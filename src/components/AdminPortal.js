// src/components/AdminPortal.js
import { store } from '../store/state.js';

let activeRoomAction = null;

export function renderAdminPortal() {
  const kpis = store.getDashboardKPIs();
  const subTab = store.adminSubTab;

  return `
    <div class="admin-view-container">
      <div class="container">
        <!-- Header Quản Trị & Lễ Tân -->
        <div class="admin-header-card">
          <div class="admin-header-info">
            <span class="section-tag" style="color: var(--color-secondary-light); margin-bottom: 4px;">Hệ Thống Quản Trị Khách Sạn & Lễ Tân</span>
            <h2>AURA STAY - Cổng Điều Hành Tập Trung</h2>
            <p>Trực ban Lễ tân & Quản trị: <strong>Lê Đức Hạnh</strong> • Trạng thái hệ thống: <span style="color: #4ade80;">● Đang kết nối Cloudflare D1</span></p>
          </div>

          <!-- Các Phân Hệ Quản Trị -->
          <div class="admin-nav-tabs">
            <button class="admin-nav-tab ${subTab === 'matrix' ? 'active' : ''}" data-tab="matrix">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Sơ Đồ Phòng
            </button>
            <button class="admin-nav-tab ${subTab === 'bookings' ? 'active' : ''}" data-tab="bookings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Quản Lý Booking (${store.bookings.length})
            </button>
            <button class="admin-nav-tab ${subTab === 'pricing' ? 'active' : ''}" data-tab="pricing">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Biểu Giá Động
            </button>
            <button class="admin-nav-tab ${subTab === 'kpi' ? 'active' : ''}" data-tab="kpi">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Báo Cáo KPI
            </button>
          </div>
        </div>

        <!-- 4 Thẻ KPI Tóm Tắt Nhanh -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-card-label">Doanh Thu Thực Tế</div>
            <div class="kpi-card-value">${store.formatPrice(kpis.totalRevenue)}</div>
            <div class="kpi-card-sub">▲ Tăng 18.5% so với tháng trước</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-label">Công Suất Phòng (Occupancy)</div>
            <div class="kpi-card-value">${kpis.occupancyRate}%</div>
            <div class="kpi-card-sub">${kpis.occupiedRooms + kpis.reservedRooms} / ${kpis.totalRooms} phòng đang hoạt động</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-label">Phòng Sạch Đón Khách</div>
            <div class="kpi-card-value" style="color: var(--color-accent-emerald);">${kpis.cleanRooms}</div>
            <div class="kpi-card-sub">Sẵn sàng nhận khách ngay</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-label">Phòng Cần Dọn Dẹp (Dirty)</div>
            <div class="kpi-card-value" style="color: var(--color-accent-rose);">${kpis.dirtyRooms}</div>
            <div class="kpi-card-sub">Khách vừa trả phòng</div>
          </div>
        </div>

        <!-- Nội Dung Sub-tab Hiện Tại -->
        ${renderSubTabContent(subTab, kpis)}
      </div>

      <!-- Modal Thao Tác Nhanh Phòng Vật Lý (Lễ Tân 1 Chạm) -->
      ${renderRoomActionModal()}
    </div>
  `;
}

function renderSubTabContent(subTab, kpis) {
  if (subTab === 'matrix') {
    return renderRoomMatrixTab();
  }
  if (subTab === 'bookings') {
    return renderBookingsTab();
  }
  if (subTab === 'pricing') {
    return renderPricingTab();
  }
  if (subTab === 'kpi') {
    return renderKpiReportTab(kpis);
  }
  return '';
}

