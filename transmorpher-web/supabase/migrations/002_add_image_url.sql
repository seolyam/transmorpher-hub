-- Migration to add image_url to loadouts for the Gallery feature
-- Note: the previous migration named this column 'screenshot_url', let's stick with 'image_url' per our plan or check if screenshot_url exists.
-- Actually, let's just make sure image_url exists.

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='loadouts' AND column_name='image_url') THEN
        ALTER TABLE public.loadouts ADD COLUMN image_url text;
    END IF;
END $$;
