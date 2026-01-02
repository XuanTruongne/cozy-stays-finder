import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  Maximize2,
  Bed,
  ChevronLeft,
  ChevronRight,
  Wind,
  Wifi,
  Bath,
  Coffee,
  Tv,
  Fan,
  Refrigerator,
  Baby,
  BedDouble,
  Shirt,
  Lamp,
} from 'lucide-react';
import { formatPrice } from '@/lib/constants';
import type { Tables } from '@/integrations/supabase/types';

type Room = Tables<'rooms'>;

interface RoomDetailModalProps {
  room: Room | null;
  hotelId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AMENITY_CATEGORIES = {
  'Phòng tắm': ['Phòng Tắm Riêng', 'Bồn tắm', 'Vòi sen', 'Máy sấy tóc', 'Khăn tắm', 'Khăn', 'Nước nóng', 'Dép lê', 'Đồ vệ sinh cá nhân', 'Bàn chải', 'Dầu gội', 'Dầu xả', 'Xà phòng', 'Lược'],
  'Bố trí phòng': ['Tủ quần áo', 'Bàn', 'Bàn ăn', 'Ghế', 'Rèm che nắng'],
  'Đồ ăn & đồ uống': ['Trà túi lọc', 'Ấm đun nước', 'Bar mini', 'Cà phê'],
  'Tiện nghi phòng': ['Điều hòa', 'Quạt điện', 'Máy điều hòa', 'Tủ lạnh'],
  'Công nghệ': ['Wifi', 'Truyền hình', 'TV', 'Internet'],
};

const AMENITY_ICONS: Record<string, any> = {
  'Điều hòa': Wind,
  'Máy điều hòa': Wind,
  'Wifi': Wifi,
  'Internet': Wifi,
  'Phòng Tắm Riêng': Bath,
  'Bồn tắm': Bath,
  'Vòi sen': Bath,
  'Trà túi lọc': Coffee,
  'Cà phê': Coffee,
  'Ấm đun nước': Coffee,
  'Truyền hình': Tv,
  'TV': Tv,
  'Quạt điện': Fan,
  'Tủ lạnh': Refrigerator,
  'Bar mini': Refrigerator,
  'Tủ quần áo': Shirt,
  'Bàn': Lamp,
  'Rèm che nắng': Lamp,
};

const RoomDetailModal = ({ room, hotelId, isOpen, onClose }: RoomDetailModalProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!room) return null;

  const images = room.images && room.images.length > 0 ? room.images : [];
  const displayImages = images.slice(0, 5);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Categorize amenities
  const categorizedAmenities: Record<string, string[]> = {};
  const uncategorizedAmenities: string[] = [];

  room.amenities?.forEach((amenity) => {
    let found = false;
    for (const [category, items] of Object.entries(AMENITY_CATEGORIES)) {
      if (items.some((item) => amenity.toLowerCase().includes(item.toLowerCase()))) {
        if (!categorizedAmenities[category]) {
          categorizedAmenities[category] = [];
        }
        categorizedAmenities[category].push(amenity);
        found = true;
        break;
      }
    }
    if (!found) {
      uncategorizedAmenities.push(amenity);
    }
  });

  const handleBooking = () => {
    onClose();
    navigate(`/booking/${hotelId}/${room.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{room.name}</DialogTitle>
            </DialogHeader>

            {/* Image Gallery */}
            {displayImages.length > 0 && (
              <div className="mt-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={displayImages[currentImageIndex]}
                    alt={`${room.name} - Ảnh ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {displayImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {displayImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {displayImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`aspect-video rounded overflow-hidden border-2 transition-colors ${
                          i === currentImageIndex ? 'border-secondary' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Room Info */}
            <div className="mt-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BedDouble className="w-4 h-4" />
                  <span>1 giường queen (chiều rộng 1,8m)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Baby className="w-4 h-4" />
                  <span>Giường phụ và cũi không áp dụng cho loại phòng này</span>
                </div>
                {room.size && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize2 className="w-4 h-4" />
                    <span>{room.size} ㎡</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Tối đa {room.capacity} người</span>
                </div>
              </div>

              {/* Description */}
              {room.description && (
                <div>
                  <h4 className="font-semibold mb-2">Mô tả</h4>
                  <p className="text-muted-foreground">{room.description}</p>
                </div>
              )}

              {/* Amenities by Category */}
              {Object.keys(categorizedAmenities).length > 0 && (
                <div className="space-y-4">
                  {Object.entries(categorizedAmenities).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((amenity) => {
                          const Icon = AMENITY_ICONS[amenity] || Bed;
                          return (
                            <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                              <Icon className="w-3 h-3" />
                              {amenity}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Uncategorized Amenities */}
              {uncategorizedAmenities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tiện nghi khác</h4>
                  <div className="flex flex-wrap gap-2">
                    {uncategorizedAmenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Child Policy */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Chính sách cho trẻ em</h4>
                <p className="text-sm text-muted-foreground">
                  Trẻ em ở mọi độ tuổi đều có thể lưu trú tại phòng này. Bạn có thể mất thêm phí để trẻ em sử dụng giường có sẵn. 
                  Hãy thêm số lượng trẻ em đi cùng để nhận được mức giá chính xác hơn.
                </p>
              </div>

              {/* Price and Booking */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-2xl font-bold text-secondary">{formatPrice(room.price)}</span>
                  <span className="text-muted-foreground">/đêm</span>
                </div>
                <Button
                  size="lg"
                  disabled={!room.available}
                  onClick={handleBooking}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {room.available ? 'Đặt phòng ngay' : 'Hết phòng'}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailModal;
