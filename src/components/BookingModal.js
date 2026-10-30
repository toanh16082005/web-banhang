// src/components/BookingModal.js
import { store } from '../store/state.js';

let appliedPromoCode = '';
let newlyCreatedBooking = null;

export function renderBookingModal() {
  const room = store.selectedRoomType;
  if (!room) return '';

  const { checkIn, checkOut, adults, children } = store.searchParams;
  const pricing = store.calculatePriceBreakdown(room, checkIn, checkOut, appliedPromoCode);

  return `
    <div class="modal-overlay ${store.activeModal === 'booking' ? 'active' : ''}" id="booking-modal">
      <div class="modal-card" style="max-width: 850px;">
        <button class="modal-close-btn" id="modal-booking-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style="padding: 32px;" id="booking-modal-body">
          ${newlyCreatedBooking ? renderBookingSuccessState(newlyCreatedBooking) : renderBookingFormState(room, checkIn, checkOut, adults, children, pricing)}
        </div>
      </div>
    </div>
  `;
}

function renderBookingFormState(room, checkIn, checkOut, adults, children, pricing) {
  return `
    <div style="border-bottom: 1px solid rgba(11, 19, 43, 0.08); padding-bottom: 20px; margin-bottom: 24px;">
      <span class="section-tag">Thủ Tục Giữ Phòng Trực Tuyến</span>
      <h2 style="font-size: 1.85rem; color: var(--color-primary); margin-bottom: 4px;">Đặt Phòng: ${room.name}</h2>
      <p style="font-size: 0.9rem; color: var(--color-text-muted);">
        Khoảng ngày: <strong>${checkIn}</strong> ➔ <strong>${checkOut}</strong> (${pricing.totalNights} đêm) • ${adults} người lớn, ${children} trẻ em
      </p>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px;">
      <!-- Cột Trái: Thông Tin Khách Hàng -->
      <form id="booking-checkout-form">
        <h4 style="font-size: 1.1rem; color: var(--color-primary); margin-bottom: 16px;">1. Thông Tin Khách Lưu Trú</h4>
        
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--color-text-main);">
              Họ Và Tên Khách Hàng *
            </label>
            <input type="text" id="cust-name" required placeholder="Ví dụ: Nguyễn Văn Chiến" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.15); outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--color-text-main);">
                Số Điện Thoại *
              </label>
              <input type="tel" id="cust-phone" required placeholder="0988123456" pattern="[0-9]{10}" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.15); outline: none;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--color-text-main);">
                Email Xác Nhận *
              </label>
              <input type="email" id="cust-email" required placeholder="khach@example.com" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.15); outline: none;" />
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--color-text-main);">
              Số CCCD / Hộ Chiếu (Để khai báo tạm trú nhanh)
            </label>
            <input type="text" id="cust-id-card" placeholder="00120100xxxx" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.15); outline: none;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--color-text-main);">
              Yêu Cầu Đặc Biệt (Tùy chọn)
            </label>
            <textarea id="cust-requests" rows="2" placeholder="Ví dụ: Tầng cao, giường phụ, xe đón sân bay lúc 13h..." style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.15); outline: none;"></textarea>
          </div>
        </div>

        <h4 style="font-size: 1.1rem; color: var(--color-primary); margin-bottom: 14px;">2. Phương Thức Thanh Toán</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
          <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid rgba(11, 19, 43, 0.12); border-radius: var(--radius-sm); cursor: pointer; background: var(--color-bg-subtle);">
            <input type="radio" name="payment_method" value="BANK_TRANSFER_QR" checked />
            <div>
              <div style="font-weight: 700; font-size: 0.92rem;">Chuyển Khoản Ngân Hàng Tự Động (VietQR)</div>
              <div style="font-size: 0.78rem; color: var(--color-text-muted);">Quét mã QR qua app ngân hàng, hệ thống xác nhận thanh toán tức thì.</div>
            </div>
          </label>

          <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid rgba(11, 19, 43, 0.12); border-radius: var(--radius-sm); cursor: pointer; background: var(--color-bg-subtle);">
            <input type="radio" name="payment_method" value="PAY_AT_CHECKIN" />
            <div>
              <div style="font-weight: 700; font-size: 0.92rem;">Thanh Toán Tại Quầy Khi Nhận Phòng</div>
              <div style="font-size: 0.78rem; color: var(--color-text-muted);">Trả tiền mặt hoặc quẹt thẻ POS khi làm thủ tục check-in tại lễ tân.</div>
            </div>
          </label>
        </div>

        <button type="submit" class="btn-pill btn-pill-gold" style="width: 100%; justify-content: center; padding: 16px; font-size: 1.05rem; font-weight: 700;">
          Xác Nhận Đặt Phòng (Khóa Phòng Ngay)
        </button>
      </form>

      <!-- Cột Phải: Bảng Kê Chi Phí & Mã Giảm Giá -->
      <div>
        <div style="background: var(--color-bg-subtle); padding: 22px; border-radius: var(--radius-md); border: 1px solid rgba(11, 19, 43, 0.08);">
          <h4 style="font-size: 1.1rem; color: var(--color-primary); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(11, 19, 43, 0.1);">
            Bảng Kê Chi Tiết Chi Phí
          </h4>

          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem; margin-bottom: 16px;">
            ${pricing.nightlyDetails.map((night, i) => `
              <div style="display: flex; justify-content: space-between;">
                <span>Đêm ${i + 1} (${night.date}) <small style="color: var(--color-secondary-dark);">${night.note}</small></span>
                <strong>${store.formatPrice(night.rate)}</strong>
              </div>
            `).join('')}

            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px dashed rgba(11, 19, 43, 0.1);">
              <span>Tạm tính tiền phòng:</span>
              <strong>${store.formatPrice(pricing.subtotal)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between;">
              <span>Phí dịch vụ resort (5%):</span>
              <strong>${store.formatPrice(pricing.serviceFee)}</strong>
            </div>

            ${pricing.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: var(--color-accent-rose); font-weight: 700;">
                <span>Mã giảm giá (${pricing.promoLabel}):</span>
                <span>-${store.formatPrice(pricing.discount)}</span>
              </div>
            ` : ''}
          </div>

          <!-- Nhập Mã Giảm Giá -->
          <div style="display: flex; gap: 8px; margin-bottom: 20px;">
            <input type="text" id="promo-input" value="${appliedPromoCode}" placeholder="Mã: AURASTAY2026" style="flex-grow: 1; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(11, 19, 43, 0.15); font-size: 0.85rem; text-transform: uppercase;" />
            <button type="button" id="apply-promo-btn" style="padding: 8px 14px; background: var(--color-primary); color: #fff; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600;">
              Áp Dụng
            </button>
          </div>

          <!-- Tổng Cộng Cuối Cùng -->
          <div style="background: #fff; padding: 14px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--color-secondary);">
            <div>
              <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;">Tổng Thanh Toán</span>
              <div style="font-size: 1.45rem; font-weight: 800; color: var(--color-primary);">
                ${store.formatPrice(pricing.finalTotal)}
              </div>
            </div>
            <span style="font-size: 0.75rem; background: #d1fae5; color: #065f46; font-weight: 700; padding: 4px 8px; border-radius: var(--radius-full);">
              Giá Đã Gồm Thuế
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBookingSuccessState(booking) {
  const isQr = booking.payment_method === 'BANK_TRANSFER_QR';
  const qrUrl = `https://api.vietqr.io/image/970422-0988123456-compact.png?amount=${booking.total_amount}&addInfo=${booking.booking_code}&accountName=AURA%20STAY%20RESORT`;

  return `
    <div style="text-align: center; padding: 20px 0;">
      <div style="width: 72px; height: 72px; background: #d1fae5; color: #065f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <span class="section-tag" style="color: var(--color-accent-emerald);">Đặt Phòng Thành Công!</span>
      <h2 style="font-size: 2.2rem; color: var(--color-primary); margin-bottom: 8px;">Cảm Ơn Quý Khách ${booking.customer_name}</h2>
      <p style="font-size: 1rem; color: var(--color-text-muted); max-width: 550px; margin: 0 auto 24px;">
        Hệ thống AURA STAY đã ghi nhận và khóa phòng vật lý số <strong>${booking.room_number}</strong> cho quý khách.
      </p>

      <div style="background: var(--color-bg-subtle); max-width: 500px; margin: 0 auto 28px; padding: 20px; border-radius: var(--radius-md); text-align: left; border: 1px dashed var(--color-secondary);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--color-text-muted);">Mã đặt phòng:</span>
          <strong style="color: var(--color-primary); font-size: 1.1rem; letter-spacing: 0.05em;">${booking.booking_code}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--color-text-muted);">Hạng phòng:</span>
          <strong>${booking.room_type_name}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--color-text-muted);">Thời gian lưu trú:</span>
          <span>${booking.check_in_date} ➔ ${booking.check_out_date} (${booking.total_nights} đêm)</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--color-text-muted);">Số phòng gán:</span>
          <strong style="color: var(--color-secondary-dark);">Phòng ${booking.room_number}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(11, 19, 43, 0.1);">
          <span style="color: var(--color-text-muted);">Tổng số tiền:</span>
          <strong style="font-size: 1.2rem; color: var(--color-primary);">${store.formatPrice(booking.total_amount)}</strong>
        </div>
      </div>

      ${isQr ? `
        <div style="background: #fff; border: 2px solid var(--color-secondary); border-radius: var(--radius-md); padding: 20px; max-width: 380px; margin: 0 auto 28px; box-shadow: var(--shadow-sm);">
          <h4 style="font-size: 1rem; color: var(--color-primary); margin-bottom: 6px;">Mã QR Chuyển Khoản Tự Động</h4>
          <p style="font-size: 0.78rem; color: var(--color-text-muted); margin-bottom: 12px;">Mở ứng dụng ngân hàng và quét mã để thanh toán ngay:</p>
          <img src="${qrUrl}" alt="VietQR" style="width: 220px; height: 220px; margin: 0 auto 10px; border: 1px solid #e2e8f0; border-radius: 8px;" />
          <div style="font-size: 0.8rem; color: var(--color-text-main);">
            Ngân hàng: <strong>MBBank</strong> • STK: <strong>0988123456</strong><br/>
            Nội dung: <strong>${booking.booking_code}</strong>
          </div>
        </div>
      ` : ''}

      <div style="display: flex; justify-content: center; gap: 14px;">
        <button class="btn-pill btn-pill-ghost" id="success-track-btn">
          Xem Tiến Trình Đặt Phòng
        </button>
        <button class="btn-pill btn-pill-gold" id="success-done-btn">
          Hoàn Tất
        </button>
      </div>
    </div>
  `;
}

