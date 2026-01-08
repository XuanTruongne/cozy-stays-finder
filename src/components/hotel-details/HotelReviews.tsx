import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface HotelReviewsProps {
  hotelId: string;
  rating: number | null;
  reviewCount: number | null;
}

const HotelReviews = ({ hotelId, rating, reviewCount }: HotelReviewsProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', hotelId],
    queryFn: async () => {
      // First fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (reviewsError) throw reviewsError;
      if (!reviewsData || reviewsData.length === 0) return [];

      // Then fetch profiles for each review
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine reviews with profiles
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      return reviewsData.map(review => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || null
      }));
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            Đánh giá khách hàng
          </div>
          <div className="flex items-center gap-1 text-base">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-bold">{rating || 0}</span>
            <span className="text-muted-foreground text-sm">({reviewCount || 0} đánh giá)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {(review.profiles as any)?.full_name?.[0] || 'K'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {(review.profiles as any)?.full_name || 'Khách hàng'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {review.created_at && format(new Date(review.created_at), 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có đánh giá nào
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelReviews;
