-- Add image_url column to discounts table
ALTER TABLE public.discounts
ADD COLUMN image_url TEXT DEFAULT NULL;

-- Update existing discounts with sample images
UPDATE public.discounts SET image_url = 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400' WHERE code = 'TET2025';
UPDATE public.discounts SET image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' WHERE code = 'XUANMOI30';
UPDATE public.discounts SET image_url = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' WHERE code = 'VUNGTAU10';