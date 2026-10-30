// src/data/seedData.js
// 15-Table Relational Schema Data for AURA STAY

export const SEED_ROOM_TYPES = [
  {
    id: 1,
    name: 'Deluxe Ocean View',
    slug: 'deluxe-ocean-view',
    base_price: 1850000,
    max_adults: 2,
    max_children: 1,
    area_sqm: 38,
    bed_type: '1 Giường đôi King size',
    short_description: 'Ban công riêng ngắm toàn cảnh biển hoàng hôn, bồn tắm nằm đá tự nhiên và trà thảo mộc thượng hạng.',
    description: 'Căn phòng Deluxe Ocean View tại AURA STAY mang lại cho bạn không gian tĩnh tại với tầm nhìn bao quát toàn bộ vịnh biển. Thiết kế lấy cảm hứng từ kiến trúc Đông Dương đương đại kết hợp tiện nghi tiêu chuẩn 5 sao quốc tế.',
    thumbnail_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['View Biển', 'Bữa Sáng Miễn Phí', 'Bán Chạy Nhất'],
    rating_avg: 4.9,
    reviews_count: 128,
    is_featured: 1
  },
  {
    id: 2,
    name: 'Grand Executive Suite',
    slug: 'grand-executive-suite',
    base_price: 2950000,
    max_adults: 2,
    max_children: 2,
    area_sqm: 65,
    bed_type: '1 Giường King + Sofa bed cao cấp',
    short_description: 'Phòng khách biệt lập, bồn sục Jacuzzi ngoài trời, đặc quyền thưởng thức rượu vang chiều tại Club Lounge.',
    description: 'Dành riêng cho những vị khách tìm kiếm sự sang trọng và tiện nghi đỉnh cao. Grand Executive Suite bao gồm khu vực tiếp khách rộng rãi, bàn làm việc sang trọng và ban công kính mở ra tầm nhìn biển 180 độ.',
    thumbnail_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Bồn Sục Jacuzzi', 'Đặc Quyền Lounge', 'View Biển Trọn Vẹn'],
    rating_avg: 5.0,
    reviews_count: 94,
    is_featured: 1
  },
  {
    id: 3,
    name: 'Beachfront Private Pool Villa',
    slug: 'beachfront-private-pool-villa',
    base_price: 5600000,
    max_adults: 4,
    max_children: 2,
    area_sqm: 145,
    bed_type: '2 Giường King lớn riêng biệt',
    short_description: 'Biệt thự sát biển với hồ bơi vô cực riêng, sân tắm nắng riêng tư và lối đi thẳng ra bờ cát trắng mịn.',
    description: 'Trải nghiệm đỉnh cao của sự tự do và riêng tư tuyệt đối tại Beachfront Private Pool Villa. Nằm ngay sát bờ biển, bạn có thể lắng nghe tiếng sóng vỗ rì rào ngay từ giường ngủ và đắm mình trong làn nước trong vắt của hồ bơi riêng.',
    thumbnail_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Hồ Bơi Riêng', 'Sát Bờ Biển', 'Lý Tưởng Cho Gia Đình'],
    rating_avg: 5.0,
    reviews_count: 67,
    is_featured: 1
  },
  {
    id: 4,
    name: 'Presidential Sunset Penthouse',
    slug: 'presidential-sunset-penthouse',
    base_price: 8900000,
    max_adults: 6,
    max_children: 3,
    area_sqm: 210,
    bed_type: '3 Phòng ngủ Master Suite',
    short_description: 'Tọa lạc trên đỉnh tháp với góc nhìn hoàng hôn 360 độ, quầy bar cá nhân, phòng chiếu phim và quản gia 24/7.',
    description: 'Biểu tượng của quyền uy và đẳng cấp thượng lưu. Penthouse là kiệt tác kiến trúc sở hữu tầm nhìn không giới hạn ra toàn cảnh biển đảo, trang bị đầy đủ quầy bar xa xỉ, phòng spa trị liệu riêng và dịch vụ quản gia cao cấp.',
    thumbnail_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Đẳng Cấp Thượng Lưu', 'Quản Gia Riêng 24/7', 'View 360°'],
    rating_avg: 5.0,
    reviews_count: 32,
    is_featured: 0
  },
  {
    id: 5,
    name: 'Zen Tropical Garden Bungalow',
    slug: 'zen-tropical-garden-bungalow',
    base_price: 1450000,
    max_adults: 2,
    max_children: 1,
    area_sqm: 42,
    bed_type: '1 Giường Queen hoặc 2 Giường đơn',
    short_description: 'Nép mình giữa vườn dừa và hoa sứ ngát hương, hiên thư giãn đọc sách và phòng tắm mở hòa mình vào thiên nhiên.',
    description: 'Dành cho những tâm hồn yêu thiên nhiên mộc mạc và sự an yên tuyệt đối. Bungalow được bao quanh bởi thảm thực vật xanh mướt, vật liệu gỗ và tre tự nhiên tạo cảm giác thư thái, phục hồi năng lượng.',
    thumbnail_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Vườn Nhiệt Đới', 'Yên Tĩnh', 'Gần Gũi Thiên Nhiên'],
    rating_avg: 4.8,
    reviews_count: 85,
    is_featured: 0
  },
  {
    id: 6,
    name: 'Honeymoon Romantic Haven',
    slug: 'honeymoon-romantic-haven',
    base_price: 2400000,
    max_adults: 2,
    max_children: 0,
    area_sqm: 52,
    bed_type: '1 Giường đôi lãng mạn vòm voan trắng',
    short_description: 'Setup hoa tươi, sâm banh ướp lạnh, bữa tối ánh nến bên ban công ngắm sao trời và biển đêm lãng mạn.',
    description: 'Thiết kế riêng cho các cặp đôi tận hưởng kỳ trăng mật hay kỷ niệm ngày cưới. Không gian ấm cúng, lung linh ánh nến cùng những dịch vụ chăm sóc ngọt ngào khó quên.',
    thumbnail_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Tuần Trăng Mật', 'Bữa Tối Ánh Nến', 'Quà Tặng Tình Yêu'],
    rating_avg: 4.9,
    reviews_count: 76,
    is_featured: 1
  }
];

