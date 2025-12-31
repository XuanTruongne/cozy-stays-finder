import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Bed, Maximize2 } from 'lucide-react';
import { formatPrice } from '@/lib/constants';
import type { Tables } from '@/integrations/supabase/types';

type Room = Tables<'rooms'>;

interface HotelRoomsProps {
  rooms: Room[];
  hotelId: string;
}

const HotelRooms = ({ rooms, hotelId }: HotelRoomsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bed className="w-5 h-5 text-secondary" />
          Các loại phòng ({rooms.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:border-secondary/50 transition-colors">
              {/* Room Image */}
              <div className="w-full md:w-48 h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bed className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{room.name}</h4>
                    <p className="text-sm text-muted-foreground">{room.type}</p>
                  </div>
                  {room.available ? (
                    <Badge className="bg-green-100 text-green-700">Còn phòng</Badge>
                  ) : (
                    <Badge variant="secondary">Hết phòng</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{room.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {room.capacity} người
                  </Badge>
                  {room.size && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      {room.size} m²
                    </Badge>
                  )}
                  {room.amenities?.slice(0, 2).map((amenity) => (
                    <Badge key={amenity} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-32">
                <div className="text-right">
                  <p className="text-xl font-bold text-secondary">{formatPrice(room.price)}</p>
                  <p className="text-xs text-muted-foreground">/đêm</p>
                </div>
                <Button
                  size="sm"
                  disabled={!room.available}
                  onClick={() => navigate(`/booking/${hotelId}/${room.id}`)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Đặt phòng
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Hiện tại không có phòng nào
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelRooms;
