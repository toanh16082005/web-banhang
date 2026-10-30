// src/store/state.js
// Reactive Global Store with LocalStorage Persistence for AURA STAY

import {
  SEED_ROOM_TYPES,
  SEED_PHYSICAL_ROOMS,
  SEED_AMENITIES,
  SEED_PRICING_RULES,
  SEED_PROMOTIONS,
  SEED_INITIAL_BOOKINGS
} from '../data/seedData.js';

const STORAGE_KEYS = {
  ROOM_TYPES: 'aura_stay_room_types_v2',
  PHYSICAL_ROOMS: 'aura_stay_physical_rooms_v2',
  BOOKINGS: 'aura_stay_bookings_v2',
  PRICING_RULES: 'aura_stay_pricing_rules_v2',
  SEARCH: 'aura_stay_search_v2',
  ROLE: 'aura_stay_active_role_v2'
};

// Khởi tạo ngày mặc định: Hôm nay và Ngày mốt (+2 đêm)
function getDefaultDates() {
  const today = new Date();
  const dayIn = new Date(today);
  dayIn.setDate(today.getDate() + 1);
  const dayOut = new Date(today);
  dayOut.setDate(today.getDate() + 3);

  const formatDate = (d) => d.toISOString().split('T')[0];
  return {
    checkIn: formatDate(dayIn),
    checkOut: formatDate(dayOut)
  };
}

class Store {
  constructor() {
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    // 1. Hạng phòng
    const storedRoomTypes = localStorage.getItem(STORAGE_KEYS.ROOM_TYPES);
    this.roomTypes = storedRoomTypes ? JSON.parse(storedRoomTypes) : SEED_ROOM_TYPES;

    // 2. Phòng vật lý
    const storedRooms = localStorage.getItem(STORAGE_KEYS.PHYSICAL_ROOMS);
    this.rooms = storedRooms ? JSON.parse(storedRooms) : SEED_PHYSICAL_ROOMS;

    // 3. Đơn đặt phòng
    const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    this.bookings = storedBookings ? JSON.parse(storedBookings) : SEED_INITIAL_BOOKINGS;

    // 4. Quy tắc giá
    const storedPricing = localStorage.getItem(STORAGE_KEYS.PRICING_RULES);
    this.pricingRules = storedPricing ? JSON.parse(storedPricing) : SEED_PRICING_RULES;

    // 5. Tìm kiếm
    const defaultDates = getDefaultDates();
    this.searchParams = {
      checkIn: defaultDates.checkIn,
      checkOut: defaultDates.checkOut,
      adults: 2,
      children: 0,
      categoryFilter: 'all',
      sortBy: 'featured'
    };

    // 6. Vai trò hiện tại ('guest' hoặc 'admin')
    this.activeRole = localStorage.getItem(STORAGE_KEYS.ROLE) || 'guest';
    this.adminSubTab = 'matrix'; // 'matrix', 'bookings', 'pricing', 'kpi'

    // 7. Modals
    this.activeModal = null; // 'booking', 'roomDetail', 'trackBooking', 'quickSearch'
    this.selectedRoomType = null;
    this.selectedPhysicalRoom = null;

    this.saveState();
  }

  saveState() {
    localStorage.setItem(STORAGE_KEYS.ROOM_TYPES, JSON.stringify(this.roomTypes));
    localStorage.setItem(STORAGE_KEYS.PHYSICAL_ROOMS, JSON.stringify(this.rooms));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
    localStorage.setItem(STORAGE_KEYS.ROLE, this.activeRole);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(fn => fn(this));
  }

  // Chuyển đổi vai trò Khách hàng <-> Lễ tân / Quản trị
  setRole(role) {
    this.activeRole = role;
    this.notify();
  }

  setAdminSubTab(tab) {
    this.adminSubTab = tab;
    this.notify();
  }

  // Cập nhật tham số tìm kiếm
  setSearchParams(params) {
    this.searchParams = { ...this.searchParams, ...params };
    this.notify();
  }

  // Mở / Đóng modal
  openModal(modalName, data = null) {
    this.activeModal = modalName;
    if (modalName === 'roomDetail' || modalName === 'booking') {
      this.selectedRoomType = data;
    } else if (modalName === 'roomAction') {
      this.selectedPhysicalRoom = data;
    }
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.selectedRoomType = null;
    this.selectedPhysicalRoom = null;
    this.notify();
  }

