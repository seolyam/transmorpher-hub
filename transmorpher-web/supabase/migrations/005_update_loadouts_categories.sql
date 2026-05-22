-- Drop class_id and race_id from loadouts
ALTER TABLE public.loadouts
  DROP COLUMN IF EXISTS class_id,
  DROP COLUMN IF EXISTS race_id;

-- Drop the class index
DROP INDEX IF EXISTS idx_loadouts_class;

-- Add new structural categories
ALTER TABLE public.loadouts
  ADD COLUMN IF NOT EXISTS race text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS visual_weight text;

-- Create indexes for the new columns to support fast filtering
CREATE INDEX IF NOT EXISTS idx_loadouts_race ON public.loadouts(race);
CREATE INDEX IF NOT EXISTS idx_loadouts_gender ON public.loadouts(gender);
CREATE INDEX IF NOT EXISTS idx_loadouts_weight ON public.loadouts(visual_weight);
