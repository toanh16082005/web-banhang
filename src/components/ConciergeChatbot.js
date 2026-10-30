// src/components/ConciergeChatbot.js
import { store } from '../store/state.js';

let isChatOpen = false;
let chatMessages = [
  {
    sender: 'bot',
    text: 'Xin chào quý khách! Tôi là <strong>AURA Concierge</strong> — Trợ lý du lịch ảo của AURA STAY Resort & Spa. Tôi có thể hỗ trợ quý khách tìm phòng trống, giải đáp chính sách lưu trú hoặc tra cứu đơn đặt phòng tức thì.'
  }
];

export function renderConciergeChatbot() {
  return `
    <!-- Nút Bật / Tắt Chatbot Nổi -->
    <div class="chatbot-toggle-btn" id="chatbot-toggle" title="Trò chuyện cùng Trợ lý AURA Concierge">
      <div class="chatbot-pulse-ring"></div>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>

    <!-- Cửa Sổ Chatbot -->
    <div class="chatbot-window ${isChatOpen ? 'open' : ''}" id="chatbot-window">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-header-profile">
          <div class="chatbot-avatar">A</div>
          <div>
            <div class="chatbot-name-title">AURA Concierge AI</div>
            <div class="chatbot-status-online">
              <span class="dot"></span> Đang trực tuyến 24/7
            </div>
          </div>
        </div>
        <button id="chatbot-close" style="color: #fff; background: none; border: none; cursor: pointer; padding: 4px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Khung Tin Nhắn -->
      <div class="chatbot-messages" id="chatbot-messages-box">
        ${chatMessages.map(msg => `
          <div class="chat-bubble ${msg.sender}">
            <div>${msg.text}</div>
            ${msg.cards ? renderChatCards(msg.cards) : ''}
          </div>
        `).join('')}

        <!-- Gợi Ý Nhanh (Quick Chips) -->
        <div class="chat-quick-chips">
          <button class="chip-btn" data-msg="Có phòng nào view biển không?">🌊 Phòng View Biển</button>
          <button class="chip-btn" data-msg="Villa có hồ bơi riêng giá bao nhiêu?">🏊 Villa Hồ Bơi</button>
          <button class="chip-btn" data-msg="Quy định giờ check-in và check-out?">⏰ Giờ Check-in</button>
          <button class="chip-btn" data-msg="Tra cứu đơn AUR-260324-1001">🔍 Tra Cứu Booking</button>
        </div>
      </div>

      <!-- Thanh Nhập Tin Nhắn -->
      <form class="chatbot-input-bar" id="chatbot-form">
        <input type="text" id="chatbot-input" placeholder="Hỏi về phòng, tiện ích, mã đơn..." autocomplete="off" />
        <button type="submit" class="chatbot-send-btn" title="Gửi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  `;
}

function renderChatCards(cards) {
  return cards.map(c => `
    <div class="chat-card-preview">
      <img src="${c.thumbnail_url}" class="chat-card-thumb" />
      <div class="chat-card-info" style="flex-grow: 1;">
        <h5>${c.name}</h5>
        <div class="price">${store.formatPrice(c.base_price)}/đêm</div>
      </div>
      <button class="chip-btn btn-chat-book" data-id="${c.id}" style="background: var(--color-secondary); color: #fff;">
        Đặt Ngay
      </button>
    </div>
  `).join('');
}

