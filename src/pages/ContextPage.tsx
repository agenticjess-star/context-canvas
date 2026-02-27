import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Link2,
  Upload,
  Copy,
  Check,
  Clock,
  Eye,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContextPage } from "@/lib/api/context";

const sourceIcons = {
  text: FileText,
  url: Link2,
  file: Upload,
};

const ContextPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getContextPage(slug).then((data) => {
      setPage(data);
      setLoading(false);
    });
  }, [slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <p className="text-sm text-muted-foreground">
            This context page doesn't exist or has expired.
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to ParsePad
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Agent-friendly header comment in the DOM */}
      <div className="sr-only" role="doc-subtitle">
        ParsePad Context Page — This page contains structured context compiled from multiple sources.
        Navigate by sections below. Each section header indicates the source type (text, url, or file).
        Content is optimized for LLM consumption.
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ParsePad</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2"
            onClick={copyUrl}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy URL"}
          </Button>
        </div>
      </header>

      {/* AI Navigation Guide */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 mb-8"
        >
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
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-base text-muted-foreground">{page.description}</p>
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {page.view_count} view{page.view_count !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {new Date(page.created_at).toLocaleDateString()}
            </div>
            {page.expires_at && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Expires {new Date(page.expires_at).toLocaleDateString()}
              </div>
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                aria-label={`Source ${i + 1}: ${src.label}`}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold truncate">{src.label}</h2>
                    <p className="text-xs text-muted-foreground capitalize">
                      {src.type === 'url' ? 'Scraped link' : src.type}
                    </p>
                  </div>
                  {src.type === 'url' && (
                    <a
                      href={src.label.startsWith('http') ? src.label : `https://${src.label}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Original
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="rounded-xl border border-border bg-card p-5">
                  {src.file_path && (src.file_path.match(/\.(png|jpg|jpeg|gif|webp)/) || src.content.includes('[File:')) ? (
                    <img
                      src={src.file_path}
                      alt={src.label}
                      className="max-w-full rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-[inherit] text-foreground/90">
                      {src.content}
                    </pre>
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
            <Sparkles className="h-3 w-3" />
            Built with ParsePad
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 rounded-full"
            onClick={copyUrl}
          >
            {copied ? "Copied!" : "Share this page"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ContextPage;
