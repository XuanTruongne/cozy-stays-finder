import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Bed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Hotel } from '@/hooks/useHotels';
import { formatPrice, WARDS } from '@/lib/constants';

interface HotelListCardProps {
  hotel: Hotel;
  minPrice?: number;
}

const HotelListCard = ({ hotel, minPrice }: HotelListCardProps) => {
  const wardLabel = WARDS.find(w => w.value === hotel.ward)?.label || hotel.ward;
  const firstImage = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  const amenities = hotel.amenities || [];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-72 lg:w-80 shrink-0">
          <Link to={`/hotel/${hotel.id}`}>
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
              <img
                src={firstImage}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {hotel.featured && (
                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                  Nổi bật
                </Badge>
              )}
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to={`/hotel/${hotel.id}`}>
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground hover:text-secondary transition-colors line-clamp-1">
                    {hotel.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Phường {wardLabel}, Vũng Tàu</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg shrink-0">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-semibold text-secondary">{hotel.rating || 0}</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {hotel.description || 'Chỗ nghỉ tuyệt vời tại Vũng Tàu với nhiều tiện nghi hiện đại.'}
            </p>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {amenities.slice(0, 4).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs font-normal">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                    +{amenities.length - 4} tiện nghi
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Giá chỉ từ</p>
              <p className="text-xl font-bold text-secondary">
                {minPrice ? formatPrice(minPrice) : 'Liên hệ'}
              </p>
              <p className="text-xs text-muted-foreground">/đêm</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {hotel.review_count || 0} đánh giá
              </span>
              <Link to={`/hotel/${hotel.id}`}>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Xem chi tiết
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListCard;
