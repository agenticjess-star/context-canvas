import { supabase } from '@/integrations/supabase/client';

const GUEST_CANVASES_KEY = 'easycontext_guest_canvases';

export interface CanvasRecord {
  id: string;
  slug: string;
  canvas_slug: string | null;
  title: string;
  description: string | null;
  view_count: number;
  created_at: string;
  expires_at: string | null;
}

export interface DataProvider {
  listCanvases: (userId: string) => Promise<CanvasRecord[]>;
  getUsername: (userId: string) => Promise<string | null>;
  deleteCanvas: (id: string) => Promise<void>;
}

const readGuestCanvases = (): CanvasRecord[] => {
  try {
    const raw = localStorage.getItem(GUEST_CANVASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestCanvases = (canvases: CanvasRecord[]) => {
  localStorage.setItem(GUEST_CANVASES_KEY, JSON.stringify(canvases));
};

export const guestDataProvider: DataProvider = {
  async listCanvases() {
    return readGuestCanvases().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  },
  async getUsername() {
    return 'guest';
  },
  async deleteCanvas(id: string) {
    writeGuestCanvases(readGuestCanvases().filter((c) => c.id !== id));
  },
};

export const cloudDataProvider: DataProvider = {
  async listCanvases(userId) {
    const { data, error } = await supabase
      .from('context_pages')
      .select('id, slug, canvas_slug, title, description, view_count, created_at, expires_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getUsername(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data?.username || null;
  },
  async deleteCanvas(id) {
    const { error } = await supabase.from('context_pages').delete().eq('id', id);
    if (error) throw error;
  },
};

export const getDataProvider = (isGuest: boolean): DataProvider => (isGuest ? guestDataProvider : cloudDataProvider);
