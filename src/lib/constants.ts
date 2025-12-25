// Room Types
export const ROOM_TYPES = [
  { value: 'villa', label: 'Villa' },
  { value: 'homestay', label: 'Homestay' },
  { value: 'hotel', label: 'Khách sạn' },
  { value: 'apartment', label: 'Căn hộ' },
  { value: 'guesthouse', label: 'Nhà nghỉ' },
] as const;

// Wards (Phường)
export const WARDS = [
  { value: '1', label: 'Phường 1' },
  { value: '2', label: 'Phường 2' },
  { value: '3', label: 'Phường 3' },
  { value: '4', label: 'Phường 4' },
  { value: '5', label: 'Phường 5' },
  { value: '6', label: 'Phường 6' },
  { value: '7', label: 'Phường 7' },
  { value: '8', label: 'Phường 8' },
  { value: '9', label: 'Phường 9' },
  { value: '10', label: 'Phường 10' },
  { value: '11', label: 'Phường 11' },
  { value: '12', label: 'Phường 12' },
  { value: 'thang-tam', label: 'Thắng Tam' },
  { value: 'nguyen-an-ninh', label: 'Nguyễn An Ninh' },
  { value: 'thang-nhi', label: 'Thắng Nhì' },
  { value: 'rach-dua', label: 'Rạch Dừa' },
  { value: 'thang-nhat', label: 'Thắng Nhất' },
] as const;

// Booking Status
export const BOOKING_STATUS = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' },
} as const;

// Price formatter
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Date formatter
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export type RoomType = typeof ROOM_TYPES[number]['value'];
export type Ward = typeof WARDS[number]['value'];
export type BookingStatus = keyof typeof BOOKING_STATUS;
