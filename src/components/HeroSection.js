// src/components/HeroSection.js
import { store } from '../store/state.js';

export function renderHeroSection() {
  const { checkIn, checkOut, adults, children } = store.searchParams;

  return `
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-subbadge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Khu Nghỉ Dưỡng 5 Sao Đẳng Cấp Quốc Tế
          </div>
          <h1 class="hero-title">
            Tuyệt Tác Nghỉ Dưỡng <br />
            <span>Bên Bờ Biển Ngọc</span>
          </h1>
          <p class="hero-subtitle">
            Hòa mình vào vẻ đẹp nguyên sơ của đại dương bao la, trải nghiệm dịch vụ quản gia cao cấp và ẩm thực tinh hoa cùng AURA STAY.
          </p>
        </div>
      </div>

      <!-- Khung Tìm Kiếm Phòng Trực Quan Gắn Chân Hero -->
      <div class="booking-bar-wrapper">
        <div class="container">
          <form class="booking-bar" id="hero-search-form">
            <!-- Ngày Nhận Phòng -->
            <div class="booking-item">
              <label class="booking-item-label" for="search-check-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Ngày Nhận Phòng
              </label>
              <input type="date" id="search-check-in" value="${checkIn}" required />
            </div>

            <!-- Ngày Trả Phòng -->
            <div class="booking-item">
              <label class="booking-item-label" for="search-check-out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Ngày Trả Phòng
              </label>
              <input type="date" id="search-check-out" value="${checkOut}" required />
            </div>

            <!-- Người Lớn -->
            <div class="booking-item">
              <label class="booking-item-label" for="search-adults">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Người Lớn
              </label>
              <select id="search-adults">
                <option value="1" ${adults == 1 ? 'selected' : ''}>1 Người lớn</option>
                <option value="2" ${adults == 2 ? 'selected' : ''}>2 Người lớn</option>
                <option value="3" ${adults == 3 ? 'selected' : ''}>3 Người lớn</option>
                <option value="4" ${adults == 4 ? 'selected' : ''}>4 Người lớn</option>
                <option value="6" ${adults == 6 ? 'selected' : ''}>6 Người lớn (Villa)</option>
              </select>
            </div>

            <!-- Trẻ Em -->
            <div class="booking-item">
              <label class="booking-item-label" for="search-children">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M9 21v-2a4 4 0 0 1 3-3.87"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Trẻ Em (< 12 tuổi)
              </label>
              <select id="search-children">
                <option value="0" ${children == 0 ? 'selected' : ''}>0 Trẻ em</option>
                <option value="1" ${children == 1 ? 'selected' : ''}>1 Trẻ em</option>
                <option value="2" ${children == 2 ? 'selected' : ''}>2 Trẻ em</option>
                <option value="3" ${children == 3 ? 'selected' : ''}>3 Trẻ em</option>
              </select>
            </div>

            <!-- Nút Tìm Kiếm -->
            <button type="submit" class="btn-search-rooms" id="hero-submit-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Tìm Phòng Trống</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
}

export function attachHeroEvents() {
  const form = document.getElementById('hero-search-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const checkIn = document.getElementById('search-check-in').value;
      const checkOut = document.getElementById('search-check-out').value;
      const adults = document.getElementById('search-adults').value;
      const children = document.getElementById('search-children').value;

      if (checkOut <= checkIn) {
        alert('Ngày trả phòng (Check-out) phải sau ngày nhận phòng (Check-in) ít nhất 1 ngày!');
        return;
      }

      store.setSearchParams({ checkIn, checkOut, adults, children });

      const roomsSec = document.getElementById('rooms-section');
      if (roomsSec) {
        roomsSec.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }
}
