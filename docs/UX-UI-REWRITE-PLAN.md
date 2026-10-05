# Kế hoạch & báo cáo tái thiết kế UX/UI — Rời Rạc Study Studio

> Trạng thái: **Hoàn tất giai đoạn 0–4 + bản chỉnh lý lần 2** — giao diện React dựng theo
> poster tech (ảnh thứ hai) với nền Three.js; kiểm thử bằng trình duyệt thật (`docs/screens/`).

---

## 1. Ảnh tham chiếu là gì và tôi đã "dịch" nó thế nào

Ảnh người dùng gửi là một **poster/thẻ collage phong cách in risograph** (tông giấy kem,
lưới ô ly mờ, khối mận – cam son, chữ tiêu đề condensed cực đậm, nhãn kỹ thuật monospace,
mã vạch, tem, vé xé). Đây là ảnh *phong cách*, không phải ảnh mockup một trang web cụ thể —
nên việc "code lại giống ảnh" được hiểu là: **lấy toàn bộ ngôn ngữ thị giác của ảnh và áp
lên 5 màn hình học tập hiện có**.

### 1.1 Danh mục thành phần nhận diện được từ ảnh → cách dựng lại

| Chi tiết trong ảnh | Cách tái tạo trong giao diện |
|---|---|
| Giấy kem + lưới ô ly | `body` nền `--paper`, lớp `.rr-paper` phủ lưới nhỏ 13px + lưới lớn 104px + vân nhiễu SVG |
| Khối mận (maroon) + chữ giấy | Panel `.rr-panel--block`, khối tiêu đề `.rr-hero-block`, banner sổ tay |
| Cam son (vermilion) làm điểm nhấn | Nút CTA, thanh tiến độ, khoá dòng đang học, biểu đồ hôm nay, con dấu |
| Chữ tiêu đề "NGL / REPLIES" | `Anton` cỡ `clamp(3.4rem, 11.5vw, 9.5rem)` với bóng in lệch 4px |
| Nhãn nhỏ "ATMOS / 03 / MB · CM" | `.rr-label` — IBM Plex Mono, giãn chữ 0.17em, in hoa |
| Mã số lớn "004" và mũi tên khối | `.rr-hero-num` + `.rr-arrow` (mũi tên tam giác CSS) |
| Ô "unread emails" nền mực | Nút `.rr-hero-mail` — "Còn N bài chưa mở" |
| Thẻ "Meet Me / 03:18 P.M." | Panel `.rr-meet` — "HỌC HÔM NAY / Ngày 07" kèm thanh tiến độ |
| Thẻ thư viện có barcode + nhãn MB·CM | `.rr-library` (nền mận, barcode sinh theo seed, khối QR giả) |
| Chồng vé/thiệp có khía xé | `.rr-ticket-card`, `.rr-topic` với khía tròn khoét đúng mép |
| Mũi tên ⟶ cạnh "PHÁ VỠ GIỚI HẠN" | Dải chữ chạy `.rr-ticker` nền mực, xen ký hiệu ✳ và → |
| Chấm halftone + ký hiệu căn lề ⌐ | `.rr-halftone` và `.rr-rule::before/after` |
| Con dấu đỏ dán lệch | `.rr-library-seal` (03 / CHƯƠNG), `.rr-meet-sticker` (R) |
| Emoji trong nội dung README | Thay bằng nhãn in `.rr-badge` (`OK`, `X`, `!`, `*`) để không phá tông in ấn |

### 1.2 Các quyết định thiết kế có chủ đích

- **Giữ tông giấy thay vì dark mode**: ảnh là bản in trên giấy; nền tối sẽ phá vỡ ngôn ngữ này.
- **Tiếng Việt có dấu**: dùng Anton + Archivo bản `vietnamese` subset; các từ dài như
  "NGÂN HÀNG BÀI TẬP" tự thu nhỏ theo `clamp()` thay vì ép cỡ chữ của ảnh.
