import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, FileText, Link2, Upload, X, Sparkles,
  GripVertical, ChevronRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createContextPage } from "@/lib/api/context";
import { useAuth } from "@/hooks/useAuth";

type SourceType = "text" | "url" | "file";

interface Source {
  id: string;
  type: SourceType;
  label: string;
  content: string;
  file?: File;
}

const sourceConfig = {
  text: { icon: FileText, label: "Text / Notes", color: "text-primary", bg: "bg-primary/10" },
  url: { icon: Link2, label: "URL", color: "text-primary", bg: "bg-primary/10" },
  file: { icon: Upload, label: "File", color: "text-primary", bg: "bg-primary/10" },
};

interface CanvasEditorProps {
  backTo?: string;
}

const CanvasEditor = ({ backTo = "/dashboard" }: CanvasEditorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [addingType, setAddingType] = useState<SourceType | null>(null);
  const [tempText, setTempText] = useState("");
  const [tempUrl, setTempUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);

  const addSource = (type: SourceType) => {
    if (type === "text" && tempText.trim()) {
      setSources((s) => [...s, { id: crypto.randomUUID(), type: "text", label: tempText.slice(0, 60) + (tempText.length > 60 ? "…" : ""), content: tempText }]);
      setTempText("");
      setAddingType(null);
    } else if (type === "url" && tempUrl.trim()) {
      let url = tempUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
      setSources((s) => [...s, { id: crypto.randomUUID(), type: "url", label: url.replace(/^https?:\/\//, "").slice(0, 60), content: url }]);
      setTempUrl("");
      setAddingType(null);
    }
  };

  const handleFileAdd = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      setSources((s) => [...s, { id: crypto.randomUUID(), type: "file", label: file.name, content: "", file }]);
    });
    setAddingType(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFileAdd(e.dataTransfer.files);
  }, [handleFileAdd]);

  const removeSource = (id: string) => setSources((s) => s.filter((src) => src.id !== id));

  const handleGenerate = async () => {
    if (sources.length === 0) {
      toast({ title: "No sources added", description: "Add at least one source.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const slug = await createContextPage({
        title: title || "Untitled",
        description,
        sources: sources.map((s) => ({ type: s.type, label: s.label, content: s.content, file: s.file })),
      });
      navigate(`/c/${slug}`);
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: SourceType) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addSource(type); }
  };

  return (
    <div className="min-h-screen bg-background relative" onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop}>
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-3" />
              <p className="text-lg font-semibold">Drop files to add as sources</p>
              <p className="text-sm text-muted-foreground mt-1">PDFs, images, text files</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => navigate(backTo)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">EasyContext</span>
            </div>
          </div>
          <Button size="sm" className="rounded-full px-5 gap-2 shadow-[0_1px_2px_hsl(230_80%_56%/0.3)]" onClick={handleGenerate} disabled={sources.length === 0 || generating}>
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {generating ? "Generating…" : "Generate URL"}
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
          {/* Left: Sources */}
          <div className="space-y-8">
            <div className="space-y-3">
              <input placeholder="Untitled context page" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 tracking-tight" />
              <input placeholder="Add a description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full text-base text-muted-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/30" />
            </div>
            <div className="h-px bg-border" />

            {/* Sources list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sources · {sources.length}</h2>
              </div>
              <AnimatePresence mode="popLayout">
                {sources.map((src) => {
                  const config = sourceConfig[src.type];
                  return (
                    <motion.div key={src.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/15 transition-all duration-200">
                      <GripVertical className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                      <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                        <config.icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{src.label}</p>
                        <p className="text-xs text-muted-foreground capitalize">{src.type === "url" ? "Link" : src.type}</p>
                      </div>
                      <button onClick={() => removeSource(src.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1.5 rounded-lg hover:bg-destructive/10">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {sources.length === 0 && !addingType && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">No sources yet</p>
                  <p className="text-xs text-muted-foreground/60 max-w-xs">Add text notes, paste URLs, or drag files here to build your context page.</p>
                </div>
              )}
            </div>

            {/* Add source panels */}
            <AnimatePresence>
              {addingType === "text" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="space-y-3 p-5 rounded-xl border border-primary/20 bg-card">
                    <p className="text-sm font-medium">Add text or notes</p>
                    <Textarea placeholder="Paste your research notes, meeting summaries, requirements, specs…" value={tempText} onChange={(e) => setTempText(e.target.value)} className="min-h-[140px] resize-none text-sm" autoFocus />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => { setAddingType(null); setTempText(""); }}>Cancel</Button>
                      <Button size="sm" className="rounded-full px-4" onClick={() => addSource("text")} disabled={!tempText.trim()}>Add source</Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {addingType === "url" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="space-y-3 p-5 rounded-xl border border-primary/20 bg-card">
                    <p className="text-sm font-medium">Add a URL</p>
                    <Input type="url" placeholder="https://docs.example.com/api-reference" value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} onKeyDown={(e) => handleKeyDown(e, "url")} autoFocus />
                    <p className="text-xs text-muted-foreground">We'll extract the page content and optimize it for AI readability.</p>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => { setAddingType(null); setTempUrl(""); }}>Cancel</Button>
                      <Button size="sm" className="rounded-full px-4" onClick={() => addSource("url")} disabled={!tempUrl.trim()}>Add source</Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {addingType === "file" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-5 rounded-xl border border-primary/20 bg-card space-y-3">
                    <p className="text-sm font-medium">Upload files</p>
                    <label className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Click to select files</p>
                        <p className="text-xs text-muted-foreground mt-0.5">PDF, PNG, JPG, TXT, MD — up to 20 MB</p>
                      </div>
                      <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.md" onChange={(e) => e.target.files && handleFileAdd(e.target.files)} className="hidden" />
                    </label>
                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setAddingType(null)}>Cancel</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add source buttons */}
            {!addingType && (
              <div className="flex flex-wrap gap-2">
                {(["text", "url", "file"] as SourceType[]).map((type) => {
                  const config = sourceConfig[type];
                  return (
                    <button key={type} onClick={() => setAddingType(type)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-200">
                      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Preview sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h3 className="text-sm font-semibold">Preview</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Title</p>
                    <p className="text-sm font-medium">{title || <span className="text-muted-foreground/40">Untitled</span>}</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Sources</p>
                    {sources.length > 0 ? (
                      <div className="space-y-1.5">
                        {sources.slice(0, 5).map((src) => {
                          const config = sourceConfig[src.type];
                          return (
                            <div key={src.id} className="flex items-center gap-2 text-xs">
                              <config.icon className={`h-3 w-3 ${config.color}`} />
                              <span className="truncate">{src.label}</span>
                            </div>
                          );
                        })}
                        {sources.length > 5 && <p className="text-xs text-muted-foreground">+{sources.length - 5} more</p>}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground/50">None added</p>
                    )}
                  </div>
                </div>
                <div className="h-px bg-border" />
                <Button className="w-full rounded-xl gap-2" onClick={handleGenerate} disabled={sources.length === 0 || generating}>
                  {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {generating ? "Generating…" : "Generate URL"}
                  {!generating && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                </Button>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tips</p>
                <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>Drag and drop files anywhere on this page</li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>URLs are automatically scraped for content</li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>More sources = richer context for AI tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile generate bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/80 backdrop-blur-xl border-t border-border p-4">
        <Button className="w-full h-12 rounded-xl gap-2 text-[15px] font-semibold" onClick={handleGenerate} disabled={sources.length === 0 || generating}>
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {generating ? "Generating…" : "Generate Context URL"}
        </Button>
      </div>
    </div>
  );
};

export default CanvasEditor;
