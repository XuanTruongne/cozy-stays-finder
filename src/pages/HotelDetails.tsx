import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useHotel } from '@/hooks/useHotels';
import { useRooms } from '@/hooks/useRooms';
import { WARDS, formatPrice } from '@/lib/constants';
import { MapPin, Star, Loader2, Building2 } from 'lucide-react';
import { AnimatedSection, FadeInScale } from '@/components/ui/animated-section';

// Hotel Details Components
import HotelImageGallery from '@/components/hotel-details/HotelImageGallery';
import HotelHighlights from '@/components/hotel-details/HotelHighlights';
import HotelAmenities from '@/components/hotel-details/HotelAmenities';
import HotelRooms from '@/components/hotel-details/HotelRooms';
import HotelReviews from '@/components/hotel-details/HotelReviews';
import ReviewForm from '@/components/hotel-details/ReviewForm';
import HotelPolicies from '@/components/hotel-details/HotelPolicies';
import HotelMap from '@/components/hotel-details/HotelMap';
import NearbyHotels from '@/components/hotel-details/NearbyHotels';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  villa: 'Villa',
  homestay: 'Homestay',
  hotel: 'Khách sạn',
  apartment: 'Căn hộ',
  guesthouse: 'Nhà nghỉ',
};

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[hotel.property_type] || hotel.property_type;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                <Building2 className="w-3 h-3 mr-1" />
                {propertyTypeLabel}
              </Badge>
              {hotel.featured && (
                <Badge variant="secondary">Nổi bật</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {hotel.address}, {wardLabel}
              </span>
              <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold">{hotel.rating || 0}</span>
                <span className="text-muted-foreground">({hotel.review_count || 0} đánh giá)</span>
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Image Gallery */}
        <FadeInScale delay={0.2}>
          <HotelImageGallery images={images} hotelName={hotel.name} />
        </FadeInScale>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Highlights */}
            <AnimatedSection delay={0.3}>
              <HotelHighlights
                rating={hotel.rating}
                reviewCount={hotel.review_count}
                propertyType={hotel.property_type}
                ward={wardLabel}
              />
            </AnimatedSection>

            {/* Amenities */}
            <AnimatedSection delay={0.35}>
              <HotelAmenities amenities={amenities} />
            </AnimatedSection>

            {/* Description */}
            {hotel.description && (
              <AnimatedSection delay={0.4}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Mô tả</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {hotel.description}
                  </p>
                </Card>
              </AnimatedSection>
            )}

            {/* Rooms */}
            <AnimatedSection delay={0.45}>
              <HotelRooms rooms={rooms || []} hotelId={hotel.id} />
            </AnimatedSection>

            {/* Map */}
            <AnimatedSection delay={0.5}>
              <HotelMap 
                address={hotel.address} 
                ward={wardLabel} 
                mapEmbedUrl={hotel.map_embed_url}
              />
            </AnimatedSection>

            {/* Reviews */}
            <AnimatedSection delay={0.55}>
              <HotelReviews
                hotelId={hotel.id}
                rating={hotel.rating}
                reviewCount={hotel.review_count}
              />
            </AnimatedSection>

            {/* Write Review */}
            <AnimatedSection delay={0.6}>
              <ReviewForm hotelId={hotel.id} />
            </AnimatedSection>

            {/* Policies */}
            <AnimatedSection delay={0.65}>
              <HotelPolicies />
            </AnimatedSection>

            {/* Nearby Hotels */}
            <AnimatedSection delay={0.7}>
              <NearbyHotels
                currentHotelId={hotel.id}
                ward={hotel.ward}
                propertyType={hotel.property_type}
              />
            </AnimatedSection>
          </main>

          {/* Sidebar - Quick Booking */}
          <aside className="w-full lg:w-80 shrink-0">
            <FadeInScale delay={0.3}>
              <Card className="sticky top-24 p-6">
                <div className="text-center mb-4">
                  <Badge className="mb-2 bg-secondary/10 text-secondary">
                    {propertyTypeLabel}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Giá từ</p>
                  <p className="text-3xl font-bold text-secondary">
                    {minPrice > 0 ? formatPrice(minPrice) : 'Liên hệ'}
                  </p>
                  <p className="text-sm text-muted-foreground">/đêm</p>
                </div>
                <Button 
                  onClick={() => navigate(`/booking/${hotel.id}`)}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 mb-3"
                >
                  Đặt ngay
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const roomsSection = document.querySelector('[data-rooms-section]');
                    roomsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full"
                >
                  Xem các phòng
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Đặt phòng nhanh chóng & an toàn
                </p>
              </Card>
            </FadeInScale>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default HotelDetails;