// 1. Phân Hệ Sơ Đồ Ma Trận Phòng (Room Matrix)
function renderRoomMatrixTab() {
  const floors = [
    { title: 'Tầng 1 - Hạng Phòng Deluxe View Biển', rooms: store.rooms.filter(r => r.floor === 1) },
    { title: 'Tầng 2 - Grand Executive Suite & Honeymoon', rooms: store.rooms.filter(r => r.floor === 2) },
    { title: 'Khu Biệt Thự Biệt Lập (Beachfront Villas & Bungalow)', rooms: store.rooms.filter(r => r.floor === 0) },
    { title: 'Tầng 3 (Tầng Thượng) - Presidential Penthouse', rooms: store.rooms.filter(r => r.floor === 3) }
  ];

  return `
    <div class="matrix-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="font-size: 1.4rem; color: var(--color-primary);">Sơ Đồ Tình Trạng Phòng Thực Tế (Room Matrix)</h3>
        <span style="font-size: 0.85rem; color: var(--color-text-muted);">Bấm vào từng phòng để thao tác Check-in, Check-out hoặc Đổi trạng thái dọn dẹp</span>
      </div>

      <!-- Chú Thích Màu Sắc -->
      <div class="matrix-legend">
        <div class="legend-item"><span class="legend-badge badge-clean"></span> Sạch / Sẵn sàng (${store.rooms.filter(r => r.status === 'clean').length})</div>
        <div class="legend-item"><span class="legend-badge badge-occupied"></span> Đang có khách ở (${store.rooms.filter(r => r.status === 'occupied').length})</div>
        <div class="legend-item"><span class="legend-badge badge-reserved"></span> Đã đặt trước (${store.rooms.filter(r => r.status === 'reserved').length})</div>
        <div class="legend-item"><span class="legend-badge badge-dirty"></span> Cần dọn dẹp (${store.rooms.filter(r => r.status === 'dirty').length})</div>
        <div class="legend-item"><span class="legend-badge badge-maintenance"></span> Đang bảo trì (${store.rooms.filter(r => r.status === 'maintenance').length})</div>
      </div>

      <!-- Danh Sách Theo Tầng -->
      ${floors.map(fl => `
        <div class="floor-group">
          <h4 class="floor-title">${fl.title}</h4>
          <div class="room-matrix-grid">
            ${fl.rooms.map(room => {
              const type = store.roomTypes.find(t => t.id === room.room_type_id);
              return `
                <div class="matrix-room-cell ${room.status}" data-room-id="${room.id}">
                  <div class="room-cell-top">
                    <span class="room-cell-number">${room.room_number}</span>
                    <span class="room-cell-status-pill">${room.status}</span>
                  </div>
                  <div class="room-cell-type">${type ? type.name : 'Phòng'}</div>
                  <div class="room-cell-guest">
                    ${room.guest_name ? `👤 ${room.guest_name}` : '• Trống'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 2. Phân Hệ Quản Lý Đơn Đặt Phòng (Bookings Management)
function renderBookingsTab() {
  return `
    <div class="data-table-card">
      <div class="table-toolbar">
        <div>
          <h3 style="font-size: 1.25rem; color: var(--color-primary); margin-bottom: 4px;">Danh Sách Toàn Bộ Đơn Đặt Phòng</h3>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">Kiểm soát State Machine: pending ➔ confirmed ➔ checked_in ➔ checked_out</p>
        </div>
      </div>

      <div class="table-responsive">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Mã Booking</th>
              <th>Khách Hàng</th>
              <th>Số Điện Thoại</th>
              <th>Hạng Phòng</th>
              <th>Số Phòng</th>
              <th>Thời Gian</th>
              <th>Tổng Tiền</th>
              <th>Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            ${store.bookings.map(b => `
              <tr>
                <td><strong>${b.booking_code}</strong></td>
                <td>${b.customer_name}</td>
                <td>${b.customer_phone}</td>
                <td>${b.room_type_name || 'Deluxe'}</td>
                <td><strong style="color: var(--color-secondary-dark);">${b.room_number || '-'}</strong></td>
                <td>${b.check_in_date} ➔ ${b.check_out_date} (${b.total_nights}đ)</td>
                <td><strong>${store.formatPrice(b.total_amount)}</strong></td>
                <td>
                  <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; ${b.payment_status === 'paid' ? 'background: #d1fae5; color: #065f46;' : 'background: #fee2e2; color: #991b1b;'}">
                    ${b.payment_status === 'paid' ? 'Đã Thanh Toán' : 'Chưa Trả'}
                  </span>
                </td>
                <td>
                  <span class="status-badge ${b.status}">${b.status}</span>
                </td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    ${b.status === 'confirmed' ? `
                      <button class="btn-action-status" data-id="${b.id}" data-status="checked_in" style="padding: 4px 8px; background: #10b981; color: #fff; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                        Check-in
                      </button>
                    ` : ''}
                    ${b.status === 'checked_in' ? `
                      <button class="btn-action-status" data-id="${b.id}" data-status="checked_out" style="padding: 4px 8px; background: #3b82f6; color: #fff; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                        Check-out
                      </button>
                    ` : ''}
                    ${b.status !== 'cancelled' && b.status !== 'checked_out' ? `
                      <button class="btn-action-status" data-id="${b.id}" data-status="cancelled" style="padding: 4px 8px; background: #ef4444; color: #fff; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                        Hủy Đơn
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 3. Phân Hệ Quản Lý Biểu Giá Động (Dynamic Pricing)
function renderPricingTab() {
  return `
    <div class="matrix-section">
      <h3 style="font-size: 1.3rem; color: var(--color-primary); margin-bottom: 12px;">Cấu Hình Biểu Giá Linh Hoạt (Zero-Trust Dynamic Pricing)</h3>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 24px;">
        Hệ thống tự động áp dụng công thức tính giá theo lịch ngày trong tuần và các dịp lễ lớn, ngăn chặn can thiệp giá từ client.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div style="background: var(--color-bg-subtle); padding: 20px; border-radius: var(--radius-md); border: 1px solid rgba(11, 19, 43, 0.08);">
          <h4 style="color: var(--color-primary); margin-bottom: 12px;">Quy Tắc Phụ Thu Cuối Tuần</h4>
          <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 16px;">Tự động nhân hệ số 1.15 (+15%) vào các đêm Thứ Sáu và Thứ Bảy.</p>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 12px 16px; border-radius: var(--radius-sm);">
            <strong>Trạng thái phụ thu cuối tuần:</strong>
            <span style="color: #10b981; font-weight: 700;">● Đang Bật (+15%)</span>
          </div>
        </div>

        <div style="background: var(--color-bg-subtle); padding: 20px; border-radius: var(--radius-md); border: 1px solid rgba(11, 19, 43, 0.08);">
          <h4 style="color: var(--color-primary); margin-bottom: 12px;">Mã Khuyến Mãi Hoạt Động</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
            <div style="background: #fff; padding: 10px 14px; border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>Mã <code>AURASTAY2026</code></span>
              <strong style="color: var(--color-secondary-dark);">Giảm 10%</strong>
            </div>
            <div style="background: #fff; padding: 10px 14px; border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>Mã <code>LUXURY500K</code></span>
              <strong style="color: var(--color-secondary-dark);">Giảm 500.000₫ (Đơn >= 4Tr)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 4. Phân Hệ Báo Cáo KPI
function renderKpiReportTab(kpis) {
  return `
    <div class="matrix-section">
      <h3 style="font-size: 1.3rem; color: var(--color-primary); margin-bottom: 20px;">Phân Tích Chỉ Số Kinh Doanh Khách Sạn</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
        <div style="background: var(--color-bg-subtle); padding: 20px; border-radius: var(--radius-md);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600;">GIÁ PHÒNG BÌNH QUÂN (ADR)</div>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary); margin-top: 6px;">
            ${store.formatPrice(Math.round(kpis.totalRevenue / (kpis.totalBookings || 1)))}
          </div>
        </div>
        <div style="background: var(--color-bg-subtle); padding: 20px; border-radius: var(--radius-md);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600;">REVPAR (DOANH THU TRÊN PHÒNG SẴN CÓ)</div>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary); margin-top: 6px;">
            ${store.formatPrice(Math.round(kpis.totalRevenue / kpis.totalRooms))}
          </div>
        </div>
        <div style="background: var(--color-bg-subtle); padding: 20px; border-radius: var(--radius-md);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600;">TỔNG SỐ LƯỢT ĐẶT PHÒNG</div>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-secondary-dark); margin-top: 6px;">
            ${kpis.totalBookings} đơn
          </div>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 20px;">
        <h4 style="margin-bottom: 12px; font-size: 1rem; color: var(--color-primary);">Biểu Đồ Tỷ Lệ Lấp Đầy Theo Trạng Thái Phòng</h4>
        <div style="height: 24px; border-radius: 12px; background: #e2e8f0; overflow: hidden; display: flex;">
          <div style="width: ${(kpis.occupiedRooms / kpis.totalRooms) * 100}%; background: var(--color-accent-amber);" title="Occupied"></div>
          <div style="width: ${(kpis.reservedRooms / kpis.totalRooms) * 100}%; background: var(--color-accent-blue);" title="Reserved"></div>
          <div style="width: ${(kpis.cleanRooms / kpis.totalRooms) * 100}%; background: var(--color-accent-emerald);" title="Clean"></div>
          <div style="width: ${(kpis.dirtyRooms / kpis.totalRooms) * 100}%; background: var(--color-accent-rose);" title="Dirty"></div>
        </div>
        <div style="display: flex; gap: 20px; font-size: 0.78rem; margin-top: 10px; color: var(--color-text-muted);">
          <span>🟡 Đang ở: ${kpis.occupiedRooms}</span>
          <span>🔵 Đã đặt: ${kpis.reservedRooms}</span>
          <span>🟢 Sạch: ${kpis.cleanRooms}</span>
          <span>🔴 Cần dọn: ${kpis.dirtyRooms}</span>
        </div>
      </div>
    </div>
  `;
}

function renderRoomActionModal() {
  if (!activeRoomAction) return '';
  const room = activeRoomAction;
  const type = store.roomTypes.find(t => t.id === room.room_type_id);

  return `
    <div class="modal-overlay active" id="room-action-modal">
      <div class="modal-card" style="max-width: 480px; padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <span class="section-tag">Thao Tác Lễ Tân</span>
            <h3 style="font-size: 1.6rem; color: var(--color-primary);">Phòng ${room.room_number}</h3>
            <span style="font-size: 0.88rem; color: var(--color-text-muted);">${type ? type.name : ''}</span>
          </div>
          <span class="room-cell-status-pill" style="font-size: 0.85rem; padding: 6px 12px;">${room.status}</span>
        </div>

        <p style="font-size: 0.9rem; color: var(--color-text-main); margin-bottom: 20px;">
          Khách hiện tại: <strong>${room.guest_name || 'Không có khách'}</strong>
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
          <button class="btn-pill" id="action-set-clean" style="background: #10b981; color: #fff; justify-content: center;">
            ✔ Đánh Dấu Phòng Đã Dọn Sạch (Clean)
          </button>
          <button class="btn-pill" id="action-set-dirty" style="background: #ef4444; color: #fff; justify-content: center;">
            🧹 Đánh Dấu Cần Dọn Dẹp (Dirty)
          </button>
          <button class="btn-pill" id="action-set-maintenance" style="background: #64748b; color: #fff; justify-content: center;">
            🔧 Đang Bảo Trì Thiết Bị (Maintenance)
          </button>
        </div>

        <button class="btn-pill btn-pill-ghost" id="action-close-modal" style="width: 100%; justify-content: center;">
          Đóng
        </button>
      </div>
    </div>
  `;
}

export function attachAdminPortalEvents() {
  // Đổi sub-tab
  document.querySelectorAll('.admin-nav-tab').forEach(btn => {
    btn.onclick = () => {
      store.setAdminSubTab(btn.dataset.tab);
    };
  });

  // Bấm vào ô phòng ma trận
  document.querySelectorAll('.matrix-room-cell').forEach(cell => {
    cell.onclick = () => {
      const roomId = Number(cell.dataset.roomId);
      activeRoomAction = store.rooms.find(r => r.id === roomId);
      store.notify();
    };
  });

  // Duyệt trạng thái đơn booking
  document.querySelectorAll('.btn-action-status').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const status = btn.dataset.status;
      store.updateBookingStatus(id, status);
    };
  });

  // Sự kiện trong modal phòng
  const cleanBtn = document.getElementById('action-set-clean');
  if (cleanBtn && activeRoomAction) {
    cleanBtn.onclick = () => {
      store.updatePhysicalRoomStatus(activeRoomAction.id, 'clean');
      activeRoomAction = null;
      store.notify();
    };
  }

  const dirtyBtn = document.getElementById('action-set-dirty');
  if (dirtyBtn && activeRoomAction) {
    dirtyBtn.onclick = () => {
      store.updatePhysicalRoomStatus(activeRoomAction.id, 'dirty');
      activeRoomAction = null;
      store.notify();
    };
  }

  const maintBtn = document.getElementById('action-set-maintenance');
  if (maintBtn && activeRoomAction) {
    maintBtn.onclick = () => {
      store.updatePhysicalRoomStatus(activeRoomAction.id, 'maintenance');
      activeRoomAction = null;
      store.notify();
    };
  }

  const closeActionBtn = document.getElementById('action-close-modal');
  if (closeActionBtn) {
    closeActionBtn.onclick = () => {
      activeRoomAction = null;
      store.notify();
    };
  }
}
