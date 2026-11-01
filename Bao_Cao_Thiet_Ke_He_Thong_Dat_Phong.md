# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG
## KHOA CÔNG NGHỆ THÔNG TIN

---

# BÁO CÁO THIẾT KẾ & XÂY DỰNG HỆ THỐNG
# HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN TRỰC TUYẾN AURA STAY
### *"Nghỉ Dưỡng Hoàn Hảo. Trải Nghiệm Thảnh Thơi."*

---

## MỤC LỤC
- [1. TỔNG QUAN DỰ ÁN](#1-tổng-quan-dự-án)
  - [1.1 Mục Tiêu](#11-mục-tiêu)
  - [1.2 Phạm Vi](#12-phạm-vi)
  - [1.3 Vai Trò Người Dùng](#13-vai-trò-người-dùng)
  - [1.4 Mô Hình Phát Triển Trợ Lý Ảo Chatbot (Kiến Trúc RAG - Retrieval-Augmented Generation)](#14-mô-hình-phát-triển-trợ-lý-ảo-chatbot-kiến-trúc-rag---retrieval-augmented-generation)
- [2. KIẾN TRÚC HỆ THỐNG](#2-kiến-trúc-hệ-thống)
  - [2.1 Sơ Đồ Kiến Trúc Tổng Thể](#21-sơ-đồ-kiến-trúc-tổng-thể)
  - [2.2 Cấu Trúc Dự Án (Frontend / Backend Split)](#22-cấu-trúc-dự-án-frontend--backend-split)
- [3. CÔNG NGHỆ & CÔNG CỤ](#3-công-nghệ--công-cụ)
  - [3.1 Stack Chi Tiết](#31-stack-chi-tiết)
  - [3.2 Dependency Graph](#32-dependency-graph)
- [4. THIẾT KẾ CHI TIẾT CÁC MODULE](#4-thiết-kế-chi-tiết-các-module)
  - [4.1 Backend - HonoJS API trên Cloudflare Workers](#41-backend---honojs-api-trên-cloudflare-workers)
    - [4.1.1 Entry Point (`backend/src/index.ts`)](#411-entry-point-backendsrcindexts)
    - [4.1.2 Database Auto-Init & Fallback Pattern (`backend/src/db/init.ts` & `fallback.ts`)](#412-database-auto-init--fallback-pattern-backendsrcdbinitts--fallbackts)
    - [4.1.3 Authentication & Rate Limiting (`backend/src/middleware/auth.ts`)](#413-authentication--rate-limiting-backendsrcmiddlewareauthts)
    - [4.1.4 Room Types, Rooms & R2 Media (`backend/src/index.ts`)](#414-room-types-rooms--r2-media-backendsrcindexts)
    - [4.1.5 Bookings, Atomic Overbooking Lock & State Machine](#415-bookings-atomic-overbooking-lock--state-machine)
    - [4.1.6 AI Concierge Chatbot Engine (`backend/src/utils/chatbot.ts`)](#416-ai-concierge-chatbot-engine-backendsrcutilschatbotts)
  - [4.2 Frontend - React 19 + Vite SPA](#42-frontend---react-19--vite-spa)
    - [4.2.1 Routing & Layout (`frontend/src/App.tsx`)](#421-routing--layout-frontendsrcapptsx)
    - [4.2.2 State Management (`BookingContext.tsx` & `CustomerAuthContext.tsx`)](#422-state-management-bookingcontexttsx--customerauthcontexttsx)
    - [4.2.3 API Integration Pattern (`frontend/src/services/api.ts`)](#423-api-integration-pattern-frontendsrcservicesapits)
    - [4.2.4 Admin Dashboard, Timeline & Room Matrix (`frontend/src/pages/admin/`)](#424-admin-dashboard-timeline--room-matrix-frontendsrcpagesadmin)
    - [4.2.5 Trợ Lý Concierge Chatbot UI (`frontend/src/components/ConciergeChatbot.tsx`)](#425-trợ-lý-concierge-chatbot-ui-frontendsrccomponentsconciergechatbottsx)
  - [4.3 Shared Types, Constants & Validators (`shared/`)](#43-shared-types-constants--validators-shared)
  - [4.4 Database Schema (Cloudflare D1 - 15 Bảng Chuẩn Hóa)](#44-database-schema-cloudflare-d1---15-bảng-chuẩn-hóa)
- [5. QUY TRÌNH PHÁT TRIỂN](#5-quy-trình-phát-triển)
  - [5.1 Khởi Tạo Dự Án](#51-khởi-tạo-dự-án)
  - [5.2 Development Workflow](#52-development-workflow)
  - [5.3 Environment Configuration](#53-environment-configuration)
- [6. CÁC QUY TRÌNH NGHIỆP VỤ](#6-các-quy-trình-nghiệp-vụ)
  - [6.1 User Journey: Tìm Phòng Theo Ngày, Đặt Phòng & Tra Cứu Booking](#61-user-journey-tìm-phòng-theo-ngày-đặt-phòng--tra-cứu-booking)
  - [6.2 Admin / Lễ Tân Flow: Quản Lý Sơ Đồ Phòng, Check-in/Check-out & Doanh Thu](#62-admin--lễ-tân-flow-quản-lý-sơ-đồ-phòng-check-incheck-out--doanh-thu)
  - [6.3 Chatbot Flow: Tư Vấn Chọn Phòng & Tra Cứu Lịch Trình Tự Động](#63-chatbot-flow-tư-vấn-chọn-phòng--tra-cứu-lịch-trình-tự-động)
- [7. CÁC VẤN ĐỀ & GIẢI PHÁP](#7-các-vấn-đề--giải-pháp)
  - [7.1 Vấn Đề Đã Giải Quyết](#71-vấn-đề-đã-giải-quyết)
  - [7.2 Technical Debt / Kế Hoạch Nâng Cấp](#72-technical-debt--kế-hoạch-nâng-cấp)
- [8. HƯỚNG DẪN TRIỂN KHAI](#8-hướng-dẫn-triển-khai)
  - [8.1 Development Môi Trường Cục Bộ](#81-development-môi-trường-cục-bộ)
  - [8.2 Đóng Gói Production Build](#82-đóng-gói-production-build)
  - [8.3 Triển Khai Cloudflare Edge](#83-triển-khai-cloudflare-edge)
- [9. KẾT LUẬN & ĐÁNH GIÁ](#9-kết-luận--đánh-giá)
  - [9.1 Điểm Mạnh](#91-điểm-mạnh)
  - [9.2 Điểm Cần Cải Thiện](#92-điểm-cần-cải-thiện)
  - [9.3 Khuyến Nghị Giai Đoạn Tiếp Theo](#93-khuyến-nghị-giai-đoạn-tiếp-theo)
- [10. PHỤ LỤC](#10-phụ-lục)
  - [10.1 Cây Thư Mục Chi Tiết (File Tree)](#101-cây-thư-mục-chi-tiết-file-tree)
  - [10.2 Kịch Bản Kiểm Thử & Scripts Hữu Ích](#102-kịch-bản-kiểm-thử--scripts-hữu-ích)

---

# 1. TỔNG QUAN DỰ ÁN

## 1.1 Mục Tiêu
Xây dựng hệ thống đặt phòng khách sạn, resort & homestay trực tuyến hoàn chỉnh mang thương hiệu **AURA STAY** (*"Nghỉ Dưỡng Hoàn Hảo. Trải Nghiệm Thảnh Thơi."*) với kiến trúc **Full-Stack Serverless Edge** hiện đại, phân tách độc lập giữa `frontend/` và `backend/`, tích hợp **Trợ lý Concierge AI Chatbot** thông minh và sẵn sàng triển khai toàn diện trên hạ tầng **Cloudflare Edge** (Cloudflare Workers / Pages, Cloudflare D1 SQLite Database, Cloudflare R2 Object Storage).

Hệ thống giải quyết triệt để các bài toán cốt lõi của ngành lưu trú:
- **Ngăn chặn Overbooking (Trùng phòng đồng thời)** bằng thuật toán kiểm tra giao khoảng ngày nguyên tử (`Atomic Date-Overlap Reservation`).
- **Cơ chế tính giá linh hoạt (Zero-Trust Dynamic Pricing)** theo mùa vụ, ngày trong tuần, ngày lễ và số lượng khách thực tế.
- **Sơ đồ ma trận phòng trực quan (Room Matrix & Timeline Gantt)** giúp bộ phận lễ tân và quản trị viên kiểm soát trạng thái phòng (`Trống`, `Đã đặt`, `Đang ở`, `Đang dọn dẹp`, `Bảo trì`) theo thời gian thực.
- **Trợ lý du lịch ảo (AI Concierge Bot)** hỗ trợ khách vãng lai tìm phòng theo khoảng ngày, ngân sách, số khách, tư vấn tiện ích và tra cứu tình trạng đơn đặt phòng tức thì.

## 1.2 Phạm Vi
- **Frontend**: Giao diện người dùng đặt phòng và cổng quản trị lễ tân/quản trị viên tối ưu cho cả Laptop, Tablet & Mobile (24 routes hoàn chỉnh xây dựng bằng **React 19 + TypeScript + Tailwind CSS v4 + TanStack Query v5**).
- **Backend**: Hệ thống RESTful API (`/api/v1/*`) quản lý hạng phòng, danh sách phòng vật lý, tiện ích, chính sách giá động, khóa đặt phòng nguyên tử chống Race Condition, xác thực mật khẩu an toàn chuẩn Web Crypto API **PBKDF2-HMAC-SHA256**, tải ảnh phòng độ phân giải cao lên Cloudflare R2 và AI Concierge Engine (**HonoJS v4 + TypeScript**).
- **Shared**: Bộ thư viện dùng chung định nghĩa TypeScript Interfaces, hằng số trạng thái đặt phòng (Booking State Machine), hàm chuẩn hóa tiền tệ VND và Zod Schemas kiểm tra ràng buộc ngày tháng, số điện thoại Việt Nam dùng chung cho cả Client và Server.
- **Infrastructure**: Cơ sở dữ liệu Cloudflare D1 gồm **15 bảng chuẩn hóa quan hệ**, cơ chế tự động migration/seed dữ liệu kết hợp bộ nhớ đệm dự phòng In-Memory + Edge Cache Fallback (Zero 500 error khi chưa liên kết D1/R2), cùng bộ kiểm thử tự động toàn diện bằng Vitest (`node:sqlite`).

## 1.3 Vai Trò Người Dùng

| Vai Trò | Quyền Hạn Trong Hệ Thống |
| :--- | :--- |
| **Guest (Khách vãng lai)** | - Tìm kiếm phòng theo ngày đến (Check-in), ngày đi (Check-out), số lượng người lớn và trẻ em.<br>- Lọc phòng theo hạng phòng (Deluxe, Suite, Villa...), khoảng giá, tiện ích (hồ bơi, bữa sáng, view biển...).<br>- Xem thư viện ảnh chất lượng cao 360 độ, đánh giá của khách cũ.<br>- Đặt phòng nhanh không bắt buộc tài khoản (COD trả tại quầy / Chuyển khoản QR ngân hàng).<br>- Tra cứu tiến trình đặt phòng bằng Mã đơn (`AUR-YYMMDD-XXXX`) hoặc SĐT.<br>- Trò chuyện với Trợ lý Concierge AI để nhận tư vấn phòng và chính sách lưu trú. |
| **Customer (Khách hàng thành viên)** | - Đăng ký / Đăng nhập tài khoản bảo mật bằng Email/SĐT.<br>- Tự động đồng bộ các booking vãng lai cũ được tạo trước đó có cùng SĐT/Email.<br>- Quản lý thông tin cá nhân, lưu thẻ căn cước/hộ chiếu để rút ngắn thủ tục check-in.<br>- Xem lịch sử đặt phòng, tải hóa đơn điện tử VAT, nhận tích điểm thành viên (Loyalty Points).<br>- Tự hủy hoặc yêu cầu đổi ngày khi đơn đặt phòng đang ở trạng thái `pending` (Chờ xác nhận).<br>- Viết đánh giá, bình luận và xếp hạng sao cho các phòng đã hoàn tất kỳ nghỉ. |
| **Receptionist / Staff (Lễ tân)** | - Đăng nhập phân quyền Staff.<br>- Xem sơ đồ phòng trực quan (Room Matrix & Gantt Timeline) theo ngày hiện tại và tuần tới.<br>- Thao tác nhanh thủ tục Nhận phòng (Check-in), Trả phòng (Check-out), Chuyển trạng thái dọn dẹp phòng (`Cleaning` / `Inspected`).<br>- Ghi nhận các chi phí phát sinh (Minibar, giặt ủi, bữa ăn tại phòng, phụ thu quá giờ) vào hóa đơn đặt phòng.<br>- Tra cứu nhanh khách sạn theo họ tên, CCCD/Passport hoặc số điện thoại. |
| **Admin (Quản trị viên hệ thống)** | - Đăng nhập bảo mật HttpOnly Cookie kèm giới hạn tần suất (Rate Limiter).<br>- Xem Dashboard chỉ số kinh doanh: Doanh thu thực tế, Tỷ lệ lấp đầy phòng (Occupancy Rate - ADR, RevPAR), Xu hướng đặt phòng theo biểu đồ 7/30/90 ngày.<br>- Quản lý Hạng phòng & Phòng vật lý (CRUD, bật/tắt, tải nhiều ảnh phòng lên Cloudflare R2).<br>- Thiết lập Bảng giá linh hoạt (Pricing Rules: Phụ thu cuối tuần, giá dịp Lễ/Tết, phụ thu giường phụ/trẻ em).<br>- Quản lý toàn bộ danh sách Booking theo State Machine nghiêm ngặt.<br>- Quản lý khách hàng CRM, mã giảm giá (Coupon), Banner trang chủ và cấu hình hệ thống. |

## 1.4 Mô Hình Phát Triển Trợ Lý Ảo Chatbot (Kiến Trúc RAG - Retrieval-Augmented Generation)

Nhằm đáp ứng yêu cầu nghiệp vụ khắt khe của ngành lưu trú và giải quyết triệt để điểm yếu cố hữu của các mô hình ngôn ngữ lớn (LLMs), hệ thống AURA STAY ứng dụng kiến trúc **RAG (Retrieval-Augmented Generation - Tạo sinh tăng cường truy xuất dữ liệu)** vào module Trợ lý ảo Concierge AI.

### 1.4.1 Yêu Cầu Cốt Lõi (User Story & System Constraints)
- ⚠️ **Không được bịa đặt (Zero Hallucination)**: Mô hình ngôn ngữ lớn (LLM) tuyệt đối không được tự suy diễn hoặc bịa ra thông tin sai lệch về giá phòng, chính sách hủy phòng hoặc các dịch vụ không có thực.
- **Chỉ sử dụng dữ liệu hiện có (Strict Context Grounding)**: Chatbot chỉ được phép trả lời dựa trên kho tri thức xác thực do khu nghỉ dưỡng cung cấp (tài liệu nội bộ, thông số phòng ốc, chính sách trẻ em và biểu giá niêm yết).
- **Vận hành trên hạ tầng Cloudflare Edge (CF)**: Tận dụng mạng lưới biên phân tán của Cloudflare (Cloudflare Workers, Cloudflare Vectorize và Workers AI) giúp phản hồi tức thì với độ trễ cực thấp (< 50ms) và tối ưu hóa 100% chi phí vận hành.

### 1.4.2 Sơ Đồ Quy Trình Vận Hành Kiến Trúc RAG

Hệ thống hoạt động đồng bộ qua hai luồng xử lý độc lập: **Luồng nạp dữ liệu tri thức (Offline Ingestion Pipeline)** và **Luồng truy xuất & sinh phản hồi theo thời gian thực (Online Retrieval Pipeline)**:

```
[ NGUỒN TRI THỨC NỘI BỘ ]
(Knowledge: .pdf, .docx, private docs)
          │
          ▼
    [ CHUNKING ] ──► Chia văn bản thành các khối nhỏ (300 - 500 tokens, 50 tokens overlap)
          │
          ▼
 ① [ WORD EMBEDDING ] ──► Chuyển đổi ngữ nghĩa văn bản thành Vector [1024 chiều]
          │
          ▼ (Index)
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    ② DB VECTOR (Cloudflare Vectorize)                 │
 │            - Lưu trữ các vector tri thức của resort                    │
 │            - Thuật toán đo khoảng cách ngữ nghĩa: Cosine Similarity    │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    ▲
                                    │ (Cosine Similarity Search)
                                    │
                                    ├──────────────────────────┐
                                    │ (Truy xuất Top-K)        │
                                    │                          │
          [ NGƯỜI DÙNG / KHÁCH ]     │                          ▼
                    │               │                 ┌─────────────────┐
                    ▼               │                 │   K PHẦN TỬ     │
             [ CÂU HỎI USER ] ──────┘                 │ (Top-K Chunks   │
                    │         (Vector hóa câu hỏi)    │  Ngữ cảnh thật) │
                    ▼                                 └────────┬────────┘
                    │                                          │
                    └───────────────────┬──────────────────────┘
                                        ▼
                               ┌─────────────────┐
                               │     ③ LLM       │ (Google Gemini 2.5 Flash / Llama 3)
                               │ (Augmented Text)│ Prompt = Ngữ cảnh thật + Câu hỏi
                               └────────┬────────┘
                                        ▼
                               [ CÂU TRẢ LỜI CHÍNH XÁC ]
                               (100% Theo dữ liệu thật, không bịa đặt)
```

### 1.4.3 Chi Tiết Các Thành Phần Triển Khai

| Thành Phần Trong Mô Hình | Vai Trò & Cơ Chế Hoạt Động | Công Nghệ Triển Khai Trong Dự Án |
| :--- | :--- | :--- |
| **Knowledge (Tài liệu nguồn)** | Tập hợp các văn bản nghiệp vụ: Bảng giá phòng, quy chế nhận/trả phòng, menu ẩm thực, chính sách đón tiễn sân bay, quy định phụ thu trẻ em và thú cưng. | `.pdf`, `.docx`, Markdown & CSDL Quan hệ Cloudflare D1. |
| **Chunking (Phân đoạn)** | Cắt nhỏ tài liệu thành các khối vừa vặn (300 - 500 từ) kèm khoảng gối đầu 50 từ (overlap) nhằm đảm bảo không bị đứt đoạn ngữ cảnh giữa các câu nối. | Thuật toán Recursive Character Text Splitter. |
| **① Word Embedding** | Mô hình học sâu biến đổi từng khối văn bản thành vector không gian đa chiều (1024 token/chiều), bảo toàn trọn vẹn ngữ nghĩa toán học của từ ngữ. | Cloudflare Workers AI (`@cf/baai/bge-base-en-v1.5`) / Google Text Embedding. |
| **② DB Vector (Vector Database)** | Cơ sở dữ liệu chuyên biệt lưu trữ vector và đánh chỉ mục theo không gian đa chiều. Khi nhận vector truy vấn, hệ thống tính toán độ tương đồng góc Cosine (`Cosine Similarity`) để trích xuất ngay lập tức `K phần tử` (Top-K) có điểm tương quan cao nhất. | **Cloudflare Vectorize** (Edge Native, tích hợp trực tiếp với Workers). |
| **③ LLM (Mô hình Ngôn ngữ)** | Tiếp nhận `Augmented Prompt` bao gồm $K$ đoạn văn bản thật được truy xuất và câu hỏi gốc của khách hàng. LLM chỉ đóng vai trò hành văn, diễn giải mạch lạc và lịch thiệp, bị khóa chặt bởi luật "Không được bịa đặt". | **Google Gemini 2.5 Flash** qua REST API / Cloudflare Workers AI. |

### 1.4.4 Prompt Engineering Chống Bịa Đặt (System Grounding)
Để bảo đảm chatbot luôn tuân thủ nguyên tắc "Không được bịa - Chỉ sử dụng dữ liệu hiện có", máy chủ nhúng chỉ thị hệ thống nghiêm ngặt vào mỗi phiên hội thoại:

```
[VAI TRÒ]: Bạn là Trợ lý du lịch ảo Concierge độc quyền của khu nghỉ dưỡng cao cấp AURA STAY.
[NGUYÊN TẮC BẮT BUỘC]:
1. CHỈ ĐƯỢC PHÉP trả lời dựa trên [DỮ LIỆU NỘI BỘ] đã được trích xuất dưới đây.
2. TUYỆT ĐỐI KHÔNG ĐƯỢC BỊA ĐẶT, suy diễn giá cả, dịch vụ hoặc tiện ích ngoài tài liệu.
3. Nếu [DỮ LIỆU NỘI BỘ] không có câu trả lời, hãy lịch sự từ chối:
   "Dạ hiện tại em chưa có thông tin chính thức về vấn đề này. Quý khách vui lòng liên hệ hotline lễ tân 0988.xxx.xxx để được hỗ trợ chu đáo nhất ạ."

[DỮ LIỆU NỘI BỘ ĐÃ TRUY XUẤT]:
{Top-K Chunks từ Cloudflare Vectorize}

[CÂU HỎI CỦA KHÁCH HÀNG]:
{User Query}
```

---

# 2. KIẾN TRÚC HỆ THỐNG

## 2.1 Sơ Đồ Kiến Trúc Tổng Thể

Hệ thống vận hành theo kiến trúc **Single-Domain Edge Architecture** hiện đại. Toàn bộ tài nguyên tĩnh của Frontend, API Backend và lưu trữ phân tán đều được liên kết nhất quán dưới một domain duy nhất, loại bỏ hoàn toàn các vấn đề phức tạp liên quan đến CORS (Cross-Origin Resource Sharing) và cookie bên thứ ba.

```
                                  [ Trình Duyệt / Khách Hàng / Lễ Tân / Admin ]
                                                        │
                                                        ▼ HTTPS
                                         [ Cloudflare Global Edge Network ]
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼                                                                   ▼
          [ Static Assets & SPA Routes ]                                      [ REST API Routes: /api/v1/* ]
           (React 19 + Tailwind v4 Build)                                     (HonoJS API trên Workers / Pages)
                      │                                                                   │
                      │                                      ┌────────────────────────────┼────────────────────────────┐
                      ▼                                      ▼                            ▼                            ▼
             [ Client Cache & UI ]                  [ Auth / Rate Limit ]       [ Booking Engine ]           [ Concierge Bot ]
             - BookingContext                       - Web Crypto PBKDF2         - Overbooking Lock           - Regex + Intent
             - CustomerAuthContext                  - SHA-256 Session           - Zero-Trust Pricing         - Gemini 2.5 Flash
             - TanStack Query v5                             │                            │                            │
                                                             ▼                            ▼                            ▼
                                                ┌──────────────────────────────────────────────────────────────────────────────┐
                                                │                    DATA & STORAGE LAYER (Edge Native)                        │
                                                │  - Cloudflare D1 (SQLite Database - 15 Bảng Chuẩn Hóa Quan Hệ)                │
                                                │  - Cloudflare R2 Bucket (Lưu trữ ảnh phòng, hóa đơn PDF không tốn egress)    │
                                                │  - In-Memory & Edge Cache Fallback (Tự động kích hoạt khi chưa gắn binding)  │
                                                └──────────────────────────────────────────────────────────────────────────────┘
```

1. **Frontend Layer (React 19 SPA)**: Giao diện đặt phòng khách hàng trực quan với bộ lọc ngày thông minh, cổng quản trị chuyên sâu cho lễ tân/admin với sơ đồ lưới phòng trực quan và widget Concierge Chatbot gắn thường trực.
2. **Backend API Layer (HonoJS trên Cloudflare Workers Runtime)**: Xử lý toàn bộ logic nghiệp vụ qua REST API `/api/v1/*`, kiểm toán khóa phòng nguyên tử, băm mật khẩu chuẩn hóa và tích hợp AI.
3. **Shared Validation & Types Layer**: Thư viện dùng chung đồng bộ 100% giữa FE và BE, kiểm tra tính hợp lệ của ngày check-in/check-out (`check_out > check_in`), số lượng người và trạng thái booking.
4. **Data & Storage Layer**: Cloudflare D1 lưu trữ dữ liệu quan hệ ACID tốc độ cao tại hơn 300 điểm PoP trên toàn cầu; Cloudflare R2 lưu trữ media; cơ chế Fallback Adapter đảm bảo hệ thống luôn khởi chạy ổn định trong mọi điều kiện kiểm thử.

## 2.2 Cấu Trúc Dự Án (Frontend / Backend Split)

```
aura-stay/
├── package.json                         # Cấu hình kịch bản scripts và toàn bộ dependencies
├── vite.config.ts                       # Cấu hình Vite SPA tích hợp Cloudflare Workers plugin
├── vitest.config.ts                     # Cấu hình kiểm thử tích hợp tự động với node:sqlite
├── wrangler.jsonc                       # Khai báo cấu hình Cloudflare Pages, D1 Database & R2 Bucket
├── scripts/
│   └── build-worker.mjs                 # Kịch bản esbuild đóng gói Backend thành dist/_worker.js
├── frontend/                            # Toàn bộ mã nguồn phía Client (React 19 + TypeScript)
│   ├── index.html                       # HTML gốc nạp phông chữ sang trọng Outfit & Playfair Display
│   ├── public/                          # Tài nguyên tĩnh, favicon, robots.txt, sitemap.xml
│   ├── shared/                          # Thư mục đồng bộ kiểu dữ liệu, constants và schema với Backend
│   └── src/
│       ├── components/                  # Các UI Components dùng chung
│       │   ├── ConciergeChatbot.tsx     # Widget Trợ lý Concierge AI nổi góc màn hình
│       │   ├── RoomCard.tsx             # Thẻ hiển thị hạng phòng (Giá, số khách, tiện ích, ảnh)
│       │   ├── DateRangePicker.tsx      # Bộ chọn ngày Check-in / Check-out trực quan
│       │   ├── ToastContext.tsx         # Hệ thống thông báo toast phản hồi người dùng
│       │   └── ErrorBoundary.tsx        # Bắt lỗi giao diện tập trung ngăn sập toàn trang
│       ├── features/                    # Quản lý trạng thái nghiệp vụ toàn cục
│       │   ├── auth/CustomerAuthContext.tsx # Phiên đăng nhập khách hàng và tự động nhận diện Admin
│       │   └── booking/BookingContext.tsx   # Quản lý ngày chọn, số khách, phòng đã chọn, voucher
│       ├── hooks/
│       │   └── useQueries.ts            # Tùy biến TanStack React Query Hooks cho phòng và booking
│       ├── layouts/
│       │   ├── MainLayout.tsx           # Layout Khách hàng: TopBar, Navbar, Footer, Floating Chat
│       │   └── AdminLayout.tsx          # Layout Quản trị: Sidebar, Thông báo, Bảo vệ quyền truy cập
│       ├── pages/                       # 16 trang Khách hàng & 8 trang Quản trị viên
│       │   ├── HomePage.tsx             # Trang chủ: Hero tìm kiếm ngày, Hạng phòng nổi bật, Feedback
│       │   ├── RoomsPage.tsx            # /rooms: Lọc hạng phòng đa tiêu chí, sắp xếp giá
│       │   ├── RoomDetailPage.tsx       # /rooms/:slug: Thư viện ảnh, thông số phòng, tiện ích chi tiết
│       │   ├── BookingCheckoutPage.tsx  # /checkout: Nhập thông tin khách, phụ thu, chọn phương thức
│       │   ├── BookingSuccessPage.tsx   # /booking-success: Xác nhận mã đặt phòng & mã QR VietQR
│       │   ├── TrackBookingPage.tsx     # /track-booking: Tra cứu tiến độ booking bằng mã hoặc SĐT
│       │   ├── AccountPage.tsx          # /account: Hồ sơ cá nhân, lịch sử đặt phòng & hủy đơn
│       │   ├── AboutPage.tsx            # /about: Giới thiệu khu nghỉ dưỡng AURA STAY
│       │   ├── ContactPage.tsx          # /contact: Bản đồ vị trí, hotline, gửi form liên hệ
│       │   └── admin/                   # Phân hệ quản trị
│       │       ├── AdminLoginPage.tsx   # /admin/login: Đăng nhập quản trị viên / lễ tân
│       │       ├── AdminDashboardPage.tsx # /admin: Biểu đồ doanh thu, tỷ lệ lấp đầy, phòng sắp check-in
│       │       ├── AdminRoomMatrixPage.tsx# /admin/matrix: Sơ đồ ma trận phòng trực quan theo thời gian
│       │       ├── AdminRoomsPage.tsx   # /admin/rooms: Quản lý danh sách phòng & tải ảnh lên R2
│       │       ├── AdminRoomTypesPage.tsx# /admin/room-types: Quản lý hạng phòng và cấu hình giá gốc
│       │       ├── AdminBookingsPage.tsx# /admin/bookings: Danh sách booking, lọc trạng thái, gán phòng
│       │       ├── AdminPricingPage.tsx # /admin/pricing: Cài đặt giá linh hoạt cuối tuần, ngày lễ
│       │       ├── AdminCustomersPage.tsx# /admin/customers: CRM lưu thông tin khách và chi tiêu tích lũy
│       │       └── AdminSettingsPage.tsx# /admin/settings: Cấu hình thông tin resort, email, chính sách
│       └── services/
│           └── api.ts                   # Tầng gọi API tập trung, tự động gắn token và bóc tách ApiError
├── backend/                             # Toàn bộ mã nguồn phía Server (HonoJS + D1 + R2)
│   ├── migrations/
│   │   └── 0001_schema.sql              # Định nghĩa 15 bảng SQLite và 18 Indexes tối ưu truy vấn
│   ├── seeds/
│   │   └── seed.sql                     # Dữ liệu mẫu ban đầu: Hạng phòng, phòng cụ thể, tiện ích, admin
│   ├── shared/                          # Thư viện dùng chung phía Server (Types, Constants, Validators)
│   ├── src/
│   │   ├── index.ts                     # Entry Point chính: Middlewares, Định tuyến REST API
│   │   ├── db/
│   │   │   ├── init.ts                  # Tự động khởi tạo cấu trúc bảng & bootstrap tài khoản Admin
│   │   │   └── fallback.ts              # In-Memory & Edge Cache Database Adapter khi chưa kết nối D1
│   │   ├── middleware/
│   │   │   └── auth.ts                  # Xác thực HttpOnly Cookie / Bearer Token, kiểm tra RBAC
│   │   └── utils/
│   │       ├── chatbot.ts               # Bộ não Concierge AI (Regex phân loại + Google Gemini 2.5 Flash)
│   │       ├── crypto.ts                # Thuật toán băm PBKDF2-HMAC-SHA256 & SHA-256 trên Web Crypto
│   │       └── response.ts              # Chuẩn hóa định dạng phản hồi JSON API thống nhất (`ok` / `fail`)
│   └── tests/
│       └── api.test.ts                  # Bộ kiểm thử tích hợp 20 kịch bản đặt phòng và bảo mật (Vitest)
└── docs/                                # Tài liệu kỹ thuật chi tiết
    ├── architecture.md                  # Tài liệu kiến trúc phân tầng
    ├── api.md                           # Đặc tả chi tiết các RESTful Endpoints
    └── database.md                      # Thiết kế lược đồ thực thể quan hệ (ERD)
```

---

# 3. CÔNG NGHỆ & CÔNG CỤ

## 3.1 Stack Chi Tiết

| Tầng Hệ Thống | Công Nghệ Sử Dụng | Phiên Bản | Lý Do Lựa Chọn & Giá Trị Kỹ Thuật |
| :--- | :--- | :--- | :--- |
| **Frontend Library** | React | 19.0.0 | Thư viện giao diện chuẩn hiện đại, tận dụng triệt để tính năng Suspense, Server Actions và tối ưu hóa Rendering mà không bị thừa bundle. |
| **Routing** | React Router DOM | 7.1.5 | Quản lý 24 tuyến đường giao diện mượt mà, phân tách rõ nhánh người dùng vãng lai và quản trị viên có bảo vệ phiên đăng nhập (`Guarded Route`). |
| **Server State Management** | TanStack React Query | 5.66.0 | Tự động caching danh sách phòng, tái kích hoạt truy vấn khi người dùng đổi khoảng ngày và làm mới trạng thái phòng theo thời gian thực. |
| **Styling & Design System** | Tailwind CSS | 4.0.6 | Khung CSS tiện ích hiệu năng cao, xây dựng giao diện phong cách Resort/Hospitality sang trọng, hỗ trợ tối đa Responsive đa thiết bị. |
| **Form & Validation** | React Hook Form + Zod | 7.54.2 / 3.24.2 | Xử lý các form đặt phòng phức tạp với tốc độ render cao, kiểm tra dữ liệu 2 đầu (Client & Server) đồng bộ với thông báo lỗi tiếng Việt thân thiện. |
| **Build & Bundle Tool** | Vite + esbuild | 6.1.0 / 0.25.0 | Thời gian khởi động môi trường dev dưới 300ms, hot-module reload siêu tốc, đóng gói bundle Worker tối ưu dưới 1MB. |
| **Backend Framework** | HonoJS | 4.7.2 | Web framework thế hệ mới siêu nhẹ (< 15KB), thiết kế chuyên biệt cho Cloudflare Workers Edge Runtime, tốc độ định tuyến vượt trội. |
| **Database** | Cloudflare D1 (SQLite) | Edge Native | Cơ sở dữ liệu quan hệ SQL phân tán tại biên, hỗ trợ đầy đủ khóa ngoại, Transaction và Batch Query với độ trễ phản hồi cực thấp (< 20ms). |
| **Object Storage** | Cloudflare R2 | Edge Native | Lưu trữ hình ảnh phòng nghỉ chất lượng cao, miễn phí 100% băng thông tải về (Zero Egress Fees), tương thích S3 API. |
| **AI Integration** | Google Gemini 2.5 Flash | v1beta REST | Tích hợp mô hình AI ngôn ngữ tự nhiên thế hệ mới của Google, hỗ trợ phản hồi thông minh các thắc mắc về điểm đến, thời tiết và gợi ý hạng phòng. |
| **Bảo Mật / Mã Hóa** | Web Crypto API | Native Edge | Băm mật khẩu bằng thuật toán PBKDF2-HMAC-SHA256 (100.000 vòng) kết hợp salt ngẫu nhiên chuẩn an toàn, vận hành trực tiếp trên V8 isolate. |
| **Kiểm Thử Tự Động** | Vitest + `node:sqlite` | 3.0.5 | Môi trường kiểm thử tự động tốc độ cao không cần giả lập phức tạp, thực thi trực tiếp trên SQLite in-memory thực tế. |

## 3.2 Dependency Graph

```
aura-stay (Root Project)
 │
 ├── Frontend Workspace (frontend/src)
 │    ├── react, react-dom, react-router-dom
 │    ├── @tanstack/react-query
 │    ├── react-hook-form, @hookform/resolvers, zod
 │    ├── lucide-react, tailwindcss
 │    └── frontend/shared (types, constants, validators) ◄────┐
 │                                                            │
 └── Backend Workspace (backend/src)                          │ (Đồng bộ cấu trúc dữ liệu)
      ├── hono (hono/cors, hono/cookie)                       │
      ├── @cloudflare/workers-types (D1Database, R2Bucket)    │
      ├── zod                                                 │
      └── backend/shared (types, constants, validators) ──────┘
```

---

# 4. THIẾT KẾ CHI TIẾT CÁC MODULE

## 4.1 Backend - HonoJS API trên Cloudflare Workers

### 4.1.1 Entry Point (`backend/src/index.ts`)
Tập tin khởi chạy chính thiết lập chuỗi Middleware theo thứ tự nghiêm ngặt:
1. **CORS Middleware**: Cho phép giao tiếp thông qua header với cấu hình `credentials: true`.
2. **Database Auto-Init & Resilience Middleware**: Tự động nhận diện môi trường, kiểm tra bảng dữ liệu đã tồn tại hay chưa để khởi tạo tức thì; nếu chạy cục bộ hoặc chưa gắn D1 Binding sẽ kích hoạt In-Memory Fallback Adapter.
3. **Centralized Error Handling (`app.onError`)**: Bắt mọi ngoại lệ không mong muốn, ẩn chi tiết stack trace trên môi trường production, trả về định dạng JSON chuẩn tắc kèm mã lỗi chi tiết.
4. **Phân nhóm định tuyến API**:
   - `/api/v1/auth/*`: Đăng ký, đăng nhập đa vai trò, kiểm tra phiên (`/me`), đăng xuất.
   - `/api/v1/rooms/*`: Tra cứu hạng phòng, kiểm tra phòng trống theo khoảng ngày, tiện ích.
   - `/api/v1/bookings/*`: Tạo đặt phòng nguyên tử, tra cứu mã đặt phòng, khách tự hủy phòng.
   - `/api/v1/chatbot/*`: Tiếp nhận tin nhắn hội thoại của khách, phân loại ý định và gọi AI.
   - `/api/v1/admin/*`: Nhóm API bảo vệ nghiêm ngặt dành cho Lễ tân và Quản trị viên (Dashboard, sơ đồ ma trận phòng, check-in, check-out, bảng giá động, upload ảnh R2).

### 4.1.2 Database Auto-Init & Fallback Pattern (`backend/src/db/init.ts` & `fallback.ts`)
Hệ thống cài đặt cơ chế tự phục hồi, đảm bảo **không bao giờ trả về mã lỗi 500 Database Not Bound** ngay cả khi vừa deploy lên Cloudflare Pages mà quản trị viên chưa kịp chạy lệnh gắn kết cơ sở dữ liệu:

```typescript
// backend/src/index.ts - Fallback & Auto-Bootstrap Middleware
const fallbackD1 = createFallbackD1();
const fallbackR2 = createFallbackR2();

app.use('/api/*', async (c, next) => {
  // 1. Kiểm tra D1 Binding
  if (!c.env.DB) {
    (c.env as any).DB = fallbackD1; // Tự động chuyển sang bộ nhớ giả lập in-memory
  } else {
    await ensureDatabaseInitialized(c.env); // Tự động tạo 15 bảng và nạp seed data nếu DB đang rỗng
  }

  // 2. Kiểm tra R2 Storage Binding
  if (!c.env.BUCKET) {
    (c.env as any).BUCKET = fallbackR2;
  }

  await next();
});
```
- **Lợi ích thực tế**: Lập trình viên có thể clone mã nguồn và chạy ngay lập tức bằng lệnh `npm run dev` mà không bắt buộc phải cài đặt máy chủ cơ sở dữ liệu cục bộ cồng kềnh; đồng thời khi triển khai thực tế lên Cloudflare D1/R2, hệ thống tự động nhận diện và chuyển sang môi trường lưu trữ phân tán bền vững.

### 4.1.3 Authentication & Rate Limiting (`backend/src/middleware/auth.ts`)
- **Thuật toán mật khẩu an toàn**: Không sử dụng các thư viện ngoài phụ thuộc binary C++, hệ thống dùng trực tiếp **Web Crypto API** gốc để băm mật khẩu bằng thuật toán **PBKDF2-HMAC-SHA256** với **100.000 vòng lặp** và chuỗi Salt ngẫu nhiên 16 bytes. Khi xác thực so sánh mật khẩu, hệ thống dùng hàm so sánh thời gian hằng số (`Constant-time Comparison`) để triệt tiêu hoàn toàn nguy cơ tấn công dò thời gian (`Timing Attack`).
- **Quản lý phiên làm việc phân tán (Edge Session Store)**: Khi người dùng đăng nhập thành công, máy chủ sinh chuỗi token bảo mật ngẫu nhiên 32 bytes (256-bit entropy). Server **chỉ lưu trữ bản băm SHA-256 (`token_hash`)** trong bảng `sessions` của D1, token gốc được gửi về client thông qua Cookie `HttpOnly; SameSite=Lax; Secure; Path=/` (hỗ trợ kèm Header `X-Auth-Token` cho các client di động). Ngay cả khi cơ sở dữ liệu bị lộ, kẻ tấn công cũng không thể giả mạo phiên làm việc của người dùng.
- **Unified Login**: Cổng đăng nhập hợp nhất `/api/v1/auth/login` tự động phát hiện vai trò (`customer`, `staff`, `admin`). Nếu tài khoản có quyền Lễ tân hoặc Admin, hệ thống tự cấp quyền truy cập các cổng quản trị tương ứng mà không bắt đăng nhập nhiều lần.
- **Chống vét cạn (Rate Limiter)**: Tự động khóa IP tạm thời trong 5 phút nếu xảy ra quá 10 lần đăng nhập thất bại liên tiếp (HTTP 429 Too Many Requests).

### 4.1.4 Room Types, Rooms & R2 Media (`backend/src/index.ts`)
- **Tách biệt giữa Hạng Phòng (Room Type) và Phòng Vật Lý (Room)**:
  - *Hạng phòng (`room_types`)*: Định nghĩa đặc tính chung như Deluxe King, Grand Suite, Family Villa; giá cơ sở, diện tích, sức chứa tối đa, danh sách tiện ích và thư viện hình ảnh.
  - *Phòng vật lý (`rooms`)*: Là từng căn phòng cụ thể trong khách sạn (ví dụ: Phòng 101, Phòng 102 - Tầng 1, Biệt thự V01) với trạng thái thực tế (`clean`, `dirty`, `maintenance`).
- **Thư viện ảnh trên Cloudflare R2**: Endpoint `POST /api/v1/admin/uploads` kiểm tra định dạng ảnh (`image/jpeg`, `image/png`, `image/webp`), dung lượng tối đa `<= 8MB`, tự sinh khóa duy nhất `rooms/{uuid}.webp`, lưu trực tiếp vào R2 Bucket và phân phối qua endpoint `GET /api/v1/media/:key` với header bộ nhớ đệm vĩnh cửu:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```

### 4.1.5 Bookings, Atomic Overbooking Lock & State Machine
Đây là module cốt lõi của hệ thống, xử lý bài toán trùng phòng (Overbooking) và tính toán chi phí chính xác tuyệt đối:

1. **Khóa chống gửi trùng (`idempotency_key`)**: Phía Client tạo chuỗi UUID duy nhất cho mỗi lượt nhấn nút "Xác nhận đặt phòng". Nếu người dùng bấm liên tục nhiều lần hoặc mạng chập chờn gửi lại request, hệ thống sẽ từ chối tạo đơn trùng lặp và trả về đơn đặt phòng đã tạo thành công trước đó.
2. **Zero-Trust Dynamic Pricing**: Máy chủ loại bỏ hoàn toàn các trường giá do Client gửi lên. Giá phòng được tính lại hoàn toàn từ dữ liệu gốc trong D1 theo công thức:
   $$\text{Giá 1 đêm} = \text{Giá gốc hạng phòng} \times (1 + \text{Hệ số cuối tuần / ngày lễ}) + \text{Phụ thu thêm người}$$
   $$\text{Tổng tiền phòng} = \sum_{\text{ngày } i = \text{check\_in}}^{\text{check\_out} - 1} \text{Giá đêm } i + \text{Phí dịch vụ phụ trợ} - \text{Mã giảm giá}$$
3. **Kiểm tra phòng trống & Khóa nguyên tử (Atomic Date-Overlap Reservation)**:
   Để kiểm tra xem hạng phòng có còn phòng trống trong khoảng thời gian $[D_{in}, D_{out}]$ hay không, hệ thống thực thi truy vấn loại trừ các phòng đã có lịch giao thoa:
   ```sql
   -- Truy vấn tìm danh sách phòng vật lý còn trống của một hạng phòng
   SELECT r.id, r.room_number 
   FROM rooms r
   WHERE r.room_type_id = ? 
     AND r.is_active = 1 
     AND r.status != 'maintenance'
     AND r.id NOT IN (
       SELECT br.room_id 
       FROM booking_rooms br
       JOIN bookings b ON br.booking_id = b.id
       WHERE b.status IN ('confirmed', 'checked_in')
         -- Điều kiện giao thoa hai khoảng thời gian [A, B] và [C, D]:
         AND (b.check_in_date < ? AND b.check_out_date > ?)
     )
   LIMIT ?;
   ```
   Toàn bộ thao tác kiểm tra số lượng phòng còn trống, tạo bản ghi trong bảng `bookings` và gán phòng vật lý trong bảng `booking_rooms` được bọc bên trong một **D1 Database Transaction**. Nếu trong tích tắc đó số lượng phòng không còn đủ, Transaction lập tức Rollback và trả về HTTP 409 `ROOM_UNAVAILABLE`.
4. **State Machine kiểm soát luồng đặt phòng**:
   - `pending` (Khách vừa tạo đơn trên web, chờ thanh toán hoặc xác nhận)
   - `confirmed` (Đã cọc/thanh toán thành công hoặc lễ tân đã xác nhận)
   - `checked_in` (Khách đã đến làm thủ tục nhận phòng)
   - `checked_out` (Khách đã thanh toán chi phí phát sinh và trả phòng)
   - `cancelled` (Đơn bị hủy do khách yêu cầu hoặc quá hạn thanh toán)
   - *Cơ chế giải phóng phòng*: Khi đơn chuyển sang trạng thái `cancelled`, toàn bộ lịch giữ chỗ của phòng đó trong khoảng ngày tương ứng lập tức được giải phóng để phục vụ khách khác.

### 4.1.6 AI Concierge Chatbot Engine (`backend/src/utils/chatbot.ts`)
Được thiết kế theo mô hình **Hybrid Concierge Engine** (kết hợp Rule-based Intent Matching tốc độ cao và Google Gemini 2.5 Flash thông minh):
1. **Phân loại 6 nhóm ý định (Intents)**:
   - `booking_lookup`: Bắt biểu thức chính quy mã đơn `AUR-YYMMDD-XXXX` hoặc số điện thoại 10 chữ số để tra cứu thông tin đặt phòng trong D1 và hiển thị trạng thái ngay lập tức.
   - `check_availability`: Nhận diện ngày muốn ở (ví dụ: "thứ 7 tuần này", "ngày 15 đến 18 tháng sau"), tự động truy vấn D1 để hiển thị danh sách hạng phòng còn trống kèm giá.
   - `amenities_inquiry`: Giải đáp thông tin về hồ bơi vô cực, buffet sáng, spa, giờ mở cửa phòng gym, bãi đỗ xe ô tô.
   - `policy_checkin_checkout`: Hướng dẫn quy định giờ nhận phòng (14:00), trả phòng (12:00), chính sách mang theo thú cưng, chính sách phụ thu trẻ em.
   - `room_recommendation`: Gợi ý phòng theo nhu cầu (cặp đôi hưởng tuần trăng mật, gia đình có con nhỏ, nhóm bạn muốn có bếp nướng BBQ).
   - `general_ai_concierge`: Khi câu hỏi vượt ra ngoài các kịch bản định sẵn (ví dụ: "Quanh resort có quán hải sản nào ngon?", "Thời tiết tháng này đi tắm biển được không?"), hệ thống tự động nhúng ngữ cảnh khách sạn, bảng giá, danh sách phòng hiện có vào `systemInstruction` và gửi lịch sử 6 tin nhắn gần nhất sang mô hình **Google Gemini 2.5 Flash** để phản hồi tự nhiên, chuẩn mực và lịch thiệp.

---

## 4.2 Frontend - React 19 + Vite SPA

### 4.2.1 Routing & Layout (`frontend/src/App.tsx`)
Hệ thống sử dụng cơ chế `React.lazy()` và `Suspense` để tối ưu tải trang, chia làm 2 phân hệ Layout hoàn chỉnh với 24 routes:

```
frontend/src/pages/
├── MainLayout (Giao diện Khách hàng - 16 Routes)
│   ├── HomePage.tsx                 # / : Hero tìm kiếm, Giới thiệu resort, Phòng nổi bật, Ưu đãi
│   ├── RoomsPage.tsx                # /rooms : Bộ lọc ngày, hạng phòng, tiện ích, khoảng giá
│   ├── RoomDetailPage.tsx           # /rooms/:slug : Chi tiết phòng, thư viện ảnh 360, chọn dịch vụ
│   ├── BookingCheckoutPage.tsx      # /checkout : Nhập thông tin khách, ghi chú, mã giảm giá, phương thức
│   ├── BookingSuccessPage.tsx       # /booking-success : Thông tin đặt phòng thành công, mã QR VietQR
│   ├── TrackBookingPage.tsx         # /track-booking : Tra cứu booking bằng mã đơn hoặc SĐT
│   ├── AccountPage.tsx              # /account : Lịch sử đặt phòng, quản lý hồ sơ, tự hủy booking
│   ├── DiningPage.tsx               # /dining : Nhà hàng ẩm thực & Menu đặc sản
│   ├── ExperiencesPage.tsx          # /experiences : Dịch vụ Spa, Tour tham quan, Bể bơi vô cực
│   ├── AboutPage.tsx                # /about : Câu chuyện thương hiệu AURA STAY & Tầm nhìn
│   ├── ContactPage.tsx              # /contact : Bản đồ định vị, thông tin liên hệ, gửi phản hồi
│   ├── PolicyPage.tsx               # /policy : Quy chế nhận/trả phòng, đổi trả & bảo mật thông tin
│   └── NotFoundPage.tsx             # Trang 404 tùy biến phong cách Resort
└── AdminLayout (Cổng Quản trị Lễ tân & Admin - 8 Routes có kiểm soát quyền)
    ├── AdminLoginPage.tsx           # /admin/login : Đăng nhập quản trị viên / lễ tân
    ├── AdminDashboardPage.tsx       # /admin : Thống kê KPI, doanh thu, tỷ lệ lấp đầy, lượt đặt mới
    ├── AdminRoomMatrixPage.tsx      # /admin/matrix : Sơ đồ ma trận phòng trực quan (Trống, Đang ở, Dọn...)
    ├── AdminBookingsPage.tsx        # /admin/bookings : Danh sách booking, gán số phòng, duyệt trạng thái
    ├── AdminRoomsPage.tsx           # /admin/rooms : Danh sách phòng vật lý, cập nhật trạng thái dọn dẹp
    ├── AdminRoomTypesPage.tsx       # /admin/room-types : Quản lý hạng phòng, giá gốc, tải ảnh R2
    ├── AdminPricingPage.tsx         # /admin/pricing : Bảng giá linh hoạt cuối tuần, ngày lễ
    └── AdminCustomersPage.tsx       # /admin/customers : CRM hồ sơ khách, lịch sử lưu trú & chi tiêu
```

### 4.2.2 State Management (`BookingContext.tsx` & `CustomerAuthContext.tsx`)
- **BookingContext**: Lưu trữ bền vững trong `localStorage` (`aura_booking_draft_v1`), quản lý: ngày check-in, ngày check-out, số người lớn, số trẻ em, hạng phòng đã chọn, các gói dịch vụ phụ trợ (đưa đón sân bay, buffet sáng) và mã giảm giá đã áp dụng. Tự động tính toán số đêm lưu trú và tổng chi phí dự kiến trước khi chuyển tới trang thanh toán.
- **CustomerAuthContext**: Đồng bộ trạng thái đăng nhập với endpoint `/api/v1/auth/me`. Khi người dùng là `staff` hoặc `admin`, hệ thống sẽ kích hoạt thanh công cụ truy cập nhanh vào giao diện Quản trị Lễ tân ở góc màn hình.

### 4.2.3 API Integration Pattern (`frontend/src/services/api.ts`)
- Đóng gói hàm `request<T>(path, options)` dựa trên chuẩn `fetch()` hiện đại.
- Tự động cấu hình `credentials: 'include'` cho phép gửi kèm HttpOnly Cookie phiên làm việc.
- Chuẩn hóa việc bắt lỗi thông qua lớp tùy chỉnh `ApiError`: bóc tách chi tiết mã lỗi nghiệp vụ (`ROOM_UNAVAILABLE`, `INVALID_DATES`, `UNAUTHORIZED`) và mảng thông báo lỗi chi tiết từ Zod validator để hiển thị trực tiếp lên form.

### 4.2.4 Admin Dashboard, Timeline & Room Matrix (`frontend/src/pages/admin/`)
- **Sơ đồ ma trận phòng trực quan (Room Matrix)**: Hiển thị toàn bộ các phòng vật lý theo dạng thẻ màu sắc thời gian thực:
  - 🟢 **Xanh lục (Available)**: Phòng sạch sẵn sàng đón khách.
  - 🟡 **Vàng (Occupied)**: Đang có khách lưu trú.
  - 🔵 **Xanh dương (Reserved)**: Khách sắp đến nhận phòng trong ngày.
  - 🔴 **Đỏ (Dirty / Cleaning)**: Phòng cần dọn dẹp sau khi khách check-out.
  - ⚫ **Xám (Maintenance)**: Phòng đang bảo trì cơ sở vật chất.
- Thao tác nhanh 1 chạm: Lễ tân có thể bấm vào phòng để xem thông tin khách, chuyển nhanh trạng thái sang "Đã dọn sạch" hoặc thực hiện thủ tục Check-in/Check-out ngay tại chỗ mà không cần mở nhiều trang.
- **KPI Dashboards**: Biểu đồ doanh thu theo 7/30/90 ngày, chỉ số công suất phòng trung bình (**Occupancy Rate**), giá phòng trung bình mỗi ngày (**ADR - Average Daily Rate**), và doanh thu trên mỗi phòng có sẵn (**RevPAR**).

### 4.2.5 Trợ Lý Concierge Chatbot UI (`frontend/src/components/ConciergeChatbot.tsx`)
- Nút bấm tròn sang trọng nổi ở góc phải bên dưới màn hình với biểu tượng lễ tân resort.
- Lưu trữ lịch sử 20 tin nhắn trong `sessionStorage` (`aura_concierge_chat_v1`) giúp cuộc trò chuyện không bị gián đoạn khi chuyển trang.
- Hỗ trợ các nút chọn nhanh chủ đề (**Quick Chips**): *"Tìm phòng cuối tuần này"*, *"Chính sách nhận phòng"*, *"Menu nhà hàng & Spa"*, *"Tra cứu lịch đặt phòng"*.
- Hiển thị trực tiếp thẻ hạng phòng ngay trong khung chat kèm hình ảnh, giá ưu đãi và nút **"Đặt phòng ngay"** (tự động điền ngày đã tư vấn vào form đặt phòng).

---

## 4.3 Shared Types, Constants & Validators (`shared/`)
Thư mục dùng chung đóng vai trò **Nguồn Chân Lý Duy Nhất (Single Source of Truth)** cho toàn bộ dự án:

- `shared/types.ts`: Khai báo kiểu TypeScript cho `RoomType`, `Room`, `Amenity`, `Booking`, `BookingItem`, `CustomerUser`, `AdminUser`, `DashboardKPIs`, `ChatResponseData`.
- `shared/constants.ts`:
  - Hàm định dạng tiền tệ Việt Nam: `formatVND(amount)`.
  - Giờ chuẩn nhận phòng (`CHECK_IN_TIME = '14:00'`) và trả phòng (`CHECK_OUT_TIME = '12:00'`).
  - Danh mục trạng thái đặt phòng: `BOOKING_STATUS = { PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED }`.
  - Hàm xác thực quy tắc chuyển đổi trạng thái hợp lệ: `isValidBookingTransition(currentStatus, nextStatus)`.
- `shared/validators.ts`: Định nghĩa các bộ lọc Zod:
  - Kiểm tra tính hợp lệ của ngày tháng: Ngày Check-in phải từ ngày hiện tại trở đi, Ngày Check-out phải sau ngày Check-in ít nhất 1 ngày.
  - Kiểm tra số điện thoại di động Việt Nam: `/^(0[3|5|7|8|9])+([0-9]{8})$/`.
  - Kiểm tra định dạng Email, Họ tên và thông tin căn cước công dân.

---

## 4.4 Database Schema (Cloudflare D1 - 15 Bảng Chuẩn Hóa)

Cơ sở dữ liệu được định nghĩa đầy đủ tại `backend/migrations/0001_schema.sql` với các ràng buộc khóa ngoại `FOREIGN KEY`, kiểm tra logic `CHECK` và **18 chỉ mục (INDEX)** tối ưu hóa tốc độ truy vấn:

```sql
-- =========================================================================
-- 1. BẢNG NGƯỜI DÙNG (Admin, Lễ tân / Staff, Khách hàng)
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT DEFAULT '',
    full_name TEXT NOT NULL,
    identity_card TEXT DEFAULT '', -- CCCD / Hộ chiếu phục vụ khai báo tạm trú
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =========================================================================
-- 2. BẢNG PHIÊN ĐĂNG NHẬP (Lưu trữ bản băm SHA-256 an toàn trên Edge)
-- =========================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token_hash TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    csrf_token TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================================
-- 3. BẢNG HẠNG PHÒNG (Room Types: Deluxe, Executive Suite, Grand Villa...)
-- =========================================================================
CREATE TABLE IF NOT EXISTS room_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    base_price INTEGER NOT NULL CHECK (base_price >= 0),
    max_adults INTEGER NOT NULL DEFAULT 2 CHECK (max_adults > 0),
    max_children INTEGER NOT NULL DEFAULT 1 CHECK (max_children >= 0),
    area_sqm REAL NOT NULL DEFAULT 35.0,
    bed_type TEXT NOT NULL DEFAULT '1 Giường đôi King size',
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    rating_avg REAL NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =========================================================================
-- 4. BẢNG PHÒNG VẬT LÝ CỤ THỂ (Phòng 101, 102, Villa 01...)
-- =========================================================================
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_type_id INTEGER NOT NULL,
    room_number TEXT NOT NULL UNIQUE,
    floor INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'clean' CHECK (status IN ('clean', 'dirty', 'maintenance')),
    is_active INTEGER NOT NULL DEFAULT 1,
    notes TEXT DEFAULT '',
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT
);

-- =========================================================================
-- 5. BẢNG TIỆN ÍCH PHÒNG (Amenities: Hồ bơi, Wifi tốc độ cao, Buffet...)
-- =========================================================================
CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL, -- Tên icon Lucide như 'wifi', 'coffee', 'waves'
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'bathroom', 'view', 'entertainment', 'service'))
);

-- =========================================================================
-- 6. BẢNG LIÊN KẾT NHIỀU - NHIỀU: HẠNG PHÒNG & TIỆN ÍCH
-- =========================================================================
CREATE TABLE IF NOT EXISTS room_type_amenities (
    room_type_id INTEGER NOT NULL,
    amenity_id INTEGER NOT NULL,
    PRIMARY KEY (room_type_id, amenity_id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- =========================================================================
-- 7. BẢNG QUY TẮC GIÁ ĐỘNG (Dynamic Pricing: Cuối tuần, Ngày lễ, Mùa cao điểm)
-- =========================================================================
CREATE TABLE IF NOT EXISTS pricing_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_type_id INTEGER, -- NULL nghĩa là áp dụng cho toàn bộ resort
    name TEXT NOT NULL,
    start_date TEXT NOT NULL, -- Định dạng YYYY-MM-DD
    end_date TEXT NOT NULL,   -- Định dạng YYYY-MM-DD
    price_multiplier REAL DEFAULT 1.0, -- Ví dụ: 1.25 (tăng 25% dịp lễ)
    extra_charge INTEGER DEFAULT 0,    -- Cộng thêm khoản tiền cố định VNĐ
    is_active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
);

-- =========================================================================
-- 8. BẢNG ĐƠN ĐẶT PHÒNG (Bookings)
-- =========================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,      -- Mã hiển thị: AUR-260324-9821
    idempotency_key TEXT UNIQUE,            -- Khóa chống bấm đúp tạo đơn trùng
    user_id INTEGER,                        -- Khóa ngoại người dùng (NULL nếu là khách vãng lai)
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_identity_card TEXT DEFAULT '',
    check_in_date TEXT NOT NULL,            -- YYYY-MM-DD
    check_out_date TEXT NOT NULL,           -- YYYY-MM-DD
    total_nights INTEGER NOT NULL CHECK (total_nights > 0),
    adults_count INTEGER NOT NULL DEFAULT 1 CHECK (adults_count > 0),
    children_count INTEGER NOT NULL DEFAULT 0 CHECK (children_count >= 0),
    special_requests TEXT DEFAULT '',
    subtotal_price INTEGER NOT NULL CHECK (subtotal_price >= 0),
    extra_services_price INTEGER NOT NULL DEFAULT 0 CHECK (extra_services_price >= 0),
    discount_amount INTEGER NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL DEFAULT 'PAY_AT_CHECKIN' CHECK (payment_method IN ('PAY_AT_CHECKIN', 'BANK_TRANSFER_QR', 'CREDIT_CARD')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================================
-- 9. BẢNG PHÒNG ĐƯỢC GÁN TRONG BOOKING (Booking Rooms)
-- =========================================================================
CREATE TABLE IF NOT EXISTS booking_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    room_type_id INTEGER NOT NULL,
    room_id INTEGER, -- Có thể NULL lúc mới đặt, sau đó Lễ tân xếp phòng cụ thể
    room_type_name_snapshot TEXT NOT NULL,
    room_number_snapshot TEXT DEFAULT '',
    price_per_night_snapshot INTEGER NOT NULL CHECK (price_per_night_snapshot >= 0),
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- =========================================================================
-- 10. BẢNG LỊCH SỬ CHUYỂN TRẠNG THÁI BOOKING (Booking Status Audit)
-- =========================================================================
CREATE TABLE IF NOT EXISTS booking_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    changed_by_user_id INTEGER,
    reason TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================================
-- 11. BẢNG DỊCH VỤ PHÁT SINH KHI LƯU TRÚ (Minibar, Spa, Giặt ủi)
-- =========================================================================
CREATE TABLE IF NOT EXISTS booking_extra_charges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    service_name TEXT NOT NULL,
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    created_by_user_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- =========================================================================
-- 12. BẢNG THƯ VIỆN ẢNH PHÒNG TRÊN CLOUDFLARE R2 (Room Images)
-- =========================================================================
CREATE TABLE IF NOT EXISTS room_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_type_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_key TEXT NOT NULL, -- Key định danh file trên Cloudflare R2
    caption TEXT DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
);

-- =========================================================================
-- 13. BẢNG ĐÁNH GIÁ CỦA KHÁCH HÀNG (Room Reviews)
-- =========================================================================
CREATE TABLE IF NOT EXISTS room_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    room_type_id INTEGER NOT NULL,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
);

-- =========================================================================
-- 14. BẢNG BANNER & KHUYẾN MÃI TRANG CHỦ (Promotions & Banners)
-- =========================================================================
CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    coupon_code TEXT NOT NULL UNIQUE,
    discount_percentage INTEGER CHECK (discount_percentage BETWEEN 1 AND 100),
    discount_amount_max INTEGER DEFAULT 0,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- =========================================================================
-- 15. BẢNG NHẬT KÝ HỘI THOẠI CONCIERGE AI (Concierge Chat Logs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS concierge_chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_id INTEGER,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    intent_detected TEXT DEFAULT 'general_ai_concierge',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =========================================================================
-- CÁC CHỈ MỤC TỐI ƯU HÓA TRUY VẤN (INDEXES)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_rooms_room_type ON rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_booking_rooms_dates ON booking_rooms(room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_dates ON pricing_rules(start_date, end_date);
```

---

# 5. QUY TRÌNH PHÁT TRIỂN

## 5.1 Khởi Tạo Dự Án
```bash
# 1. Cài đặt các gói phụ thuộc cho toàn bộ dự án
npm install

# 2. Khởi tạo cấu trúc 15 bảng cơ sở dữ liệu trên Cloudflare D1 Local
npm run db:migrate:local

# 3. Nạp dữ liệu mẫu ban đầu (Hạng phòng Deluxe, Suite, Villa, tiện ích & tài khoản admin)
npm run db:seed
```

## 5.2 Development Workflow
```bash
# Khởi chạy server phát triển tích hợp (Vite Client + Hono Edge Worker + D1 Local)
npm run dev
# -> Truy cập ứng dụng tại: http://localhost:5173
# Tài khoản Quản trị mặc định: admin@aurastay.vn / AuraStay@2026

# Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript không xuất lỗi
npm run typecheck

# Chạy bộ kiểm thử tự động 20 kịch bản đặt phòng và bảo mật
npm test

# Đóng gói sản phẩm cho môi trường Production
npm run build
```

## 5.3 Environment Configuration

| Tên Biến Môi Trường | Ý Nghĩa & Mục Đích Sử Dụng | Môi Trường Mặc Định |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Môi trường vận hành (`development` / `production`). | `development` |
| `DEFAULT_CHECKIN_HOUR` | Giờ nhận phòng mặc định theo quy chuẩn quốc tế. | `14` |
| `DEFAULT_CHECKOUT_HOUR`| Giờ trả phòng mặc định theo quy chuẩn quốc tế. | `12` |
| `ADMIN_BOOTSTRAP_EMAIL`| Email khởi tạo tài khoản Quản trị viên hệ thống. | `admin@aurastay.vn` |
| `ADMIN_BOOTSTRAP_PASSWORD`| Mật khẩu khởi tạo Quản trị viên hệ thống. | `AuraStay@2026` |
| `GEMINI_API_KEY` | Khóa API kích hoạt trí tuệ nhân tạo Google Gemini 2.5 Flash. | *Bí mật Cloudflare Secret* |
| `DB` (Binding) | Kết nối cơ sở dữ liệu phân tán Cloudflare D1 Database. | `aura-stay-db` |
| `BUCKET` (Binding) | Kết nối lưu trữ tệp hình ảnh Cloudflare R2 Bucket. | `aura-stay-assets` |

---

# 6. CÁC QUY TRÌNH NGHIỆP VỤ

## 6.1 User Journey: Tìm Phòng Theo Ngày, Đặt Phòng & Tra Cứu Booking
1. **Tìm kiếm ngày lưu trú**: Tại trang chủ `/`, người dùng chọn Ngày Check-in, Ngày Check-out và Số lượng khách (Người lớn + Trẻ em) $\rightarrow$ Hệ thống chuyển sang trang `/rooms` tự động lọc ra các hạng phòng còn phòng vật lý trống trong toàn bộ khoảng ngày đó.
2. **Khám phá chi tiết**: Khách xem chi tiết hạng phòng tại `/rooms/:slug`, quan sát tiện ích (view biển, bồn tắm nằm, bữa sáng buffet miễn phí), diện tích và chọn thêm các dịch vụ đưa đón sân bay.
3. **Thanh toán an toàn (Zero-Trust)**:
   - Khách chuyển sang `/checkout`, nhập thông tin cá nhân (Họ tên, SĐT, Email). Nếu đã đăng nhập, thông tin sẽ được tự động điền sẵn.
   - Chọn hình thức: Thanh toán chuyển khoản nhanh qua **VietQR** hoặc Thanh toán khi nhận phòng tại quầy (**Pay at Check-in**).
   - Nhấn "Xác nhận đặt phòng" kèm `idempotency_key`. Máy chủ kiểm tra lại tồn kho phòng trống, tính lại giá chính xác từ D1 và cấp Mã đặt phòng độc quyền `AUR-YYMMDD-XXXX`.
4. **Theo dõi đơn phòng**: Khách có thể tra cứu trạng thái đơn bất cứ lúc nào tại `/track-booking` chỉ bằng cách nhập Số điện thoại hoặc Mã đặt phòng, hoặc quản lý danh sách phòng đã đặt tại trang cá nhân `/account`.

## 6.2 Admin / Lễ Tân Flow: Quản Lý Sơ Đồ Phòng, Check-in/Check-out & Doanh Thu
1. **Đăng nhập phân quyền**: Lễ tân hoặc Quản trị viên đăng nhập tại `/admin/login`. Hệ thống xác thực bằng cookie `HttpOnly` an toàn và tự động chuyển hướng vào cổng điều hành.
2. **Theo dõi trực quan (Room Matrix & Timeline)**:
   - Lễ tân mở `/admin/matrix` để nắm bắt tình hình toàn bộ các phòng trong ngày.
   - Khi khách đến: Bấm vào phòng tương ứng $\rightarrow$ Kiểm tra thông tin $\rightarrow$ Nhấn nút **"Check-in"** $\rightarrow$ Hệ thống chuyển trạng thái đơn sang `checked_in`, phòng chuyển sang màu vàng (Occupied).
   - Trong quá trình lưu trú: Ghi nhận thêm chi phí giặt là, đồ uống minibar qua module phụ thu `booking_extra_charges`.
   - Khi khách rời đi: Bấm nút **"Check-out"** $\rightarrow$ In hóa đơn tổng kết $\rightarrow$ Phòng tự động chuyển sang màu đỏ (Dirty / Cần dọn dẹp).
3. **Quản lý giá và hình ảnh**: Admin tạo các chương trình giá linh hoạt cho dịp cuối tuần (tăng 20%) và các dịp nghỉ lễ lớn tại `/admin/pricing`; tải ảnh phòng mới lên R2 với tốc độ cao.

## 6.3 Chatbot Flow: Tư Vấn Chọn Phòng & Tra Cứu Lịch Trình Tự Động
1. Khách hàng mở cửa sổ **AURA Concierge** ở góc dưới màn hình.
2. **Tư vấn thông minh**:
   - Khách gõ: *"Mình muốn tìm phòng cho gia đình 4 người có ban công ngắm biển cuối tuần này"* $\rightarrow$ Concierge Engine nhận diện nhu cầu, lọc các hạng phòng phù hợp trong D1 và gửi thẻ xem phòng trực tiếp vào khung chat.
3. **Tra cứu booking tự động**:
   - Khách nhập: *"Tra cứu đơn AUR-260324-1102"* hoặc *"Kiểm tra lịch đặt của số 0912345678"* $\rightarrow$ Bot tự động truy vấn bảng `bookings`, hiển thị thông tin ngày đến, số đêm và trạng thái hiện tại.
4. **Hỏi đáp điểm đến**:
   - Khách hỏi về thời tiết, quán ăn ngon lân cận $\rightarrow$ Bot chuyển tiếp ngữ cảnh sang **Google Gemini 2.5 Flash** để tư vấn chân thành, lịch thiệp như một hướng dẫn viên bản địa chuyên nghiệp.

---

# 7. CÁC VẤN ĐỀ & GIẢI PHÁP

## 7.1 Vấn Đề Đã Giải Quyết

| Vấn Đề Thách Thức Kỹ Thuật | Giải Pháp Đã Triển Khai Trong AURA STAY |
| :--- | :--- |
| **Lỗi 500 khi vừa triển khai chưa liên kết D1/R2** | Thiết kế cơ chế `fallback.ts` kết hợp bộ nhớ In-Memory Adapter và Cloudflare Edge Cache API; tự động chạy migration khởi tạo bảng và seed dữ liệu nếu DB đang trống. |
| **Trùng phòng đồng thời (Overbooking Race Condition)** | Áp dụng thuật toán kiểm tra giao thoa khoảng ngày `(check_in < req_out AND check_out > req_in)` và thực thi gán phòng vật lý bên trong một D1 Transaction nguyên tử, tự rollback nếu hết phòng. |
| **Khách hàng can thiệp sửa giá phòng ở Client** | Áp dụng nguyên tắc **Zero-Trust Dynamic Pricing**: Máy chủ bỏ qua mọi tham số giá từ Client, tự động tính toán lại từng đêm lưu trú dựa trên biểu giá gốc trong D1 và các hệ số phụ thu mùa vụ. |
| **Bấm liên tục nút đặt phòng hoặc mạng chập chờn** | Tích hợp cơ chế khóa **`idempotency_key`** duy nhất trên mỗi phiên đặt phòng, ngăn chặn tạo 2 đơn trùng lặp và giữ chỗ thừa. |
| **Mất lịch sử đặt phòng khi khách đặt vãng lai rồi mới tạo tài khoản** | Tự động thực thi câu lệnh đồng bộ `UPDATE bookings SET user_id = ? WHERE customer_phone = ? OR customer_email = ?` ngay khi khách đăng ký hoặc đăng nhập tài khoản. |
| **Bảo mật phiên đăng nhập trên hạ tầng Edge không có Redis** | Băm mật khẩu bằng **PBKDF2 100.000 vòng** qua Web Crypto API; chỉ lưu trữ chuỗi băm **SHA-256 (`token_hash`)** trong D1 và bảo vệ bằng Cookie HttpOnly SameSite=Lax. |
| **AI Chatbot tư vấn sai giá phòng hoặc bịa tiện ích không có** | Kiến trúc Hybrid Concierge: Ưu tiên truy vấn trực tiếp bảng `room_types` và `bookings` bằng Regex; chỉ sử dụng Gemini 2.5 Flash khi câu hỏi mở và **nhồi toàn bộ dữ liệu phòng thực tế vào System Prompt**. |

## 7.2 Technical Debt / Kế Hoạch Nâng Cấp

| Mức Độ Ưu Tiên | Hạng Mục Cần Nâng Cấp | Mô Tả Kỹ Thuật & Giải Pháp Triển Khai |
| :---: | :--- | :--- |
| 🟡 **Cao (High)** | Tách nhỏ tệp định tuyến chính `backend/src/index.ts` | Hiện tại tệp `index.ts` gộp chung nhiều module; cần phân rã thành các sub-routers chuyên biệt theo chuẩn Clean Architecture (`routes/room-types.ts`, `routes/bookings.ts`, `routes/admin.ts`). |
| 🟢 **Trung bình** | Tích hợp Webhook gạch nợ thanh toán tự động VietQR | Tích hợp giải pháp Webhook thông minh (như SePay / Casso / PayOS) để khi khách chuyển khoản quét mã QR thành công, hệ thống tự động đổi `payment_status = 'paid'` và `status = 'confirmed'`. |
| 🟢 **Trung bình** | Gửi thông báo Email xác nhận & Tin nhắn Zalo ZNS | Tự động gửi Email xác nhận kèm tệp hóa đơn PDF cho khách qua Resend API / Cloudflare Email Routing ngay khi đặt phòng thành công. |
| 🔵 **Thấp (Low)** | Phân tích AI Insights từ nhật ký trò chuyện của khách | Định kỳ tổng hợp bảng `concierge_chat_logs` bằng Gemini để báo cáo các tiện ích và hạng phòng mà du khách tìm kiếm nhiều nhất cho Ban Giám đốc. |

---

# 8. HƯỚNG DẪN TRIỂN KHAI

## 8.1 Development Môi Trường Cục Bộ
```bash
# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy server phát triển tích hợp
npm run dev
# Truy cập: http://localhost:5173
# Tài khoản Quản trị viên mặc định: admin@aurastay.vn / AuraStay@2026
```

## 8.2 Đóng Gói Production Build
```bash
# Kiểm tra toàn bộ mã nguồn không phát sinh lỗi kiểu TypeScript
npm run typecheck

# Chạy toàn bộ 20 kịch bản kiểm thử tích hợp
npm test

# Đóng gói sản phẩm hoàn chỉnh
npm run build
# -> Thư mục giao diện tĩnh Frontend: dist/
# -> Tệp bundle Cloudflare Pages Worker: dist/_worker.js
```

## 8.3 Triển Khai Cloudflare Edge
```bash
# 1. Đăng nhập vào tài khoản Cloudflare
npx wrangler login

# 2. Khởi tạo cơ sở dữ liệu D1 và bộ lưu trữ R2 trên Cloudflare Production
npx wrangler d1 create aura-stay-db
npx wrangler r2 bucket create aura-stay-assets

# 3. Thực thi migration tạo 15 bảng cơ sở dữ liệu trên D1 Production
npm run db:migrate:prod

# 4. Thiết lập các biến môi trường bí mật (Secrets) an toàn
npx wrangler secret put ADMIN_BOOTSTRAP_EMAIL
npx wrangler secret put ADMIN_BOOTSTRAP_PASSWORD
npx wrangler secret put GEMINI_API_KEY

# 5. Triển khai toàn bộ ứng dụng lên Cloudflare Pages
npm run deploy:web
```

---

# 9. KẾT LUẬN & ĐÁNH GIÁ

## 9.1 Điểm Mạnh
- ✅ **Kiến trúc Full-Stack Serverless Edge Tiên Tiến**: Phục vụ người dùng toàn cầu với độ trễ phản hồi cực thấp nhờ hạ tầng Cloudflare Workers và D1 Database; vận hành trơn tru không phát sinh sự cố CORS.
- ✅ **Cơ Sở Dữ Liệu Quan Hệ Chuẩn Mực (15 Bảng D1)**: Phân tách rõ ràng giữa Hạng phòng trừu tượng và Phòng vật lý cụ thể, hỗ trợ tính giá linh hoạt theo mùa vụ, lưu vết lịch sử chuyển đổi trạng thái đơn và theo dõi chi tiết tình trạng phòng.
- ✅ **Bảo Mật & Xử Lý Nghiệp Vụ Khách Sạn Chặt Chẽ**: Thuật toán kiểm tra giao thoa khoảng ngày nguyên tử triệt tiêu hoàn toàn nguy cơ Overbooking; chính sách Zero-Trust Pricing bảo vệ doanh thu khách sạn; mã hóa mật khẩu PBKDF2 100.000 vòng trên Web Crypto API bản địa.
- ✅ **Trợ Lý Du Lịch AI Concierge Trực Chiến**: Tự động giải đáp phòng trống, hướng dẫn quy định lưu trú và tra cứu mã đơn tức thì bằng cơ sở dữ liệu thật kết hợp trí tuệ nhân tạo Google Gemini 2.5 Flash.
- ✅ **Kiểm Thử Tự Động Đáng Tin Cậy**: Hệ thống tích hợp sẵn 20 kịch bản kiểm thử tích hợp tự động với Vitest và `node:sqlite`, bao quát toàn bộ luồng nghiệp vụ từ chọn ngày, đặt phòng, khóa phòng đến quản lý doanh thu.

## 9.2 Điểm Cần Cải Thiện
- Cần hoàn thiện cơ chế đối soát giao dịch chuyển khoản ngân hàng hoàn toàn tự động thông qua Webhook thay vì lễ tân phải bấm xác nhận thủ công trên màn hình quản trị.
- Cần bổ sung cổng thông báo tin nhắn tức thời qua SMS Brandname hoặc Zalo ZNS để nhắc nhở khách giờ nhận phòng trước ngày đến 24 giờ.

## 9.3 Khuyến Nghị Giai Đoạn Tiếp Theo
- **Giai đoạn 1 (Tái cấu trúc)**: Phân rã tệp `backend/src/index.ts` thành các Controller và Service module độc lập theo chuẩn Clean Architecture.
- **Giai đoạn 2 (Tích hợp Thanh toán & Thông báo)**: Tích hợp Webhook ngân hàng VietQR tự động kích hoạt trạng thái đơn và kích hoạt gửi Email xác nhận tức thì qua Resend.
- **Giai đoạn 3 (Nâng tầm Trải nghiệm Khách hàng)**: Bổ sung tính năng Khách tự check-in trực tuyến (Web Check-in) tải ảnh CCCD trước để nhận phòng không chạm (Contactless Check-in) qua mã QR.

---

# 10. PHỤ LỤC

## 10.1 Cây Thư Mục Chi Tiết (File Tree)

```
aura-stay/
├── backend/
│   ├── migrations/
│   │   └── 0001_schema.sql             # Đặc tả 15 bảng SQLite và 18 Indexes cho Cloudflare D1
│   ├── seeds/
│   │   └── seed.sql                    # Dữ liệu mẫu khởi tạo hạng phòng, phòng cụ thể & tiện ích
│   ├── shared/
│   │   ├── constants.ts                # Giờ check-in/out, hằng số trạng thái, hàm format tiền tệ
│   │   ├── types.ts                    # Toàn bộ TypeScript Interfaces cho Hotel & Booking
│   │   └── validators.ts               # Schema Zod kiểm tra ngày tháng, số điện thoại, form đặt phòng
│   ├── src/
│   │   ├── index.ts                    # HonoJS App & Toàn bộ API Endpoints (/api/v1/*)
│   │   ├── db/
│   │   │   ├── init.ts                 # Tự động tạo bảng & bootstrap tài khoản Admin mặc định
│   │   │   └── fallback.ts             # In-Memory D1/R2 Adapter dự phòng sự cố
│   │   ├── middleware/
│   │   │   └── auth.ts                 # Xác thực HttpOnly Cookie, phân quyền RBAC & Rate Limiting
│   │   └── utils/
│   │       ├── chatbot.ts              # Concierge Chatbot Engine (Regex + Google Gemini 2.5)
│   │       ├── crypto.ts               # Web Crypto API PBKDF2-HMAC-SHA256 & SHA-256
│   │       └── response.ts             # Chuẩn hóa JSON phản hồi thống nhất (ok / fail)
│   └── tests/
│       └── api.test.ts                 # 20 kịch bản kiểm thử tích hợp (Vitest + node:sqlite)
└── frontend/
    ├── index.html                      # HTML gốc tải phông chữ sang trọng Outfit & Playfair Display
    ├── public/                         # Ảnh đại diện, favicon, sitemap.xml
    ├── shared/                         # Bản liên kết đồng bộ constants, types, validators
    └── src/
        ├── App.tsx                     # Định tuyến 24 Routes (Lazy-loaded Suspense)
        ├── main.tsx                    # Điểm khởi chạy React 19 + Providers
        ├── index.css                   # Thiết lập Tailwind CSS v4 & bảng màu phong cách Resort
        ├── components/
        │   ├── ConciergeChatbot.tsx    # Widget Trợ lý Concierge AI nổi góc màn hình
        │   ├── RoomCard.tsx            # Thẻ hiển thị hạng phòng (Giá, số khách, tiện ích, ảnh)
        │   ├── DateRangePicker.tsx     # Bộ chọn ngày Check-in / Check-out trực quan
        │   ├── ToastContext.tsx        # Hệ thống thông báo toast phản hồi
        │   └── ErrorBoundary.tsx       # Bắt lỗi giao diện tập trung
        ├── features/
        │   ├── auth/CustomerAuthContext.tsx # Quản lý trạng thái đăng nhập khách hàng / lễ tân
        │   └── booking/BookingContext.tsx   # Quản lý khoảng ngày lưu trú, phòng chọn, voucher
        ├── hooks/
        │   └── useQueries.ts           # Custom React Query Hooks cho phòng và booking
        ├── layouts/
        │   ├── MainLayout.tsx          # Header sang trọng, Navbar, Footer & Chatbot nổi
        │   └── AdminLayout.tsx         # Sidebar điều hướng và khung bảo vệ bảo mật cổng Admin
        ├── pages/                      # 16 trang Khách hàng & 8 trang Quản trị
        └── services/
            └── api.ts                  # Tầng gọi API tập trung & bóc tách ApiError
```

## 10.2 Kịch Bản Kiểm Thử & Scripts Hữu Ích

```json
// package.json - Scripts thực thi
{
  "name": "aura-stay",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "dev:web": "vite",
    "dev:api": "wrangler pages dev dist",
    "build": "vite build && node scripts/build-worker.mjs",
    "typecheck": "tsc --noEmit",
    "lint": "tsc --noEmit",
    "test": "vitest run",
    "db:migrate:local": "wrangler d1 execute aura-stay-db --local --file=./backend/migrations/0001_schema.sql",
    "db:migrate:prod": "wrangler d1 execute aura-stay-db --remote --file=./backend/migrations/0001_schema.sql",
    "db:seed": "wrangler d1 execute aura-stay-db --local --file=./backend/seeds/seed.sql",
    "deploy:api": "npm run build && wrangler pages deploy dist",
    "deploy:web": "npm run build && wrangler pages deploy dist"
  }
}
```
