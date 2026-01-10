import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Award, Heart } from 'lucide-react';
import WhyChooseUs from '@/components/home/WhyChooseUs';

const About = () => {
  const stats = [
    { icon: Building2, value: '500+', label: 'Chỗ ở' },
    { icon: Users, value: '50,000+', label: 'Khách hàng' },
    { icon: Award, value: '10+', label: 'Năm kinh nghiệm' },
    { icon: Heart, value: '98%', label: 'Hài lòng' },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'Giám đốc điều hành',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    },
    {
      name: 'Trần Thị B',
      role: 'Giám đốc Marketing',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    },
    {
      name: 'Lê Văn C',
      role: 'Quản lý vận hành',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] bg-primary">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Về Chúng Tôi
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Nền tảng đặt phòng hàng đầu tại Vũng Tàu với hơn 10 năm kinh nghiệm
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <stat.icon className="w-10 h-10 text-secondary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Sứ mệnh của chúng tôi</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              VungTau Stay được thành lập với sứ mệnh mang đến cho du khách những trải nghiệm lưu trú 
              tốt nhất tại thành phố biển Vũng Tàu. Chúng tôi kết nối bạn với hàng trăm khách sạn, 
              villa, homestay và căn hộ chất lượng cao với giá cả hợp lý.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Với đội ngũ nhân viên tận tâm và hệ thống đặt phòng hiện đại, chúng tôi cam kết 
              mang đến dịch vụ nhanh chóng, tiện lợi và đáng tin cậy cho mỗi khách hàng.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Chất lượng</h3>
                <p className="text-muted-foreground">
                  Chúng tôi chỉ hợp tác với các đối tác đạt tiêu chuẩn chất lượng cao, 
                  đảm bảo mọi chỗ ở đều đáp ứng kỳ vọng của khách hàng.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Minh bạch</h3>
                <p className="text-muted-foreground">
                  Giá cả rõ ràng, không phí ẩn. Thông tin chính xác và cập nhật liên tục 
                  để bạn có thể đưa ra quyết định tốt nhất.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Tận tâm</h3>
                <p className="text-muted-foreground">
                  Đội ngũ hỗ trợ 24/7 sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn 
                  trong suốt quá trình đặt phòng.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Đội ngũ lãnh đạo</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />
    </Layout>
  );
};

export default About;
