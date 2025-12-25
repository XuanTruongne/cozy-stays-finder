import { RoomType, Ward } from './constants';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  ward: Ward;
  type: RoomType;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  featured: boolean;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  roomType: string;
  price: number;
  capacity: number;
  totalRooms: number;
  availableRooms: number;
  description: string;
  images: string[];
  amenities: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

// Mock Hotels Data
export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Sunset Beach Villa',
    address: '123 Đường Thùy Vân',
    ward: 'thang-tam',
    type: 'villa',
    description: 'Villa sang trọng với tầm nhìn ra biển tuyệt đẹp, thiết kế hiện đại kết hợp phong cách nhiệt đới. Phù hợp cho gia đình và nhóm bạn.',
    price: 3500000,
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    ],
    amenities: ['Hồ bơi riêng', 'WiFi miễn phí', 'Bếp đầy đủ', 'Sân vườn', 'BBQ'],
    featured: true,
  },
  {
    id: '2',
    name: 'Ocean View Hotel',
    address: '45 Đường Hạ Long',
    ward: '1',
    type: 'hotel',
    description: 'Khách sạn 4 sao với vị trí đắc địa, chỉ cách bãi biển 50m. Dịch vụ chuyên nghiệp và tiện nghi đẳng cấp.',
    price: 1200000,
    rating: 4.5,
    reviewCount: 256,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    amenities: ['Bể bơi', 'Spa', 'Nhà hàng', 'Phòng gym', 'WiFi miễn phí'],
    featured: true,
  },
  {
    id: '3',
    name: 'Cozy Corner Homestay',
    address: '78 Đường Lê Hồng Phong',
    ward: '2',
    type: 'homestay',
    description: 'Homestay ấm cúng với không gian xanh mát, phong cách vintage độc đáo. Chủ nhà thân thiện và nhiệt tình.',
    price: 450000,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    amenities: ['Bếp chung', 'WiFi miễn phí', 'Sân vườn', 'Xe đạp miễn phí'],
    featured: true,
  },
  {
    id: '4',
    name: 'City Center Apartment',
    address: '156 Đường Nguyễn Thái Học',
    ward: '3',
    type: 'apartment',
    description: 'Căn hộ hiện đại ngay trung tâm thành phố, tiện lợi di chuyển và mua sắm. View thành phố tuyệt đẹp.',
    price: 800000,
    rating: 4.4,
    reviewCount: 167,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
      'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800',
    ],
    amenities: ['Bếp đầy đủ', 'WiFi tốc độ cao', 'Smart TV', 'Máy giặt'],
    featured: false,
  },
  {
    id: '5',
    name: 'Budget Inn Guesthouse',
    address: '23 Đường Trưng Trắc',
    ward: '4',
    type: 'guesthouse',
    description: 'Nhà nghỉ giá rẻ, sạch sẽ và tiện nghi cơ bản. Phù hợp cho du khách ba lô và công tác ngắn ngày.',
    price: 250000,
    rating: 4.1,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    ],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'Nóng lạnh'],
    featured: false,
  },
  {
    id: '6',
    name: 'Royal Palace Hotel',
    address: '89 Đường Bà Triệu',
    ward: '5',
    type: 'hotel',
    description: 'Khách sạn 5 sao đẳng cấp quốc tế, dịch vụ hoàn hảo và tiện nghi sang trọng bậc nhất.',
    price: 2800000,
    rating: 4.9,
    reviewCount: 445,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    ],
    amenities: ['Bể bơi vô cực', 'Spa cao cấp', 'Nhà hàng fine dining', 'Concierge 24/7', 'Phòng gym'],
    featured: true,
  },
  {
    id: '7',
    name: 'Garden Villa Resort',
    address: '234 Đường Phan Chu Trinh',
    ward: 'nguyen-an-ninh',
    type: 'villa',
    description: 'Resort villa với khu vườn nhiệt đới rộng lớn, không gian yên tĩnh và riêng tư hoàn toàn.',
    price: 4200000,
    rating: 4.7,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    amenities: ['Hồ bơi riêng', 'Sân vườn 500m2', 'BBQ', 'Bếp đầy đủ', 'Xe đưa đón'],
    featured: true,
  },
  {
    id: '8',
    name: 'Backpacker Haven',
    address: '56 Đường Lý Thường Kiệt',
    ward: '6',
    type: 'guesthouse',
    description: 'Nhà nghỉ dành cho backpacker với không gian giao lưu sôi động và giá cả phải chăng.',
    price: 180000,
    rating: 4.2,
    reviewCount: 523,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    amenities: ['Phòng dorm', 'WiFi miễn phí', 'Bếp chung', 'Tủ khóa cá nhân'],
    featured: false,
  },
  {
    id: '9',
    name: 'Seaside Homestay',
    address: '12 Đường Hoàng Hoa Thám',
    ward: 'thang-nhi',
    type: 'homestay',
    description: 'Homestay view biển tuyệt đẹp, bữa sáng homemade và không gian ấm cúng như ở nhà.',
    price: 550000,
    rating: 4.6,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    amenities: ['Bữa sáng miễn phí', 'View biển', 'WiFi miễn phí', 'Xe máy cho thuê'],
    featured: false,
  },
  {
    id: '10',
    name: 'Modern Studio Apartment',
    address: '78 Đường Nguyễn Văn Trỗi',
    ward: '7',
    type: 'apartment',
    description: 'Studio apartment thiết kế hiện đại, đầy đủ tiện nghi cho cặp đôi và du khách công tác.',
    price: 650000,
    rating: 4.3,
    reviewCount: 201,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    ],
    amenities: ['Bếp mini', 'Smart TV', 'WiFi tốc độ cao', 'Máy giặt'],
    featured: false,
  },
  {
    id: '11',
    name: 'Luxury Beach Villa',
    address: '1 Đường Trần Phú',
    ward: '8',
    type: 'villa',
    description: 'Villa siêu sang ngay bờ biển, thiết kế đương đại với nội thất cao cấp nhập khẩu.',
    price: 6500000,
    rating: 5.0,
    reviewCount: 45,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    amenities: ['Bãi biển riêng', 'Hồ bơi vô cực', 'Butler service', 'Jacuzzi', 'Phòng xông hơi'],
    featured: true,
  },
  {
    id: '12',
    name: 'Business Hotel Central',
    address: '200 Đường Lê Lợi',
    ward: '9',
    type: 'hotel',
    description: 'Khách sạn dành cho doanh nhân với phòng họp và dịch vụ văn phòng hoàn chỉnh.',
    price: 950000,
    rating: 4.4,
    reviewCount: 334,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    amenities: ['Phòng họp', 'Business center', 'WiFi tốc độ cao', 'Nhà hàng', 'Đưa đón sân bay'],
    featured: false,
  },
];

