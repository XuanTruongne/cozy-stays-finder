import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useHotel } from '@/hooks/useHotels';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, formatDate } from '@/lib/constants';
import { format, differenceInDays, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  MapPin, 
  Check, 
  Loader2, 
  LogIn, 
  CreditCard, 
  Smartphone, 
  Wallet,
  CigaretteOff,
  Cigarette,
  Bed,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Maximize,
  Shield,
  Wifi,
  Pencil,
  Clock,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import BookingSteps from '@/components/booking/BookingSteps';
import PaymentDebitCard from '@/components/booking/PaymentDebitCard';
import PaymentMomo from '@/components/booking/PaymentMomo';
import PaymentBankApp from '@/components/booking/PaymentBankApp';
import BookingInvoice from '@/components/booking/BookingInvoice';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  guestEmail: z.string().email('Email không hợp lệ').max(255),
  guestPhone: z.string().min(10, 'Số điện thoại không hợp lệ').max(15),
  guests: z.string(),
  specialRequests: z.string().max(500).optional(),
  paymentMethod: z.enum(['pay_later', 'debit_card', 'bank_app', 'momo']),
  smokingPreference: z.enum(['non_smoking', 'smoking']),
  bedPreference: z.enum(['large_bed', 'twin_beds']).optional(),
  arrivalTime: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  size: number | null;
  description: string | null;
  amenities: string[] | null;
  images: string[] | null;
}

type PaymentStep = 'form' | 'debit_card' | 'momo' | 'bank_app' | 'invoice';

const specialRequestOptions = [
  { id: 'high_floor', label: 'Tôi muốn lấy phòng tầng cao' },
  { id: 'quiet_room', label: 'Tôi muốn lấy phòng yên tĩnh' },
  { id: 'luggage', label: 'Tôi muốn gửi hành lý' },
  { id: 'far_elevator', label: 'Tôi muốn phòng xa thang máy' },
  { id: 'near_elevator', label: 'Tôi muốn phòng gần thang máy' },
  { id: 'parking', label: 'Tôi muốn chỗ đỗ xe' },
  { id: 'honeymoon', label: 'Tôi muốn sắp xếp phòng cho kỳ nghỉ trăng mật' },
  { id: 'crib', label: 'Tôi muốn có giường cũi của em bé (có thể áp dụng phụ phí)' },
  { id: 'airport_pickup', label: 'Tôi muốn đưa đón sân bay (có thể áp dụng phụ phí)' },
];

const arrivalTimeOptions = [
  'Tôi chưa biết',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  'Sau 22:00',
];

