import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SearchToolbar from '@/components/search/SearchToolbar';
import HotelListCard from '@/components/hotels/HotelListCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useHotels } from '@/hooks/useHotels';
import { useRooms } from '@/hooks/useRooms';
import { ROOM_TYPES, WARDS, formatPrice } from '@/lib/constants';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

interface GuestCount {
  rooms: number;
  adults: number;
  children: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialCheckIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined;
  const initialCheckOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined;
  const initialType = searchParams.get('type') || '';

  // Toolbar state
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut);
  const [guests, setGuests] = useState<GuestCount>({ rooms: 1, adults: 2, children: 0 });

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [ward, setWard] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState('recommended');

  // Sync URL params with filter state
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && !selectedTypes.includes(typeFromUrl)) {
      setSelectedTypes([typeFromUrl]);
    }
  }, [searchParams]);

  const { data: hotels, isLoading: hotelsLoading } = useHotels();
  const { data: rooms, isLoading: roomsLoading } = useRooms();

  const isLoading = hotelsLoading || roomsLoading;

  // Get minimum price for each hotel from rooms
  const hotelMinPrices = useMemo(() => {
    if (!rooms) return {};
    const prices: Record<string, number> = {};
    rooms.forEach(room => {
      if (!prices[room.hotel_id] || room.price < prices[room.hotel_id]) {
        prices[room.hotel_id] = room.price;
      }
    });
    return prices;
  }, [rooms]);

  const filteredHotels = useMemo(() => {
    if (!hotels) return [];
    
    let results = hotels.filter(hotel => {
      // Filter by ward
      if (ward && ward !== 'all' && hotel.ward !== ward) return false;
      
      // Filter by price range
      const minPrice = hotelMinPrices[hotel.id] || 0;
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) return false;
      
      // Filter by property type (using hotels.property_type column)
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(hotel.property_type)) {
          return false;
        }
      }
      
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => (hotelMinPrices[a.id] || 0) - (hotelMinPrices[b.id] || 0));
        break;
      case 'price-desc':
        results.sort((a, b) => (hotelMinPrices[b.id] || 0) - (hotelMinPrices[a.id] || 0));
        break;
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return results;
  }, [hotels, ward, priceRange, sortBy, hotelMinPrices, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Layout>
      {/* Search Header with Toolbar */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
            Tìm kiếm chỗ ở
          </h1>
          <SearchToolbar
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onGuestsChange={setGuests}
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Left */}
          <aside className="w-full lg:w-72 shrink-0 order-2 lg:order-1">
            <div className="bg-card rounded-xl border border-border shadow-sm p-5 sticky top-24">
              <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-secondary" />
                Bộ lọc
              </h2>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Loại hình
                </label>
                <div className="space-y-2">
                  {ROOM_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={selectedTypes.includes(type.value)}
                        onCheckedChange={() => toggleType(type.value)}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
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

          {/* Results - Right */}
          <main className="flex-1 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Tìm thấy <span className="font-semibold text-foreground">{filteredHotels.length}</span> kết quả
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <HotelListCard 
                    key={hotel.id} 
                    hotel={hotel} 
                    minPrice={hotelMinPrices[hotel.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
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