// Mock Rooms for each hotel
export const mockRooms: Room[] = [
  // Hotel 1 - Sunset Beach Villa
  {
    id: 'r1-1',
    hotelId: '1',
    name: 'Master Bedroom Villa',
    roomType: 'Villa Suite',
    price: 3500000,
    capacity: 4,
    totalRooms: 2,
    availableRooms: 1,
    description: 'Phòng master rộng rãi với ban công view biển, bồn tắm riêng.',
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    amenities: ['King bed', 'Balcony', 'Bathtub', 'Mini bar'],
  },
  {
    id: 'r1-2',
    hotelId: '1',
    name: 'Garden View Room',
    roomType: 'Standard',
    price: 2800000,
    capacity: 2,
    totalRooms: 3,
    availableRooms: 2,
    description: 'Phòng view vườn xanh mát, yên tĩnh.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    amenities: ['Queen bed', 'Garden view', 'Work desk'],
  },
  // Hotel 2 - Ocean View Hotel
  {
    id: 'r2-1',
    hotelId: '2',
    name: 'Deluxe Ocean View',
    roomType: 'Deluxe',
    price: 1500000,
    capacity: 2,
    totalRooms: 10,
    availableRooms: 5,
    description: 'Phòng Deluxe với tầm nhìn ra đại dương tuyệt đẹp.',
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
    amenities: ['King bed', 'Ocean view', 'Coffee maker', 'Safe box'],
  },
  {
    id: 'r2-2',
    hotelId: '2',
    name: 'Superior Room',
    roomType: 'Superior',
    price: 1200000,
    capacity: 2,
    totalRooms: 15,
    availableRooms: 8,
    description: 'Phòng Superior tiện nghi đầy đủ.',
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    amenities: ['Twin beds', 'City view', 'Mini fridge'],
  },
  {
    id: 'r2-3',
    hotelId: '2',
    name: 'Family Suite',
    roomType: 'Suite',
    price: 2200000,
    capacity: 4,
    totalRooms: 5,
    availableRooms: 2,
    description: 'Suite gia đình rộng rãi với phòng khách riêng biệt.',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    amenities: ['2 bedrooms', 'Living room', 'Kitchenette', 'Sea view'],
  },
  // Add more rooms for other hotels...
  {
    id: 'r3-1',
    hotelId: '3',
    name: 'Cozy Double Room',
    roomType: 'Double',
    price: 450000,
    capacity: 2,
    totalRooms: 4,
    availableRooms: 3,
    description: 'Phòng đôi ấm cúng với nội thất vintage.',
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    amenities: ['Double bed', 'Shared kitchen', 'Garden access'],
  },
  {
    id: 'r4-1',
    hotelId: '4',
    name: 'Studio Apartment',
    roomType: 'Studio',
    price: 800000,
    capacity: 2,
    totalRooms: 6,
    availableRooms: 4,
    description: 'Studio hiện đại với đầy đủ tiện nghi nấu ăn.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    amenities: ['Full kitchen', 'Washer', 'Smart TV', 'Workspace'],
  },
  {
    id: 'r5-1',
    hotelId: '5',
    name: 'Standard Room',
    roomType: 'Standard',
    price: 250000,
    capacity: 2,
    totalRooms: 20,
    availableRooms: 12,
    description: 'Phòng tiêu chuẩn sạch sẽ, tiện nghi cơ bản.',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    amenities: ['AC', 'Hot water', 'WiFi'],
  },
  {
    id: 'r6-1',
    hotelId: '6',
    name: 'Royal Suite',
    roomType: 'Presidential Suite',
    price: 5500000,
    capacity: 4,
    totalRooms: 2,
    availableRooms: 1,
    description: 'Suite hoàng gia với dịch vụ butler 24/7.',
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    amenities: ['Butler service', 'Private pool', 'Jacuzzi', 'Dining room'],
  },
  {
    id: 'r6-2',
    hotelId: '6',
    name: 'Executive Room',
    roomType: 'Executive',
    price: 2800000,
    capacity: 2,
    totalRooms: 8,
    availableRooms: 3,
    description: 'Phòng Executive với lounge access.',
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    amenities: ['Lounge access', 'King bed', 'Nespresso machine', 'Turndown service'],
  },
];

