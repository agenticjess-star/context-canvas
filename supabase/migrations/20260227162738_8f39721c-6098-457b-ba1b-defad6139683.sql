
-- Allow public read of profiles by username (needed for @username URL lookups)
CREATE POLICY "Anyone can read profiles by username" ON public.profiles
  FOR SELECT USING (true);

-- Drop the restrictive select policy since we need public username lookups
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
