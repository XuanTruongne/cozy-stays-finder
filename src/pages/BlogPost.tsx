import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockBlogs } from '@/lib/mockData';
import { formatDate } from '@/lib/constants';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = mockBlogs.find(b => b.slug === slug);

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
          <Button asChild>
            <Link to="/blog">Quay lại Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Blog
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="lead text-xl text-muted-foreground mb-8">{post.excerpt}</p>
            <div className="text-foreground leading-relaxed space-y-4">
              <p>{post.content}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h2 className="text-2xl font-display font-bold mt-8 mb-4">Điểm đến phổ biến</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bãi Sau - bãi biển dài nhất Vũng Tàu</li>
                <li>Tượng Chúa Kitô Vua - điểm tham quan nổi tiếng</li>
                <li>Bạch Dinh - di tích lịch sử văn hóa</li>
                <li>Hải đăng Vũng Tàu - ngọn hải đăng cổ kính</li>
              </ul>
              <h2 className="text-2xl font-display font-bold mt-8 mb-4">Lời khuyên khi du lịch</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold mb-8">Bài viết liên quan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockBlogs.filter(b => b.id !== post.id).slice(0, 3).map((relatedPost) => (
              <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-secondary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">{formatDate(relatedPost.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
