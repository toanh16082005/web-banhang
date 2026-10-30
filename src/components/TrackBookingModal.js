// src/components/TrackBookingModal.js
import { store } from '../store/state.js';

let searchResult = null;

export function renderTrackBookingModal() {
  return `
    <div class="modal-overlay ${store.activeModal === 'trackBooking' ? 'active' : ''}" id="track-booking-modal">
      <div class="modal-card" style="max-width: 680px;">
        <button class="modal-close-btn" id="modal-track-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style="padding: 32px;">
          <span class="section-tag">Tra Cứu Trực Tuyến</span>
          <h2 style="font-size: 1.85rem; color: var(--color-primary); margin-bottom: 8px;">Theo Dõi Đơn Đặt Phòng</h2>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 24px;">
            Nhập Mã đặt phòng (ví dụ: <code>AUR-260324-1001</code>) hoặc Số điện thoại của bạn để kiểm tra tiến trình xác nhận và số phòng gán.
          </p>

          <!-- Ô Tìm Kiếm -->
          <div style="display: flex; gap: 10px; margin-bottom: 28px;">
            <input type="text" id="track-query-input" placeholder="Nhập mã AUR-... hoặc số điện thoại..." style="flex-grow: 1; padding: 12px 18px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.2); font-size: 1rem; outline: none;" />
            <button class="btn-pill btn-pill-gold" id="btn-do-track">
              Tra Cứu
            </button>
          </div>

          <!-- Kết Quả -->
          <div id="track-results-container">
            ${renderResultsHtml(searchResult)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderResultsHtml(results) {
  if (!results) {
    return `
      <div style="text-align: center; padding: 40px 20px; color: var(--color-text-light); background: var(--color-bg-subtle); border-radius: var(--radius-md);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; display: block;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Vui lòng nhập thông tin để tra cứu lịch trình lưu trú.
      </div>
    `;
  }

  if (results.length === 0) {
    return `
      <div style="text-align: center; padding: 30px; color: var(--color-accent-rose); background: #fee2e2; border-radius: var(--radius-md);">
        Không tìm thấy đơn đặt phòng nào phù hợp với từ khóa của bạn. Vui lòng kiểm tra lại mã hoặc số điện thoại.
      </div>
    `;
  }

  return results.map(booking => {
    const isCancelled = booking.status === 'cancelled';
    const canCancel = booking.status === 'confirmed' || booking.status === 'pending';

    const steps = [
      { key: 'pending', label: 'Tạo Đơn' },
      { key: 'confirmed', label: 'Đã Xác Nhận' },
      { key: 'checked_in', label: 'Đang Ở (Check-in)' },
      { key: 'checked_out', label: 'Hoàn Tất' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === booking.status);

    return `
      <div style="background: var(--color-bg-subtle); border: 1px solid rgba(11, 19, 43, 0.1); border-radius: var(--radius-md); padding: 22px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(11, 19, 43, 0.08); padding-bottom: 12px;">
          <div>
            <span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Mã Đơn:</span>
            <strong style="font-size: 1.15rem; color: var(--color-primary); letter-spacing: 0.04em;">${booking.booking_code}</strong>
          </div>
          <span class="status-badge ${booking.status}">
            ${booking.status.toUpperCase()}
          </span>
        </div>

        <!-- Tiến Trình Trực Quan (Stepper) -->
        ${!isCancelled ? `
          <div style="display: flex; justify-content: space-between; position: relative; margin: 24px 0 28px;">
            <div style="position: absolute; top: 14px; left: 10%; right: 10%; height: 2px; background: #cbd5e1; z-index: 1;"></div>
            ${steps.map((st, idx) => {
              const isPassed = currentStepIndex >= idx;
              return `
                <div style="position: relative; z-index: 2; text-align: center; flex: 1;">
                  <div style="width: 30px; height: 30px; border-radius: 50%; background: ${isPassed ? 'var(--color-secondary)' : '#e2e8f0'}; color: ${isPassed ? '#fff' : '#64748b'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; font-weight: 700; font-size: 0.8rem; box-shadow: ${isPassed ? 'var(--shadow-gold)' : 'none'};">
                    ${idx + 1}
                  </div>
                  <div style="font-size: 0.75rem; font-weight: 600; color: ${isPassed ? 'var(--color-primary)' : '#94a3b8'};">
                    ${st.label}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div style="padding: 12px; background: #fee2e2; color: #991b1b; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 16px;">
            ❌ Đơn đặt phòng này đã bị hủy. Phòng vật lý đã được giải phóng trên hệ thống.
          </div>
        `}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.88rem; margin-bottom: 16px;">
          <div>Khách hàng: <strong>${booking.customer_name}</strong></div>
          <div>Số điện thoại: <strong>${booking.customer_phone}</strong></div>
          <div>Hạng phòng: <strong>${booking.room_type_name || 'Deluxe'}</strong></div>
          <div>Số phòng gán: <strong style="color: var(--color-secondary-dark);">Phòng ${booking.room_number || 'Chờ lễ tân'}</strong></div>
          <div>Khoảng ngày: <span>${booking.check_in_date} ➔ ${booking.check_out_date} (${booking.total_nights} đêm)</span></div>
          <div>Tổng chi phí: <strong style="color: var(--color-primary);">${store.formatPrice(booking.total_amount)}</strong></div>
        </div>

        ${canCancel ? `
          <div style="text-align: right; border-top: 1px dashed rgba(11, 19, 43, 0.1); padding-top: 12px;">
            <button class="btn-cancel-booking" data-code="${booking.booking_code}" style="color: var(--color-accent-rose); font-size: 0.82rem; font-weight: 700; text-decoration: underline; background: none; border: none; cursor: pointer;">
              Hủy Giữ Chỗ Đơn Này
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

export function attachTrackBookingEvents() {
  const modal = document.getElementById('track-booking-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-track-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      searchResult = null;
      store.closeModal();
    };
  }

  const doTrack = () => {
    const input = document.getElementById('track-query-input');
    const q = input ? input.value : '';
    searchResult = store.lookupBooking(q);
    const container = document.getElementById('track-results-container');
    if (container) {
      container.innerHTML = renderResultsHtml(searchResult);
      attachItemCancelEvents();
    }
  };

  const trackBtn = document.getElementById('btn-do-track');
  if (trackBtn) {
    trackBtn.onclick = doTrack;
  }

  const queryInput = document.getElementById('track-query-input');
  if (queryInput) {
    queryInput.onkeyup = (e) => {
      if (e.key === 'Enter') doTrack();
    };
  }

  attachItemCancelEvents();
}

function attachItemCancelEvents() {
  document.querySelectorAll('.btn-cancel-booking').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.code;
      if (confirm(`Bạn có chắc chắn muốn hủy đơn đặt phòng [${code}] không? Phòng giữ chỗ sẽ được mở lại ngay lập tức.`)) {
        try {
          store.cancelBooking(code);
          alert('Đã hủy đặt phòng thành công!');
          searchResult = store.lookupBooking(code);
          const container = document.getElementById('track-results-container');
          if (container) {
            container.innerHTML = renderResultsHtml(searchResult);
          }
        } catch (e) {
          alert(e.message);
        }
      }
    };
  });
}
