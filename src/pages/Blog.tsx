import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { mockBlogs } from '@/lib/mockData';
import { formatDate } from '@/lib/constants';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
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
          {/* Featured Post */}
          {mockBlogs[0] && (
            <Link to={`/blog/${mockBlogs[0].slug}`} className="block mb-12">
              <Card className="overflow-hidden group">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 h-64 md:h-auto">
                    <img
                      src={mockBlogs[0].image}
                      alt={mockBlogs[0].title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex-1 p-8 flex flex-col justify-center">
                    <span className="text-secondary text-sm font-semibold mb-2">Bài viết nổi bật</span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 group-hover:text-secondary transition-colors">
                      {mockBlogs[0].title}
                    </h2>
                    <p className="text-muted-foreground mb-4">{mockBlogs[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {mockBlogs[0].author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(mockBlogs[0].createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          )}

          {/* Other Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBlogs.slice(1).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden h-full group hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
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
                        {formatDate(post.createdAt)}
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
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
