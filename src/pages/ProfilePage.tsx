import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, AtSign, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      if (data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const slug = username.toLowerCase().replace(/[^a-z0-9-_]/g, '').slice(0, 30);
    const { error } = await supabase
      .from('profiles')
      .update({ username: slug })
      .eq('id', user.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated' });
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppLayout activeTab="profile">
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
        <p className="text-sm text-muted-foreground mb-8">Manage your account settings</p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium">{username || 'Set your username'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">easycontext.me/@</span>
              <Input
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                className="h-9 rounded-xl text-sm flex-1"
                maxLength={30}
              />
            </div>
            <p className="text-xs text-muted-foreground">This is your public handle. Canvas URLs will be easycontext.me/@{username || 'you'}/canvas-title</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email
            </label>
            <Input
              value={user?.email || ''}
              disabled
              className="h-9 rounded-xl text-sm bg-muted"
            />
          </div>

          <Button
            className="rounded-full px-6 gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Save changes
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
