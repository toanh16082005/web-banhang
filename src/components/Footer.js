// src/components/Footer.js

export function renderFooter() {
  return `
    <footer class="footer" id="footer-section">
      <div class="container">
        <div class="footer-grid">
          <!-- Cột Thương Hiệu -->
          <div class="footer-brand">
            <h3>AURA STAY RESORT</h3>
            <p style="font-size: 0.95rem; line-height: 1.7; margin-bottom: 20px;">
              Khu nghỉ dưỡng biển 5 sao tiêu chuẩn quốc tế. Nơi giao hòa giữa thiên nhiên nguyên sơ, kiến trúc tinh hoa và lòng hiếu khách chân thành của người Việt.
            </p>
            <div style="font-size: 0.85rem; color: var(--color-secondary-light);">
              🏆 Giải Thưởng World Luxury Hotel Awards 2025 - Best Beachfront Luxury Resort
            </div>
          </div>

          <!-- Cột Hạng Phòng -->
          <div class="footer-column">
            <h4>Hạng Phòng</h4>
            <ul class="footer-links">
              <li><a href="#rooms-section">Deluxe Ocean View</a></li>
              <li><a href="#rooms-section">Grand Executive Suite</a></li>
              <li><a href="#rooms-section">Beachfront Pool Villa</a></li>
              <li><a href="#rooms-section">Presidential Penthouse</a></li>
              <li><a href="#rooms-section">Zen Garden Bungalow</a></li>
            </ul>
          </div>

          <!-- Cột Tiện Ích & Dịch Vụ -->
          <div class="footer-column">
            <h4>Dịch Vụ</h4>
            <ul class="footer-links">
              <li><a href="#highlights-section">Hồ Bơi Vô Cực Nước Mặn</a></li>
              <li><a href="#highlights-section">AURA Herbal Spa & Sauna</a></li>
              <li><a href="#highlights-section">Nhà Hàng Ẩm Thực Biển</a></li>
              <li><a href="#highlights-section">Đưa Đón Sân Bay Limousine</a></li>
              <li><a href="#highlights-section">Tiệc Cưới Bãi Biển Lãng Mạn</a></li>
            </ul>
          </div>

          <!-- Cột Liên Hệ -->
          <div class="footer-column">
            <h4>Liên Hệ & Đặt Phòng</h4>
            <p style="font-size: 0.88rem; line-height: 1.8; margin-bottom: 12px;">
              📍 Bãi Dài, Bán Đảo Cam Ranh, Khánh Hòa, Việt Nam<br/>
              📞 Hotline đặt phòng: <strong>1900 8899 (24/7)</strong><br/>
              ✉️ Email: <strong>reservation@aurastay.vn</strong><br/>
              ⏰ Giờ nhận phòng: 14:00 • Giờ trả phòng: 12:00
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 AURA STAY Resort & Spa. Bản quyền thuộc về Hệ thống Đặt Phòng AURA STAY. Vận hành trên nền tảng Cloudflare Edge & AI Concierge.</p>
        </div>
      </div>
    </footer>
  `;
}
