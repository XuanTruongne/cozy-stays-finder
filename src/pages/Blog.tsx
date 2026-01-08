import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Blog = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const formatBlogDate = (dateString: string | null) => {
    if (!dateString) return 'Mới cập nhật';
    return format(new Date(dateString), 'dd MMMM, yyyy', { locale: vi });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Blog Du Lịch
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Khám phá những bài viết hữu ích về du lịch, ẩm thực và các địa điểm thú vị tại Vũng Tàu
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : blogs && blogs.length > 0 ? (
            <>
              {/* Featured Post */}
              <Link to={`/blog/${blogs[0].slug}`} className="block mb-12">
                <Card className="overflow-hidden group">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 h-64 md:h-auto">
                      <img
                        src={blogs[0].image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
                        alt={blogs[0].title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="flex-1 p-8 flex flex-col justify-center">
                      <span className="text-secondary text-sm font-semibold mb-2">Bài viết nổi bật</span>
                      <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 group-hover:text-secondary transition-colors">
                        {blogs[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-4">{blogs[0].excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatBlogDate(blogs[0].created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>

              {/* Other Posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(1).map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden h-full group hover:shadow-lg transition-shadow">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatBlogDate(post.created_at)}
                          </span>
                          <span className="flex items-center gap-1 text-secondary font-medium group-hover:underline">
                            Đọc tiếp <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có bài viết nào
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
