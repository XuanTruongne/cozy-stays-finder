import { useState } from 'react';
import { Ticket, X, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppliedDiscount {
  code: string;
  discountPercent: number;
  description: string;
}

interface PromoCodeInputProps {
  propertyType: string;
  minOrderAmount: number;
  appliedDiscount: AppliedDiscount | null;
  onApply: (discount: AppliedDiscount) => void;
  onRemove: () => void;
}

const PromoCodeInput = ({ 
  propertyType, 
  minOrderAmount, 
  appliedDiscount, 
  onApply, 
  onRemove 
}: PromoCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã khuyến mãi');
      return;
    }

    setIsValidating(true);

    try {
      const { data: discount, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .gt('valid_until', new Date().toISOString())
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!discount) {
        toast.error('Mã khuyến mãi không hợp lệ hoặc đã hết hạn');
        return;
      }

      // Check min order amount
      if (discount.min_order_amount && minOrderAmount < discount.min_order_amount) {
        toast.error(`Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(discount.min_order_amount)}đ để sử dụng mã này`);
        return;
      }

      // Check max uses
      if (discount.max_uses && discount.used_count >= discount.max_uses) {
        toast.error('Mã khuyến mãi đã hết lượt sử dụng');
        return;
      }

      // Check valid_from
      if (discount.valid_from && new Date(discount.valid_from) > new Date()) {
        toast.error('Mã khuyến mãi chưa có hiệu lực');
        return;
      }

      // Check applicable_to (property type)
      const applicableTo = discount.applicable_to as string[] | null;
      if (applicableTo && applicableTo.length > 0) {
        const isApplicable = applicableTo.includes('all') || 
                            applicableTo.some(type => 
                              type.toLowerCase() === propertyType.toLowerCase()
                            );
        
        if (!isApplicable) {
          const applicableTypes = applicableTo.filter(t => t !== 'all').join(', ');
          toast.error(`Mã này chỉ áp dụng cho: ${applicableTypes}`);
          return;
        }
      }

      // Success - apply discount
      onApply({
        code: discount.code,
        discountPercent: discount.discount_percent,
        description: discount.description,
      });

      toast.success(`Áp dụng mã "${discount.code}" thành công! Giảm ${discount.discount_percent}%`);
      setCode('');

    } catch (err) {
      console.error('Error validating promo code:', err);
      toast.error('Có lỗi xảy ra khi kiểm tra mã');
    } finally {
      setIsValidating(false);
    }
  };

  if (appliedDiscount) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-700">
                Mã <span className="font-mono">{appliedDiscount.code}</span> đã được áp dụng
              </p>
              <p className="text-sm text-green-600">
                {appliedDiscount.description} (-{appliedDiscount.discountPercent}%)
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-green-700 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Ticket className="w-5 h-5 text-secondary" />
        <span className="font-medium">Mã khuyến mãi</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Nhập mã khuyến mãi"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="font-mono uppercase"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApplyCode();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApplyCode}
          disabled={isValidating || !code.trim()}
          className="shrink-0"
        >
          {isValidating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Áp dụng'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
