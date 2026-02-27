
-- Vault items table for storing user assets
CREATE TABLE public.vault_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('text', 'url', 'file', 'image')),
  label text NOT NULL,
  content text NOT NULL DEFAULT '',
  file_path text,
  file_size bigint,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vault_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own vault items" ON public.vault_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add canvas_slug to context_pages for friendly URLs
ALTER TABLE public.context_pages ADD COLUMN IF NOT EXISTS canvas_slug text;

-- Create index for @username/canvas_slug lookups
CREATE INDEX IF NOT EXISTS idx_context_pages_canvas_slug ON public.context_pages(user_id, canvas_slug);
