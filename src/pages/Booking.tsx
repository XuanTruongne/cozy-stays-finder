import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getHotelById, getRoomsByHotelId, Room } from '@/lib/mockData';
import { formatPrice, formatDate } from '@/lib/constants';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, MapPin, Check } from 'lucide-react';
import { toast } from 'sonner';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  guestEmail: z.string().email('Email không hợp lệ').max(255),
  guestPhone: z.string().min(10, 'Số điện thoại không hợp lệ').max(15),
  roomCount: z.string(),
  specialRequests: z.string().max(500).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const Booking = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId?: string }>();
  const navigate = useNavigate();
  
  const hotel = getHotelById(hotelId || '');
  const rooms = getRoomsByHotelId(hotelId || '');
  const initialRoom = roomId ? rooms.find(r => r.id === roomId) : rooms[0];

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(initialRoom);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      roomCount: '1',
      specialRequests: '',
    },
  });

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

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const roomCount = parseInt(form.watch('roomCount') || '1');
  const totalPrice = selectedRoom ? selectedRoom.price * nights * roomCount : 0;

  const onSubmit = async (data: BookingFormData) => {
    if (!checkIn || !checkOut) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng');
      return;
    }
    if (!selectedRoom) {
      toast.error('Vui lòng chọn phòng');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Đặt phòng thành công!');
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-4">Đặt phòng thành công!</h1>
            <p className="text-muted-foreground mb-6">
              Cảm ơn bạn đã đặt phòng tại {hotel.name}. Chúng tôi sẽ gửi email xác nhận đến bạn trong giây lát.
            </p>
            <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-4">Thông tin đặt phòng:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Khách sạn:</span> {hotel.name}</p>
                <p><span className="text-muted-foreground">Phòng:</span> {selectedRoom?.name}</p>
                <p><span className="text-muted-foreground">Nhận phòng:</span> {checkIn && formatDate(checkIn)}</p>
                <p><span className="text-muted-foreground">Trả phòng:</span> {checkOut && formatDate(checkOut)}</p>
                <p><span className="text-muted-foreground">Số phòng:</span> {roomCount}</p>
                <p className="text-lg font-semibold mt-4">
                  <span className="text-muted-foreground">Tổng tiền:</span>{' '}
                  <span className="text-secondary">{formatPrice(totalPrice)}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
              <Button 
                onClick={() => navigate('/search')}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Tìm thêm phòng
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Đặt phòng</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking Form */}
          <main className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Room Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chọn phòng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedRoom?.id === room.id
                              ? 'border-secondary bg-secondary/5'
                              : 'border-border hover:border-secondary/50'
                          }`}
                        >
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-muted-foreground">{room.roomType}</p>
                          <p className="text-lg font-bold text-secondary mt-2">
                            {formatPrice(room.price)}<span className="text-sm font-normal text-muted-foreground">/đêm</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Date Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chọn ngày</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ngày nhận phòng</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {checkIn ? format(checkIn, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkIn}
                              onSelect={setCheckIn}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ngày trả phòng</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {checkOut ? format(checkOut, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkOut}
                              onSelect={setCheckOut}
                              disabled={(date) => date <= (checkIn || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      name="roomCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số phòng</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn số phòng" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} phòng
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                </Button>
              </form>
            </Form>
          </main>

          {/* Order Summary */}
          <aside className="w-full lg:w-96 shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Thông tin đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {hotel.address}
                    </p>
                  </div>
                </div>

                {selectedRoom && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Phòng đã chọn</p>
                    <p className="font-semibold">{selectedRoom.name}</p>
                  </div>
                )}

                {checkIn && checkOut && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nhận phòng</span>
                      <span>{formatDate(checkIn)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trả phòng</span>
                      <span>{formatDate(checkOut)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Số đêm</span>
                      <span>{nights} đêm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Số phòng</span>
                      <span>{roomCount}</span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Tổng tiền</span>
                    <span className="text-2xl font-bold text-secondary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
