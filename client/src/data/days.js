// Lộ trình ôn tập 7 ngày — trích từ README.md (giữ nguyên nội dung).
export const days = [
  {
    "id": 1,
    "title": "Đại cương & phép đếm",
    "subtitle": "Bảng chữ cái, xâu, ngôn ngữ và phép toán trên ngôn ngữ.",
    "time": "2–3 giờ",
    "range": "Bài 1–40",
    "filter": 1,
    "focus": "Nắm thật chắc những viên gạch đầu tiên: Σ, xâu, ngôn ngữ, phép ghép và cách đếm.",
    "formula": "Σ* = Σ⁺ ∪ {ε}     ·     |Σⁿ| = |Σ|ⁿ",
    "objectives": [
      "Phân biệt ∅ với {ε} và Σ* với Σ⁺.",
      "Tính độ dài, phép ghép và số lượng xâu.",
      "Mô tả một ngôn ngữ bằng tập hợp hoặc điều kiện."
    ],
    "concept": "Một ngôn ngữ hình thức là tập con của Σ*. Xâu rỗng ε luôn có độ dài 0 và thuộc Σ*, nhưng không thuộc Σ⁺."
  },
  {
    "id": 2,
    "title": "Văn phạm & phân loại Chomsky",
    "subtitle": "Dẫn xuất, ngôn ngữ sinh và bốn tầng văn phạm.",
    "time": "2–3 giờ",
    "range": "Bài 41–80",
    "filter": 2,
    "focus": "Xem văn phạm như một hệ thống viết lại: bắt đầu ở ký hiệu gốc, áp dụng quy tắc, sinh ra xâu.",
    "formula": "G = ⟨Σ, Δ, I, R⟩     ·     L₃ ⊂ L₂ ⊂ L₁ ⊂ L₀",
    "objectives": [
      "Viết dẫn xuất đầy đủ và đọc ra L(G).",
      "Phân loại chính quy, phi ngữ cảnh, cảm ngữ cảnh, ngữ cấu.",
      "Nhớ mẹo: tự do → không co → đơn thân → tuyến tính."
    ],
    "concept": "Kiểm tra quy tắc từ loại mạnh nhất xuống: loại 3 cần dạng tuyến tính; loại 2 cần vế trái là một biến; loại 1 không giảm độ dài."
  },
  {
    "id": 3,
    "title": "Ô-tô-mát hữu hạn · DFA",
    "subtitle": "Đọc bảng chuyển, mô phỏng xâu và thiết kế máy trạng thái.",
    "time": "2–3 giờ",
    "range": "Bài 81–109",
    "filter": 3,
    "focus": "Trước khi vẽ DFA, hãy hỏi: máy cần nhớ điều gì để quyết định xâu có hợp lệ không?",
    "formula": "M = (Q, Σ, δ, q₀, F)     ·     nhận ⇔ δ*(q₀,w) ∈ F",
    "objectives": [
      "Mô phỏng một xâu từng ký tự một.",
      "Thiết kế DFA cho “chứa”, “kết thúc”, “chia hết”.",
      "Hoàn thiện bảng chuyển, kể cả trạng thái chết."
    ],
    "concept": "DFA chỉ có hữu hạn trạng thái và không có bộ nhớ phụ. Tên trạng thái nên mô tả ý nghĩa cần ghi nhớ: parity, hậu tố hoặc tiến độ khớp mẫu."
  },
  {
    "id": 4,
    "title": "NFA, ε-NFA & phương pháp tập con",
    "subtitle": "Tính đóng, ε-closure, chuyển đổi NFA thành DFA.",
    "time": "2–3 giờ",
    "range": "Bài 110–145, 196–197",
    "filter": 3,
    "focus": "NFA và DFA có cùng sức mạnh biểu diễn; khác biệt nằm ở số trạng thái và cách tính chuyển.",
    "formula": "T₀ = ε-closure({q₀})     ·     Fᴰ = {T : T ∩ Fᴺ ≠ ∅}",
    "objectives": [
      "Tính ε-closure trước và sau mỗi bước nếu có ε.",
      "Gộp các trạng thái NFA thành một tập trạng thái DFA.",
      "Chỉ lập các tập con đi tới được; xác định tập kết thúc."
    ],
    "concept": "Trong phép xây dựng tập con, một trạng thái DFA chính là một tập trạng thái NFA. Tập rỗng có thể đóng vai trò trạng thái chết."
  },
  {
    "id": 5,
    "title": "Regex, văn phạm & dạng chuẩn",
    "subtitle": "Thompson, chuyển đổi FA ↔ văn phạm và CNF.",
    "time": "2–3 giờ",
    "range": "Bài 126–165",
    "filter": 4,
    "focus": "Nhìn một ngôn ngữ từ ba góc: biểu thức chính quy, ô-tô-mát và văn phạm.",
    "formula": "A → BC  |  A → a     ·     ε → đơn → vô sinh → không đến được → CNF",
    "objectives": [
      "Đọc regex đúng thứ tự ưu tiên: lặp, ghép, hợp.",
      "Dùng Thompson để xây ε-NFA từ regex.",
      "Đưa văn phạm về dạng chuẩn Chomsky đúng thứ tự."
    ],
    "concept": "Trong ký hiệu của giáo trình, dấu + là phép hợp. CNF cho phép A → BC hoặc A → a (ngoại lệ S → ε nếu ngôn ngữ chứa ε)."
  },
  {
    "id": 6,
    "title": "PDA · máy có ngăn xếp",
    "subtitle": "Hình trạng, quy tắc đẩy/lấy và ngôn ngữ phi ngữ cảnh.",
    "time": "2–3 giờ",
    "range": "Bài 177–190",
    "filter": 5,
    "focus": "Thêm một ngăn xếp LIFO vào FA để máy có thể nhớ số lượng chưa biết trước.",
    "formula": "PDA = (Q, Σ, Γ, δ, q₀, z₀, F)     ·     aⁿbⁿ: push A / pop A",
    "objectives": [
      "Ghi hình trạng theo đúng thứ tự: (trạng thái, xâu còn lại, ngăn xếp).",
      "Thiết kế PDA cho aⁿbⁿ và ngoặc cân bằng.",
      "Nêu rõ nhận theo trạng thái kết thúc hay ngăn xếp rỗng."
    ],
    "concept": "FA không thể nhớ số lượng a tùy ý; PDA dùng ngăn xếp để đẩy một ký hiệu cho mỗi a, rồi lấy ra cho mỗi b."
  },
  {
    "id": 7,
    "title": "Bổ đề bơm & tổng ôn",
    "subtitle": "Chứng minh, tính đóng, phân cấp và ứng dụng CNTT.",
    "time": "2–3 giờ",
    "range": "Bài 166–176, 191–200",
    "filter": 5,
    "focus": "Kết nối mọi mảnh ghép và luyện cách lập luận đủ chặt trong bài thi.",
    "formula": "w = xyz;  |xy| ≤ n;  |y| ≥ 1;  ∀i ≥ 0: xyⁱz ∈ L",
    "objectives": [
      "Chọn xâu “khó xử” và xét mọi cách tách hợp lệ.",
      "Phân biệt điều kiện cần với điều kiện đủ của bổ đề bơm.",
      "Ôn tính đóng, Myhill–Nerode và phân cấp Chomsky."
    ],
    "concept": "Để chứng minh không chính quy, giả sử L chính quy, chọn w đủ dài, xét mọi cách tách xyz, rồi tìm i làm xâu bị bơm ra ngoài L."
  }
];

export const dayById = (id) => days.find((day) => day.id === Number(id));
