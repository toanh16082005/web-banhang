// src/components/HighlightsSection.js

export function renderHighlightsSection() {
  return `
    <section class="section-highlights" id="highlights-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Đặc Quyền Thượng Lưu</span>
          <h2 class="section-title">Trải Nghiệm Nghỉ Dưỡng Hoàn Hảo</h2>
          <p class="section-description">
            AURA STAY nâng niu từng khoảnh khắc của bạn với hệ thống dịch vụ chuẩn quốc tế, mang lại kỳ nghỉ trọn vẹn và an yên tuyệt đối.
          </p>
        </div>

        <div class="highlight-grid">
          <div class="highlight-card">
            <div class="highlight-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"></path>
                <path d="M2 17c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"></path>
              </svg>
            </div>
            <h4>Hồ Bơi Vô Cực View Biển</h4>
            <p>Hồ bơi tràn bờ nước mặn công nghệ điện phân muối khoáng, ngắm hoàng hôn rực rỡ bên ly cocktail mát lạnh.</p>
          </div>

          <div class="highlight-card">
            <div class="highlight-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            <h4>Ẩm Thực Biển 5 Sao</h4>
            <p>Bữa sáng buffet phong phú phong cách Âu - Á và thực đơn hải sản tươi sống đánh bắt trực tiếp trong ngày.</p>
          </div>

          <div class="highlight-card">
            <div class="highlight-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h4>AURA Spa & Trị Liệu</h4>
            <p>Liệu pháp massage đá nóng bazan và xông hơi tinh dầu tràm tự nhiên giúp giải tỏa mọi căng thẳng mệt mỏi.</p>
          </div>

          <div class="highlight-card">
            <div class="highlight-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h4>Đưa Đón Sân Bay Cao Cấp</h4>
            <p>Dịch vụ xe limousine đón tiễn tận sân bay chu đáo, nước uống và khăn lạnh phục vụ miễn phí suốt hành trình.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
