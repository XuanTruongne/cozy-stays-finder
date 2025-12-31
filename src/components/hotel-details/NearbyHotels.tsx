import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Star, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, WARDS } from '@/lib/constants';

interface NearbyHotelsProps {
  currentHotelId: string;
  ward: string;
  propertyType: string;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  villa: 'Villa',
  homestay: 'Homestay',
  hotel: 'Khách sạn',
  apartment: 'Căn hộ',
  guesthouse: 'Nhà nghỉ',
};

const NearbyHotels = ({ currentHotelId, ward, propertyType }: NearbyHotelsProps) => {
  const navigate = useNavigate();

  const { data: nearbyHotels, isLoading } = useQuery({
    queryKey: ['nearby-hotels', ward, currentHotelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('ward', ward)
        .neq('id', currentHotelId)
        .order('rating', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms-prices-nearby', nearbyHotels?.map(h => h.id)],
    queryFn: async () => {
      if (!nearbyHotels?.length) return [];
      const { data, error } = await supabase
        .from('rooms')
        .select('hotel_id, price')
        .in('hotel_id', nearbyHotels.map(h => h.id));
      
      if (error) throw error;
      return data;
    },
    enabled: !!nearbyHotels?.length,
  });

  const hotelMinPrices = rooms?.reduce((acc, room) => {
    if (!acc[room.hotel_id] || room.price < acc[room.hotel_id]) {
      acc[room.hotel_id] = room.price;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const wardLabel = WARDS.find(w => w.value === ward)?.label || ward;

  if (isLoading) {
    return null;
  }

  if (!nearbyHotels || nearbyHotels.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-secondary" />
          Chỗ nghỉ lân cận ({wardLabel})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group cursor-pointer border rounded-lg overflow-hidden hover:border-secondary/50 transition-colors"
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {hotel.images && hotel.images.length > 0 ? (
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <span className="px-1.5 py-0.5 bg-secondary/10 rounded text-secondary text-[10px]">
                    {PROPERTY_TYPE_LABELS[hotel.property_type] || hotel.property_type}
                  </span>
                  {hotel.rating && (
                    <span className="flex items-center gap-0.5 ml-auto">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {hotel.rating}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-sm line-clamp-1 group-hover:text-secondary transition-colors">
                  {hotel.name}
                </h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {hotel.address}
                </p>
                <p className="text-sm font-semibold text-secondary mt-2">
                  {hotelMinPrices[hotel.id] ? formatPrice(hotelMinPrices[hotel.id]) : 'Liên hệ'}
                  <span className="text-xs text-muted-foreground font-normal">/đêm</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyHotels;
