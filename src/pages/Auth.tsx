import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

type AuthMethod = 'select' | 'email' | 'phone' | 'otp';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select');
  const [otpTarget, setOtpTarget] = useState('');
  const [otpType, setOtpType] = useState<'email' | 'phone'>('email');
  const [otp, setOtp] = useState('');
  const { user, signUp, signInWithOtp, verifyOtp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleEmailOtp = async (data: EmailFormData) => {
    setIsLoading(true);
    const { error } = await signInWithOtp(data.email, 'email');
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi gửi mã',
        description: 'Không thể gửi mã xác thực. Vui lòng thử lại.',
      });
    } else {
      setOtpTarget(data.email);
      setOtpType('email');
      setAuthMethod('otp');
      toast({
        title: 'Đã gửi mã xác thực',
        description: `Mã xác thực đã được gửi đến ${data.email}`,
      });
    }
  };

  const handlePhoneOtp = async (data: PhoneFormData) => {
    setIsLoading(true);
    // Format phone number to E.164
    let phone = data.phone;
    if (phone.startsWith('0')) {
      phone = '+84' + phone.substring(1);
    } else if (phone.startsWith('84')) {
      phone = '+' + phone;
    }
    
    const { error } = await signInWithOtp(phone, 'phone');
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi gửi mã',
        description: 'Xác thực SMS chưa được kích hoạt. Vui lòng sử dụng Email hoặc Google.',
      });
    } else {
      setOtpTarget(phone);
      setOtpType('phone');
      setAuthMethod('otp');
      toast({
        title: 'Đã gửi mã xác thực',
        description: `Mã xác thực đã được gửi đến ${data.phone}`,
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Mã không hợp lệ',
        description: 'Vui lòng nhập đủ 6 số',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await verifyOtp(otpTarget, otp, otpType);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Xác thực thất bại',
        description: 'Mã xác thực không đúng hoặc đã hết hạn',
      });
    } else {
      toast({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn!',
      });
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi đăng nhập',
        description: 'Không thể đăng nhập bằng Google. Vui lòng thử lại.',
      });
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);

    if (error) {
      let message = 'Đã xảy ra lỗi khi đăng ký';
      if (error.message.includes('User already registered')) {
        message = 'Email này đã được đăng ký';
      }
      toast({
        variant: 'destructive',
        title: 'Đăng ký thất bại',
        description: message,
      });
    } else {
      toast({
        title: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo!',
      });
      navigate('/');
    }
  };

  const renderLoginContent = () => {
    if (authMethod === 'otp') {
      return (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            className="p-0 h-auto" 
            onClick={() => { setAuthMethod('select'); setOtp(''); }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="text-center space-y-2">
            <h3 className="font-medium">Nhập mã xác thực</h3>
            <p className="text-sm text-muted-foreground">
              Mã đã được gửi đến {otpTarget}
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button onClick={handleVerifyOtp} className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Xác thực
          </Button>
        </div>
      );
    }

    if (authMethod === 'email') {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            className="p-0 h-auto" 
            onClick={() => setAuthMethod('select')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <form onSubmit={emailForm.handleSubmit(handleEmailOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="email@example.com"
                {...emailForm.register('email')}
              />
              {emailForm.formState.errors.email && (
                <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Gửi mã xác thực
            </Button>
          </form>
        </div>
      );
    }

    if (authMethod === 'phone') {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            className="p-0 h-auto" 
            onClick={() => setAuthMethod('select')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <form onSubmit={phoneForm.handleSubmit(handlePhoneOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-phone">Số điện thoại</Label>
              <Input
                id="login-phone"
                type="tel"
                placeholder="0912345678"
                {...phoneForm.register('phone')}
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-sm text-destructive">{phoneForm.formState.errors.phone.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Gửi mã xác thực
            </Button>
          </form>
        </div>
      );
    }

    // Default: select method
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12" 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập với Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12" 
          onClick={() => setAuthMethod('email')}
        >
          <Mail className="w-5 h-5" />
          Đăng nhập với Email
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12" 
          onClick={() => setAuthMethod('phone')}
        >
          <Phone className="w-5 h-5" />
          Đăng nhập với Số điện thoại
        </Button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container-custom py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Chào mừng đến VungTau Stays</CardTitle>
            <CardDescription>Đăng nhập hoặc tạo tài khoản để tiếp tục</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setAuthMethod('select')}>Đăng nhập</TabsTrigger>
                <TabsTrigger value="signup">Đăng ký</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                {renderLoginContent()}
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-12" 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Đăng ký với Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Hoặc đăng ký với email</span>
                    </div>
                  </div>

                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Họ và tên</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        {...signupForm.register('fullName')}
                      />
                      {signupForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="email@example.com"
                        {...signupForm.register('email')}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mật khẩu</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        {...signupForm.register('password')}
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Xác nhận mật khẩu</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        {...signupForm.register('confirmPassword')}
                      />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Đăng ký
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            Bằng việc tiếp tục, bạn đồng ý với điều khoản sử dụng của chúng tôi
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
