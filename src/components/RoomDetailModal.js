// src/components/RoomDetailModal.js
import { store } from '../store/state.js';

export function renderRoomDetailModal() {
  const room = store.selectedRoomType;
  if (!room) return '';

  const { checkIn, checkOut } = store.searchParams;
  const nights = store.calculateNights(checkIn, checkOut);
  const pricing = store.calculatePriceBreakdown(room, checkIn, checkOut);
  const availableRooms = store.getAvailableRoomsForType(room.id, checkIn, checkOut);
  const isAvailable = availableRooms.length > 0;

  return `
    <div class="modal-overlay ${store.activeModal === 'roomDetail' ? 'active' : ''}" id="room-detail-modal">
      <div class="modal-card">
        <button class="modal-close-btn" id="modal-detail-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style="padding: 28px;">
          <!-- Gallery -->
          <div style="position: relative; height: 360px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px;">
            <img id="detail-main-img" src="${room.gallery[0] || room.thumbnail_url}" style="width: 100%; height: 100%; object-fit: cover;" />
            
            <div style="position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px;">
              ${room.gallery.map((img, idx) => `
                <img src="${img}" class="gallery-thumb" data-src="${img}" style="width: 60px; height: 42px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid ${idx === 0 ? 'var(--color-secondary)' : '#fff'};" />
              `).join('')}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div>
              <span class="section-tag">${room.tags.join(' • ')}</span>
              <h2 style="font-size: 2rem; color: var(--color-primary);">${room.name}</h2>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">Giá phòng</span>
              <span style="font-size: 1.8rem; font-weight: 700; color: var(--color-primary);">${store.formatPrice(room.base_price)}</span>
              <span style="font-size: 0.85rem; color: var(--color-text-muted);">/ đêm</span>
            </div>
          </div>

          <p style="font-size: 1rem; color: var(--color-text-muted); margin-bottom: 24px; line-height: 1.7;">
            ${room.description}
          </p>

          <!-- Thông Số Kỹ Thuật -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: var(--color-bg-subtle); padding: 18px; border-radius: var(--radius-md); margin-bottom: 28px;">
            <div>
              <div style="font-size: 0.75rem; color: var(--color-secondary-dark); font-weight: 700; text-transform: uppercase;">Diện Tích</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">${room.area_sqm} m²</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--color-secondary-dark); font-weight: 700; text-transform: uppercase;">Loại Giường</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">${room.bed_type}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--color-secondary-dark); font-weight: 700; text-transform: uppercase;">Sức Chứa</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">${room.max_adults} người lớn + ${room.max_children} trẻ em</div>
            </div>
          </div>

          <!-- Tiện Ích Phòng Đi Kèm -->
          <h4 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 14px;">Tiện Nghi Tiêu Chuẩn Quốc Tế</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 28px; font-size: 0.9rem;">
            <div style="display: flex; align-items: center; gap: 8px;">✔️ Bồn tắm nằm ngắm biển</div>
            <div style="display: flex; align-items: center; gap: 8px;">✔️ Wifi tốc độ cao 500Mbps</div>
            <div style="display: flex; align-items: center; gap: 8px;">✔️ Smart TV 65-inch 4K</div>
            <div style="display: flex; align-items: center; gap: 8px;">✔️ Máy pha cà phê Espresso viên nén</div>
            <div style="display: flex; align-items: center; gap: 8px;">✔️ Két sắt điện tử an toàn</div>
            <div style="display: flex; align-items: center; gap: 8px;">✔️ Áo choàng tắm sợi tre cao cấp</div>
          </div>

          <!-- Chính Sách Lưu Trú -->
          <div style="background: rgba(212, 175, 55, 0.08); border-left: 4px solid var(--color-secondary); padding: 14px 18px; border-radius: var(--radius-sm); margin-bottom: 28px; font-size: 0.88rem; color: var(--color-text-main);">
            <strong>Chính sách lưu trú:</strong> Nhận phòng từ 14:00 - Trả phòng trước 12:00. Miễn phí hủy phòng trước ngày đến 48 giờ. Phục vụ bữa sáng buffet miễn phí từ 06:30 đến 10:00 hàng ngày.
          </div>

          <!-- Tóm Tắt Chi Phí Cho Khoảng Ngày Đã Chọn -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid rgba(11, 19, 43, 0.1);">
            <div>
              <span style="font-size: 0.85rem; color: var(--color-text-muted);">
                Tổng tiền (${nights} đêm: ${checkIn} ➔ ${checkOut}):
              </span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary);">
                ${store.formatPrice(pricing.finalTotal)}
              </div>
            </div>

            <div>
              ${isAvailable ? `
                <button class="btn-pill btn-pill-gold" id="detail-book-now-btn" style="padding: 14px 32px; font-size: 1rem;">
                  Đặt Hạng Phòng Này Ngay
                </button>
              ` : `
                <button class="btn-pill" disabled style="padding: 14px 32px; background: #64748b; color: #fff; cursor: not-allowed;">
                  Đã Kín Phòng Trong Ngày Chọn
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachRoomDetailEvents() {
  const modal = document.getElementById('room-detail-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-detail-close');
  if (closeBtn) {
    closeBtn.onclick = () => store.closeModal();
  }

  // Đổi ảnh chính khi bấm thumbnail
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.onclick = () => {
      const mainImg = document.getElementById('detail-main-img');
      if (mainImg) {
        mainImg.src = thumb.dataset.src;
        document.querySelectorAll('.gallery-thumb').forEach(t => t.style.borderColor = '#fff');
        thumb.style.borderColor = 'var(--color-secondary)';
      }
    };
  });

  const bookBtn = document.getElementById('detail-book-now-btn');
  if (bookBtn) {
    bookBtn.onclick = () => {
      const room = store.selectedRoomType;
      store.openModal('booking', room);
    };
  }
}
