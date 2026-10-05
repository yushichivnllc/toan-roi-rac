// Ngân hàng mini quiz — nội dung chương 3.
export const quizBank = [
  {
    "question": "Với Σ = {a, b}, xâu nào KHÔNG thuộc Σ*?",
    "options": [
      "abba",
      "ε",
      "aab",
      "abca"
    ],
    "answer": 3,
    "topic": "Bảng chữ cái & xâu",
    "explanation": "Mọi ký tự của một xâu trong Σ* phải thuộc Σ. Chữ c không nằm trong {a, b}, nên “abca” không hợp lệ. Xâu rỗng ε thì luôn thuộc Σ*."
  },
  {
    "question": "Ngôn ngữ {aⁿbⁿ | n ≥ 1} chứa xâu nào?",
    "options": [
      "aabb",
      "abab",
      "abb",
      "ba"
    ],
    "answer": 0,
    "topic": "Ngôn ngữ hình thức",
    "explanation": "aabb có đúng hai chữ a đứng trước hai chữ b, đúng dạng aⁿbⁿ với n = 2. “abab” sai hình dạng vì a và b bị xen kẽ."
  },
  {
    "question": "Biểu thức chính quy (a+b)*abb mô tả ngôn ngữ nào?",
    "options": [
      "Xâu bắt đầu bằng abb",
      "Xâu kết thúc bằng abb",
      "Xâu chứa đúng một abb",
      "Chỉ xâu abb"
    ],
    "answer": 1,
    "topic": "Biểu thức chính quy",
    "explanation": "(a+b)* cho phép một tiền tố bất kỳ trên {a,b}; hậu tố abb khóa ba ký tự cuối. Vì vậy ngôn ngữ gồm mọi xâu kết thúc bằng “abb”."
  },
  {
    "question": "Văn phạm S → aSb | ε sinh ra ngôn ngữ nào?",
    "options": [
      "{aⁿbⁿ | n ≥ 0}",
      "{aⁿbᵐ | n,m ≥ 0}",
      "{aⁿbⁿ | n ≥ 1}",
      "Mọi palindrome trên {a,b}"
    ],
    "answer": 0,
    "topic": "Văn phạm phi ngữ cảnh",
    "explanation": "Mỗi lần dùng S → aSb sẽ thêm một a bên trái và một b bên phải. Quy tắc S → ε cho phép n = 0, nên L = {aⁿbⁿ | n ≥ 0}."
  },
  {
    "question": "NFA và DFA có sức mạnh nhận dạng ngôn ngữ chính quy như thế nào?",
    "options": [
      "NFA mạnh hơn DFA",
      "DFA mạnh hơn NFA",
      "Tương đương về sức mạnh",
      "Không thể chuyển đổi qua lại"
    ],
    "answer": 2,
    "topic": "NFA → DFA",
    "explanation": "Mọi NFA đều có thể chuyển thành DFA tương đương bằng phương pháp tập con. Ngôn ngữ nhận bởi DFA và NFA là cùng một lớp; số trạng thái DFA có thể tăng đến 2ⁿ."
  },
  {
    "question": "Muốn nhận ngôn ngữ {aⁿbⁿ | n ≥ 1}, mô hình nào phù hợp?",
    "options": [
      "DFA",
      "PDA",
      "Regex thuần",
      "Máy trạng thái 2 trạng thái"
    ],
    "answer": 1,
    "topic": "PDA & ngăn xếp",
    "explanation": "PDA có ngăn xếp để ghi nhớ số lượng a chưa được ghép. Đẩy một A cho mỗi a, rồi lấy một A ra cho mỗi b. Ngôn ngữ này không chính quy nên DFA không đủ."
  },
  {
    "question": "Ký hiệu ∅* biểu diễn tập nào?",
    "options": [
      "∅",
      "{ε}",
      "{∅}",
      "Σ*"
    ],
    "answer": 1,
    "topic": "Bẫy ký hiệu",
    "explanation": "Phép lặp Kleene cho phép lặp 0 lần. Lặp ngôn ngữ rỗng 0 lần tạo ra đúng xâu rỗng, vì vậy ∅* = {ε}."
  },
  {
    "question": "Dạng chuẩn Chomsky cho phép quy tắc nào?",
    "options": [
      "A → BC hoặc A → a",
      "AB → a",
      "A → aBC",
      "A → B"
    ],
    "answer": 0,
    "topic": "CNF",
    "explanation": "Trong CNF, mỗi quy tắc có dạng A → BC (hai biến) hoặc A → a (một terminal). Có thể cho phép S → ε nếu ngôn ngữ cần xâu rỗng."
  }
];

export const dailyChallengePool = quizBank;