- **Bỏ GSAP**: chuyển động chuyển sang CSS + `IntersectionObserver` (đếm số khi cuộn tới),
  giảm 60KB JS so với bản cũ mà vẫn giữ hiệu ứng xuất hiện.
- **Màu ngữ nghĩa**: 8 thẻ sổ tay vốn có các tông `green/lilac/peach/yellow`; các tông này
  được ánh xạ về bảng màu mực–mận–son thay vì pastel để hợp ảnh.

---

## 2. Kiểm kê hiện trạng bản cũ (deep audit)

| Tệp | Vai trò | Ghi chú |
|---|---|---|
| `server.js` | Express: API + static + SPA fallback | Nguồn dữ liệu là `README.md` |
| `lib/exercises.js` | Bóc 200 bài tập từ README, gán 5 mức | `extractExercises`, `LEVELS` |
| `public/index.html` | Toàn bộ markup 5 màn hình | 371 dòng, viết tay |
| `public/app.js` | Logic UI (1101 dòng, IIFE) | State + render bằng `innerHTML` |
| `public/styles.css` + `public/theme.css` | Hai tệp CSS chồng nhau | 760 + 993 dòng, nhiều ghi đè |
| `public/style-lab.html` | Trang thí nghiệm giao diện | Không nằm trong luồng chính |
| `test/exercises.test.js` | Test bóc tách bài tập | `node --test` — vẫn xanh |

**Vấn đề đã giải quyết:** markup khổng lồ một tệp · hai tầng CSS xung đột · render bằng
`innerHTML` rải rác · không có token thiết kế · không deep-link được.

---

## 3. Kiến trúc mới

```
client/
├─ index.html                 # vỏ HTML (không còn link Google Fonts — font tự host)
├─ vite.config.js             # dev 0.0.0.0:5173, allowedHosts, proxy /api + /exercises.json
├─ public/                    # favicon, assets tĩnh
└─ src/
   ├─ main.jsx / App.jsx      # điểm vào + khung ứng dụng
   ├─ api/exercises.js        # tải catalog, lọc, phân trang, lấy chi tiết
   ├─ app/
   │  ├─ useHashRoute.js      # #/overview, #/roadmap, #/practice, #/notes, #/progress
   │  ├─ ToastHost.jsx
   │  ├─ views/{overview,roadmap,practice,notes,progress}.jsx
   │  └─ modals/{Lesson,Exercise,Quiz,About}Modal.jsx + index.jsx
   ├─ components/
   │  ├─ ui.jsx               # Icon, Barcode, Halftone, Chip, Button, Stamp, CountUp, NoteBlock
   │  ├─ TopNav.jsx           # thanh điều hướng + menu toàn màn hình
   │  └─ Modal.jsx            # khung modal, khoá cuộn, trả tiêu điểm
   ├─ data/{days,quizBank,levels,notes,overview}.js
   ├─ lib/markdown.js         # port 1:1 + thay emoji bằng nhãn in
   ├─ state/
   │  ├─ progress.jsx         # tiến độ học tập (localStorage khoá cũ)
   │  └─ ui.jsx               # màn hình, modal, menu, toast, phím tắt
   └─ styles/
      ├─ tokens.css           # ⬅ NGUỒN SỰ THẬT: màu, chữ, khoảng cách, hình khối
      ├─ base.css             # reset + nền giấy + thư viện thành phần
      └─ views.css            # bố cục từng màn hình
```

**Chạy dự án**

```bash
npm install
npm run install:client     # cài React/Vite + font tự host
npm run dev:client         # giao diện React → http://localhost:5173 (proxy sang API)
npm run dev                # API Express   → http://localhost:3000
npm run build              # xuất client/dist; server.js tự phục vụ bản đã build
npm test                   # test bóc tách bài tập (4/4 xanh)
```

### Quy tắc kiến trúc (đang được tuân thủ)

