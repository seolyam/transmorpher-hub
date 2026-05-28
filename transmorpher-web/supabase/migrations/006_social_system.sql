-- 1. Modify the existing trigger so it only inserts the ID, leaving username and avatar_url NULL 
-- to enforce the Next.js onboarding flow.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NULL, NULL);
  RETURN NEW;
END;
$$;

-- 2. Wipe existing loadouts for a clean slate
TRUNCATE TABLE public.loadouts CASCADE;

-- 3. Modify profiles table constraints
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 16),
  ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$');

-- 4. Rename author_id to user_id in loadouts
ALTER TABLE public.loadouts RENAME COLUMN author_id TO user_id;

-- 5. Replace upvotes with likes to match requirements exactly
DROP VIEW IF EXISTS public.loadout_upvote_counts;
DROP TABLE IF EXISTS public.upvotes CASCADE;

CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  loadout_id UUID NOT NULL REFERENCES public.loadouts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, loadout_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes" 
  ON public.likes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert likes" 
  ON public.likes FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.likes FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- 6. Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loadout_id UUID NOT NULL REFERENCES public.loadouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" 
  ON public.comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert comments" 
  ON public.comments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);
