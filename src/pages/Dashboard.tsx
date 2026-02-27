import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Plus, Eye, Clock, Trash2, ExternalLink, Copy, Check, LogOut, Loader2, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FREE_CANVAS_LIMIT = 3;

interface Canvas {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  view_count: number;
  created_at: string;
  expires_at: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchCanvases = async () => {
      const { data, error } = await supabase
        .from('context_pages')
        .select('id, slug, title, description, view_count, created_at, expires_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setCanvases(data);
      setLoading(false);
    };
    fetchCanvases();
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

  const copyUrl = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const atLimit = canvases.length >= FREE_CANVAS_LIMIT;

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">EasyContext</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <span className="max-w-[140px] truncate">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleSignOut}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Canvases</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {canvases.length} / {FREE_CANVAS_LIMIT} canvases used (Free plan)
            </p>
          </div>
          <Button
            className="rounded-full px-5 gap-2"
            onClick={() => navigate('/dashboard/new')}
            disabled={atLimit}
          >
            {atLimit ? <Lock className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {atLimit ? 'Limit reached' : 'New Canvas'}
          </Button>
        </div>

        {/* Upgrade banner */}
        {atLimit && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5 mb-8 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold">You've reached the free limit</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upgrade to create unlimited context canvases.</p>
            </div>
            <Button size="sm" className="rounded-full px-5 shrink-0">
              Upgrade
            </Button>
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
              <Plus className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No canvases yet</p>
            <p className="text-xs text-muted-foreground/60 max-w-xs mb-4">Create your first AI-ready context canvas.</p>
            <Button className="rounded-full px-5 gap-2" onClick={() => navigate('/dashboard/new')}>
              <Plus className="h-3.5 w-3.5" /> New Canvas
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {canvases.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="group flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/15 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{c.title}</p>
                    {c.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{c.view_count}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.created_at).toLocaleDateString()}</span>
                      {c.expires_at && new Date(c.expires_at) < new Date() && (
                        <span className="text-destructive">Expired</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => window.open(`/c/${c.slug}`, '_blank')}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => copyUrl(c.slug)}>
                      {copiedId === c.slug ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