1. Component chỉ dùng biến trong `tokens.css` — kiểm tra bằng cách đổi token và xem toàn bộ đổi theo.
2. Nội dung nằm trong `src/data`, không viết cứng trong JSX.
3. Trạng thái học tập chỉ đi qua `useProgress()`.
4. Mỗi màn hình một tệp trong `src/app/views/`.
5. Không gọi `localhost` từ trình duyệt: dev dùng proxy của Vite, prod dùng cùng origin Express.

---

## 4. Bảng token đã chốt từ ảnh

| Nhóm | Token | Giá trị |
|---|---|---|
| Giấy | `--paper` / `--paper-2` / `--paper-3` | `#eee5d3` / `#f7f1e3` / `#e5d9c0` |
| Mực | `--ink` / `--ink-soft` | `#171310` / `#3d332a` |
| Nhấn | `--vermilion` / `--vermilion-ink` | `#e04e1b` / `#b93c12` |
| Khối đậm | `--madder` / `--madder-3` | `#4b1e10` / `#2e120a` |
| Lưới | `--grid-line` / `--grid-major` | `rgba(191,88,42,.18)` / `104px` |
| Chữ tiêu đề | `--font-display` | Anton 400 (self-host, subset vietnamese) |
| Chữ giao diện | `--font-sans` | Archivo 400/500/600/700/800 |
| Nhãn kỹ thuật | `--font-mono` | IBM Plex Mono 400/500 |
| Thang tiêu đề | `--fs-display` | `clamp(3.4rem, 11.5vw, 9.5rem)` |
| Viền | `--rule` / `--rule-thick` | `2px solid ink` / `3px solid ink` |
| Bóng khối | `--shadow-block` | `6px 6px 0 ink` |
| Bán kính | `--r-panel` / `--r-block` / `--chip` | `22px` / `16px` / `7px` |
| Bố cục | `--frame-w` | `1280px` |

---

## 5. Kiểm chứng bằng trình duyệt thật

Sandbox không tải được Chrome từ CDN, nên đã dựng **chromium hoạt động được** (npm
`@sparticuz/chromium` + thư viện stub NSS/NSPR biên dịch bằng gcc) để chụp ảnh và đo DOM:

```bash
node scripts/shoot.cjs all 1440 900          # ảnh toàn trang 5 màn hình
node scripts/shoot.cjs overview 1440 900 .rr-hero   # ảnh cận cảnh theo selector
node scripts/shoot.cjs practice 1440 1000 .rr-modal "document.querySelector('.rr-exercise').click()"
node scripts/e2e.cjs                          # 15 kiểm tra hành vi
node scripts/docs-shots.cjs                   # sinh ảnh trong docs/screens/
```

**Kết quả `scripts/e2e.cjs` — 15/15 đạt, không lỗi runtime:**

- phân trang 12 dòng/lần · tìm kiếm "pumping" · lọc mức 01 · xoá lọc quay lại 12 dòng
- modal bài tập + lời giải markdown · đánh dấu đã ôn · toast xác nhận
- bộ đếm trên thanh điều hướng cập nhật · tiến độ còn nguyên sau khi tải lại (localStorage)
- trang tiến độ phản ánh số bài · mini quiz 4 đáp án + phản hồi
- `Ctrl/⌘+K` mở ngân hàng bài tập · menu toàn màn hình 5 mục · tìm kiếm trong sổ tay

**Lỗi thật do quá trình kiểm thử phát hiện và đã sửa:** tìm kiếm trong sổ tay trước đây
không khớp `id` thẻ (gõ "pumping" không ra thẻ Bổ đề bơm như bản vanilla) — nay dò cả id,
nhãn, mô tả và mọi khối nội dung.

Ảnh chụp: `docs/screens/desktop-*.jpg` (5 màn hình), `modal-exercise.jpg`, `mobile-overview.jpg`.

---