const Booking = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId?: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const { data: hotel, isLoading: hotelLoading } = useHotel(hotelId || '');
  const { data: rooms, isLoading: roomsLoading } = useRooms(hotelId || '');

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [checkIn, setCheckIn] = useState<Date>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 2));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('form');
  const [showMoreRequests, setShowMoreRequests] = useState(false);
  const [selectedExtraRequests, setSelectedExtraRequests] = useState<string[]>([]);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
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
  } | null>(null);
  const [pendingFormData, setPendingFormData] = useState<BookingFormData | null>(null);

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const initialRoom = roomId ? rooms.find(r => r.id === roomId) : rooms[0];
      setSelectedRoom(initialRoom);
    }
  }, [rooms, roomId]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: '',
      guestEmail: user?.email || '',
      guestPhone: '',
      guests: '1',
      specialRequests: '',
      paymentMethod: 'pay_later',
      smokingPreference: 'non_smoking',
      bedPreference: 'large_bed',
      arrivalTime: 'Tôi chưa biết',
    },
  });

  useEffect(() => {
    if (user?.email) {
      form.setValue('guestEmail', user.email);
    }
  }, [user, form]);

  if (hotelLoading || roomsLoading || authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </Layout>
    );
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy khách sạn</h1>
          <Button onClick={() => navigate('/search')}>Quay lại tìm kiếm</Button>
        </div>
      </Layout>
    );
  }

  // Require login to book
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center p-8">
            <LogIn className="w-16 h-16 text-secondary mx-auto mb-6" />
            <h1 className="text-2xl font-display font-bold mb-4">Đăng nhập để đặt phòng</h1>
            <p className="text-muted-foreground mb-6">
              Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục đặt phòng tại {hotel.name}
            </p>
            <Button 
              onClick={() => navigate('/auth', { state: { from: `/booking/${hotelId}${roomId ? `/${roomId}` : ''}` } })}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Đăng nhập ngay
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const guestsCount = parseInt(form.watch('guests') || '1');
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;
  const freeCancelDate = addDays(checkIn, -1);

  const handleExtraRequestToggle = (requestId: string) => {
    setSelectedExtraRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const saveBookingToDatabase = async (data: BookingFormData, status: 'pending' | 'confirmed' = 'pending') => {
    // Build special requests string
    const extraRequestsLabels = selectedExtraRequests.map(id => 
      specialRequestOptions.find(opt => opt.id === id)?.label
    ).filter(Boolean);
    
    const allSpecialRequests = [
      data.smokingPreference === 'non_smoking' ? 'Phòng không hút thuốc' : 'Phòng hút thuốc',
      data.bedPreference === 'large_bed' ? 'Giường lớn' : 'Phòng 2 giường',
      data.arrivalTime ? `Giờ đến dự kiến: ${data.arrivalTime}` : '',
      ...extraRequestsLabels,
      data.specialRequests || '',
    ].filter(Boolean).join('; ');

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      hotel_id: hotelId!,
      room_id: selectedRoom!.id,
      check_in: format(checkIn, 'yyyy-MM-dd'),
      check_out: format(checkOut, 'yyyy-MM-dd'),
      guests: parseInt(data.guests),
      guest_name: data.guestName,
      guest_email: data.guestEmail,
      guest_phone: data.guestPhone,
      special_requests: allSpecialRequests || null,
      total_price: totalPrice,
      status: status,
    });

    if (error) throw error;

    const bookingCode = `BK${Date.now().toString().slice(-8)}`;
    
    setBookingDetails({
      hotelName: hotel.name,
      hotelAddress: hotel.address,
      roomName: selectedRoom!.name,
      checkIn,
      checkOut,
      guests: guestsCount,
      totalPrice,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      paymentMethod: data.paymentMethod,
      bookingCode,
    });

    return bookingCode;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!checkIn || !checkOut) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng');
      return;
    }
    if (!selectedRoom) {
      toast.error('Vui lòng chọn phòng');
      return;
    }
    if (nights <= 0) {
      toast.error('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }

    setPendingFormData(data);

    // Navigate to appropriate payment step based on selected method
    if (data.paymentMethod === 'pay_later') {
      // Pay later goes directly to invoice
      setIsSubmitting(true);
      try {
        const bookingCode = await saveBookingToDatabase(data, 'pending');
        
        // Send confirmation email
        await sendConfirmationEmail(bookingCode, data);
        
        setPaymentStep('invoice');
        toast.success('Đặt phòng thành công!');
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra khi đặt phòng');
      } finally {
        setIsSubmitting(false);
      }
    } else if (data.paymentMethod === 'debit_card') {
      setPaymentStep('debit_card');
    } else if (data.paymentMethod === 'momo') {
      setPaymentStep('momo');
    } else if (data.paymentMethod === 'bank_app') {
      setPaymentStep('bank_app');
    }
  };

  const sendConfirmationEmail = async (bookingCode: string, formData: BookingFormData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          guestEmail: formData.guestEmail,
          guestName: formData.guestName,
          guestPhone: formData.guestPhone,
          hotelName: hotel!.name,
          hotelAddress: hotel!.address,
          roomName: selectedRoom!.name,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests: parseInt(formData.guests),
          totalPrice,
          bookingId: bookingCode,
          paymentMethod: formData.paymentMethod === 'pay_later' ? 'Thanh toán tại khách sạn' :
                         formData.paymentMethod === 'debit_card' ? 'Thẻ ghi nợ' :
                         formData.paymentMethod === 'momo' ? 'MoMo' : 'Chuyển khoản ngân hàng',
        },
      });

      if (error) {
        console.error('Failed to send confirmation email:', error);
      } else {
        console.log('Confirmation email sent:', data);
      }
    } catch (err) {
      console.error('Error sending confirmation email:', err);
    }
  };

  const handlePaymentComplete = async () => {
    if (!pendingFormData) return;
    
    setIsSubmitting(true);
    try {
      const bookingCode = await saveBookingToDatabase(pendingFormData, 'confirmed');
      
      // Send confirmation email
      await sendConfirmationEmail(bookingCode, pendingFormData);
      
      setPaymentStep('invoice');
      toast.success('Thanh toán thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đặt phòng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToForm = () => {
    setPaymentStep('form');
  };

  // Show Invoice
  if (paymentStep === 'invoice' && bookingDetails) {
    return (
      <Layout>
        <BookingSteps currentStep={3} />
        <div className="container mx-auto px-4 py-8">
          <BookingInvoice bookingDetails={bookingDetails} />
        </div>
      </Layout>
    );
  }

  // Show Payment Forms
  if (paymentStep !== 'form') {
    return (
      <Layout>
        <BookingSteps currentStep={2} />
        <div className="container mx-auto px-4 py-8">
          {paymentStep === 'debit_card' && (
            <PaymentDebitCard 
              totalPrice={totalPrice}
              onComplete={handlePaymentComplete}
              onBack={handleBackToForm}
            />
          )}
          {paymentStep === 'momo' && (
            <PaymentMomo 
              totalPrice={totalPrice}
              onComplete={handlePaymentComplete}
              onBack={handleBackToForm}
              recipientName="NGUYỄN VĂN TRƯỜNG"
              recipientPhone="0562070694"
            />
          )}
          {paymentStep === 'bank_app' && (
            <PaymentBankApp 
              totalPrice={totalPrice}
              onComplete={handlePaymentComplete}
              onBack={handleBackToForm}
              bankName="Vietcombank"
              accountNumber="1023630921"
              accountName="NGUYỄN VĂN TRƯỜNG"
            />
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BookingSteps currentStep={2} />
      <div className="bg-muted/30 min-h-screen">
        {/* Header with user greeting */}
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">
                Xin chào <strong>{form.watch('guestName') || user?.email?.split('@')[0]}</strong>! 
                <span className="text-muted-foreground ml-1">(không phải là bạn? <button className="text-secondary hover:underline" onClick={() => navigate('/auth')}>Thoát</button>)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Booking Form */}
            <main className="flex-1 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Payment Method Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-secondary">Chọn cách thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-4"
                              >
                                {/* Pay Later Option */}
                                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'pay_later' ? 'border-secondary bg-secondary/5' : 'border-border'}`}>
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="pay_later" id="pay_later" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="pay_later" className="font-medium cursor-pointer">
                                        Thanh toán vào ngày {format(checkIn, 'd MMMM, yyyy', { locale: vi })}
                                      </Label>
                                      <div className="mt-2 space-y-1 text-sm">
                                        <p className="text-green-600 font-medium flex items-center gap-1">
                                          <Check className="w-4 h-4" />
                                          KHÔNG SỢ RỦI RO! Không thanh toán hôm nay
                                        </p>
                                        <p className="text-green-600 flex items-center gap-1">
                                          <Check className="w-4 h-4" />
                                          Hủy miễn phí trước {format(freeCancelDate, 'd MMMM, yyyy', { locale: vi })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2 mt-3">
                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Thanh toán tại khách sạn</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Debit Card Option */}
                                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'debit_card' ? 'border-secondary bg-secondary/5' : 'border-border'}`}>
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="debit_card" id="debit_card" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="debit_card" className="font-medium cursor-pointer">
                                        Thanh toán bằng thẻ ghi nợ
                                      </Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Visa, Mastercard</span>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* MoMo Option */}
                                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'momo' ? 'border-secondary bg-secondary/5' : 'border-border'}`}>
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="momo" id="momo" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="momo" className="font-medium cursor-pointer">
                                        Thanh toán qua MoMo
                                      </Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Wallet className="w-5 h-5 text-pink-500" />
                                        <span className="text-sm text-muted-foreground">Ví điện tử MoMo</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Bank App Option */}
                                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${field.value === 'bank_app' ? 'border-secondary bg-secondary/5' : 'border-border'}`}>
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="bank_app" id="bank_app" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="bank_app" className="font-medium cursor-pointer">
                                        Thanh toán qua App ngân hàng
                                      </Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-muted-foreground">Chuyển khoản ngân hàng</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Guest Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-secondary">Ai là khách chính?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!isEditingGuest && form.watch('guestName') && form.watch('guestEmail') ? (
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{form.watch('guestName')}</p>
                              <p className="text-sm text-muted-foreground">{form.watch('guestEmail')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Việt Nam</span>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => setIsEditingGuest(true)}
                              className="text-secondary"
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Chỉnh sửa
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="guestName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Họ và tên *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nguyễn Văn A" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="guestEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="guestPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số điện thoại *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="0901234567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="guests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Số khách</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn số khách" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                      <SelectItem key={num} value={num.toString()}>
                                        {num} khách
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {isEditingGuest && (
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditingGuest(false)}
                            >
                              Xong
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Special Requests */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-secondary">Yêu cầu đặc biệt</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Hãy cho chúng tôi biết về sở thích của quý khách. Phụ thuộc vào tình trạng thực tế.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Smoking & Bed Preferences */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="smokingPreference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phòng hút thuốc/Không hút thuốc</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="non_smoking" id="non_smoking" />
                                    <Label htmlFor="non_smoking" className="flex items-center gap-2 cursor-pointer">
                                      <CigaretteOff className="w-4 h-4 text-green-600" />
                                      Phòng không hút thuốc
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="smoking" id="smoking" />
                                    <Label htmlFor="smoking" className="flex items-center gap-2 cursor-pointer">
                                      <Cigarette className="w-4 h-4 text-muted-foreground" />
                                      Phòng hút thuốc
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bedPreference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chọn loại giường</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="large_bed" id="large_bed" />
                                    <Label htmlFor="large_bed" className="flex items-center gap-2 cursor-pointer">
                                      <Bed className="w-4 h-4" />
                                      Tôi muốn lấy giường lớn
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="twin_beds" id="twin_beds" />
                                    <Label htmlFor="twin_beds" className="flex items-center gap-2 cursor-pointer">
                                      <Bed className="w-4 h-4" />
                                      Tôi muốn lấy phòng 2 giường
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Additional Requests */}
                      <Collapsible open={showMoreRequests} onOpenChange={setShowMoreRequests}>
                        <CollapsibleTrigger asChild>
                          <Button type="button" variant="ghost" className="text-secondary p-0 h-auto">
                            Thêm yêu cầu đặc biệt 
                            {showMoreRequests ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {specialRequestOptions.map((option) => (
                              <div key={option.id} className="flex items-start gap-2">
                                <Checkbox
                                  id={option.id}
                                  checked={selectedExtraRequests.includes(option.id)}
                                  onCheckedChange={() => handleExtraRequestToggle(option.id)}
                                />
                                <Label 
                                  htmlFor={option.id} 
                                  className="text-sm cursor-pointer leading-tight"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Additional Text Requests */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Quý khách có thêm yêu cầu gì không?</h4>
                        <p className="text-sm text-muted-foreground">
                          Hãy cho chúng tôi biết bằng tiếng Anh hoặc tiếng Việt
                        </p>
                        <FormField
                          control={form.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  placeholder="Nhập mọi yêu cầu bổ sung"
                                  className="resize-none"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Arrival Time */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Bạn đã biết khi nào sẽ đến nhận phòng chưa?</h4>
                        <p className="text-sm text-muted-foreground">
                          Khách sạn hoặc chủ nhà sẽ được báo trước giờ đến dự kiến để chuẩn bị đón tiếp.
                        </p>
                        <FormField
                          control={form.control}
                          name="arrivalTime"
                          render={({ field }) => (
                            <FormItem className="w-full md:w-64">
                              <FormLabel className="text-sm text-muted-foreground">Chọn</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tôi chưa biết" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {arrivalTimeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Free Cancellation Policy */}
                  <Card className="bg-blue-50/80 border-blue-200">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold text-secondary mb-4">Quyền lợi phòng miễn phí</h3>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Shield className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Không rủi ro và được hoàn lại toàn bộ</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Hủy trước {format(freeCancelDate, 'd MMMM, yyyy', { locale: vi })} và quý khách sẽ không phải trả gì cả.
                          </p>
                        </div>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                          BAO GỒM
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !selectedRoom}
                    className="w-full h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'KẾ TIẾP: BƯỚC CUỐI CÙNG'
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {form.watch('paymentMethod') === 'pay_later' 
                      ? `Quý khách sẽ trả 0 ₫ hôm nay`
                      : `Quý khách sẽ thanh toán ${formatPrice(totalPrice)}`
                    }
                  </p>
                </form>
              </Form>
            </main>

            {/* Right Sidebar - Booking Summary */}
            <aside className="w-full lg:w-96 shrink-0 space-y-6">
              {/* Date Summary Header */}
              <div className="bg-card rounded-lg p-4 border flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Nhận phòng</p>
                  <p className="font-semibold text-sm">
                    {format(checkIn, 'EEEE, d MMMM', { locale: vi })}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 border-t border-dashed border-muted-foreground"></div>
                  <span className="mx-2 text-sm font-semibold">{nights}</span>
                  <div className="w-8 border-t border-dashed border-muted-foreground"></div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Trả phòng</p>
                  <p className="font-semibold text-sm">
                    {format(checkOut, 'EEEE, d MMMM', { locale: vi })}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{nights} đêm</span>
              </div>

              {/* Hotel Info Card */}
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                  {/* Hotel Header */}
                  <div className="flex gap-4">
                    <img
                      src={hotel.images?.[0] || '/placeholder.svg'}
                      alt={hotel.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < (hotel.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                        ))}
                      </div>
                      {hotel.rating && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded font-semibold">
                            {hotel.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {hotel.rating >= 9 ? 'Tuyệt vời' : hotel.rating >= 8 ? 'Rất tốt' : 'Tốt'} · {hotel.review_count || 0} bài đánh giá
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {hotel.address}
                      </p>
                    </div>
                  </div>

                  {/* Free Cancel Notice */}
                  <div className="text-xs">
                    <p className="text-green-600 font-medium">
                      ✓ Đơn đặt phòng không có rủi ro! Hủy trước {format(freeCancelDate, 'd MMMM yyyy', { locale: vi })} và quý khách sẽ không phải thanh toán bất cứ khoản nào!
                    </p>
                  </div>

                  <Separator />

                  {/* Selected Room Info */}
                  {selectedRoom && (
                    <div className="flex gap-3">
                      <img
                        src={selectedRoom.images?.[0] || hotel.images?.[0] || '/placeholder.svg'}
                        alt={selectedRoom.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">1 x {selectedRoom.name}</p>
                        <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                          {selectedRoom.size && (
                            <p className="flex items-center gap-1">
                              <Maximize className="w-3 h-3" /> Diện tích: {selectedRoom.size} m²
                            </p>
                          )}
                          <p className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> Tối đa: {selectedRoom.capacity} người lớn
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Room Features */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đặt phòng hôm nay và thanh toán vào {format(checkIn, 'd MMMM, yyyy', { locale: vi })}
                    </p>
                    <p className="text-xs text-orange-600 flex items-center gap-1">
                      ⚡ Chúng tôi chỉ có số phòng giới hạn ở mức giá này - hãy...
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Nhận phòng nhanh
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> WiFi miễn phí
                    </p>
                  </div>

                  {/* Amenities Grid */}
                  {selectedRoom?.amenities && selectedRoom.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {selectedRoom.amenities.slice(0, 8).map((amenity, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          {amenity}
                        </span>
                      ))}
                      {selectedRoom.amenities.length > 8 && (
                        <span className="text-secondary">+{selectedRoom.amenities.length - 8} nữa</span>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Giá phòng (1 phòng x {nights} đêm)
                      </span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Thuế và phí</span>
                      <span className="text-muted-foreground">Đã bao gồm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Phí đặt trước</span>
                      <span className="text-green-600 font-medium">MIỄN PHÍ</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total Price */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Giá tiền</span>
                    <span className="text-2xl font-bold text-secondary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Giá đã bao gồm: Phí dịch vụ 5%, Thuế 8%
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