export const SEED_PHYSICAL_ROOMS = [
  // Tầng 1 - Deluxe Ocean View
  { id: 101, room_number: '101', room_type_id: 1, floor: 1, status: 'clean', guest_name: '' },
  { id: 102, room_number: '102', room_type_id: 1, floor: 1, status: 'occupied', guest_name: 'Nguyễn Văn Chiến' },
  { id: 103, room_number: '103', room_type_id: 1, floor: 1, status: 'reserved', guest_name: 'Trần Đình Phú' },
  { id: 104, room_number: '104', room_type_id: 1, floor: 1, status: 'dirty', guest_name: '' },
  
  // Tầng 2 - Grand Executive Suite
  { id: 201, room_number: '201', room_type_id: 2, floor: 2, status: 'clean', guest_name: '' },
  { id: 202, room_number: '202', room_type_id: 2, floor: 2, status: 'occupied', guest_name: 'Phạm Văn Mạnh' },
  { id: 203, room_number: '203', room_type_id: 2, floor: 2, status: 'clean', guest_name: '' },
  { id: 204, room_number: '204', room_type_id: 2, floor: 2, status: 'maintenance', guest_name: '' },
  
  // Khu Biệt Thự Sát Biển (Villas)
  { id: 301, room_number: 'V01', room_type_id: 3, floor: 0, status: 'occupied', guest_name: 'Cao Xuân Thịnh' },
  { id: 302, room_number: 'V02', room_type_id: 3, floor: 0, status: 'clean', guest_name: '' },
  { id: 303, room_number: 'V03', room_type_id: 3, floor: 0, status: 'reserved', guest_name: 'Lê Đức Hạnh' },
  
  // Khu Vườn Sinh Thái (Bungalow)
  { id: 401, room_number: 'B01', room_type_id: 5, floor: 0, status: 'clean', guest_name: '' },
  { id: 402, room_number: 'B02', room_type_id: 5, floor: 0, status: 'clean', guest_name: '' },
  
  // Khu Trăng Mật & Penthouse
  { id: 501, room_number: 'H01', room_type_id: 6, floor: 2, status: 'clean', guest_name: '' },
  { id: 601, room_number: 'PH01', room_type_id: 4, floor: 3, status: 'clean', guest_name: '' }
];

