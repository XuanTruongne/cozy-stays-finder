-- Add address column to rooms table for custom location
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS address TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.rooms.address IS 'Custom address for room location, if different from hotel address';