// Xử lý logic câu trả lời của AI Concierge
function processChatbotResponse(userText) {
  const text = userText.toLowerCase().trim();

  // 1. Tra cứu booking theo mã hoặc số điện thoại
  const bookingMatch = userText.match(/AUR-\d{6}-\d{4}/i);
  const phoneMatch = userText.match(/(0[35789]\d{8})/);

  if (bookingMatch || phoneMatch) {
    const q = bookingMatch ? bookingMatch[0] : phoneMatch[0];
    const results = store.lookupBooking(q);
    if (results.length > 0) {
      const b = results[0];
      return {
        text: `Tôi đã tìm thấy đơn đặt phòng của quý khách!<br/>
        • <strong>Mã đơn:</strong> ${b.booking_code}<br/>
        • <strong>Khách hàng:</strong> ${b.customer_name}<br/>
        • <strong>Hạng phòng:</strong> ${b.room_type_name} (Phòng ${b.room_number || 'Chờ xếp'})<br/>
        • <strong>Ngày lưu trú:</strong> ${b.check_in_date} ➔ ${b.check_out_date} (${b.total_nights} đêm)<br/>
        • <strong>Trạng thái:</strong> <span style="font-weight:700; color: #10b981;">${b.status.toUpperCase()}</span>`
      };
    } else {
      return {
        text: `Rất tiếc tôi không tìm thấy đơn đặt phòng nào khớp với thông tin "<strong>${q}</strong>". Quý khách vui lòng kiểm tra lại mã hoặc số điện thoại nhé.`
      };
    }
  }

  // 2. Tìm phòng view biển
  if (text.includes('view biển') || text.includes('hướng biển') || text.includes('ngắm biển')) {
    const matched = store.roomTypes.filter(r => r.tags.some(t => t.includes('View Biển')));
    return {
      text: `Dạ, AURA STAY có các hạng phòng sở hữu tầm nhìn biển trực diện tuyệt mỹ sau đây:`,
      cards: matched
    };
  }

  // 3. Villa hồ bơi riêng
  if (text.includes('hồ bơi') || text.includes('bể bơi') || text.includes('villa')) {
    const matched = store.roomTypes.filter(r => r.tags.some(t => t.includes('Hồ Bơi')));
    return {
      text: `Dạ, biệt thự cao cấp có hồ bơi riêng của resort:`,
      cards: matched
    };
  }

  // 4. Giờ check-in / check-out
  if (text.includes('check-in') || text.includes('checkin') || text.includes('nhận phòng') || text.includes('trả phòng') || text.includes('giờ')) {
    return {
      text: `Quy định nhận và trả phòng tại <strong>AURA STAY Resort</strong>:<br/>
      • <strong>Giờ nhận phòng (Check-in):</strong> từ <strong>14:00</strong> chiều.<br/>
      • <strong>Giờ trả phòng (Check-out):</strong> trước <strong>12:00</strong> trưa.<br/>
      Nếu quý khách cần nhận phòng sớm hoặc trả phòng trễ, vui lòng ghi chú khi đặt phòng để lễ tân hỗ trợ sắp xếp tùy theo lượng phòng trống thực tế ạ.`
    };
  }

  // 5. Đưa đón sân bay & Buffet sáng
  if (text.includes('sân bay') || text.includes('đón') || text.includes('ăn sáng') || text.includes('buffet')) {
    return {
      text: `Dạ tất cả hạng phòng tại AURA STAY đều đã bao gồm <strong>bữa sáng buffet 5 sao miễn phí</strong> cho người lớn và trẻ em theo tiêu chuẩn phòng.<br/>
      Đối với dịch vụ đưa đón sân bay, khách đặt từ 2 đêm hoặc ở hạng Villa trở lên sẽ được <strong>đưa đón xe Limousine miễn phí 2 chiều</strong> ạ!`
    };
  }

  // 6. Mặc định phản hồi thân thiện
  return {
    text: `Cảm ơn quý khách đã quan tâm đến AURA STAY! Resort tọa lạc ngay bên bãi biển hoang sơ, có đầy đủ hồ bơi vô cực, ẩm thực hải sản và spa thảo dược. Quý khách có thể bấm chọn ngày ở thanh tìm kiếm phía trên để xem giá ưu đãi tốt nhất nhé!`
  };
}

export function attachConciergeChatbotEvents() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      isChatOpen = !isChatOpen;
      const win = document.getElementById('chatbot-window');
      if (win) {
        if (isChatOpen) win.classList.add('open');
        else win.classList.remove('open');
      }
    };
  }

  const closeBtn = document.getElementById('chatbot-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      isChatOpen = false;
      const win = document.getElementById('chatbot-window');
      if (win) win.classList.remove('open');
    };
  }

  // Submit form chat
  const form = document.getElementById('chatbot-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('chatbot-input');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      chatMessages.push({ sender: 'user', text });
      input.value = '';

      // Tự động trả lời
      setTimeout(() => {
        const reply = processChatbotResponse(text);
        chatMessages.push({ sender: 'bot', text: reply.text, cards: reply.cards });
        updateMessagesView();
      }, 500);

      updateMessagesView();
    };
  }

  // Quick Chips
  document.querySelectorAll('.chip-btn[data-msg]').forEach(chip => {
    chip.onclick = () => {
      const msg = chip.dataset.msg;
      chatMessages.push({ sender: 'user', text: msg });
      setTimeout(() => {
        const reply = processChatbotResponse(msg);
        chatMessages.push({ sender: 'bot', text: reply.text, cards: reply.cards });
        updateMessagesView();
      }, 400);
      updateMessagesView();
    };
  });

  attachChatCardBookEvents();
}

function updateMessagesView() {
  const box = document.getElementById('chatbot-messages-box');
  if (!box) return;

  box.innerHTML = `
    ${chatMessages.map(msg => `
      <div class="chat-bubble ${msg.sender}">
        <div>${msg.text}</div>
        ${msg.cards ? renderChatCards(msg.cards) : ''}
      </div>
    `).join('')}
    <div class="chat-quick-chips">
      <button class="chip-btn" data-msg="Có phòng nào view biển không?">🌊 Phòng View Biển</button>
      <button class="chip-btn" data-msg="Villa có hồ bơi riêng giá bao nhiêu?">🏊 Villa Hồ Bơi</button>
      <button class="chip-btn" data-msg="Quy định giờ check-in và check-out?">⏰ Giờ Check-in</button>
      <button class="chip-btn" data-msg="Tra cứu đơn AUR-260324-1001">🔍 Tra Cứu Booking</button>
    </div>
  `;

  box.scrollTop = box.scrollHeight;

  // Re-attach quick chips & book events
  document.querySelectorAll('.chip-btn[data-msg]').forEach(chip => {
    chip.onclick = () => {
      const msg = chip.dataset.msg;
      chatMessages.push({ sender: 'user', text: msg });
      setTimeout(() => {
        const reply = processChatbotResponse(msg);
        chatMessages.push({ sender: 'bot', text: reply.text, cards: reply.cards });
        updateMessagesView();
      }, 400);
      updateMessagesView();
    };
  });

  attachChatCardBookEvents();
}

function attachChatCardBookEvents() {
  document.querySelectorAll('.btn-chat-book').forEach(btn => {
    btn.onclick = () => {
      const roomId = Number(btn.dataset.id);
      const room = store.roomTypes.find(r => r.id === roomId);
      if (room) {
        store.openModal('booking', room);
      }
    };
  });
}