## 6. Checklist parity — giữ đủ tính năng bản cũ

**Tổng quan** — ✅ hero đầy đủ (tiêu đề, manifesto, mô tả, 2 CTA, 3 badge) · ✅ panel tiến độ
% + số bài + thanh tiến độ + câu gợi ý theo mốc · ✅ 3 thẻ chỉ số đếm số khi cuộn tới ·
✅ dải chữ chạy · ✅ xem trước 3 ngày + gợi ý ngày đang học · ✅ thử thách hôm nay (khoá theo
ngày, phản hồi đúng/sai) · ✅ 4 thẻ chủ đề.

**Lộ trình** — ✅ thanh tiến độ % · ✅ 7 chặng với 3 trạng thái · ✅ modal bài học 4 phần
(trọng tâm, công thức, mục tiêu, ý chính, mẹo) · ✅ nút "Luyện bài N" lọc đúng mức ·
✅ bật/tắt hoàn thành · ✅ ghi chú mẹo ôn tập.

**Bài tập** — ✅ tìm kiếm không dấu/có dấu · ✅ 6 bộ lọc · ✅ skeleton khi tải · ✅ trạng thái
rỗng · ✅ "Xem thêm" · ✅ đếm kết quả · ✅ nhãn mức · ✅ dấu ✓ bài đã ôn · ✅ modal đề + lời giải
(markdown, bảng, code, blockquote) · ✅ đánh dấu đã ôn.

**Sổ tay** — ✅ 8 thẻ đủ nội dung · ✅ sao chép công thức · ✅ tìm kiếm (khớp cả id) ·
✅ trạng thái rỗng.

**Tiến độ** — ✅ số % cỡ lớn · ✅ 3 thẻ thống kê · ✅ biểu đồ 7 ngày · ✅ 4 huy hiệu theo điều
kiện · ✅ danh sách bài đã đánh dấu · ✅ đặt lại (có xác nhận).

**Dùng chung** — ✅ menu toàn màn hình (thay sidebar thu gọn) · ✅ thanh điều hướng trên cùng
· ✅ modal + quản lý tiêu điểm + khoá cuộn · ✅ toast · ✅ mini quiz 5 câu + màn kết quả ·
✅ `⌘K`/`Ctrl+K`/`/` · ✅ `Esc` · ✅ `prefers-reduced-motion` · ✅ deep-link `#/view`.

**Tương thích dữ liệu:** giữ nguyên khoá `roi-rac-study-studio-v1` và cấu trúc state cũ
(`solvedExercises`, `completedDays`, `quizHistory`, `activity`, `challenge*`) → người đang học
không mất tiến độ. Nút "Vé 03" trong ảnh được dùng lại trong sổ tay để mở lại bài đã lưu.

---

## 7. Rủi ro còn lại & việc nên làm tiếp

| Việc | Lý do |
|---|---|
| Gỡ `public/*` và GSAP khỏi `package.json` | Bản vanilla hiện là phương án dự phòng khi chưa build; nên xoá hẳn sau khi bạn duyệt giao diện mới |
| Dark mode | Ngôn ngữ "bản in trên giấy" không có biến thể tối trong ảnh; nếu cần sẽ làm một bảng màu mực-xanh riêng |
| Font thương mại | Ảnh có thể dùng font khác; Anton/Archivo là lựa chọn miễn phí gần nhất — đổi 1 dòng trong `tokens.css` nếu bạn có bản quyền font gốc |
| Ảnh cho các màn còn lại | Ảnh bạn gửi là poster phong cách; nếu bạn có mockup riêng cho từng màn hình, gửi thêm để mình chỉnh khớp từng khối |

---

## 8. Bản chỉnh lý lần 2 — poster "tech" + Three.js (theo ảnh mới)

