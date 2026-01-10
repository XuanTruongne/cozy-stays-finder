import { CheckCircle, Headphones, MapPin, Percent, Shield, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: MapPin,
      title: 'Địa phương & Am hiểu',
      description: 'Đội ngũ am hiểu sâu sắc về Vũng Tàu, tư vấn địa điểm phù hợp nhất cho bạn.',
    },
    {
      icon: Percent,
      title: 'Giá ưu đãi độc quyền',
      description: 'Cam kết giá tốt nhất, nhiều mã giảm giá và ưu đãi đặc biệt dành riêng.',
    },
    {
      icon: Shield,
      title: 'Đặt phòng an toàn',
      description: 'Bảo mật thông tin và thanh toán tuyệt đối, hoàn tiền nếu không hài lòng.',
    },
    {
      icon: CheckCircle,
      title: 'Xác nhận tức thì',
      description: 'Nhận xác nhận đặt phòng ngay lập tức qua email và SMS.',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.',
    },
    {
      icon: ThumbsUp,
      title: 'Đánh giá thực tế',
      description: 'Hàng ngàn đánh giá chân thực từ khách hàng đã trải nghiệm.',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            VungTau Stay mang đến trải nghiệm đặt phòng tuyệt vời với nhiều ưu điểm vượt trội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:border-secondary/50"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <reason.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
