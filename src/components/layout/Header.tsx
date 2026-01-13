import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/search', label: 'Tìm Phòng' },
    { href: '/about', label: 'Giới Thiệu' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Liên Hệ' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-custom-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl md:text-2xl font-bold text-primary">
              Vũng Tàu<span className="text-secondary">Stay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  isActive(link.href)
                    ? 'text-secondary'
                    : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      {user.email?.split('@')[0] || user.phone}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Hồ sơ của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile?tab=bookings')}>
                      Lịch sử đặt phòng
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link to="/auth">
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/auth?tab=signup">
                      <User className="h-4 w-4 mr-2" />
                      Đăng ký
                    </Link>
                  </Button>
                </div>
              )
            )}
            
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link to="/search">
                Đặt Phòng Ngay
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-slide-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive(link.href)
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-foreground/80 hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                {!loading && (
                  user ? (
                    <>
                      <Button variant="outline" className="w-full" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                        Hồ sơ của tôi
                      </Button>
                      <Button variant="ghost" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                          Đăng nhập
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          Đăng ký
                        </Link>
                      </Button>
                    </>
                  )
                )}
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                    Đặt Phòng Ngay
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
