import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Loader2, ArrowLeft, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentBankAppProps {
  totalPrice: number;
  onComplete: () => void;
  onBack: () => void;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  bookingCode?: string;
}

const PaymentBankApp = ({ 
  totalPrice, 
  onComplete, 
  onBack,
  bankName = 'Vietcombank',
  accountNumber = '1023630921',
  accountName = 'NGUYỄN VĂN TRƯỜNG',
  bookingCode
}: PaymentBankAppProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate stable booking code on mount
  const stableBookingCode = useMemo(() => {
    return bookingCode || `BOOKING${Date.now().toString().slice(-8)}`;
  }, [bookingCode]);

  // VietQR API URL - Bank ID for Vietcombank is 970436
  const vietQrUrl = useMemo(() => {
    const bankId = '970436'; // Vietcombank BIN
    const template = 'compact2';
    const encodedContent = encodeURIComponent(stableBookingCode);
    return `https://img.vietqr.io/image/${bankId}-${accountNumber}-${template}.png?amount=${totalPrice}&addInfo=${encodedContent}&accountName=${encodeURIComponent(accountName)}`;
  }, [accountNumber, totalPrice, stableBookingCode, accountName]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Đã sao chép');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onComplete();
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          Thanh toán qua App ngân hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Thời gian còn lại để thanh toán</p>
          <p className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</p>
        </div>

        {/* VietQR Code */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white rounded-lg flex items-center justify-center border-2 border-blue-300 p-2 shadow-md overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="w-48 h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}
            {imageError ? (
              <div className="w-48 h-48 flex items-center justify-center bg-blue-50">
                <p className="text-sm text-muted-foreground text-center px-4">
                  Không thể tải mã QR. Vui lòng chuyển khoản thủ công.
                </p>
              </div>
            ) : (
              <img 
                src={vietQrUrl} 
                alt="VietQR Code" 
                className={`max-w-[200px] object-contain ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium">Quét mã QR bằng app ngân hàng</p>
            <p className="text-xs text-muted-foreground mt-1">Số tiền và nội dung đã được điền sẵn</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm">Thông tin chuyển khoản:</h4>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ngân hàng:</span>
            <span className="font-medium">{bankName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{accountNumber}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(accountNumber, 'account')}
              >
                {copied === 'account' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Chủ tài khoản:</span>
            <span className="font-medium">{accountName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Số tiền:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600">{formattedPrice}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(totalPrice.toString(), 'amount')}
              >
                {copied === 'amount' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nội dung CK:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{stableBookingCode}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(stableBookingCode, 'content')}
              >
                {copied === 'content' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Supported Banks */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Hỗ trợ tất cả ngân hàng Việt Nam qua VietQR</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {['Vietcombank', 'Techcombank', 'BIDV', 'VietinBank', 'MB Bank', 'TPBank'].map(bank => (
              <span key={bank} className="text-xs bg-muted px-2 py-1 rounded">{bank}</span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleConfirmPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xác nhận...
              </>
            ) : (
              'Tôi đã thanh toán'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Sau khi chuyển khoản, vui lòng nhấn nút trên để xác nhận
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentBankApp;
