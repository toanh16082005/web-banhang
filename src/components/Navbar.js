// src/components/Navbar.js
import { store } from '../store/state.js';

export function renderNavbar() {
  const isGuest = store.activeRole === 'guest';
  
  return `
    <header class="navbar">
      <div class="container nav-wrapper">
        <a href="#" class="brand-logo" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;">
          <div class="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div class="brand-title">
            <span>AURA STAY</span>
            <span class="brand-tagline">Resort & Luxury Hotel</span>
          </div>
        </a>

        <ul class="nav-links">
          <li><a href="#rooms-section" class="nav-link">Hạng Phòng</a></li>
          <li><a href="#highlights-section" class="nav-link">Dịch Vụ & Spa</a></li>
          <li><a href="#culinary-section" class="nav-link">Ẩm Thực</a></li>
          <li><a href="#footer-section" class="nav-link">Vị Trí & Liên Hệ</a></li>
        </ul>

        <div class="nav-actions">
          <!-- Nút Tra Cứu Đơn Đặt Phòng -->
          <button class="btn-pill btn-pill-ghost" id="nav-track-btn" title="Tra cứu tiến độ và mã đặt phòng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Tra Cứu Đơn
          </button>

          <!-- Nút Chuyển Đổi Vai Trò Guest <-> Admin / Lễ Tân -->
          <div class="role-switcher-badge" id="nav-role-switcher" title="Bấm để chuyển đổi giữa giao diện Khách hàng và Cổng Lễ tân / Quản trị">
            <span class="dot"></span>
            <span>${isGuest ? 'Cổng Lễ Tân & Admin' : 'Về Trang Đặt Phòng'}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function attachNavbarEvents() {
  const trackBtn = document.getElementById('nav-track-btn');
  if (trackBtn) {
    trackBtn.onclick = () => store.openModal('trackBooking');
  }

  const roleSwitcher = document.getElementById('nav-role-switcher');
  if (roleSwitcher) {
    roleSwitcher.onclick = () => {
      const nextRole = store.activeRole === 'guest' ? 'admin' : 'guest';
      store.setRole(nextRole);
    };
  }
}
