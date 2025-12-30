-- Add property_type column to hotels table
ALTER TABLE public.hotels 
ADD COLUMN property_type text NOT NULL DEFAULT 'hotel';

-- Add comment for the column
COMMENT ON COLUMN public.hotels.property_type IS 'Loại hình: villa, homestay, hotel, apartment, guesthouse';