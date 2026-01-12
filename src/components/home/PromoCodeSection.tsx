import { useState, useEffect } from 'react';
import { Copy, Check, Ticket, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Discount {
  id: string;
  code: string;
  discount_percent: number;
  description: string | null;
  min_order_amount: number | null;
  valid_until: string | null;
  image_url: string | null;
}

const PromoCodeSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      const { data, error } = await supabase
        .from('discounts')
        .select('id, code, discount_percent, description, min_order_amount, valid_until, image_url')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setDiscounts(data);
      }
      setLoading(false);
    };

    fetchDiscounts();
  }, []);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const formatExpiry = (date: string | null) => {
    if (!date) return 'Không giới hạn';
    return format(new Date(date), 'dd/MM/yyyy');
  };

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-border animate-pulse">
                <div className="h-40 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : discounts.length === 0 ? (
          <p className="text-center text-muted-foreground">Hiện chưa có mã khuyến mãi nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discounts.map((promo) => (
              <div
                key={promo.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={promo.image_url || 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400'}
                    alt={promo.description || promo.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-secondary" />
                      <span className="text-2xl font-bold text-white">{promo.discount_percent}%</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">{promo.description || `Giảm ${promo.discount_percent}%`}</h3>
                  <div className="text-sm text-muted-foreground space-y-1 mb-4">
                    <p>Đơn tối thiểu: {formatCurrency(promo.min_order_amount)}</p>
                    <p>Hết hạn: {formatExpiry(promo.valid_until)}</p>
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
        )}
      </div>
    </section>
  );
};

export default PromoCodeSection;
