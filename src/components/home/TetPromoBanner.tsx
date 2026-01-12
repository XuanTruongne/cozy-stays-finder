import { Link } from 'react-router-dom';
import { Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
const TetPromoBanner = () => {
  return <section className="relative py-12 overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-amber-500">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-10 text-6xl">🧧</div>
        <div className="absolute top-8 right-20 text-5xl">🎊</div>
        <div className="absolute bottom-4 left-1/4 text-4xl">🌸</div>
        <div className="absolute bottom-6 right-1/3 text-5xl">🏮</div>
        <div className="absolute top-1/2 left-1/2 text-3xl">✨</div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
              <span className="text-yellow-200 font-semibold uppercase tracking-wider text-sm">
                Khuyến Mãi Đặc Biệt
              </span>
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Đón Tết Bính Ngọ 2026 🐎 
            </h2>
            <p className="text-white/90 text-lg max-w-xl">
              Giảm đến <span className="font-bold text-yellow-200 text-2xl">30%</span> cho tất cả các đặt phòng từ nay đến hết mùng 10 Tết. 
              Đặt phòng sớm - Giá hời hơn!
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Button size="lg" className="bg-yellow-400 text-red-700 hover:bg-yellow-300 font-bold text-lg px-8 shadow-lg" asChild>
              <Link to="/search">
                <Gift className="w-5 h-5 mr-2" />
                Đặt Ngay
              </Link>
            </Button>
            <span className="text-white/80 text-sm">* Áp dụng đến 09/02/2025</span>
          </div>
        </div>
      </div>
    </section>;
};
export default TetPromoBanner;