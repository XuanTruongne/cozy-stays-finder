import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Hotel } from '@/hooks/useHotels';
import { formatPrice, WARDS } from '@/lib/constants';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const wardLabel = WARDS.find(w => w.value === hotel.ward)?.label || hotel.ward;
  const firstImage = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  const amenities = hotel.amenities || [];

  return (
    <Link to={`/hotel/${hotel.id}`}>
      <Card className="overflow-hidden card-hover group cursor-pointer h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={firstImage}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
            {hotel.name}
          </h3>
          
          <div className="flex items-center gap-1 mt-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{wardLabel}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-medium text-foreground">{hotel.rating || 0}</span>
              <span className="text-sm text-muted-foreground">({hotel.review_count || 0} đánh giá)</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {hotel.description}
          </p>

          {/* Amenities Preview */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-normal">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{amenities.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;
