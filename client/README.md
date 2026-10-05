# Rời Rạc — giao diện React (client)

Giao diện mới của **Rời Rạc · Electric Study Studio**, chuyển từ `public/*` (vanilla) sang React + Vite.
Kế hoạch đầy đủ: [`../docs/UX-UI-REWRITE-PLAN.md`](../docs/UX-UI-REWRITE-PLAN.md).

## Chạy

```bash
# 1) API + dữ liệu bài tập (cổng 3000) — chạy ở thư mục gốc repo
npm install
npm run dev

# 2) Giao diện React (cổng 5173) — proxy /api và /exercises.json sang cổng 3000
npm --prefix client install
npm run dev:client
```

Mở `http://localhost:5173`.

## Build

```bash
npm run build          # xuất client/dist
npm start              # server.js tự phục vụ bản đã build (nếu có), ngược lại dùng public/
npm test               # test bóc tách bài tập từ README
```

## Ngôn ngữ thị giác

Giao diện dựng theo ảnh tham chiếu (poster tech kiểu VESPERBELL): giấy xám sáng có vân,
mực đen, chữ gothic Anton khổng lồ, chữ dọc viền outline, barcode + nhãn monospace, dải
zigzag, tia sao, dấu căn lề — mỗi màn hình một màu nhấn (cam hoặc periwinkle). Nền là lớp
wireframe **Three.js** (`src/components/Backdrop.jsx`), tôn trọng `prefers-reduced-motion`.
Toàn bộ giá trị nằm trong `src/styles/tokens.css`.

## Kiểm chứng giao diện

```bash
node scripts/shoot.cjs all 1440 900     # ảnh toàn trang (cần chromium trong sandbox)
node scripts/e2e.cjs                    # 15 kiểm tra hành vi bằng trình duyệt thật
```

## Nguyên tắc

- **Màu, chữ, khoảng cách, bán kính, bóng** chỉ khai báo trong `src/styles/tokens.css`. Component không hard-code giá trị trình bày.
- **Nội dung** (lộ trình, quiz, sổ tay, chỉ số) nằm trong `src/data/` — sửa chữ không cần sửa JSX.
- **Trạng thái học tập** đi qua `useProgress()` (`src/state/progress.jsx`), lưu ở `localStorage` khoá `roi-rac-study-studio-v1` — trùng bản cũ nên không mất tiến độ.
- **Điều hướng** bằng hash: `#/overview`, `#/roadmap`, `#/practice`, `#/notes`, `#/progress` (deep-link được).
- **Không gọi `localhost` từ trình duyệt**: dev dùng proxy của Vite, prod dùng cùng origin với Express.
