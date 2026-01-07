import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const BlogSection = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['homepage-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Khám Phá Vũng Tàu
            </h2>
            <p className="text-muted-foreground">
              Những địa điểm không thể bỏ lỡ khi đến thành phố biển
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/blog">
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className={`group ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <article className="relative h-full rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300">
                  <div className={`relative ${index === 0 ? 'h-80 md:h-full' : 'h-48'} overflow-hidden`}>
                    <img
                      src={blog.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {blog.created_at 
                            ? format(new Date(blog.created_at), 'dd MMMM, yyyy', { locale: vi })
                            : 'Mới cập nhật'
                          }
                        </span>
                      </div>
                      <h3 className={`font-serif font-bold text-white group-hover:text-secondary transition-colors ${
                        index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'
                      }`}>
                        {blog.title}
                      </h3>
                      {index === 0 && blog.excerpt && (
                        <p className="text-white/80 mt-2 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Chưa có bài viết nào
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link to="/blog">
              Xem tất cả bài viết
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