export const SEED_AMENITIES = [
  { id: 1, name: 'Hồ Bơi Vô Cực View Biển', icon: 'waves' },
  { id: 2, name: 'Buffet Sáng Chuẩn 5 Sao', icon: 'coffee' },
  { id: 3, name: 'Wifi Tốc Độ Cao 500Mbps', icon: 'wifi' },
  { id: 4, name: 'Bồn Tắm Nằm & Bồn Sục Jacuzzi', icon: 'bath' },
  { id: 5, name: 'Đưa Đón Sân Bay Miễn Phí', icon: 'car' },
  { id: 6, name: 'Dịch Vụ Spa Trị Liệu Thảo Dược', icon: 'sparkles' },
  { id: 7, name: 'Phòng Gym & Yoga Hướng Biển', icon: 'activity' },
  { id: 8, name: 'Minibar & Máy Pha Cà Phê Viên Nén', icon: 'cup-soda' }
];

export const SEED_PRICING_RULES = [
  {
    id: 1,
    name: 'Phụ Thu Cuối Tuần (Thứ 6, Thứ 7)',
    multiplier: 1.15,
    extra_fixed: 0,
    applies_to: 'weekend',
    is_active: true
  },
  {
    id: 2,
    name: 'Ưu Đãi Đặt Sớm (Trước 14 Ngày)',
    multiplier: 0.90,
    extra_fixed: 0,
    applies_to: 'early_bird',
    is_active: true
  }
];

export const SEED_PROMOTIONS = [
  { code: 'AURASTAY2026', discount_percent: 10, label: 'Giảm 10% Cho Thành Viên Mới' },
  { code: 'LUXURY500K', discount_fixed: 500000, label: 'Giảm 500.000₫ Cho Đơn Từ 4 Triệu' }
];

export const SEED_INITIAL_BOOKINGS = [
  {
    id: 1,
    booking_code: 'AUR-260324-1001',
    customer_name: 'Nguyễn Văn Chiến',
    customer_phone: '0988123456',
    customer_email: 'chien.nguyen@gmail.com',
    customer_identity: '001201009876',
    room_type_id: 1,
    room_id: 102,
    room_number: '102',
    check_in_date: '2026-03-24',
    check_out_date: '2026-03-27',
    total_nights: 3,
    adults: 2,
    children: 1,
    total_amount: 5550000,
    payment_method: 'BANK_TRANSFER_QR',
    payment_status: 'paid',
    status: 'checked_in',
    special_requests: 'Chuẩn bị thêm gối lông vũ cho trẻ em',
    created_at: '2026-03-20 09:30:00'
  },
  {
    id: 2,
    booking_code: 'AUR-260324-1002',
    customer_name: 'Trần Đình Phú',
    customer_phone: '0977889900',
    customer_email: 'phu.tran@gmail.com',
    customer_identity: '001201005544',
    room_type_id: 1,
    room_id: 103,
    room_number: '103',
    check_in_date: '2026-03-26',
    check_out_date: '2026-03-28',
    total_nights: 2,
    adults: 2,
    children: 0,
    total_amount: 3700000,
    payment_method: 'PAY_AT_CHECKIN',
    payment_status: 'unpaid',
    status: 'confirmed',
    special_requests: 'Phòng tầng yên tĩnh',
    created_at: '2026-03-22 14:15:00'
  },
  {
    id: 3,
    booking_code: 'AUR-260324-1003',
    customer_name: 'Cao Xuân Thịnh',
    customer_phone: '0912334455',
    customer_email: 'thinh.cao@gmail.com',
    customer_identity: '001201007788',
    room_type_id: 3,
    room_id: 301,
    room_number: 'V01',
    check_in_date: '2026-03-23',
    check_out_date: '2026-03-26',
    total_nights: 3,
    adults: 4,
    children: 2,
    total_amount: 16800000,
    payment_method: 'BANK_TRANSFER_QR',
    payment_status: 'paid',
    status: 'checked_in',
    special_requests: 'Setup tiệc nướng BBQ bãi biển tối ngày thứ 2',
    created_at: '2026-03-18 11:00:00'
  }
];
