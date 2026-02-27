import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Archive, Plus, FileText, Link2, Upload, Image, Trash2, Search,
  Loader2, X, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';

interface VaultItem {
  id: string;
  type: string;
  label: string;
  content: string;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: any; label: string }> = {
  text: { icon: FileText, label: 'Text' },
  url: { icon: Link2, label: 'Link' },
  file: { icon: Upload, label: 'File' },
  image: { icon: Image, label: 'Image' },
};

const VaultPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addingType, setAddingType] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('vault_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setItems(data as VaultItem[]);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const addTextOrUrl = async (type: 'text' | 'url') => {
    if (!user || !tempContent.trim()) return;
    const label = tempLabel.trim() || (type === 'url' ? tempContent.replace(/^https?:\/\//, '').slice(0, 60) : tempContent.slice(0, 60));
    const { data, error } = await supabase
      .from('vault_items')
      .insert({ user_id: user.id, type, label, content: tempContent })
      .select()
      .single();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      setItems((prev) => [data as VaultItem, ...prev]);
      setTempLabel('');
      setTempContent('');
      setAddingType(null);
    }
  };

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    if (!user) return;
    setIsDragOver(false);
    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith('image/');
      const type = isImage ? 'image' : 'file';
      const ext = file.name.split('.').pop();
      const filePath = `vault/${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('context-files')
        .upload(filePath, file);

      if (uploadErr) {
        toast({ title: 'Upload failed', description: uploadErr.message, variant: 'destructive' });
        continue;
      }

      const { data: urlData } = supabase.storage.from('context-files').getPublicUrl(filePath);

      let content = '';
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        content = await file.text();
      }

      const { data, error } = await supabase
        .from('vault_items')
        .insert({
          user_id: user.id,
          type,
          label: file.name,
          content,
          file_path: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (!error && data) setItems((prev) => [data as VaultItem, ...prev]);
    }
  }, [user, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('vault_items').delete().eq('id', id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase()) ||
    i.content.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppLayout activeTab="vault">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center backdrop-blur-sm"
            >
              <div className="text-center">
                <Upload className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-lg font-semibold">Drop files into your Vault</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vault</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {/* Search + Add buttons */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search vault…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {['text', 'url', 'file'].map((type) => {
              const cfg = typeConfig[type];
              return (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 h-9 text-xs"
                  onClick={() => type === 'file' ? document.getElementById('vault-file-input')?.click() : setAddingType(type)}
                >
                  <Plus className="h-3 w-3" />
                  {cfg.label}
                </Button>
              );
            })}
            <input
              id="vault-file-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Add panels */}
        <AnimatePresence>
          {(addingType === 'text' || addingType === 'url') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="space-y-3 p-5 rounded-xl border border-primary/20 bg-card">
                <p className="text-sm font-medium">
                  {addingType === 'text' ? 'Save text to Vault' : 'Save a URL to Vault'}
                </p>
                <Input
                  placeholder="Label (optional)"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  className="h-9 rounded-xl text-sm"
                />
                {addingType === 'text' ? (
                  <Textarea
                    placeholder="Paste text, notes, code snippets…"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    className="min-h-[120px] resize-none text-sm"
                    autoFocus
                  />
                ) : (
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    className="h-9 rounded-xl text-sm"
                    autoFocus
                  />
                )}
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => { setAddingType(null); setTempContent(''); setTempLabel(''); }}>Cancel</Button>
                  <Button size="sm" className="rounded-full px-4" onClick={() => addTextOrUrl(addingType as 'text' | 'url')} disabled={!tempContent.trim()}>Save</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Archive className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {search ? 'No results' : 'Your Vault is empty'}
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-xs">
              {search ? 'Try a different search term.' : 'Drop files, save links, or add text snippets to build your asset library.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {filtered.map((item) => {
                const cfg = typeConfig[item.type] || typeConfig.file;
                const Icon = cfg.icon;
                const isImage = item.type === 'image' && item.file_path;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative rounded-xl border border-border bg-card hover:border-primary/15 transition-all overflow-hidden"
                  >
                    {isImage && (
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img src={item.file_path!} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {!isImage && (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cfg.label} · {new Date(item.created_at).toLocaleDateString()}
                          </p>
                          {item.content && !isImage && (
                            <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2">{item.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {item.type === 'url' && (
                        <button
                          onClick={() => window.open(item.content, '_blank')}
                          className="p-1.5 rounded-lg bg-card/90 border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 rounded-lg bg-card/90 border border-border text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default VaultPage;
