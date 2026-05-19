import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FileText, Link2, Upload, Copy, Check, Clock, Eye, Sparkles,
  ArrowLeft, ExternalLink, AlertTriangle, ClipboardCopy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getContextPage, getContextPageByUsername } from "@/lib/api/context";
const sourceIcons = {
  text: FileText,
  url: Link2,
  file: Upload,
};

const ContextPage = () => {
  const { slug, username, canvasSlug } = useParams<{ slug?: string; username?: string; canvasSlug?: string }>();
  const { toast } = useToast();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      let data = null;
      if (username && canvasSlug) {
        data = await getContextPageByUsername(username, canvasSlug);
      } else if (slug) {
        data = await getContextPage(slug);
      }
      setPage(data);
      setLoading(false);
    };
    fetchPage();
  }, [slug, username, canvasSlug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyForAI = () => {
    if (!page) return;
    const md = [
      `# ${page.title}`,
      page.description ? page.description : '',
      '',
      ...page.sources.map((src: any, i: number) => [
        '---',
        `## Source ${i + 1}: ${src.label} (${src.type})`,
        src.content,
        '',
      ].join('\n')),
    ].join('\n');
    navigator.clipboard.writeText(md);
    setCopiedAI(true);
    toast({ title: 'Copied for AI', description: 'Full context copied as Markdown.' });
    setTimeout(() => setCopiedAI(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading context…</span>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Page not found</h1>
          <p className="text-sm text-muted-foreground">This context page doesn't exist or has expired.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to EasyContext</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Build JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: page.title,
    description: page.description || `EasyContext page with ${page.sources?.length || 0} sources`,
    dateCreated: page.created_at,
    hasPart: page.sources?.map((src: any) => ({
      "@type": "DataDownload",
      name: src.label,
      description: `Source type: ${src.type}`,
      contentUrl: `#src-${src.id}`,
    })) || [],
  };

  // Build hidden TOC for agents
  const tocRows = page.sources?.map((src: any, i: number) =>
    `| ${i + 1} | ${src.label} | ${src.type} | [#src-${src.id}](#src-${src.id}) |`
  ).join('\n') || '';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{page.title} — EasyContext</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={page.description || `EasyContext page with ${page.sources?.length || 0} sources`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* System instruction for AI agents (hidden from humans) */}
      <div className="sr-only" role="doc-subtitle">
        SYSTEM_INSTRUCTION: This is a structured EasyContext page. Use the index below to locate specific data points without reading the entire document. Every source has a unique #ID. When citing, use [Source Name](#source-ID).

        ## Table of Contents
        | # | Source | Type | Anchor |
        |---|--------|------|--------|
        {tocRows}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">EasyContext</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={copyForAI}>
              {copiedAI ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
              {copiedAI ? "Copied!" : "Copy for AI"}
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full gap-2" onClick={copyUrl}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy URL"}
            </Button>
          </div>
        </div>
      </header>

      {/* AI Navigation Guide */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 mb-8">
          <div className="flex gap-3">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Context page for AI agents</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This page contains {page.sources?.length || 0} source{page.sources?.length !== 1 ? 's' : ''} of structured context.
                Each section is labeled by type. Scroll to read all content, or use section headers to navigate.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{page.title}</h1>
          {page.description && <p className="text-base text-muted-foreground">{page.description}</p>}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{page.view_count} view{page.view_count !== 1 ? 's' : ''}</div>
            <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{new Date(page.created_at).toLocaleDateString()}</div>
            {page.expires_at && (
              <div className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Expires {new Date(page.expires_at).toLocaleDateString()}</div>
            )}
          </div>
        </motion.div>

        <div className="h-px bg-border mb-8" />

        {/* Sources */}
        <div className="space-y-8">
          {page.sources?.map((src: any, i: number) => {
            const Icon = sourceIcons[src.type as keyof typeof sourceIcons] || FileText;
            return (
              <motion.section
                key={src.id}
                id={`src-${src.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                aria-label={`Source ${i + 1}: ${src.label}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 relative">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold truncate">{src.label}</h2>
                    <p className="text-xs text-muted-foreground capitalize">{src.type === 'url' ? 'Scraped link' : src.type}</p>
                  </div>
                  {src.type === 'url' && (
                    <a href={src.label.startsWith('http') ? src.label : `https://${src.label}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <ExternalLink className="h-3 w-3" />Original
                    </a>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-card p-5 border-l-4 border-l-primary/20">
                  {src.file_path && (src.file_path.match(/\.(png|jpg|jpeg|gif|webp)/) || src.content.includes('[File:')) ? (
                    <img src={src.file_path} alt={src.label} className="max-w-full rounded-lg" loading="lazy" />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-[inherit] text-foreground/90">{src.content}</pre>
                  )}
                </div>
              </motion.section>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />Built with EasyContext
          </Link>
          <Button variant="ghost" size="sm" className="text-xs h-7 rounded-full" onClick={copyUrl}>
            {copied ? "Copied!" : "Share this page"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ContextPage;