  // Tính số đêm lưu trú
  calculateNights(inDateStr, outDateStr) {
    const inDate = new Date(inDateStr);
    const outDate = new Date(outDateStr);
    const diffTime = Math.abs(outDate - inDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  // Định dạng tiền tệ VND
  formatPrice(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Zero-Trust Pricing: Tính toán giá chuẩn xác từng đêm
  calculatePriceBreakdown(roomType, checkInStr, checkOutStr, promoCode = '') {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    const totalNights = this.calculateNights(checkInStr, checkOutStr);

    let nightlyDetails = [];
    let subtotal = 0;

    let currentDate = new Date(checkIn);
    for (let i = 0; i < totalNights; i++) {
      const dayOfWeek = currentDate.getDay(); // 0 = Chủ nhật, 5 = Thứ sáu, 6 = Thứ bảy
      const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
      
      let rate = roomType.base_price;
      let multiplier = 1.0;
      let note = 'Ngày trong tuần';

      if (isWeekend) {
        multiplier = 1.15; // Phụ thu 15% cuối tuần
        rate = Math.round(roomType.base_price * multiplier);
        note = 'Phụ thu cuối tuần (+15%)';
      }

      subtotal += rate;
      nightlyDetails.push({
        date: currentDate.toISOString().split('T')[0],
        rate,
        note
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Giảm giá khuyến mãi
    let discount = 0;
    let promoLabel = '';
    const promo = SEED_PROMOTIONS.find(p => p.code.toUpperCase() === (promoCode || '').trim().toUpperCase());
    if (promo) {
      if (promo.discount_percent) {
        discount = Math.round((subtotal * promo.discount_percent) / 100);
        promoLabel = promo.label;
      } else if (promo.discount_fixed && subtotal >= 4000000) {
        discount = promo.discount_fixed;
        promoLabel = promo.label;
      }
    }

    const serviceFee = Math.round(subtotal * 0.05); // 5% phí phục vụ resort
    const finalTotal = Math.max(0, subtotal + serviceFee - discount);

    return {
      totalNights,
      nightlyDetails,
      subtotal,
      discount,
      promoLabel,
      serviceFee,
      finalTotal
    };
  }

  // Kiểm tra số phòng còn trống cho hạng phòng trong khoảng ngày
  getAvailableRoomsForType(roomTypeId, checkInStr, checkOutStr) {
    const candidateRooms = this.rooms.filter(r => r.room_type_id === roomTypeId && r.status !== 'maintenance');
    
    // Lọc ra các phòng không bị giao thoa bởi booking đã xác nhận
    const available = candidateRooms.filter(room => {
      const isBooked = this.bookings.some(b => {
        if (b.status === 'cancelled' || b.status === 'checked_out') return false;
        if (b.room_id !== room.id) return false;
        
        // Điều kiện giao thoa ngày
        return (b.check_in_date < checkOutStr && b.check_out_date > checkInStr);
      });
      return !isBooked;
    });

    return available;
  }

  // Tạo đơn đặt phòng mới (Khóa nguyên tử chống Overbooking)
  createBooking(formData) {
    const { roomTypeId, checkIn, checkOut, customerName, customerPhone, customerEmail, customerIdentity, specialRequests, paymentMethod, promoCode } = formData;
    
    const roomType = this.roomTypes.find(t => t.id === Number(roomTypeId));
    if (!roomType) throw new Error('Hạng phòng không tồn tại');

    // 1. Kiểm tra phòng trống
    const availableRooms = this.getAvailableRoomsForType(roomType.id, checkIn, checkOut);
    if (availableRooms.length === 0) {
      throw new Error(`Rất tiếc! Hạng phòng ${roomType.name} đã hết phòng trống trong khoảng thời gian từ ${checkIn} đến ${checkOut}. Vui lòng chọn ngày khác hoặc hạng phòng khác.`);
    }

    // 2. Gán phòng vật lý đầu tiên còn trống
    const assignedRoom = availableRooms[0];

    // 3. Tính toán giá chính xác (Zero-Trust Pricing)
    const pricing = this.calculatePriceBreakdown(roomType, checkIn, checkOut, promoCode);

    // 4. Sinh mã đặt phòng duy nhất: AUR-YYMMDD-XXXX
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `AUR-${yy}${mm}${dd}-${randomSuffix}`;

    const newBooking = {
      id: Date.now(),
      booking_code: bookingCode,
      idempotency_key: crypto.randomUUID ? crypto.randomUUID() : `idemp-${Date.now()}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_identity: customerIdentity || '',
      room_type_id: roomType.id,
      room_type_name: roomType.name,
      room_id: assignedRoom.id,
      room_number: assignedRoom.room_number,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_nights: pricing.totalNights,
      adults: Number(this.searchParams.adults) || 2,
      children: Number(this.searchParams.children) || 0,
      subtotal_price: pricing.subtotal,
      service_fee: pricing.serviceFee,
      discount_amount: pricing.discount,
      total_amount: pricing.finalTotal,
      payment_method: paymentMethod || 'PAY_AT_CHECKIN',
      payment_status: paymentMethod === 'BANK_TRANSFER_QR' ? 'paid' : 'unpaid',
      status: 'confirmed',
      special_requests: specialRequests || '',
      created_at: new Date().toLocaleString('vi-VN')
    };

    // 5. Cập nhật trạng thái phòng vật lý
    const roomIndex = this.rooms.findIndex(r => r.id === assignedRoom.id);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].status = 'reserved';
      this.rooms[roomIndex].guest_name = customerName;
    }

    this.bookings.unshift(newBooking);
    this.notify();

    return newBooking;
  }

  // Chuyển đổi trạng thái đơn đặt phòng theo State Machine
  updateBookingStatus(bookingId, nextStatus) {
    const booking = this.bookings.find(b => b.id === Number(bookingId));
    if (!booking) return;

    booking.status = nextStatus;

    // Đồng bộ trạng thái phòng vật lý
    const room = this.rooms.find(r => r.id === booking.room_id);
    if (room) {
      if (nextStatus === 'checked_in') {
        room.status = 'occupied';
        room.guest_name = booking.customer_name;
      } else if (nextStatus === 'checked_out') {
        room.status = 'dirty';
        room.guest_name = '';
      } else if (nextStatus === 'cancelled') {
        room.status = 'clean';
        room.guest_name = '';
      }
    }

    this.notify();
  }

  // Cập nhật trạng thái phòng vật lý (Lễ tân đổi nhanh: Dọn xong -> Sạch)
  updatePhysicalRoomStatus(roomId, newStatus) {
    const room = this.rooms.find(r => r.id === Number(roomId));
    if (!room) return;
    room.status = newStatus;
    if (newStatus === 'clean') {
      room.guest_name = '';
    }
    this.notify();
  }

  // Tra cứu đơn đặt phòng theo Mã đơn hoặc Số điện thoại
  lookupBooking(query) {
    if (!query) return [];
    const q = query.trim().toUpperCase();
    return this.bookings.filter(b => 
      b.booking_code.toUpperCase().includes(q) || 
      b.customer_phone.includes(query.trim())
    );
  }

  // Hủy đơn đặt phòng (Khách tự hủy hoặc Lễ tân hủy)
  cancelBooking(bookingCode, reason = 'Khách yêu cầu hủy') {
    const booking = this.bookings.find(b => b.booking_code.toUpperCase() === bookingCode.toUpperCase());
    if (!booking) throw new Error('Không tìm thấy mã đặt phòng');

    if (booking.status === 'checked_in' || booking.status === 'checked_out') {
      throw new Error('Đơn đặt phòng đang lưu trú hoặc đã hoàn tất không thể hủy.');
    }

    booking.status = 'cancelled';
    booking.cancel_reason = reason;

    // Giải phóng phòng
    const room = this.rooms.find(r => r.id === booking.room_id);
    if (room && room.status !== 'occupied') {
      room.status = 'clean';
      room.guest_name = '';
    }

    this.notify();
    return booking;
  }

  // Thống kê số liệu KPI cho Quản trị viên
  getDashboardKPIs() {
    const totalRevenue = this.bookings
      .filter(b => b.status !== 'cancelled' && (b.payment_status === 'paid' || b.status === 'checked_in' || b.status === 'checked_out'))
      .reduce((sum, b) => sum + b.total_amount, 0);

    const totalRooms = this.rooms.length;
    const occupiedRooms = this.rooms.filter(r => r.status === 'occupied').length;
    const reservedRooms = this.rooms.filter(r => r.status === 'reserved').length;
    const cleanRooms = this.rooms.filter(r => r.status === 'clean').length;
    const dirtyRooms = this.rooms.filter(r => r.status === 'dirty').length;

    const occupancyRate = Math.round(((occupiedRooms + reservedRooms) / totalRooms) * 100);

    return {
      totalRevenue,
      occupancyRate,
      totalRooms,
      occupiedRooms,
      reservedRooms,
      cleanRooms,
      dirtyRooms,
      totalBookings: this.bookings.length
    };
  }
}

export const store = new Store();
