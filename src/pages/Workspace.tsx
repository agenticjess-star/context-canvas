import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  FileText,
  Link2,
  Upload,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type SourceType = "text" | "url" | "file";

interface Source {
  id: string;
  type: SourceType;
  label: string;
  content: string;
  file?: File;
}

const Workspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [addingType, setAddingType] = useState<SourceType | null>(null);
  const [tempText, setTempText] = useState("");
  const [tempUrl, setTempUrl] = useState("");

  const addSource = (type: SourceType) => {
    if (type === "text" && tempText.trim()) {
      setSources((s) => [
        ...s,
        {
          id: crypto.randomUUID(),
          type: "text",
          label: tempText.slice(0, 40) + (tempText.length > 40 ? "…" : ""),
          content: tempText,
        },
      ]);
      setTempText("");
      setAddingType(null);
    } else if (type === "url" && tempUrl.trim()) {
      setSources((s) => [
        ...s,
        {
          id: crypto.randomUUID(),
          type: "url",
          label: tempUrl,
          content: tempUrl,
        },
      ]);
      setTempUrl("");
      setAddingType(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      setSources((s) => [
        ...s,
        {
          id: crypto.randomUUID(),
          type: "file",
          label: file.name,
          content: "",
          file,
        },
      ]);
    });
    setAddingType(null);
  };

  const removeSource = (id: string) => {
    setSources((s) => s.filter((src) => src.id !== id));
  };

  const handleGenerate = () => {
    if (sources.length === 0) {
      toast({
        title: "No sources added",
        description: "Add at least one source before generating.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Coming soon",
      description: "Context generation will be available in Phase 2!",
    });
  };

  const typeIcon = {
    text: <FileText className="h-4 w-4" />,
    url: <Link2 className="h-4 w-4" />,
    file: <Upload className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border max-w-4xl mx-auto">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-lg font-bold tracking-tight font-[Space_Grotesk]">
          Parse<span className="text-primary">Pad</span>
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Title */}
        <div>
          <Input
            placeholder="Context page title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Sources list */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Sources
          </h2>
          <AnimatePresence mode="popLayout">
            {sources.map((src) => (
              <motion.div
                key={src.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                  {typeIcon[src.type]}
                </div>
                <span className="flex-1 text-sm truncate">{src.label}</span>
                <button
                  onClick={() => removeSource(src.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {sources.length === 0 && !addingType && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No sources yet. Add text, a URL, or upload a file to get started.
            </p>
          )}
        </div>

        {/* Add source panel */}
        <AnimatePresence>
          {addingType === "text" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <Textarea
                placeholder="Paste your notes, context, or any text…"
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                className="min-h-[120px]"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => addSource("text")}>
                  Add Text
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAddingType(null);
                    setTempText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {addingType === "url" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <Input
                type="url"
                placeholder="https://example.com/article"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => addSource("url")}>
                  Add URL
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAddingType(null);
                    setTempUrl("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {addingType === "file" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <label className="flex flex-col items-center justify-center gap-2 p-10 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to select or drag files here
                </span>
                <span className="text-xs text-muted-foreground/60">
                  PDF, images, text files
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <Button
                size="sm"
                variant="ghost"
                className="mt-3"
                onClick={() => setAddingType(null)}
              >
                Cancel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add source buttons */}
        {!addingType && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingType("text")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Text / Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingType("url")}
              className="gap-2"
            >
              <Link2 className="h-4 w-4" /> URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingType("file")}
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> File
            </Button>
          </div>
        )}

        {/* Generate button */}
        <div className="pt-4">
          <Button
            size="lg"
            className="w-full h-13 text-base font-semibold rounded-xl gap-2 shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundImage: "var(--gradient-primary)" }}
            onClick={handleGenerate}
          >
            <Sparkles className="h-5 w-5" />
            Generate Context URL
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
