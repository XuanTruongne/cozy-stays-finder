-- Create discounts table
CREATE TABLE public.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  min_order_amount NUMERIC DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_to TEXT[] DEFAULT '{}', -- e.g., ['villa', 'hotel', 'all']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

-- Everyone can view active discounts
CREATE POLICY "Active discounts are viewable by everyone"
  ON public.discounts
  FOR SELECT
  USING (is_active = true AND valid_until > now());

-- Admins can manage all discounts
CREATE POLICY "Admins can manage discounts"
  ON public.discounts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_discounts_updated_at
  BEFORE UPDATE ON public.discounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.discounts (code, description, discount_percent, min_order_amount, valid_until, applicable_to) VALUES
('TET2025', 'Giảm 15% cho tất cả đặt phòng', 15, 1000000, '2025-02-09 23:59:59+07', ARRAY['all']),
('XUANMOI30', 'Giảm 30% cho Villa & Resort', 30, 3000000, '2025-02-15 23:59:59+07', ARRAY['villa', 'resort']),
('VUNGTAU10', 'Giảm 10% - Khách hàng mới', 10, 500000, '2025-02-28 23:59:59+07', ARRAY['all']);