Người dùng gửi ảnh tham chiếu thứ hai (thumbnail VESPERBELL): nền giấy **xám sáng** có vân,
chữ gothic siêu đậm màu đen cỡ khổng lồ, **chữ dọc viền outline**, barcode + nhãn monospace
siêu nhỏ, dải zigzag / chùm đường kẻ, mũi tên ↗ trong vòng tròn, tia sao 4 cánh, và mỗi
poster mang **một màu nhấn** (cam hoặc tím periwinkle). Yêu cầu kèm theo: **chuyển sang
Three.js**.

### 8.1 Token mới (`tokens.css`)

| Nhóm | Giá trị mới |
|---|---|
| Giấy | `#ececea` / `#f6f6f4` / `#e2e1de` (xám sáng, bỏ tông kem) |
| Mực | `#0d0d10` |
| Nhấn ấm | cam `#ff5a1f` |
| Nhấn lạnh | periwinkle `#7b78f4` — bật bằng `[data-accent='cool']` trên `.rr-app` |
| Khối đậm | `--madder` ánh xạ sang đen `#131318` (thay mận) |
| Góc | `--r-panel: 10px`, `--r-chip: 4px` — bỏ hầu hết viên thuốc |
| Bóng | mềm kiểu poster: `0 14px 30px rgba(13,13,16,.12)` |

Mỗi màn hình một màu nhấn: `overview/roadmap/progress` = cam, `practice/notes` = periwinkle
(`ACCENTS` trong `App.jsx`). Toàn bộ thành phần chỉ tham chiếu `--vermilion` nên đổi màu
lan toả tự động; các chỗ từng hard-code `rgba(224,78,27,…)` đã chuyển sang
`color-mix(in srgb, var(--vermilion) …, transparent)`.

### 8.2 Three.js (`components/Backdrop.jsx`)

- Canvas cố định phủ sau nội dung (`renderer alpha`), gồm: khối đa diện lưới dây (mực),
  vòng xuyến wireframe **mang màu nhấn của màn hình**, nút dây TorusKnot, và 260 hạt "bụi mực".
- Parallax theo con trỏ; `prefers-reduced-motion` → vẽ đúng một khung hình tĩnh.
- Chunk riêng `three-*.js` (~130KB gzip) qua `manualChunks` để cache lâu.
- Ba cảnh chạy headless trong sandbox xác nhận WebGL (SwiftShader) hoạt động, không lỗi console.

### 8.3 Hoạ tiết poster mới (`ui.jsx` + `base.css`)

`CircleArrows` (↗↗↗ trong vòng tròn), `Sparkle` (sao 4 cánh nhấp nháy), `CropMarks`
(dấu căn lề 4 góc trang), `WaveArcs` (cung tròn đồng tâm), `.rr-zigzag`, `.rr-checker`,
`.rr-lines`, `.rr-vertical--outline` (chữ dọc viền ngoài — "RỜI RẠC · ELECTRIC STUDY
STUDIO" chạy dọc mép trái hero như chữ VESPERBELL).

### 8.4 Bố cục hero mới (Tổng quan)

Dải meta đầu trang = barcode + vòng mũi tên + "BẠN SẴN SÀNG CHƯA? …"; chip đen "TƯ DUY";
tiêu đề hai dòng đen tuyền "MỞ KHÓA / RỜI RẠC." kèm tia sao; dòng phụ giãn chữ
"HỌC ✦ LUYỆN ✦ THỰC CHIẾN" (nhại "KARAOKE ✦ LIVE ✦ STREAM"); dải zigzag + chùm kẻ +
microcopy; tem vuông cam xoay góc thay tem tròn; khối thư viện chuyển đen.

### 8.5 Kiểm chứng lại

- `scripts/e2e.cjs`: 15/15 đạt, không lỗi runtime (chạy trên bản mới).
- `npm test`: 4/4 xanh. Ảnh mới trong `docs/screens/` (chụp lại sau chỉnh lý).
- Build: `index-*.js` ~92KB gzip + `three-*.js` ~130KB gzip.
