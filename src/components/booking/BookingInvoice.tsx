import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Download, Printer, Home, FileText } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';

interface BookingInvoiceProps {
  bookingDetails: {
    hotelName: string;
    hotelAddress?: string;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    paymentMethod: string;
    bookingCode?: string;
  };
}

const BookingInvoice = ({ bookingDetails }: BookingInvoiceProps) => {
  const navigate = useNavigate();
  const bookingCode = bookingDetails.bookingCode || `BK${Date.now().toString().slice(-8)}`;
  const invoiceDate = new Date();
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'pay_later': return 'Thanh toán tại khách sạn';
      case 'debit_card': return 'Thẻ ghi nợ (Visa/Mastercard)';
      case 'momo': return 'Ví MoMo';
      case 'bank_app': return 'Chuyển khoản ngân hàng';
      default: return method;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Đặt phòng thành công!</h1>
        <p className="text-muted-foreground">
          Mã đặt phòng của bạn: <span className="font-bold text-foreground">{bookingCode}</span>
        </p>
      </div>

      {/* Invoice Card */}
      <Card className="print:shadow-none">
        <CardContent className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-bold">HÓA ĐƠN ĐẶT PHÒNG</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Ngày xuất: {invoiceDate.toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-secondary">#{bookingCode}</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mt-1">
                {bookingDetails.paymentMethod === 'pay_later' ? 'Chờ thanh toán' : 'Đã thanh toán'}
              </span>
            </div>
          </div>

          <Separator />

          {/* Guest Information */}
          <div>
            <h3 className="font-semibold mb-3 text-secondary">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Họ và tên:</span>
                <p className="font-medium">{bookingDetails.guestName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{bookingDetails.guestEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Số điện thoại:</span>
                <p className="font-medium">{bookingDetails.guestPhone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phương thức thanh toán:</span>
                <p className="font-medium">{getPaymentMethodLabel(bookingDetails.paymentMethod)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Hotel & Room Information */}
          <div>
            <h3 className="font-semibold mb-3 text-secondary">Thông tin đặt phòng</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Khách sạn:</span>
                <span className="font-medium text-right">{bookingDetails.hotelName}</span>
              </div>
              {bookingDetails.hotelAddress && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Địa chỉ:</span>
                  <span className="font-medium text-right">{bookingDetails.hotelAddress}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại phòng:</span>
                <span className="font-medium">{bookingDetails.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày nhận phòng:</span>
                <span className="font-medium">{formatDate(bookingDetails.checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày trả phòng:</span>
                <span className="font-medium">{formatDate(bookingDetails.checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số khách:</span>
                <span className="font-medium">{bookingDetails.guests} người</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div>
            <h3 className="font-semibold mb-3 text-secondary">Chi tiết thanh toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giá phòng:</span>
                <span>{formatPrice(bookingDetails.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thuế & Phí dịch vụ:</span>
                <span>Đã bao gồm</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-secondary">{formatPrice(bookingDetails.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Vui lòng mang theo CMND/CCCD khi nhận phòng</li>
              <li>Thời gian nhận phòng: từ 14:00</li>
              <li>Thời gian trả phòng: trước 12:00</li>
              <li>Liên hệ khách sạn nếu cần thay đổi đặt phòng</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Button variant="outline" className="flex-1" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          In hóa đơn
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Tải PDF
        </Button>
        <Button 
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={() => navigate('/')}
        >
          <Home className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </div>

      {/* View Bookings Link */}
      <div className="text-center print:hidden">
        <Button 
          variant="link" 
          className="text-secondary"
          onClick={() => navigate('/profile')}
        >
          Xem tất cả đặt phòng của tôi →
        </Button>
      </div>
    </div>
  );
};

export default BookingInvoice;
