import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Eye, Clock, Trash2, ExternalLink, Copy, Check, Loader2, Lock, Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';

const FREE_CANVAS_LIMIT = 3;

interface Canvas {
  id: string;
  slug: string;
  canvas_slug: string | null;
  title: string;
  description: string | null;
  view_count: number;
  created_at: string;
  expires_at: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [canvasRes, profileRes] = await Promise.all([
        supabase
          .from('context_pages')
          .select('id, slug, canvas_slug, title, description, view_count, created_at, expires_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single(),
      ]);
      if (canvasRes.data) setCanvases(canvasRes.data);
      if (profileRes.data) setUsername(profileRes.data.username);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('context_pages').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setCanvases((c) => c.filter((x) => x.id !== id));
      toast({ title: 'Canvas deleted' });
    }
  };

  const getCanvasUrl = (c: Canvas) => {
    if (username && c.canvas_slug) {
      return `${window.location.origin}/@${username}/${c.canvas_slug}`;
    }
    return `${window.location.origin}/c/${c.slug}`;
  };

  const copyUrl = (c: Canvas) => {
    navigator.clipboard.writeText(getCanvasUrl(c));
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCanvas = (c: Canvas) => {
    if (username && c.canvas_slug) {
      window.open(`/@${username}/${c.canvas_slug}`, '_blank');
    } else {
      window.open(`/c/${c.slug}`, '_blank');
    }
  };

  const atLimit = canvases.length >= FREE_CANVAS_LIMIT;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppLayout
      activeTab="canvases"
      onNewCanvas={atLimit ? undefined : () => navigate('/dashboard/new')}
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Canvases</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {canvases.length} / {FREE_CANVAS_LIMIT} · Free plan
          </p>
        </div>
        <div className="md:hidden">
          {!atLimit && (
            <Button size="sm" className="rounded-full px-4 gap-1.5" onClick={() => navigate('/dashboard/new')}>
              <Plus className="h-3 w-3" /> New
            </Button>
          )}
        </div>
      </div>

      {/* Limit banner */}
      {atLimit && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5 mb-6 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold">Free limit reached</p>
            <p className="text-xs text-muted-foreground mt-0.5">Upgrade to create unlimited canvases.</p>
          </div>
          <Button size="sm" className="rounded-full px-5 shrink-0">Upgrade</Button>
        </motion.div>
      )}

      {/* Canvas list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : canvases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Layers className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">No canvases yet</p>
          <p className="text-xs text-muted-foreground/60 max-w-xs mb-4">Create your first context canvas.</p>
          <Button className="rounded-full px-5 gap-2" onClick={() => navigate('/dashboard/new')}>
            <Plus className="h-3.5 w-3.5" /> New Canvas
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {canvases.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/15 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{c.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{c.view_count}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.created_at).toLocaleDateString()}</span>
                    {c.expires_at && new Date(c.expires_at) < new Date() && (
                      <span className="text-destructive text-[10px] font-medium">Expired</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openCanvas(c)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => copyUrl(c)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    {copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
