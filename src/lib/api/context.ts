import { supabase } from '@/integrations/supabase/client';

export async function scrapeUrl(url: string): Promise<{ markdown: string; title: string }> {
  const { data, error } = await supabase.functions.invoke('scrape-url', {
    body: { url },
  });

  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || 'Scrape failed');
  return { markdown: data.markdown, title: data.title };
}

export async function uploadFile(file: File, pageId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filePath = `${pageId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('context-files')
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from('context-files')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

interface CreatePageParams {
  title: string;
  description: string;
  sources: Array<{
    type: 'text' | 'url' | 'file';
    label: string;
    content: string;
    file?: File;
  }>;
  expiresIn?: string; // '1h', '1d', '7d', '30d', 'never'
}

function getExpiryDate(expiresIn?: string): string | null {
  if (!expiresIn || expiresIn === 'never') return null;
  const now = new Date();
  const map: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now.getTime() + (map[expiresIn] || 0)).toISOString();
}

export async function createContextPage(params: CreatePageParams): Promise<string> {
  const expiresAt = getExpiryDate(params.expiresIn);

  // Create the page
  const { data: page, error: pageError } = await supabase
    .from('context_pages')
    .insert({
      title: params.title || 'Untitled',
      description: params.description || '',
      expires_at: expiresAt,
    })
    .select('id, slug')
    .single();

  if (pageError || !page) throw new Error(pageError?.message || 'Failed to create page');

  // Process sources — scrape URLs, upload files
  const processedSources = await Promise.all(
    params.sources.map(async (src, i) => {
      let content = src.content;
      let filePath: string | null = null;

      if (src.type === 'url') {
        try {
          const scraped = await scrapeUrl(src.content);
          content = scraped.markdown;
        } catch (e) {
          content = `Failed to scrape: ${src.content}`;
        }
      } else if (src.type === 'file' && src.file) {
        try {
          const url = await uploadFile(src.file, page.id);
          filePath = url;
          // For text-based files, read content
          if (src.file.type.startsWith('text/') || src.file.name.endsWith('.md') || src.file.name.endsWith('.txt')) {
            content = await src.file.text();
          } else {
            content = `[File: ${src.label}](${url})`;
          }
        } catch (e) {
          content = `Failed to upload: ${src.label}`;
        }
      }

      return {
        page_id: page.id,
        type: src.type,
        label: src.label,
        content,
        file_path: filePath,
        sort_order: i,
      };
    })
  );

  // Insert all sources
  const { error: srcError } = await supabase
    .from('context_sources')
    .insert(processedSources);

  if (srcError) throw new Error(srcError.message);

  return page.slug;
}

export async function getContextPage(slug: string) {
  const { data: page, error: pageError } = await supabase
    .from('context_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (pageError || !page) return null;

  // Check expiry
  if (page.expires_at && new Date(page.expires_at) < new Date()) return null;

  // Increment view count
  await supabase
    .from('context_pages')
    .update({ view_count: page.view_count + 1 })
    .eq('id', page.id);

  const { data: sources } = await supabase
    .from('context_sources')
    .select('*')
    .eq('page_id', page.id)
    .order('sort_order');

  // Strip user_id from public response to avoid leaking identity
  const { user_id, ...publicPage } = page;
  return { ...publicPage, sources: sources || [] };
}
