// src/main.js
// Stylesheet is linked directly via <link rel="stylesheet" href="/src/styles/main.css"> in index.html
import { store } from './store/state.js';
import { renderNavbar, attachNavbarEvents } from './components/Navbar.js';
import { renderHeroSection, attachHeroEvents } from './components/HeroSection.js';
import { renderRoomCatalog, attachRoomCatalogEvents } from './components/RoomCatalog.js';
import { renderHighlightsSection } from './components/HighlightsSection.js';
import { renderRoomDetailModal, attachRoomDetailEvents } from './components/RoomDetailModal.js';
import { renderBookingModal, attachBookingEvents } from './components/BookingModal.js';
import { renderTrackBookingModal, attachTrackBookingEvents } from './components/TrackBookingModal.js';
import { renderAdminPortal, attachAdminPortalEvents } from './components/AdminPortal.js';
import { renderConciergeChatbot, attachConciergeChatbotEvents } from './components/ConciergeChatbot.js';
import { renderFooter } from './components/Footer.js';

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const isGuest = store.activeRole === 'guest';

  app.innerHTML = `
    ${renderNavbar()}
    
    <main>
      ${isGuest ? `
        ${renderHeroSection()}
        ${renderRoomCatalog()}
        ${renderHighlightsSection()}
      ` : `
        ${renderAdminPortal()}
      `}
    </main>

    ${renderFooter()}

    <!-- Modals -->
    ${renderRoomDetailModal()}
    ${renderBookingModal()}
    ${renderTrackBookingModal()}

    <!-- AI Concierge Chatbot Widget (luôn hiển thị thường trực) -->
    ${renderConciergeChatbot()}
  `;

  // Gắn sự kiện (Events)
  attachNavbarEvents();
  if (isGuest) {
    attachHeroEvents();
    attachRoomCatalogEvents();
  } else {
    attachAdminPortalEvents();
  }
  attachRoomDetailEvents();
  attachBookingEvents();
  attachTrackBookingEvents();
  attachConciergeChatbotEvents();
}

// Lắng nghe thay đổi trạng thái từ Reactive Store
store.subscribe(() => {
  renderApp();
});

// Khởi chạy ứng dụng lần đầu
renderApp();
console.log('🌟 AURA STAY Resort & Hotel Web Application Initialized Successfully!');
