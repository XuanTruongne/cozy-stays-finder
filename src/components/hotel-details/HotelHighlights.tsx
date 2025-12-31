import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, Shield, ThumbsUp, MapPin, Star } from 'lucide-react';

interface HotelHighlightsProps {
  rating: number | null;
  reviewCount: number | null;
  propertyType: string;
  ward: string;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  villa: 'Villa',
  homestay: 'Homestay',
  hotel: 'Khách sạn',
  apartment: 'Căn hộ',
  guesthouse: 'Nhà nghỉ',
};

const HotelHighlights = ({ rating, reviewCount, propertyType, ward }: HotelHighlightsProps) => {
  const highlights = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: 'Đánh giá cao',
      description: rating ? `${rating}/5 từ ${reviewCount || 0} đánh giá` : 'Chưa có đánh giá',
    },
    {
      icon: <MapPin className="w-5 h-5 text-secondary" />,
      title: 'Vị trí thuận tiện',
      description: `Tọa lạc tại ${ward}, Vũng Tàu`,
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      title: 'Nhận/trả phòng linh hoạt',
      description: 'Nhận phòng 14:00 - Trả phòng 12:00',
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: 'An toàn & Vệ sinh',
      description: 'Đảm bảo tiêu chuẩn vệ sinh',
    },
    {
      icon: <ThumbsUp className="w-5 h-5 text-purple-500" />,
      title: PROPERTY_TYPE_LABELS[propertyType] || propertyType,
      description: 'Phù hợp cho gia đình, cặp đôi',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-orange-500" />,
      title: 'Dịch vụ chất lượng',
      description: 'Đội ngũ nhân viên chuyên nghiệp',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          Điểm nổi bật
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{highlight.icon}</div>
              <div>
                <p className="font-medium text-sm">{highlight.title}</p>
                <p className="text-xs text-muted-foreground">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelHighlights;
