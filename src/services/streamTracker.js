// src/services/streamTracker.js
// Cloudflare Stream Ingestion for Basin Catalog Telemetry

const STREAM_ENDPOINT = 'https://f8fb6f6f730b404fb2f273fd789d04df.ingest.cloudflare.com';

// 1. Nhận diện thiết bị của người dùng (Desktop / Mobile / Tablet)
export function detectDevice() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

// 2. Lấy IP và Quốc gia thông qua Cloudflare Trace API
export async function getClientNetworkInfo() {
  try {
    const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace', { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n');
      const data = {};
      lines.forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) data[k.trim()] = v.trim();
      });

      return {
        ip: data.ip || 'Unknown',
        country: data.loc || 'VN'
      };
    }
  } catch (e) {
    // Dự phòng dịch vụ thay thế nếu bị chặn
    try {
      const fallback = await fetch('https://api.country.is/');
      if (fallback.ok) {
        const fbData = await fallback.json();
        return {
          ip: fbData.ip || 'Unknown',
          country: fbData.country || 'VN'
        };
      }
    } catch {
      // Bỏ qua lỗi fallback
    }
  }

  return { ip: 'Unknown', country: 'VN' };
}

// 3. Hàm chính: Gửi dữ liệu Stream Ingestion lên Basin Catalog
export async function trackVisitStream() {
  try {
    // Kiểm tra phiên để không gửi trùng lặp nếu người dùng refresh liên tục trong 5 phút
    const lastTrackTime = sessionStorage.getItem('aura_last_stream_track');
    const now = Date.now();
    if (lastTrackTime && now - parseInt(lastTrackTime, 10) < 5 * 60 * 1000) {
      return;
    }

    const network = await getClientNetworkInfo();
    const device = detectDevice();

    const payload = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'vis-' + Math.random().toString(36).substring(2, 12),
      country: network.country,
      device: device,
      time: now,
      ip: network.ip,
      meta: {
        path: window.location.pathname || '/',
        referrer: document.referrer || 'Direct',
        screen: `${window.screen ? window.screen.width : 0}x${window.screen ? window.screen.height : 0}`,
        userAgent: navigator.userAgent,
        language: navigator.language || 'vi-VN'
      }
    };

    const response = await fetch(STREAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      sessionStorage.setItem('aura_last_stream_track', now.toString());
      
      // Lưu lại nhật ký cục bộ để hiển thị trong Admin Dashboard nếu cần
      try {
        const localLogs = JSON.parse(localStorage.getItem('aura_stream_visits_v1') || '[]');
        localLogs.unshift(payload);
        if (localLogs.length > 50) localLogs.pop();
        localStorage.setItem('aura_stream_visits_v1', JSON.stringify(localLogs));
      } catch {}

      console.log('📡 [Basin Catalog Stream] Đã ghi nhận lượt truy cập thành công:', {
        country: payload.country,
        device: payload.device,
        ip: payload.ip,
        time: new Date(payload.time).toLocaleString()
      });
    }
  } catch (error) {
    console.warn('📡 [Basin Catalog Stream] Lỗi khi gửi dữ liệu stream:', error);
  }
}
