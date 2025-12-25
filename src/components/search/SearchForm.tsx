import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ROOM_TYPES, WARDS } from '@/lib/constants';

interface SearchFormProps {
  variant?: 'hero' | 'compact';
  initialType?: string;
  initialWard?: string;
}

const SearchForm = ({ variant = 'hero', initialType, initialWard }: SearchFormProps) => {
  const navigate = useNavigate();
  const [type, setType] = useState(initialType || '');
  const [ward, setWard] = useState(initialWard || '');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (ward) params.append('ward', ward);
    if (checkIn) params.append('checkIn', checkIn.toISOString());
    if (checkOut) params.append('checkOut', checkOut.toISOString());
    
    navigate(`/search?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Loại phòng</label>
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
        
        <div className="flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-foreground mb-1.5 block">Phường</label>
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

        <Button onClick={handleSearch} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-custom-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Room Type */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Home className="w-4 h-4 text-secondary" />
            Loại phòng
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Chọn loại phòng" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary" />
            Phường
          </label>
          <Select value={ward} onValueChange={setWard}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Chọn phường" />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map((w) => (
                <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            Nhận phòng
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                {checkIn ? format(checkIn, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            Trả phòng
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                {checkOut ? format(checkOut, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < (checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1 flex items-end">
          <Button 
            onClick={handleSearch} 
            className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm Phòng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
