-- Adjust RLS policy to allow guest uploads under the seeded community user ID

-- 1. Drop existing author-only insert policy
DROP POLICY IF EXISTS "Loadouts: author insert" ON public.loadouts;

-- 2. Re-create insert policy to allow logged-in users OR community guest submissions
CREATE POLICY "Loadouts: insert policy"
  ON public.loadouts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    OR
    author_id = 'd3b07384-d113-43cf-a53c-a9a35e4d2bfd'
  );
