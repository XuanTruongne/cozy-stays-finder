import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useHotel } from '@/hooks/useHotels';
import { useRooms } from '@/hooks/useRooms';
import { WARDS, formatPrice } from '@/lib/constants';
import { 
  MapPin, Star, Users, ChevronLeft, ChevronRight, 
  Wifi, Car, Coffee, Waves, Utensils, Dumbbell,
  Check, Loader2
} from 'lucide-react';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi miễn phí': <Wifi className="w-4 h-4" />,
  'WiFi tốc độ cao': <Wifi className="w-4 h-4" />,
  'Bãi đậu xe': <Car className="w-4 h-4" />,
  'Bữa sáng': <Coffee className="w-4 h-4" />,
  'Hồ bơi': <Waves className="w-4 h-4" />,
  'Bể bơi': <Waves className="w-4 h-4" />,
  'Nhà hàng': <Utensils className="w-4 h-4" />,
  'Phòng gym': <Dumbbell className="w-4 h-4" />,
};

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: hotel, isLoading: hotelLoading } = useHotel(id || '');
  const { data: rooms, isLoading: roomsLoading } = useRooms(id);

  const isLoading = hotelLoading || roomsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </Layout>
    );
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy khách sạn</h1>
          <Button onClick={() => navigate('/search')}>Quay lại tìm kiếm</Button>
        </div>
      </Layout>
    );
  }

  const wardLabel = WARDS.find(w => w.value === hotel.ward)?.label || hotel.ward;
  const images = hotel.images || [];
  const amenities = hotel.amenities || [];
  const minPrice = rooms && rooms.length > 0 ? Math.min(...rooms.map(r => r.price)) : 0;

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <Layout>
      {/* Image Gallery */}
      <section className="relative h-[50vh] md:h-[60vh] bg-muted">
        {images.length > 0 ? (
          <img
            src={images[currentImage]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Không có hình ảnh</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Hotel Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                    {hotel.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.address}, {wardLabel}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-secondary/10 px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="font-bold text-lg">{hotel.rating || 0}</span>
                  <span className="text-sm text-muted-foreground">({hotel.review_count || 0})</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {hotel.description}
              </p>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="flex items-center gap-1.5 py-1.5 px-3">
                      {amenityIcons[amenity] || <Check className="w-4 h-4" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Rooms */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">Các phòng còn trống</h2>
              <div className="space-y-4">
                {rooms && rooms.length > 0 ? (
                  rooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-64 h-48 md:h-auto shrink-0">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={room.images[0]}
                              alt={room.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <p className="text-muted-foreground text-sm">Không có hình</p>
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{room.name}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{room.type}</p>
                              <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {room.capacity} người
                                </Badge>
                                {room.amenities?.slice(0, 3).map((amenity) => (
                                  <Badge key={amenity} variant="outline">{amenity}</Badge>
                                ))}
                              </div>
                              {room.available && (
                                <p className="text-sm text-green-600">Còn phòng</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-secondary">{formatPrice(room.price)}</p>
                              <p className="text-sm text-muted-foreground mb-4">/đêm</p>
                              <Button 
                                onClick={() => navigate(`/booking/${hotel.id}/${room.id}`)}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                              >
                                Đặt phòng
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Hiện tại không có phòng nào</p>
                  </Card>
                )}
              </div>
            </section>
          </main>

          {/* Sidebar - Quick Booking */}
          <aside className="w-full lg:w-80 shrink-0">
            <Card className="sticky top-24 p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Giá từ</p>
                <p className="text-3xl font-bold text-secondary">
                  {minPrice > 0 ? formatPrice(minPrice) : 'Liên hệ'}
                </p>
                <p className="text-sm text-muted-foreground">/đêm</p>
              </div>
              <Button 
                onClick={() => navigate(`/booking/${hotel.id}`)}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12"
              >
                Đặt ngay
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Đặt phòng nhanh, không cần đăng nhập
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default HotelDetails;
