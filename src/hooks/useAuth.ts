import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const GUEST_MODE_KEY = 'easycontext_guest_mode';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem(GUEST_MODE_KEY) === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};

    const bootstrap = async () => {
      try {
        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          if (nextSession?.user) {
            setIsGuest(false);
            localStorage.removeItem(GUEST_MODE_KEY);
          }
          setLoading(false);
        });
        unsub = () => data.subscription.unsubscribe();

        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        setUser(sessionData.session?.user ?? null);
      } catch {
        // Supabase unavailable or misconfigured: allow local guest mode.
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
    return () => unsub();
  }, []);

  const enterGuestMode = () => {
    localStorage.setItem(GUEST_MODE_KEY, 'true');
    setIsGuest(true);
  };

  const exitGuestMode = () => {
    localStorage.removeItem(GUEST_MODE_KEY);
    setIsGuest(false);
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    if (error) throw error;
  };
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
    if (error) throw error;
  };
  const signOut = async () => {
    exitGuestMode();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) throw error;
  };

  return { user, session, loading, isGuest, enterGuestMode, exitGuestMode, signUp, signIn, signInWithGoogle, signOut, resetPassword };
}