// Mock Blog Posts
export const mockBlogs: BlogPost[] = [
  {
    id: 'b1',
    title: 'Top 10 Điểm Đến Không Thể Bỏ Qua Tại Vũng Tàu',
    slug: 'top-10-diem-den-vung-tau',
    excerpt: 'Khám phá những địa điểm du lịch hấp dẫn nhất tại thành phố biển Vũng Tàu.',
    content: 'Vũng Tàu là điểm đến lý tưởng cho kỳ nghỉ cuối tuần với nhiều bãi biển đẹp, đồ ăn ngon và các hoạt động giải trí phong phú...',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    author: 'Nguyễn Văn A',
    createdAt: '2024-01-15',
  },
  {
    id: 'b2',
    title: 'Hướng Dẫn Chọn Villa Phù Hợp Cho Gia Đình',
    slug: 'huong-dan-chon-villa-gia-dinh',
    excerpt: 'Những tiêu chí quan trọng khi lựa chọn villa cho chuyến du lịch gia đình.',
    content: 'Khi đi du lịch cùng gia đình, việc chọn một villa phù hợp là rất quan trọng để đảm bảo mọi người đều có kỳ nghỉ thoải mái...',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    author: 'Trần Thị B',
    createdAt: '2024-01-10',
  },
  {
    id: 'b3',
    title: 'Ẩm Thực Đường Phố Vũng Tàu: Món Nào Phải Thử?',
    slug: 'am-thuc-duong-pho-vung-tau',
    excerpt: 'Danh sách các món ăn đường phố ngon nhất mà bạn không nên bỏ lỡ.',
    content: 'Vũng Tàu không chỉ nổi tiếng với biển đẹp mà còn là thiên đường ẩm thực với nhiều món ngon...',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    author: 'Lê Văn C',
    createdAt: '2024-01-05',
  },
];

// Helper functions
export const getHotelById = (id: string): Hotel | undefined => {
  return mockHotels.find(hotel => hotel.id === id);
};

export const getRoomsByHotelId = (hotelId: string): Room[] => {
  return mockRooms.filter(room => room.hotelId === hotelId);
};

export const getFeaturedHotels = (): Hotel[] => {
  return mockHotels.filter(hotel => hotel.featured);
};

export const searchHotels = (type?: string, ward?: string, minPrice?: number, maxPrice?: number): Hotel[] => {
  return mockHotels.filter(hotel => {
    if (type && hotel.type !== type) return false;
    if (ward && hotel.ward !== ward) return false;
    if (minPrice && hotel.price < minPrice) return false;
    if (maxPrice && hotel.price > maxPrice) return false;
    return true;
  });
};
