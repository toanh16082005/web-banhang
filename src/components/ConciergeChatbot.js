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
          <button class="chip-btn" data-msg="Còn phòng nào cho 2 người không?">👫 Phòng 2 Người</button>
          <button class="chip-btn" data-msg="Có phòng nào view biển không?">🌊 Phòng View Biển</button>
          <button class="chip-btn" data-msg="Bảng giá các hạng phòng bao nhiêu?">💰 Bảng Giá</button>
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

// Xử lý logic câu trả lời của AI Concierge thông minh & đúng trọng tâm
function processChatbotResponse(userText) {
  const text = userText.toLowerCase().trim();

  // 1. Tra cứu booking theo mã (AUR-...) hoặc số điện thoại (10 số)
  const bookingMatch = userText.match(/AUR-\d{6}-\d{4}/i);
  const phoneMatch = userText.match(/(0[35789]\d{8})/);

  if (bookingMatch || phoneMatch) {
    const q = bookingMatch ? bookingMatch[0].toUpperCase() : phoneMatch[0];
    const results = store.lookupBooking(q);
    if (results.length > 0) {
      const b = results[0];
      const statusLabels = {
        pending: 'Chờ xác nhận (Pending)',
        confirmed: 'Đã xác nhận (Confirmed)',
        checked_in: 'Đang lưu trú (Checked-in)',
        checked_out: 'Đã trả phòng (Checked-out)',
        cancelled: 'Đã hủy (Cancelled)'
      };
      return {
        text: `Dạ em đã tìm thấy thông tin đơn đặt phòng của quý khách:<br/>
        • <strong>Mã đặt phòng:</strong> <span style="color: var(--color-primary); font-weight: 700;">${b.booking_code}</span><br/>
        • <strong>Khách hàng:</strong> ${b.customer_name} (${b.customer_phone})<br/>
        • <strong>Hạng phòng:</strong> ${b.room_type_name} (Phòng ${b.room_number || 'Sẽ xếp khi check-in'})<br/>
        • <strong>Lịch lưu trú:</strong> ${b.check_in_date} ➔ ${b.check_out_date} (${b.total_nights} đêm, ${b.adults} người lớn)<br/>
        • <strong>Tổng thanh toán:</strong> <strong>${store.formatPrice(b.total_amount)}</strong> (${b.payment_status === 'paid' ? 'Đã thanh toán' : 'Thanh toán tại quầy'})<br/>
        • <strong>Trạng thái:</strong> <span style="font-weight:700; color: #10b981;">${statusLabels[b.status] || b.status}</span>`
      };
    } else {
      return {
        text: `Dạ rất tiếc em không tìm thấy đơn đặt phòng nào khớp với "<strong>${q}</strong>". Quý khách vui lòng kiểm tra lại mã đơn (dạng AUR-YYMMDD-XXXX) hoặc số điện thoại đã dùng để đặt phòng nhé ạ!`
      };
    }
  }

  // 2. Hỏi phòng cho 2 người / cặp đôi / 1 người (Đúng trọng tâm câu hỏi của khách)
  if (
    text.includes('2 người') ||
    text.includes('hai người') ||
    text.includes('2 nguoi') ||
    text.includes('cho 2') ||
    text.includes('2 khách') ||
    text.includes('cặp đôi') ||
    text.includes('cap doi') ||
    text.includes('1 người') ||
    text.includes('một người') ||
    text.includes('2 bạn')
  ) {
    const matched = store.roomTypes.filter(r => r.max_adults === 2);
    return {
      text: `Dạ hiện tại AURA STAY có <strong>4 hạng phòng</strong> cực kỳ lý tưởng cho <strong>2 người</strong> (cặp đôi hoặc bạn bè) với các mức giá và phong cách trải nghiệm đa dạng:<br/>
      • 🌿 <strong>Zen Tropical Garden Bungalow:</strong> từ <strong>1.450.000₫</strong>/đêm (tiết kiệm nhất, hiên ngắm hoa thơm và vườn dừa).<br/>
      • 🌊 <strong>Deluxe Ocean View:</strong> từ <strong>1.850.000₫</strong>/đêm (bán chạy nhất, ban công ngắm trọn biển hoàng hôn, bồn tắm đá).<br/>
      • 💖 <strong>Honeymoon Romantic Haven:</strong> từ <strong>2.400.000₫</strong>/đêm (thiết kế lãng mạn, tặng kèm rượu vang và bữa tối nến).<br/>
      • 👑 <strong>Grand Executive Suite:</strong> từ <strong>2.950.000₫</strong>/đêm (rộng 65m², bồn sục Jacuzzi ngoài trời cao cấp).<br/>
      <small style="color: var(--color-text-muted);">*Tất cả đều đã bao gồm buffet sáng 5 sao miễn phí. Quý khách có thể nhấn nút <strong>"Đặt Ngay"</strong> ở thẻ phòng bên dưới nhé!*</small>`,
      cards: matched
    };
  }

  // 3. Hỏi phòng cho 4 người / gia đình / 3 người
  if (
    text.includes('4 người') ||
    text.includes('bốn người') ||
    text.includes('gia đình') ||
    text.includes('gia dinh') ||
    text.includes('family') ||
    text.includes('3 người') ||
    text.includes('ba người') ||
    text.includes('có con nhỏ') ||
    text.includes('trẻ em')
  ) {
    const matched = store.roomTypes.filter(r => r.id === 3 || r.id === 2 || r.id === 4);
    return {
      text: `Dạ đối với đoàn <strong>gia đình từ 3 - 4 người</strong>, AURA STAY có những lựa chọn không gian rộng rãi và riêng tư nhất:<br/>
      • 🏊 <strong>Beachfront Private Pool Villa (5.600.000₫/đêm):</strong> Biệt thự sát biển với hồ bơi riêng, 2 giường King lớn biệt lập, sức chứa 4 người lớn + 2 trẻ em.<br/>
      • 👑 <strong>Grand Executive Suite (2.950.000₫/đêm):</strong> Có 1 giường King + Sofa Bed êm ái, bồn Jacuzzi ngoài trời cho cả nhà thư giãn.<br/>
      • 🌇 <strong>Presidential Sunset Penthouse (8.900.000₫/đêm):</strong> 3 phòng ngủ Master Suite trên tầng cao nhất cho gia đình lớn.<br/>
      Quý khách xem chi tiết thẻ phòng phía dưới và bấm <strong>"Đặt Ngay"</strong> để giữ chỗ nhé!`,
      cards: matched
    };
  }

  // 4. Hỏi phòng cho 6 người trở lên / nhóm đông / đoàn
  if (
    text.includes('6 người') ||
    text.includes('sáu người') ||
    text.includes('nhóm đông') ||
    text.includes('đoàn') ||
    text.includes('công ty') ||
    text.includes('nhiều người')
  ) {
    const matched = store.roomTypes.filter(r => r.id === 4 || r.id === 3);
    return {
      text: `Dạ với đoàn <strong>từ 6 người trở lên</strong>, quý khách có thể lựa chọn:<br/>
      • 👑 <strong>Presidential Sunset Penthouse (8.900.000₫/đêm):</strong> Diện tích 210m² với 3 phòng ngủ Master Suite, sức chứa 6 người lớn + 3 trẻ em, view 360 độ và quản gia 24/7.<br/>
      • 🏊 <strong>Đặt cụm Biệt Thự Villa Liền Kề:</strong> Các căn Villa sát biển có lối đi thông nhau rất thuận tiện.<br/>
      Quý khách có thể liên hệ hotline <strong>0988.123.456</strong> để nhận báo giá ưu đãi đoàn tốt nhất ạ!`,
      cards: matched
    };
  }

  // 5. Hỏi chung về tình trạng còn phòng / kiểm tra phòng trống
  if (
    text.includes('còn phòng') ||
    text.includes('con phong') ||
    text.includes('phòng trống') ||
    text.includes('check phòng') ||
    text.includes('tìm phòng') ||
    text.includes('đặt phòng') ||
    text.includes('có phòng nào')
  ) {
    const cleanRoomsCount = store.rooms.filter(r => r.status === 'clean').length;
    return {
      text: `Dạ hiện tại AURA STAY đang có <strong>${cleanRoomsCount} phòng trống sạch</strong> sẵn sàng đón quý khách lưu trú, trải dài từ hạng Bungalow nhiệt đới đến Biệt thự hồ bơi sát biển.<br/>
      • Giá phòng dao động từ <strong>1.450.000₫</strong> đến <strong>8.900.000₫</strong>/đêm.<br/>
      Quý khách dự định đi <strong>mấy người</strong> và vào <strong>khoảng ngày nào</strong> để em kiểm tra và tư vấn căn phòng đẹp nhất cho mình ạ?`,
      cards: store.roomTypes.slice(0, 3)
    };
  }

  // 6. Hỏi về giá phòng / bảng giá / rẻ nhất
  if (
    text.includes('giá') ||
    text.includes('gia') ||
    text.includes('bao nhiêu') ||
    text.includes('rẻ nhất') ||
    text.includes('re nhat') ||
    text.includes('bảng giá') ||
    text.includes('bang gia') ||
    text.includes('chi phí') ||
    text.includes('tiết kiệm')
  ) {
    const sorted = [...store.roomTypes].sort((a, b) => a.base_price - b.base_price);
    return {
      text: `Dạ bảng giá niêm yết các hạng phòng tại AURA STAY (đã gồm buffet sáng 5 sao) như sau ạ:<br/>
      1. 🌿 <strong>Zen Tropical Garden Bungalow:</strong> ${store.formatPrice(sorted[0].base_price)}/đêm <em>(Giá tốt nhất)</em><br/>
      2. 🌊 <strong>Deluxe Ocean View:</strong> ${store.formatPrice(sorted[1].base_price)}/đêm <em>(Bán chạy nhất)</em><br/>
      3. 💖 <strong>Honeymoon Romantic Haven:</strong> ${store.formatPrice(sorted[2].base_price)}/đêm<br/>
      4. 👑 <strong>Grand Executive Suite:</strong> ${store.formatPrice(sorted[3].base_price)}/đêm<br/>
      5. 🏊 <strong>Beachfront Private Pool Villa:</strong> ${store.formatPrice(sorted[4].base_price)}/đêm<br/>
      6. 🌇 <strong>Presidential Sunset Penthouse:</strong> ${store.formatPrice(sorted[5].base_price)}/đêm<br/>
      <small style="color: var(--color-text-muted);">*Nhập mã <strong>AURASTAY2026</strong> khi đặt phòng để được giảm thêm 10% nữa nhé!*</small>`,
      cards: sorted.slice(0, 3)
    };
  }

  // 7. Hỏi về view biển / biển
  if (text.includes('view biển') || text.includes('hướng biển') || text.includes('ngắm biển') || text.includes('bãi biển') || text.includes('view bien')) {
    const matched = store.roomTypes.filter(r => r.tags.some(t => t.includes('View Biển')) || r.id === 1 || r.id === 2);
    return {
      text: `Dạ AURA STAY tọa lạc ngay sát vịnh biển nên các hạng phòng sau đây sở hữu tầm nhìn biển trực diện tuyệt mỹ:<br/>
      • 🌊 <strong>Deluxe Ocean View (1.850.000₫):</strong> Ban công riêng đón gió biển và hoàng hôn rực rỡ.<br/>
      • 👑 <strong>Grand Executive Suite (2.950.000₫):</strong> Ban công kính panorama mở rộng 180 độ view biển.<br/>
      • 🏊 <strong>Beachfront Villa (5.600.000₫):</strong> Chỉ cách mép sóng vài bước chân trên bãi cát trắng.<br/>
      Quý khách xem hình ảnh thực tế ở thẻ phòng bên dưới nhé:`,
      cards: matched
    };
  }

  // 8. Hỏi về Villa / Hồ bơi riêng
  if (text.includes('hồ bơi') || text.includes('ho boi') || text.includes('bể bơi') || text.includes('villa') || text.includes('biệt thự')) {
    const matched = store.roomTypes.filter(r => r.id === 3 || r.id === 2);
    return {
      text: `Dạ khu nghỉ dưỡng có 2 trải nghiệm hồ bơi độc đáo:<br/>
      1. 🏊 <strong>Hồ bơi vô cực chung:</strong> Rộng 500m² view tràn biển, phục vụ cocktail và âm nhạc nhẹ nhàng bên hồ.<br/>
      2. 🏖️ <strong>Beachfront Private Pool Villa:</strong> Biệt thự riêng tư sở hữu <strong>hồ bơi vô cực riêng</strong> ngay trước thềm phòng ngủ, cực kỳ sang trọng và kín đáo!<br/>
      Quý khách có thể bấm <strong>"Đặt Ngay"</strong> để nhận ưu đãi villa hôm nay:`,
      cards: matched
    };
  }

  // 9. Hỏi về giờ Check-in / Check-out
  if (
    text.includes('check-in') ||
    text.includes('checkin') ||
    text.includes('nhận phòng') ||
    text.includes('nhan phong') ||
    text.includes('trả phòng') ||
    text.includes('tra phong') ||
    text.includes('checkout') ||
    text.includes('mấy giờ')
  ) {
    return {
      text: `Dạ quy định giờ nhận và trả phòng tại <strong>AURA STAY Resort</strong> như sau ạ:<br/>
      • ⏰ <strong>Giờ nhận phòng (Check-in):</strong> từ <strong>14:00</strong> chiều.<br/>
      • ⏰ <strong>Giờ trả phòng (Check-out):</strong> trước <strong>12:00</strong> trưa.<br/>
      • <em>Nhận phòng sớm / Trả phòng trễ:</em> Resort sẽ hỗ trợ linh hoạt miễn phí nếu có phòng trống sẵn sàng. Quý khách chỉ cần ghi chú trong đơn đặt phòng để lễ tân sắp xếp chu đáo ạ!`
    };
  }

  // 10. Hỏi về Đưa đón sân bay / Xe cộ
  if (text.includes('sân bay') || text.includes('san bay') || text.includes('đưa đón') || text.includes('dua don') || text.includes('xe đón')) {
    return {
      text: `Dạ resort cách sân bay quốc tế chỉ khoảng 15 phút di chuyển và có chính sách đón tiễn như sau ạ:<br/>
      • 🚗 <strong>Miễn phí 100% xe Limousine 2 chiều:</strong> Áp dụng cho khách đặt từ 2 đêm trở lên hoặc lưu trú tại hạng Beachfront Villa / Penthouse.<br/>
      • Đối với các hạng phòng khác: Hỗ trợ đặt xe đưa đón riêng với giá ưu đãi chỉ 250.000₫/chuyến 4-7 chỗ sạch sẽ, tài xế lịch sự đón tận sảnh ga.`
    };
  }

  // 11. Hỏi về Ăn sáng / Buffet / Nhà hàng / Ẩm thực
  if (
    text.includes('ăn sáng') ||
    text.includes('an sang') ||
    text.includes('buffet') ||
    text.includes('nhà hàng') ||
    text.includes('nha hang') ||
    text.includes('hải sản') ||
    text.includes('hai san') ||
    text.includes('ăn uống') ||
    text.includes('menu')
  ) {
    return {
      text: `Dạ ẩm thực là một trong những niềm tự hào lớn nhất tại AURA STAY:<br/>
      • 🥐 <strong>Buffet sáng 5 sao MIỄN PHÍ:</strong> Bao gồm trong tất cả giá phòng, với hơn 60 món Âu - Á, quầy bánh nướng tươi và cà phê thơm ngon từ 06:30 - 10:00 sáng.<br/>
      • 🦞 <strong>Nhà hàng AURA Ocean:</strong> Phục vụ hải sản tươi sống đánh bắt trong ngày (tôm hùm, cua huỳnh đế, hàu nướng phô mai).<br/>
      • 🍷 <strong>Sunset Lounge Bar:</strong> Ngắm hoàng hôn bên bờ biển với cocktail nhiệt đới và nhạc Acoustic mỗi tối!`
    };
  }

  // 12. Hỏi về Spa / Massage / Thư giãn
  if (text.includes('spa') || text.includes('massage') || text.includes('mát xa') || text.includes('thư giãn') || text.includes('xông hơi')) {
    return {
      text: `Dạ <strong>AURA Lotus Spa</strong> mở cửa từ 09:00 đến 22:00 hàng ngày:<br/>
      • Liệu trình massage bấm huyệt thảo dược Đông y, xông hơi đá muối Himalaya và ngâm bồn thảo mộc tự nhiên.<br/>
      • <strong>Ưu đãi:</strong> Tặng voucher giảm <strong>15%</strong> cho tất cả khách đặt phòng trực tiếp trên website hôm nay ạ!`
    };
  }

  // 13. Hỏi về Trăng mật / Kỷ niệm ngày cưới / Cặp đôi
  if (text.includes('trăng mật') || text.includes('honeymoon') || text.includes('kỷ niệm') || text.includes('lãng mạn')) {
    const matched = store.roomTypes.filter(r => r.id === 6 || r.id === 1);
    return {
      text: `Dạ chúc mừng kỳ nghỉ đặc biệt của hai bạn! AURA STAY có gói phòng <strong>Honeymoon Romantic Haven (2.400.000₫/đêm)</strong> được setup riêng:<br/>
      • Giường ngủ rải cánh hoa hồng nhung và thiên nga uyên ương.<br/>
      • 1 chai rượu vang Chile ướp lạnh và đĩa hoa quả tươi chào mừng.<br/>
      • Bữa tối lãng mạn dưới ánh nến tại ban công riêng view biển đêm.<br/>
      Quý khách tham khảo ngay thẻ phòng bên dưới nhé:`,
      cards: matched
    };
  }

  // 14. Hỏi về Hủy phòng / Đổi ngày
  if (text.includes('hủy') || text.includes('huy') || text.includes('đổi ngày') || text.includes('doi ngay') || text.includes('hoàn tiền')) {
    return {
      text: `Dạ chính sách hủy đổi tại AURA STAY rất linh hoạt để đảm bảo quyền lợi tốt nhất cho quý khách:<br/>
      • <strong>Miễn phí 100%:</strong> Quý khách được hủy hoặc đổi ngày miễn phí nếu thông báo trước 48 giờ so với ngày nhận phòng.<br/>
      • Nếu đơn đặt phòng của quý khách đang ở trạng thái <em>Pending (Chờ xác nhận)</em>, quý khách có thể tự thao tác hủy trực tiếp trong mục Tra Cứu Booking hoặc gọi lễ tân hỗ trợ ngay ạ!`
    };
  }

  // 15. Hỏi về Địa chỉ / Vị trí / Liên hệ / Hotline
  if (text.includes('ở đâu') || text.includes('địa chỉ') || text.includes('dia chi') || text.includes('vị trí') || text.includes('hotline') || text.includes('số điện thoại') || text.includes('sđt') || text.includes('liên hệ')) {
    return {
      text: `Dạ thông tin liên hệ của khu nghỉ dưỡng <strong>AURA STAY Resort</strong>:<br/>
      • 📍 <strong>Địa chỉ:</strong> Đại lộ Bãi Dài, Bán đảo Cam Ranh, Khánh Hòa.<br/>
      • 📞 <strong>Hotline Lễ tân 24/7:</strong> <strong>0988.123.456</strong> (Hỗ trợ Zalo & Đặt phòng).<br/>
      • ✉️ <strong>Email:</strong> booking@aurastay.vn.<br/>
      • 🌐 <strong>Website chính thức:</strong> aurastay.vn (hoặc web-banhang.pages.dev).`
    };
  }

  // 16. Chào hỏi thân thiện (Xin chào, hello, hi, bot ơi...)
  if (
    text === 'xin chào' ||
    text === 'chào' ||
    text === 'hello' ||
    text === 'hi' ||
    text === 'chào bạn' ||
    text === 'alo' ||
    text === 'bot ơi' ||
    text === 'tư vấn' ||
    text === 'giúp mình'
  ) {
    return {
      text: `Dạ em chào quý khách! Em là Trợ lý Concierge AI của AURA STAY Resort. Em có thể hỗ trợ quý khách ngay lập tức:<br/>
      1️⃣ Tìm phòng cho <strong>2 người</strong>, <strong>gia đình</strong> hoặc <strong>cặp đôi</strong><br/>
      2️⃣ Báo giá ưu đãi các hạng phòng (từ <strong>1.450.000₫</strong>/đêm)<br/>
      3️⃣ Tư vấn giờ check-in, buffet sáng, xe đưa đón sân bay<br/>
      4️⃣ Tra cứu thông tin đơn đặt phòng theo mã hoặc SĐT<br/>
      Quý khách đang quan tâm đến nội dung nào để em hỗ trợ chu đáo nhất ạ?`
    };
  }

  // 17. Fallback thông minh: Tự động phân tích từ khóa trong danh mục phòng
  const keywordMatches = store.roomTypes.filter(r =>
    r.name.toLowerCase().includes(text) ||
    r.short_description.toLowerCase().includes(text) ||
    r.tags.some(t => t.toLowerCase().includes(text))
  );

  if (keywordMatches.length > 0) {
    return {
      text: `Dạ em tìm thấy các hạng phòng phù hợp với yêu cầu "<strong>${userText}</strong>" của quý khách:`,
      cards: keywordMatches
    };
  }

  // Fallback định hướng trọng tâm (không trả lời lan man)
  return {
    text: `Dạ em đã ghi nhận thắc mắc của quý khách về: <em>"${userText}"</em>.<br/>
    Để em tư vấn chính xác và nhanh nhất, quý khách có thể cho em biết thêm:<br/>
    • Quý khách dự định đi <strong>bao nhiêu người</strong> (ví dụ: <em>2 người</em>, <em>gia đình 4 người</em>)?<br/>
    • Hoặc quý khách muốn xem <strong>bảng giá</strong>, <strong>phòng view biển</strong> hay <strong>villa có hồ bơi riêng</strong> ạ?`
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
      <button class="chip-btn" data-msg="Còn phòng nào cho 2 người không?">👫 Phòng 2 Người</button>
      <button class="chip-btn" data-msg="Có phòng nào view biển không?">🌊 Phòng View Biển</button>
      <button class="chip-btn" data-msg="Bảng giá các hạng phòng bao nhiêu?">💰 Bảng Giá</button>
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
