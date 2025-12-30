import { useState } from 'react';
import { Calendar, Users, Minus, Plus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GuestCount {
  rooms: number;
  adults: number;
  children: number;
}

interface SearchToolbarProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: GuestCount;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  onGuestsChange: (guests: GuestCount) => void;
}

const SearchToolbar = ({
  checkIn,
  checkOut,
  guests,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
}: SearchToolbarProps) => {
  const totalGuests = guests.adults + guests.children;
  const showContactWarning = totalGuests > 10;

  const updateGuests = (field: keyof GuestCount, delta: number) => {
    const newValue = guests[field] + delta;
    if (field === 'rooms' && newValue >= 1 && newValue <= 10) {
      onGuestsChange({ ...guests, rooms: newValue });
    } else if (field === 'adults' && newValue >= 1 && newValue <= 20) {
      onGuestsChange({ ...guests, adults: newValue });
    } else if (field === 'children' && newValue >= 0 && newValue <= 10) {
      onGuestsChange({ ...guests, children: newValue });
    }
  };

  const guestSummary = `${guests.rooms} phòng, ${guests.adults} người lớn${guests.children > 0 ? `, ${guests.children} trẻ em` : ''}`;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Check-in Date */}
        <div className="flex-1 min-w-[180px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-secondary" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Ngày đến</span>
                  <span className="text-sm font-medium">
                    {checkIn ? format(checkIn, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={onCheckInChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="flex-1 min-w-[180px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-secondary" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Ngày đi</span>
                  <span className="text-sm font-medium">
                    {checkOut ? format(checkOut, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={onCheckOutChange}
                disabled={(date) => date < (checkIn || new Date())}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests Selector */}
        <div className="flex-1 min-w-[220px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left font-normal"
              >
                <Users className="mr-2 h-4 w-4 text-secondary" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Số lượng</span>
                  <span className="text-sm font-medium truncate">{guestSummary}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                {/* Rooms */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Phòng</p>
                    <p className="text-sm text-muted-foreground">Số phòng cần đặt</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('rooms', -1)}
                      disabled={guests.rooms <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{guests.rooms}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('rooms', 1)}
                      disabled={guests.rooms >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Người lớn</p>
                    <p className="text-sm text-muted-foreground">Từ 18 tuổi trở lên</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('adults', -1)}
                      disabled={guests.adults <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{guests.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('adults', 1)}
                      disabled={guests.adults >= 20}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Trẻ em</p>
                    <p className="text-sm text-muted-foreground">Từ 0 - 17 tuổi</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('children', -1)}
                      disabled={guests.children <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{guests.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('children', 1)}
                      disabled={guests.children >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contact Warning */}
                {showContactWarning && (
                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 flex items-start gap-2">
                    <Phone className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-secondary">Nhóm trên 10 người</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vui lòng liên hệ hotline: <strong>0123 456 789</strong> để được hỗ trợ đặt phòng cho nhóm lớn.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button className="h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90">
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default SearchToolbar;
