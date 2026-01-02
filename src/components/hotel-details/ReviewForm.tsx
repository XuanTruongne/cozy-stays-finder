import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, PenLine } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ReviewFormProps {
  hotelId: string;
}

const ReviewForm = ({ hotelId }: ReviewFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has completed booking at this hotel
  const { data: hasCompletedBooking } = useQuery({
    queryKey: ['user-completed-booking', hotelId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('hotel_id', hotelId)
        .eq('user_id', user.id)
        .in('status', ['completed', 'confirmed'])
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!user,
  });

  // Check if user already reviewed this hotel
  const { data: existingReview } = useQuery({
    queryKey: ['user-review', hotelId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để viết đánh giá');
      navigate('/auth');
      return;
    }

    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        hotel_id: hotelId,
        user_id: user.id,
        rating,
        comment: comment.trim() || null,
      });

      if (error) throw error;

      toast.success('Đánh giá của bạn đã được gửi!');
      setRating(0);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', hotelId] });
      queryClient.invalidateQueries({ queryKey: ['user-review', hotelId, user.id] });
    } catch (error: any) {
      toast.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-3">Đăng nhập để viết đánh giá</p>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Đăng nhập
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (existingReview) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">Bạn đã đánh giá chỗ nghỉ này</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < existingReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
                }`}
              />
            ))}
          </div>
          {existingReview.comment && (
            <p className="text-sm mt-2 italic">"{existingReview.comment}"</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!hasCompletedBooking) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">
            Chỉ khách đã đặt phòng mới có thể viết đánh giá
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PenLine className="w-5 h-5 text-secondary" />
          Viết đánh giá của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Đánh giá sao</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Nhận xét (tùy chọn)</p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            rows={4}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
