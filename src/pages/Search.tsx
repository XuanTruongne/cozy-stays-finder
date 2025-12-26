import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/search/SearchForm';
import HotelCard from '@/components/hotels/HotelCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { mockHotels } from '@/lib/mockData';
import { ROOM_TYPES, WARDS, formatPrice } from '@/lib/constants';
import { SlidersHorizontal } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';
  const initialWard = searchParams.get('ward') || '';

  const [type, setType] = useState(initialType);
  const [ward, setWard] = useState(initialWard);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState('recommended');

  const filteredHotels = useMemo(() => {
    let results = mockHotels.filter(hotel => {
      if (type && type !== 'all' && hotel.type !== type) return false;
      if (ward && ward !== 'all' && hotel.ward !== ward) return false;
      if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return results;
  }, [type, ward, priceRange, sortBy]);

  return (
    <Layout>
      {/* Search Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-6">
            Tìm kiếm chỗ ở
          </h1>
          <SearchForm variant="compact" initialType={initialType} initialWard={initialWard} />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-card rounded-lg shadow-custom p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-secondary" />
                Bộ lọc
              </h2>

              {/* Room Type Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">Loại phòng</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {ROOM_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ward Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">Phường</label>
                <Select value={ward} onValueChange={setWard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {WARDS.map((w) => (
                      <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-4 block">
                  Khoảng giá
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000000}
                  step={100000}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Sắp xếp</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Đề xuất</SelectItem>
                    <SelectItem value="price-asc">Giá thấp → cao</SelectItem>
                    <SelectItem value="price-desc">Giá cao → thấp</SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Tìm thấy <span className="font-semibold text-foreground">{filteredHotels.length}</span> kết quả
              </p>
            </div>

            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground text-lg">Không tìm thấy kết quả phù hợp</p>
                <p className="text-sm text-muted-foreground mt-2">Hãy thử thay đổi bộ lọc</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
