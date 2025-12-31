import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CreditCard, Baby, Dog, Cigarette, AlertCircle } from 'lucide-react';

const HotelPolicies = () => {
  const policies = [
    {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      title: 'Nhận/Trả phòng',
      items: ['Nhận phòng: 14:00 - 22:00', 'Trả phòng: trước 12:00'],
    },
    {
      icon: <CreditCard className="w-5 h-5 text-green-500" />,
      title: 'Thanh toán',
      items: ['Thanh toán khi nhận phòng', 'Chấp nhận tiền mặt, chuyển khoản'],
    },
    {
      icon: <Baby className="w-5 h-5 text-purple-500" />,
      title: 'Trẻ em',
      items: ['Trẻ em dưới 5 tuổi miễn phí', 'Có thể thêm giường phụ'],
    },
    {
      icon: <Dog className="w-5 h-5 text-orange-500" />,
      title: 'Thú cưng',
      items: ['Liên hệ trước khi mang thú cưng'],
    },
    {
      icon: <Cigarette className="w-5 h-5 text-red-500" />,
      title: 'Hút thuốc',
      items: ['Không hút thuốc trong phòng', 'Khu vực hút thuốc riêng'],
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      title: 'Hủy phòng',
      items: ['Miễn phí hủy trước 24h', 'Phí 50% nếu hủy trong ngày'],
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-secondary" />
          Chính sách chỗ nghỉ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {policy.icon}
                <h4 className="font-medium">{policy.title}</h4>
              </div>
              <ul className="space-y-1">
                {policy.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelPolicies;
