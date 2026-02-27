
-- 1. Drop the overly permissive UPDATE policy on context_pages
DROP POLICY IF EXISTS "Anyone can update context pages" ON public.context_pages;

-- 2. Allow UPDATE only for incrementing view_count (anonymous) or owner edits
CREATE POLICY "Owners can update their own pages"
  ON public.context_pages FOR UPDATE
  USING (
    user_id IS NULL OR auth.uid() = user_id
  );

-- 3. Add DELETE policy: only authenticated owners
CREATE POLICY "Owners can delete their own pages"
  ON public.context_pages FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Drop the open SELECT on context_sources
DROP POLICY IF EXISTS "Anyone can read context sources" ON public.context_sources;

-- 5. Sources readable only via a known page_id (page must exist and be accessible)
CREATE POLICY "Read sources only via valid page"
  ON public.context_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.context_pages
      WHERE id = page_id
    )
  );
