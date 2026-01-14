import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, Mail, Phone, Calendar, MapPin, Loader2, FileText } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/constants';
import { AnimatedSection, FadeInScale } from '@/components/ui/animated-section';
import BookingInvoice from '@/components/booking/BookingInvoice';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100).optional(),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(15).optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const defaultTab = searchParams.get('tab') === 'bookings' ? 'bookings' : 'profile';
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels:hotel_id (name, address, images),
          rooms:room_id (name, type)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name || null,
          phone: data.phone || null,
        })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Chờ xác nhận', variant: 'outline' },
      confirmed: { label: 'Đã xác nhận', variant: 'default' },
      cancelled: { label: 'Đã hủy', variant: 'destructive' },
      completed: { label: 'Hoàn thành', variant: 'secondary' },
    };
    const { label, variant } = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <h1 className="text-3xl font-display font-bold mb-8">Tài khoản của tôi</h1>
        </AnimatedSection>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <AnimatedSection delay={0.1}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="bookings">Lịch sử đặt phòng</TabsTrigger>
            </TabsList>
          </AnimatedSection>

          <TabsContent value="profile" className="space-y-6">
            <FadeInScale delay={0.2}>
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="0901234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              </Card>
            </FadeInScale>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <FadeInScale delay={0.2}>
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Lịch sử đặt phòng
                </CardTitle>
                <CardDescription>
                  Xem lại các đặt phòng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="border rounded-lg p-4 hover:border-secondary/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {booking.hotels?.images?.[0] && (
                            <img 
                              src={booking.hotels.images[0]} 
                              alt={booking.hotels.name}
                              className="w-full md:w-32 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{booking.hotels?.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {booking.hotels?.address}
                                </p>
                              </div>
                              {getStatusBadge(booking.status || 'pending')}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Phòng:</span>
                                <p className="font-medium">{booking.rooms?.name}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Nhận phòng:</span>
                                <p className="font-medium">{formatDate(new Date(booking.check_in))}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Trả phòng:</span>
                                <p className="font-medium">{formatDate(new Date(booking.check_out))}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tổng tiền:</span>
                                <p className="font-semibold text-secondary">{formatPrice(Number(booking.total_price))}</p>
                              </div>
                            </div>
                            {/* View Invoice Button */}
                            <div className="mt-3 pt-3 border-t flex justify-center md:justify-end">
                              <Button
                                variant="outline"
                                size="default"
                                className="w-full md:w-auto"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsInvoiceOpen(true);
                                }}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Xem hóa đơn
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Bạn chưa có đặt phòng nào</p>
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/search')}
                      className="text-secondary mt-2"
                    >
                      Tìm phòng ngay
                    </Button>
                  </div>
                )}
              </CardContent>
              </Card>
            </FadeInScale>
          </TabsContent>
        </Tabs>

        {/* Invoice Modal */}
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">Hóa đơn đặt phòng</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <BookingInvoice
                bookingDetails={{
                  hotelName: selectedBooking.hotels?.name || '',
                  hotelAddress: selectedBooking.hotels?.address,
                  roomName: selectedBooking.rooms?.name || '',
                  checkIn: new Date(selectedBooking.check_in),
                  checkOut: new Date(selectedBooking.check_out),
                  guests: selectedBooking.guests,
                  totalPrice: Number(selectedBooking.total_price),
                  guestName: selectedBooking.guest_name,
                  guestEmail: selectedBooking.guest_email,
                  guestPhone: selectedBooking.guest_phone,
                  paymentMethod: selectedBooking.status === 'confirmed' ? 'paid' : 'pay_later',
                  bookingCode: selectedBooking.id.slice(0, 8).toUpperCase(),
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Profile;
