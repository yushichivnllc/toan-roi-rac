/**
 * Nội dung Sổ tay công thức — tách khỏi phần trình bày.
 * Mỗi thẻ gồm: nhãn, tiêu đề, mô tả, chuỗi sao chép nhanh và danh sách các khối nội dung.
 * Phần UI quyết định cách vẽ từng loại khối (`type`) nên có thể đổi giao diện mà không sửa dữ liệu.
 */
export const noteCards = [
  {
    id: 'chomsky',
    tag: 'PHÂN LOẠI',
    tone: 'default',
    title: 'Phân cấp Chomsky',
    description: 'Bốn tầng văn phạm và máy tương ứng — luôn kiểm tra từ loại mạnh nhất xuống.',
    copyText: 'L₃ ⊂ L₂ ⊂ L₁ ⊂ L₀',
    blocks: [
      {
        type: 'chomsky-stack',
        items: [
          { index: '03', name: 'Chính quy', machine: 'DFA / NFA' },
          { index: '02', name: 'Phi ngữ cảnh', machine: 'PDA' },
          { index: '01', name: 'Cảm ngữ cảnh', machine: 'LBA' },
          { index: '00', name: 'Ngữ cấu', machine: 'Máy Turing' },
        ],
      },
      { type: 'formula', text: 'L₃ ⊂ L₂ ⊂ L₁ ⊂ L₀', tone: 'default' },
    ],
  },
  {
    id: 'symbols',
    tag: 'KÝ HIỆU CƠ BẢN',
    tone: 'green',
    title: 'Σ*, Σ⁺ và ε',
    description: 'Σ* chứa mọi xâu, kể cả xâu rỗng. Σ⁺ chỉ chứa xâu khác rỗng.',
    copyText: 'Σ* = Σ+ ∪ {ε};  Σ+ = Σ* \\ {ε};  ∅* = {ε}',
    blocks: [
      {
        type: 'formula',
        tone: 'default',
        lines: ['Σ* = Σ⁺ ∪ {ε}', 'Σ⁺ = Σ* \\ {ε}', '∅* = {ε}'],
        emphasisLine: 2,
      },
      { type: 'note', tone: 'default', text: '∅ khác {ε}: một tập không có phần tử, một tập có đúng xâu rỗng.' },
    ],
  },
  {
    id: 'regular',
    tag: 'NGÔN NGỮ CHÍNH QUY',
    tone: 'lilac',
    title: 'Thứ tự phép toán regex',
    description: 'Lặp mạnh nhất, ghép ở giữa, hợp yếu nhất. Dấu “+” trong giáo trình là phép hợp.',
    copyText: '(r + s)* ≠ r* + s*',
    blocks: [
      {
        type: 'formula',
        tone: 'lilac',
        lines: ['r*  →  lặp', 'rs  →  ghép', 'r + s  →  hợp'],
      },
      { type: 'note', tone: 'lilac', text: '(r+s)* cho phép xen kẽ; r*+s* thì không.' },
    ],
  },
  {
    id: 'subset',
    tag: 'THUẬT TOÁN',
    tone: 'peach',
    title: 'NFA → DFA · phương pháp tập con',
    description: 'Mỗi trạng thái mới là một tập trạng thái cũ. Chỉ liệt kê tập với tới được.',
    copyText: 'T₀ = ε-closure({q₀});  T —a→ ε-closure(⋃ δ(q,a))',
    blocks: [
      {
        type: 'steps',
        items: [
          'Bắt đầu từ ε-closure(q₀).',
          'Gộp mọi trạng thái đi được theo ký tự.',
          'Tập chứa trạng thái kết thúc → kết thúc.',
        ],
      },
    ],
  },
  {
    id: 'cnf',
    tag: 'CHUẨN HÓA',
    tone: 'yellow',
    title: 'Giản lược & CNF',
    description: 'Thứ tự làm sạch văn phạm trước khi đưa về dạng chuẩn Chomsky.',
    copyText: 'ε → quy tắc đơn → vô sinh → không đến được → CNF',
    blocks: [
      { type: 'pipeline', steps: ['ε', 'Đơn', 'Vô sinh', 'CNF'] },
      { type: 'foot', text: 'CNF: A → BC  hoặc  A → a' },
    ],
  },
  {
    id: 'pumping',
    tag: 'CHỨNG MINH',
    tone: 'green',
    title: 'Bổ đề bơm chính quy',
    description: 'Dùng để chứng minh một ngôn ngữ không chính quy. Đây là điều kiện cần, không phải điều kiện đủ.',
    copyText: 'w = xyz; |xy| ≤ n; |y| ≥ 1; ∀i ≥ 0: xyⁱz ∈ L',
    blocks: [
      {
        type: 'formula',
        tone: 'green',
        lines: ['w = xyz', '|xy| ≤ n, |y| ≥ 1', '∀i ≥ 0: xyⁱz ∈ L'],
      },
      { type: 'note', tone: 'green', icon: '→', text: 'Với aⁿbⁿ, chọn w = aⁿbⁿ rồi bơm i = 0 hoặc i = 2.' },
    ],
  },
  {
    id: 'pda',
    tag: 'BỘ NHỚ NGĂN XẾP',
    tone: 'lilac',
    title: 'PDA · FA + ngăn xếp',
    description: 'Bộ nhớ LIFO cho phép máy ghi lại một số lượng không giới hạn.',
    copyText: 'PDA = (Q, Σ, Γ, δ, q₀, z₀, F)',
    blocks: [
      { type: 'stack', items: ['A', 'A', 'A'], bottom: 'z₀ · đáy' },
      { type: 'foot', text: 'Đẩy khi đọc a · lấy ra khi đọc b → nhận aⁿbⁿ' },
    ],
  },
  {
    id: 'exam',
    tag: 'CHECKLIST THI',
    tone: 'peach',
    title: '10 giây trước khi nộp',
    description: 'Rà lại bẫy ký hiệu, điều kiện kết thúc và bước chứng minh.',
    copyText: 'DFA đầy đủ · ε-closure · ngoặc regex · hình trạng PDA · xét mọi cách bơm',
    blocks: [
      {
        type: 'checklist',
        items: ['DFA có trạng thái chết?', 'Đã lấy ε-closure?', 'PDA đã đọc hết xâu?', 'Đã xét đủ vị trí bơm?'],
      },
    ],
  },
];

export const notesBanner = {
  symbol: 'ε',
  overline: 'NHỚ NHANH · CHƯƠNG 3',
  headline: '0 thì tự do. 1 thì không co. 2 thì đơn thân. 3 thì tuyến tính.',
};
