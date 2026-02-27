
-- Context pages table
CREATE TABLE public.context_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  title TEXT NOT NULL DEFAULT 'Untitled',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users
);

-- Sources for each context page
CREATE TABLE public.context_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.context_pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'url', 'file')),
  label TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  file_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.context_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.context_sources ENABLE ROW LEVEL SECURITY;

-- Public read for context pages (unlisted URLs, anyone with the link can view)
CREATE POLICY "Anyone can read context pages" ON public.context_pages
  FOR SELECT USING (true);

-- Anyone can insert context pages (anonymous-first model)
CREATE POLICY "Anyone can create context pages" ON public.context_pages
  FOR INSERT WITH CHECK (true);

-- Anyone can update view_count
CREATE POLICY "Anyone can update context pages" ON public.context_pages
  FOR UPDATE USING (true);

-- Public read for sources
CREATE POLICY "Anyone can read context sources" ON public.context_sources
  FOR SELECT USING (true);

-- Anyone can insert sources
CREATE POLICY "Anyone can create context sources" ON public.context_sources
  FOR INSERT WITH CHECK (true);

-- Storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public) VALUES ('context-files', 'context-files', true);

-- Storage policies
CREATE POLICY "Anyone can upload context files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'context-files');

CREATE POLICY "Anyone can read context files" ON storage.objects
  FOR SELECT USING (bucket_id = 'context-files');
