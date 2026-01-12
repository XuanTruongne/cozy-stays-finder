import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/search/SearchForm';
import HotelCard from '@/components/hotels/HotelCard';
import TetPromoBanner from '@/components/home/TetPromoBanner';
import PromoCodeSection from '@/components/home/PromoCodeSection';
import BlogSection from '@/components/home/BlogSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { useFeaturedHotels } from '@/hooks/useHotels';
import { ROOM_TYPES } from '@/lib/constants';
import { AnimatedSection, StaggerContainer, StaggerItem, FadeInScale } from '@/components/ui/animated-section';

const Index = () => {
  const {
    data: featuredHotels,
    isLoading
  } = useFeaturedHotels();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920" alt="Hero background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="container-custom relative z-10 py-16">
          <AnimatedSection direction="up" delay={0.1}>
            <div className="max-w-2xl mb-10">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Khám Phá Vũng Tàu
                <span className="block text-secondary my-[20px]">Đặt Phòng Dễ Dàng</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Từ Villa sang trọng đến Homestay ấm cúng - Tìm nơi nghỉ dưỡng hoàn hảo cho chuyến đi của bạn.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.3}>
            <SearchForm />
          </AnimatedSection>
        </div>
      </section>

      {/* Tet Promo Banner */}
      <AnimatedSection>
        <TetPromoBanner />
      </AnimatedSection>

      {/* Features */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{
              icon: Shield,
              title: 'Đặt phòng an toàn',
              desc: 'Bảo mật thanh toán'
            }, {
              icon: Clock,
              title: 'Xác nhận nhanh',
              desc: 'Trong vòng 24h'
            }, {
              icon: Star,
              title: 'Đánh giá thực',
              desc: 'Từ khách hàng'
            }, {
              icon: Award,
              title: 'Giá tốt nhất',
              desc: 'Cam kết hoàn tiền'
            }].map((item, index) => (
              <StaggerItem key={index}>
                <div className="text-center p-4">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Loại Phòng Phổ Biến
            </h2>
            <p className="text-muted-foreground">Đa dạng lựa chọn phù hợp mọi nhu cầu</p>
          </AnimatedSection>
          
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-4" staggerDelay={0.1}>
            {ROOM_TYPES.map(type => (
              <StaggerItem key={type.value}>
                <Link to={`/search?type=${type.value}`} className="group relative aspect-square rounded-xl overflow-hidden block">
                  <img src={`https://images.unsplash.com/photo-${type.value === 'villa' ? '1613490493576-7fde63acd811' : type.value === 'homestay' ? '1502672260266-1c1ef2d93688' : type.value === 'hotel' ? '1566073771259-6a8506099945' : type.value === 'apartment' ? '1522708323590-d24dbb6b0267' : '1631049307264-da0ec9d70304'}?w=400`} alt={type.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-lg font-semibold text-white">{type.label}</h3>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <AnimatedSection className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                Nơi Nghỉ Nổi Bật
              </h2>
              <p className="text-muted-foreground">Được yêu thích nhất bởi du khách</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/search">
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              </div>
            ) : featuredHotels && featuredHotels.length > 0 ? (
              featuredHotels.slice(0, 6).map((hotel, index) => (
                <FadeInScale key={hotel.id} delay={index * 0.1}>
                  <HotelCard hotel={hotel} />
                </FadeInScale>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Chưa có khách sạn nổi bật
              </div>
            )}
          </div>
          
          <AnimatedSection className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link to="/search">
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Promo Codes */}
      <PromoCodeSection />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Blog Section */}
      <BlogSection />

      {/* CTA */}
      <AnimatedSection>
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Sẵn sàng cho chuyến đi?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Đặt phòng ngay hôm nay và trải nghiệm dịch vụ tuyệt vời tại Vũng Tàu.
            </p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link to="/search">Đặt Phòng Ngay</Link>
            </Button>
          </div>
        </section>
      </AnimatedSection>
    </Layout>
  );
};

export default Index;
