import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AtSign, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { getSubscriptionState } from '@/lib/subscription';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sub, setSub] = useState<any>(null);
  const [usage, setUsage] = useState(0);

  useEffect(() => { if (!authLoading && !user) navigate('/auth', { replace: true }); }, [authLoading, user, navigate]);
  useEffect(() => { (async () => {
    if (!user) return;
    const [{ data }, s, { count }] = await Promise.all([
      supabase.from('profiles').select('username').eq('id', user.id).single(),
      getSubscriptionState(),
      supabase.from('context_pages').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);
    setUsername(data?.username || ''); setSub(s); setUsage(count || 0); setLoading(false);
  })(); }, [user]);

  if (authLoading || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  return <AppLayout activeTab="profile"><div className="max-w-lg"><h1 className="text-2xl font-bold tracking-tight mb-1">Profile & Billing</h1>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2"><label className="text-sm font-medium flex items-center gap-2"><AtSign className="h-3.5 w-3.5 text-muted-foreground" />Username</label><div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">easycontext.me/@</span><Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))} /></div></div>
      <div className="space-y-2"><label className="text-sm font-medium flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />Email</label><Input value={user?.email || ''} disabled className="bg-muted" /></div>
      <div className="rounded-xl border p-4 bg-card"><p className="font-medium">Current plan: {sub?.plan}</p><p className="text-sm text-muted-foreground">Status: {sub?.status}</p><p className="text-sm text-muted-foreground">Renews: {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}</p><p className="text-sm mt-2">Usage: {usage} / {sub?.limit} canvases</p><div className="flex gap-2 mt-3"><Button variant="outline" onClick={() => navigate('/pricing')}>Upgrade</Button><Button onClick={async()=>{const {data}=await supabase.functions.invoke('create-billing-portal');if(data?.url) window.location.href=data.url;}}>Manage billing</Button></div></div>
      <Button className="rounded-full px-6 gap-2" onClick={async()=>{setSaving(true);await supabase.from('profiles').update({username}).eq('id', user?.id);setSaving(false);toast({title:'Profile updated'});}} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Save changes</Button>
    </motion.div></div></AppLayout>;
};

export default ProfilePage;