export function attachBookingEvents() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-booking-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      newlyCreatedBooking = null;
      appliedPromoCode = '';
      store.closeModal();
    };
  }

  // Áp dụng mã giảm giá
  const promoBtn = document.getElementById('apply-promo-btn');
  if (promoBtn) {
    promoBtn.onclick = () => {
      const input = document.getElementById('promo-input');
      appliedPromoCode = input ? input.value : '';
      store.notify();
    };
  }

  // Submit đặt phòng
  const form = document.getElementById('booking-checkout-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      try {
        const customerName = document.getElementById('cust-name').value;
        const customerPhone = document.getElementById('cust-phone').value;
        const customerEmail = document.getElementById('cust-email').value;
        const customerIdentity = document.getElementById('cust-id-card').value;
        const specialRequests = document.getElementById('cust-requests').value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'PAY_AT_CHECKIN';

        const newBooking = store.createBooking({
          roomTypeId: store.selectedRoomType.id,
          checkIn: store.searchParams.checkIn,
          checkOut: store.searchParams.checkOut,
          customerName,
          customerPhone,
          customerEmail,
          customerIdentity,
          specialRequests,
          paymentMethod,
          promoCode: appliedPromoCode
        });

        newlyCreatedBooking = newBooking;
        store.notify();
      } catch (err) {
        alert(err.message);
      }
    };
  }

  // Nút sau khi thành công
  const successTrack = document.getElementById('success-track-btn');
  if (successTrack) {
    successTrack.onclick = () => {
      const code = newlyCreatedBooking?.booking_code;
      newlyCreatedBooking = null;
      appliedPromoCode = '';
      store.openModal('trackBooking');
      setTimeout(() => {
        const trackInput = document.getElementById('track-query-input');
        if (trackInput && code) {
          trackInput.value = code;
          trackInput.dispatchEvent(new Event('input'));
        }
      }, 100);
    };
  }

  const successDone = document.getElementById('success-done-btn');
  if (successDone) {
    successDone.onclick = () => {
      newlyCreatedBooking = null;
      appliedPromoCode = '';
      store.closeModal();
    };
  }
}
