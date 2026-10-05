/** Nội dung tĩnh của trang Tổng quan (bản đồ kiến thức, chỉ số, dải chữ chạy). */
export const editionLine = {
  brand: 'RỜI RẠC® — KHÔNG GIAN HỌC TẬP',
  volume: 'VOL. 03 / HỌC KHÔNG GIỚI HẠN ↗',
};

export const hero = {
  kicker: ['TOÁN RỜI RẠC', 'CHƯƠNG 03'],
  titleTop: 'MỞ KHÓA',
  titleEm: 'TƯ DUY.',
  manifesto: ['HIỂU SÂU HƠN.', 'ĐI XA HƠN MỖI NGÀY.'],
  lede: 'Ô-tô-mát & Ngôn ngữ hình thức. 200 bài tập có lời giải. Một hành trình của riêng bạn.',
  badges: [
    { value: '200', label: 'bài có lời giải' },
    { value: '07', label: 'ngày lộ trình' },
    { value: '05', label: 'mức luyện tập' },
  ],
  posterCoordinate: ['Σ* / δ / q₀', 'KNOWLEDGE IS THE KEY.', '21° 01′ N — 105° 51′ E'],
  posterFooter: ['01 — HIỂU SÂU · NHỚ LÂU · LÀM ĐƯỢC', 'SCROLL TO EXPLORE ↓'],
};

export const tickerItems = ['THINK BEYOND', 'PHÁ VỠ GIỚI HẠN', 'LEARN. SOLVE. REPEAT.', 'Σ · δ · q₀ · PDA'];

export const metricCards = [
  { id: 'library', icon: 'library', tone: 'mint', overline: 'THƯ VIỆN BÀI TẬP', value: 200, unit: 'bài có lời giải', note: 'Từ nhập môn đến cực khó' },
  { id: 'roadmap', icon: 'clock', tone: 'peach', overline: 'LỘ TRÌNH GỢI Ý', value: 7, unit: 'ngày ôn tập', note: 'Mỗi ngày 2–3 giờ tập trung', pad: 2 },
  { id: 'levels', icon: 'check', tone: 'lavender', overline: 'TRỌNG TÂM KIẾN THỨC', value: 5, unit: 'mức độ luyện', note: 'Chia theo đúng cấu trúc tài liệu', pad: 2 },
];

export const topics = [
  {
    id: 'language',
    number: '01 / NỀN TẢNG',
    symbol: 'Σ',
    tone: 'mint',
    title: 'Xâu & ngôn ngữ',
    description: 'Bảng chữ cái, Σ*, phép toán và quy tắc đếm.',
    count: 40,
    dayId: 1,
  },
  {
    id: 'automata',
    number: '02 / MÁY TRẠNG THÁI',
    symbol: 'q₀',
    symbolVariant: 'automaton',
    tone: 'lilac',
    title: 'DFA & NFA',
    description: 'Thiết kế máy, đọc bảng chuyển, xây tập con.',
    count: 45,
    dayId: 3,
  },
  {
    id: 'regex',
    number: '03 / BIỂU DIỄN',
    symbol: '(a+b)*',
    symbolVariant: 'regex',
    tone: 'peach',
    title: 'Regex & văn phạm',
    description: 'Chuyển đổi biểu thức, giản lược và chuẩn hóa.',
    count: 40,
    dayId: 5,
  },
  {
    id: 'pda',
    number: '04 / MÁY CÓ BỘ NHỚ',
    symbol: '▤',
    symbolVariant: 'stack',
    tone: 'yellow',
    title: 'PDA & bổ đề bơm',
    description: 'Ngăn xếp, ngôn ngữ phi ngữ cảnh, chứng minh.',
    count: 35,
    dayId: 6,
  },
];

export const roadmapTip = {
  title: 'Mẹo ôn tập:',
  body: 'Học một chủ đề, tự giải một bài, rồi kiểm tra lời giải. Mỗi lần hoàn thành chặng, đánh dấu để theo dõi tiến độ trên thiết bị này.',
};

export const achievements = [
  { id: 'first-quiz', title: 'Bước đầu tiên', description: 'Hoàn thành một mini quiz', icon: '↗' },
  { id: 'ten-solved', title: 'Người giải bài', description: 'Đánh dấu 10 bài đã ôn', icon: '✓' },
  { id: 'three-days', title: 'Học đều đặn', description: 'Hoàn thành 3 ngày lộ trình', icon: '✳' },
  { id: 'all-days', title: 'Bứt phá', description: 'Hoàn thành đủ 7 ngày', icon: '★' },
];

export const viewLabels = {
  overview: 'Tổng quan',
  roadmap: 'Lộ trình 7 ngày',
  practice: 'Ngân hàng bài tập',
  notes: 'Sổ tay công thức',
  progress: 'Tiến độ của tôi',
};

export const viewOrder = ['overview', 'roadmap', 'practice', 'notes', 'progress'];
