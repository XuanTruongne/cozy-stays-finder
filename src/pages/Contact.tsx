import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ').max(255),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(15),
  subject: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(200),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Gửi tin nhắn thành công!');
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: '123 Đường Lê Hồng Phong, Phường 2, TP. Vũng Tàu',
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '0254 123 4567',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@vungtaustay.com',
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Liên Hệ
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi bất cứ lúc nào!
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-display font-bold mb-6">Thông tin liên hệ</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-muted-foreground text-sm">{info.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Bản đồ Google Maps</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold mb-6">Gửi tin nhắn</h2>
                
                {isSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Cảm ơn bạn đã liên hệ!</h3>
                    <p className="text-muted-foreground mb-6">
                      Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsSuccess(false);
                        form.reset();
                      }}
                      variant="outline"
                    >
                      Gửi tin nhắn khác
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
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
                        <FormField
                          control={form.control}
                          name="email"
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
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
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
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tiêu đề *</FormLabel>
                              <FormControl>
                                <Input placeholder="Hỗ trợ đặt phòng" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nội dung *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Nhập nội dung tin nhắn của bạn..." 
                                rows={5}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        {isSubmitting ? (
                          'Đang gửi...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Gửi tin nhắn
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
