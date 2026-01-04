import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Loader2, ArrowLeft } from 'lucide-react';

interface PaymentDebitCardProps {
  totalPrice: number;
  onComplete: () => void;
  onBack: () => void;
}

const PaymentDebitCard = ({ totalPrice, onComplete, onBack }: PaymentDebitCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onComplete();
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length >= 16 && 
    cardHolder.length >= 2 && 
    expiryDate.length >= 5 && 
    cvv.length >= 3;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-secondary" />
          Thanh toán bằng thẻ ghi nợ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Số thẻ</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardHolder">Tên chủ thẻ</Label>
            <Input
              id="cardHolder"
              placeholder="NGUYEN VAN A"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Ngày hết hạn</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                maxLength={4}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Tổng thanh toán:</span>
              <span className="text-xl font-bold text-secondary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
              </span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={!isFormValid || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Thanh toán ngay'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentDebitCard;
