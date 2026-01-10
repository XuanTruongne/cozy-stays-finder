-- Add map_embed_url column to hotels table for custom Google Maps embed links
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS map_embed_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.hotels.map_embed_url IS 'Google Maps embed URL for displaying location on hotel details page';