import { useState } from 'react';
import { Copy, Check, Ticket, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const promoCodes = [
  {
    code: 'TET2025',
    discount: '15%',
    description: 'Giảm 15% cho tất cả đặt phòng',
    minOrder: '1.000.000đ',
    expiry: '09/02/2025',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400',
  },
  {
    code: 'XUANMOI30',
    discount: '30%',
    description: 'Giảm 30% cho Villa & Resort',
    minOrder: '3.000.000đ',
    expiry: '15/02/2025',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
  },
  {
    code: 'VUNGTAU10',
    discount: '10%',
    description: 'Giảm 10% - Khách hàng mới',
    minOrder: '500.000đ',
    expiry: '28/02/2025',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  },
];

const PromoCodeSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Đã sao chép mã "${code}"`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Không thể sao chép mã');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Ticket className="w-6 h-6 text-secondary" />
            <span className="text-secondary font-semibold uppercase tracking-wider text-sm">
              Mã Khuyến Mãi
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Ưu Đãi Dành Riêng Cho Bạn
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sử dụng các mã khuyến mãi dưới đây để tiết kiệm hơn cho chuyến đi của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoCodes.map((promo) => (
            <div
              key={promo.code}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-secondary" />
                    <span className="text-2xl font-bold text-white">{promo.discount}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-foreground mb-2">{promo.description}</h3>
                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  <p>Đơn tối thiểu: {promo.minOrder}</p>
                  <p>Hết hạn: {promo.expiry}</p>
                </div>

                {/* Promo Code with Copy */}
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border-2 border-dashed border-secondary/30">
                  <code className="flex-1 text-center font-mono font-bold text-lg text-secondary">
                    {promo.code}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(promo.code)}
                    className="shrink-0 hover:bg-secondary/10"
                  >
                    {copiedCode === promo.code ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-secondary" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCodeSection;
