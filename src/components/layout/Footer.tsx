import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              Vũng Tàu<span className="text-secondary">Stay</span>
            </h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Nền tảng đặt phòng trực tuyến hàng đầu tại Vũng Tàu. Đa dạng lựa chọn từ Villa, 
              Homestay đến Khách sạn với giá tốt nhất.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-secondary">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Tìm Kiếm Phòng
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Room Types */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-secondary">Loại Phòng</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/search?type=villa" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Villa
                </Link>
              </li>
              <li>
                <Link to="/search?type=homestay" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Homestay
                </Link>
              </li>
              <li>
                <Link to="/search?type=hotel" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Khách Sạn
                </Link>
              </li>
              <li>
                <Link to="/search?type=apartment" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Căn Hộ
                </Link>
              </li>
              <li>
                <Link to="/search?type=guesthouse" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Nhà Nghỉ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-secondary">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                <span className="text-primary-foreground/80 text-sm">
                  123 Đường Thùy Vân, Phường Thắng Tam, TP. Vũng Tàu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-primary-foreground/80 text-sm">
                  0254 123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-primary-foreground/80 text-sm">
                  contact@vungtaustay.vn
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">© 2026 VũngTàuStay.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;