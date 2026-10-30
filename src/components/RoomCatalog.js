// src/components/RoomCatalog.js
import { store } from '../store/state.js';

export function renderRoomCatalog() {
  const { checkIn, checkOut, categoryFilter, sortBy } = store.searchParams;
  const nights = store.calculateNights(checkIn, checkOut);

  // Lọc theo tag/danh mục
  let filteredRooms = store.roomTypes.filter(room => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'ocean_view') return room.tags.some(t => t.includes('View Biển'));
    if (categoryFilter === 'pool_villa') return room.tags.some(t => t.includes('Hồ Bơi'));
    if (categoryFilter === 'family') return room.max_adults >= 4;
    if (categoryFilter === 'honeymoon') return room.tags.some(t => t.includes('Trăng Mật'));
    return true;
  });

  // Sắp xếp
  if (sortBy === 'price_asc') {
    filteredRooms.sort((a, b) => a.base_price - b.base_price);
  } else if (sortBy === 'price_desc') {
    filteredRooms.sort((a, b) => b.base_price - a.base_price);
  } else if (sortBy === 'rating') {
    filteredRooms.sort((a, b) => b.rating_avg - a.rating_avg);
  }

  const roomCardsHtml = filteredRooms.map(room => {
    const availableRooms = store.getAvailableRoomsForType(room.id, checkIn, checkOut);
    const isAvailable = availableRooms.length > 0;
    const priceCalculation = store.calculatePriceBreakdown(room, checkIn, checkOut);

    return `
      <article class="room-card" data-room-id="${room.id}">
        <div class="room-image-box">
          <img src="${room.thumbnail_url}" alt="${room.name}" class="room-image" loading="lazy" />
          
          <div class="room-badge-overlay">
            ${room.tags.map(tag => `<span class="room-tag">${tag}</span>`).join('')}
            ${!isAvailable ? '<span class="room-tag discount">Đã Kín Phòng</span>' : ''}
          </div>

          <div class="room-rating-overlay">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>${room.rating_avg} (${room.reviews_count})</span>
          </div>
        </div>

        <div class="room-card-content">
          <h3 class="room-card-title">${room.name}</h3>
          <p class="room-card-desc">${room.short_description}</p>

          <div class="room-specs">
            <div class="room-spec-item" title="Diện tích phòng">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
              <span>${room.area_sqm} m²</span>
            </div>
            <div class="room-spec-item" title="Số lượng khách tối đa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>${room.max_adults} người lớn + ${room.max_children} trẻ em</span>
            </div>
          </div>

          <div class="room-amenities-pills">
            <span class="amenity-pill">🛏️ ${room.bed_type}</span>
            <span class="amenity-pill">☕ Buffet sáng</span>
            <span class="amenity-pill">🏊 Bể bơi vô cực</span>
          </div>

          <div class="room-card-footer">
            <div class="room-price-box">
              <span class="room-price-label">Giá từ / đêm</span>
              <span class="room-price-value">${store.formatPrice(room.base_price)}</span>
              <span class="room-price-period">
                ${nights > 1 ? `(${nights} đêm trọn gói: ${store.formatPrice(priceCalculation.finalTotal)})` : '/ đêm'}
              </span>
            </div>

            <div class="room-card-actions">
              <button class="btn-card-detail" data-action="detail" data-id="${room.id}">
                Xem Chi Tiết
              </button>
              ${isAvailable ? `
                <button class="btn-card-book" data-action="book" data-id="${room.id}">
                  Đặt Phòng
                </button>
              ` : `
                <button class="btn-card-book" disabled style="opacity: 0.5; cursor: not-allowed; background: #64748b;">
                  Hết Phòng
                </button>
              `}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <section class="section-rooms" id="rooms-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Bộ Sưu Tập Không Gian</span>
          <h2 class="section-title">Chọn Hạng Phòng Nghỉ Dưỡng</h2>
          <p class="section-description">
            Tất cả các phòng tại AURA STAY đều được bài trí tinh tế, view ngắm biển hoàng hôn tuyệt mỹ và trang bị đầy đủ tiện nghi chuẩn 5 sao quốc tế.
          </p>
        </div>

        <!-- Bộ Lọc Đa Tiêu Chí -->
        <div class="filter-container">
          <div class="filter-chips">
            <button class="filter-chip ${categoryFilter === 'all' ? 'active' : ''}" data-filter="all">Tất Cả (${store.roomTypes.length})</button>
            <button class="filter-chip ${categoryFilter === 'ocean_view' ? 'active' : ''}" data-filter="ocean_view">View Biển</button>
            <button class="filter-chip ${categoryFilter === 'pool_villa' ? 'active' : ''}" data-filter="pool_villa">Hồ Bơi Riêng</button>
            <button class="filter-chip ${categoryFilter === 'family' ? 'active' : ''}" data-filter="family">Biệt Thự Gia Đình</button>
            <button class="filter-chip ${categoryFilter === 'honeymoon' ? 'active' : ''}" data-filter="honeymoon">Tuần Trăng Mật</button>
          </div>

          <div class="filter-sort">
            <label for="room-sort-select" style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted);">Sắp xếp:</label>
            <select id="room-sort-select">
              <option value="featured" ${sortBy === 'featured' ? 'selected' : ''}>Nổi bật nhất</option>
              <option value="price_asc" ${sortBy === 'price_asc' ? 'selected' : ''}>Giá tăng dần</option>
              <option value="price_desc" ${sortBy === 'price_desc' ? 'selected' : ''}>Giá giảm dần</option>
              <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        <!-- Lưới Danh Sách Phòng -->
        <div class="room-grid">
          ${roomCardsHtml}
        </div>
      </div>
    </section>
  `;
}

export function attachRoomCatalogEvents() {
  // Lọc theo chip
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.onclick = () => {
      const filter = btn.dataset.filter;
      store.setSearchParams({ categoryFilter: filter });
    };
  });

  // Sắp xếp
  const sortSelect = document.getElementById('room-sort-select');
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      store.setSearchParams({ sortBy: e.target.value });
    };
  }

  // Bấm nút Xem chi tiết hoặc Đặt phòng
  document.querySelectorAll('.room-card button[data-action]').forEach(btn => {
    btn.onclick = () => {
      const action = btn.dataset.action;
      const roomId = Number(btn.dataset.id);
      const room = store.roomTypes.find(r => r.id === roomId);
      if (!room) return;

      if (action === 'detail') {
        store.openModal('roomDetail', room);
      } else if (action === 'book') {
        store.openModal('booking', room);
      }
    };
  });
}
