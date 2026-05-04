import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Eye, Clock, Trash2, ExternalLink, Copy, Check, Loader2, Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import { getDataProvider, type CanvasRecord } from '@/lib/data/provider';

const FREE_CANVAS_LIMIT = 3;

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isGuest, loading: authLoading } = useAuth();
  const [canvases, setCanvases] = useState<CanvasRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user && !isGuest) navigate('/auth', { replace: true });
  }, [authLoading, user, isGuest, navigate]);

  useEffect(() => {
    if (!user && !isGuest) return;
    const fetchData = async () => {
      const provider = getDataProvider(isGuest);
      try {
        const [canvasData, profileName] = await Promise.all([
          provider.listCanvases(user?.id || 'guest'),
          provider.getUsername(user?.id || 'guest'),
        ]);
        setCanvases(canvasData);
        setUsername(profileName);
      } catch (error: any) {
        toast({ title: 'Cloud unavailable', description: 'Showing preview data instead.', variant: 'default' });
        const fallback = getDataProvider(true);
        setCanvases(await fallback.listCanvases('guest'));
        setUsername('guest');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isGuest, toast]);

  const handleDelete = async (id: string) => {
    try {
      await getDataProvider(isGuest).deleteCanvas(id);
      setCanvases((c) => c.filter((x) => x.id !== id));
      toast({ title: 'Canvas deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getCanvasUrl = (c: CanvasRecord) => username && c.canvas_slug ? `${window.location.origin}/@${username}/${c.canvas_slug}` : `${window.location.origin}/c/${c.slug}`;
  const copyUrl = (c: CanvasRecord) => {
    navigator.clipboard.writeText(getCanvasUrl(c));
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const atLimit = canvases.length >= FREE_CANVAS_LIMIT;
  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <AppLayout activeTab="canvases" isGuest={isGuest} onNewCanvas={atLimit ? undefined : () => navigate('/dashboard/new')}>
      {isGuest && <div className="mb-4 text-xs rounded-lg border border-primary/30 bg-primary/10 text-primary px-3 py-2">Preview mode: canvases are stored locally and not synced.</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Canvases</h1><p className="text-sm text-muted-foreground mt-0.5">{canvases.length} / {FREE_CANVAS_LIMIT} · {isGuest ? 'Preview mode' : 'Free plan'}</p></div>
        <div className="md:hidden">{!atLimit && <Button size="sm" className="rounded-full px-4 gap-1.5" onClick={() => navigate('/dashboard/new')}><Plus className="h-3 w-3" /> New</Button>}</div>
      </div>
      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div> : canvases.length === 0 ? <div className="flex flex-col items-center justify-center py-20 text-center"><div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4"><Layers className="h-6 w-6 text-muted-foreground/50" /></div><p className="text-sm font-medium text-muted-foreground mb-1">No canvases yet</p><Button className="rounded-full px-5 gap-2" onClick={() => navigate('/dashboard/new')}><Plus className="h-3.5 w-3.5" /> New Canvas</Button></div> : <div className="space-y-2"><AnimatePresence>{canvases.map((c) => <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border"><div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Layers className="h-4 w-4 text-primary" /></div><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{c.title}</p><div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Eye className="h-3 w-3" />{c.view_count}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.created_at).toLocaleDateString()}</span></div></div><div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => window.open(getCanvasUrl(c), '_blank')} className="p-2 rounded-lg text-muted-foreground hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /></button><button onClick={() => copyUrl(c)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground">{copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button><button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div></motion.div>)}</AnimatePresence></div>}
    </AppLayout>
  );
};

export default Dashboard;
