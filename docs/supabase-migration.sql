-- =====================================================
-- COMPLETE MIGRATION FILE FOR SUPABASE PROJECT
-- Target: dspmxnrmctqktwiprrmh
-- =====================================================

-- =====================================================
-- PART 1: ENUMS
-- =====================================================

CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- =====================================================
-- PART 2: TABLES
-- =====================================================

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user'
);

-- Hotels table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  ward TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL DEFAULT 'hotel',
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  size INTEGER,
  capacity INTEGER NOT NULL DEFAULT 2,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotel_id UUID NOT NULL,
  room_id UUID NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotel_id UUID NOT NULL,
  booking_id UUID,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image TEXT,
  author_id UUID,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- PART 3: FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PART 4: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Hotels policies
CREATE POLICY "Hotels are viewable by everyone" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Admins can manage hotels" ON public.hotels FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Rooms policies
CREATE POLICY "Rooms are viewable by everyone" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Blogs policies
CREATE POLICY "Published blogs are viewable by everyone" ON public.blogs FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all blogs" ON public.blogs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage blogs" ON public.blogs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- PART 5: SEED DATA - HOTELS
-- =====================================================

INSERT INTO public.hotels (id, name, address, ward, description, property_type, amenities, images, rating, review_count, featured) VALUES
('11111111-1111-1111-1111-111111111111', 'Vinpearl Resort Đà Nẵng', '7 Trường Sa, Ngũ Hành Sơn, Đà Nẵng', 'Ngũ Hành Sơnn', 'Khu nghỉ dưỡng 5 sao sang trọng với bãi biển riêng và dịch vụ đẳng cấp quốc tế. Tọa lạc ngay bờ biển Mỹ Khê xinh đẹp, Vinpearl Resort mang đến trải nghiệm nghỉ dưỡng hoàn hảo với phòng ốc sang trọng, ẩm thực tinh tế và các tiện ích giải trí đa dạng.', 'hotel', ARRAY['WiFi miễn phí', 'Hồ bơi', 'Spa', 'Phòng gym', 'Nhà hàng', 'Bãi biển riêng', 'Đón tiễn sân bay'], ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'], 4.8, 245, true),
('22222222-2222-2222-2222-222222222222', 'Imperial Hotel Vũng Tàu', '155 Thùy Vân, Phường 1, Thành Phố Vũng Tàu', '1', 'Resort cao cấp nằm trên bờ biển Vũng Tàu là điểm đến lý tưởng cho kỳ nghỉ sang trọng và yên bình.', 'hotel', ARRAY['WiFi miễn phí', 'Hồ bơi vô cực', 'Spa cao cấp', 'Sân golf', 'Nhà hàng 5 sao', 'Bar trên mái'], ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'], 4.9, 169, true),
('33333333-3333-3333-3333-333333333333', 'Mercure Đà Nẵng French Village', 'Bà Nà Hills, Đà Nẵng', 'Ngũ Hành Sơn', 'Khách sạn phong cách Pháp độc đáo tại Bà Nà Hills với khí hậu mát mẻ quanh năm. Trải nghiệm không khí châu Âu giữa lòng Việt Nam với kiến trúc cổ điển và dịch vụ chuẩn Pháp.', 'hotel', ARRAY['WiFi miễn phí', 'Nhà hàng', 'Quán bar', 'Phòng họp', 'Dịch vụ giặt ủi'], ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'], 4.5, 157, true),
('44444444-4444-4444-4444-444444444444', 'Minz HomeStay', '45 Lý Tự Trọng, Phường 8, Thành Phố Vũng Tàu', '2', 'HomeStay đầy đủ tiện nghi, đặc biệt là gần biển, Tháp Tam Thắng', 'homestay', ARRAY['WiFi miễn phí', 'Hồ bơi', 'Spa', 'Tennis', '4 nhà hàng', 'Kids club'], ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'], 4.7, 312, true),
('55555555-5555-5555-5555-555555555555', 'Novotel Đà Nẵng', '36 Bạch Đằng, Hải Châu, Đà Nẵng', 'Hải Châu', 'Khách sạn 4 sao nằm bên bờ sông Hàn với view tuyệt đẹp về cầu Rồng và thành phố. Vị trí trung tâm thuận tiện cho việc khám phá các điểm du lịch và ẩm thực địa phương.', 'hotel', ARRAY['WiFi miễn phí', 'Hồ bơi', 'Gym', 'Nhà hàng', 'Bar', 'Phòng họp'], ARRAY['https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'], 4.4, 178, false),
('66666666-6666-6666-6666-666666666666', 'Hilton Đà Nẵng', '50 Bạch Đằng, Hải Châu, Đà Nẵng', 'Sơn Trà', 'Khách sạn cao cấp với tiêu chuẩn quốc tế Hilton, nằm ngay trung tâm thành phố. Phòng ốc rộng rãi, tiện nghi hiện đại và dịch vụ chu đáo cho mọi loại hình lưu trú.', 'hotel', ARRAY['WiFi miễn phí', 'Hồ bơi tầng thượng', 'Spa', 'Gym', 'Executive Lounge', 'Nhà hàng'], ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'], 4.6, 203, false);

-- =====================================================
-- PART 6: SEED DATA - ROOMS
-- =====================================================

INSERT INTO public.rooms (id, hotel_id, name, type, description, price, size, capacity, amenities, images, available) VALUES
-- Vinpearl Resort rooms
('394a504d-3c34-4a75-a945-938857e0a4d9', '11111111-1111-1111-1111-111111111111', 'Family Villa', 'Villa', 'Villa gia đình với hồ bơi riêng', 8000000.00, 120, 6, ARRAY['WiFi', 'Điều hòa', 'Bếp', 'Hồ bơi riêng', 'Sân vườn'], ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'], true),

-- Mercure rooms
('da0749eb-5cd7-44fb-b5ea-d779e879354d', '33333333-3333-3333-3333-333333333333', 'Deluxe Mountain View', 'Deluxe', 'Phòng Deluxe view núi', 1800000.00, 32, 2, ARRAY['WiFi', 'Điều hòa', 'Minibar', 'Ban công'], ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'], true),

-- Minz Homestay rooms
('8112212d-ec2f-4ce5-bd2d-80442df94cb7', '44444444-4444-4444-4444-444444444444', 'Garden View Room', 'Deluxe', 'Phòng view vườn nhiệt đới', 2200000.00, 40, 2, ARRAY['WiFi', 'Điều hòa', 'Minibar', 'Bồn tắm'], ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'], true),
('5c8e11d4-a897-4108-9cda-1100b3ed27aa', '44444444-4444-4444-4444-444444444444', 'Ocean Suite', 'Suite', 'Suite view biển sang trọng', 5500000.00, 70, 3, ARRAY['WiFi', 'Điều hòa', 'Phòng khách', 'Bếp nhỏ'], ARRAY['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800'], true),
('f53b2299-ba00-436c-9c3f-a50b684d0154', '44444444-4444-4444-4444-444444444444', 'Beach Villa', 'Villa', 'Villa bãi biển riêng tư', 15000000.00, 200, 8, ARRAY['WiFi', 'Điều hòa', 'Bếp đầy đủ', 'Hồ bơi riêng', 'BBQ'], ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'], true),

-- Novotel rooms
('63554986-8b59-4252-ad16-af566a53d904', '55555555-5555-5555-5555-555555555555', 'Superior River View', 'Superior', 'Phòng Superior view sông Hàn', 1600000.00, 30, 2, ARRAY['WiFi', 'Điều hòa', 'Minibar', 'Ban công'], ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'], true),

-- Hilton rooms
('136c09c1-91c3-4eab-b365-5d817547142f', '66666666-6666-6666-6666-666666666666', 'King Guest Room', 'Deluxe', 'Phòng King tiêu chuẩn Hilton', 2000000.00, 35, 2, ARRAY['WiFi', 'Điều hòa', 'Minibar', 'Bồn tắm'], ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'], true),
('f77e8ac5-2ddf-4eaa-9345-11ade1705450', '66666666-6666-6666-6666-666666666666', 'Executive Suite', 'Suite', 'Suite Executive với lounge access', 4000000.00, 60, 3, ARRAY['WiFi', 'Điều hòa', 'Phòng khách', 'Executive Lounge'], ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'], true),

-- Imperial Hotel rooms
('3994258b-bd14-462b-b995-a2bb9a909b69', '22222222-2222-2222-2222-222222222222', 'Superior Room', 'Superior', 'Phòng Superior tiện nghi', 1800000.00, 28, 2, ARRAY['WiFi', 'Điều hòa', 'TV', 'Két sắt'], ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'], true),
('6940fc83-87c5-4576-9b4c-04e7d28db2e5', '22222222-2222-2222-2222-222222222222', 'Deluxe Sea View', 'Deluxe', 'Phòng Deluxe view biển', 2800000.00, 38, 2, ARRAY['WiFi', 'Điều hòa', 'Minibar', 'Ban công'], ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'], true);

-- =====================================================
-- PART 7: NOTES
-- =====================================================

-- NOTE: User data (profiles, user_roles, bookings) cannot be migrated directly
-- because they reference auth.users which requires users to sign up again.
-- 
-- After migration:
-- 1. Run this script in SQL Editor at https://supabase.com/dashboard/project/dspmxnrmctqktwiprrmh/sql
-- 2. Update your .env file with the new Supabase URL and anon key
-- 3. Users will need to create new accounts
-- 4. If you need to make a user admin, run:
--    UPDATE user_roles SET role = 'admin' WHERE user_id = '<user-id>';
