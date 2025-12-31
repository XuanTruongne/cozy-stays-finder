import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wifi, Car, Coffee, Waves, Utensils, Dumbbell, 
  AirVent, Tv, Bath, WashingMachine, UtensilsCrossed,
  Snowflake, Phone, ShieldCheck, Baby, Dog, Check
} from 'lucide-react';

interface HotelAmenitiesProps {
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi miễn phí': <Wifi className="w-5 h-5" />,
  'WiFi tốc độ cao': <Wifi className="w-5 h-5" />,
  'Bãi đậu xe': <Car className="w-5 h-5" />,
  'Bữa sáng': <Coffee className="w-5 h-5" />,
  'Hồ bơi': <Waves className="w-5 h-5" />,
  'Bể bơi': <Waves className="w-5 h-5" />,
  'Nhà hàng': <Utensils className="w-5 h-5" />,
  'Phòng gym': <Dumbbell className="w-5 h-5" />,
  'Điều hòa': <AirVent className="w-5 h-5" />,
  'Máy lạnh': <Snowflake className="w-5 h-5" />,
  'TV': <Tv className="w-5 h-5" />,
  'Bồn tắm': <Bath className="w-5 h-5" />,
  'Máy giặt': <WashingMachine className="w-5 h-5" />,
  'Bếp': <UtensilsCrossed className="w-5 h-5" />,
  'Lễ tân 24/7': <Phone className="w-5 h-5" />,
  'An ninh 24/7': <ShieldCheck className="w-5 h-5" />,
  'Phòng gia đình': <Baby className="w-5 h-5" />,
  'Cho phép thú cưng': <Dog className="w-5 h-5" />,
};

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tiện nghi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="text-secondary">
                {amenityIcons[amenity] || <Check className="w-5 h-5" />}
              </div>
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelAmenities;
