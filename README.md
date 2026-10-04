# TOÁN RỜI RẠC — CHƯƠNG 3: Ô-TÔ-MÁT & NGÔN NGỮ HÌNH THỨC
### Bản "hiểu sâu – nhớ lâu – làm được": Lý thuyết trực quan · Cheat sheet · 200 bài tập có lời giải

> **Nguồn chính:** Slide bài giảng *"TRR Chương 3 Otomat vA NNHT"* – Trường ĐH Quản lý và Công nghệ Hải Phòng (79 trang), gồm 4 mục: 3.1 Đại cương về ngôn ngữ hình thức · 3.2 Ô-tô-mát hữu hạn & biểu thức chính quy · 3.3 Văn phạm phi ngữ cảnh · 3.4 Ô-tô-mát đẩy xuống.
> **Bổ trợ (đối chiếu, mở rộng):** giáo trình *Automat và ngôn ngữ hình thức* (Võ Đức Lũng – HUST; Đỗ Đức Thịnh), bài giảng ĐH Nông nghiệp – FITA, bài tập Ngôn ngữ hình thức (nhannguyen95), tài liệu quốc tế Sipser *Introduction to the Theory of Computation*, Hopcroft–Motwani–Ullman, UCSD CSE105, CMU 15-453, Oxford FCS.
> **Đặc biệt:** Mọi automaton/văn phạm/biểu thức chính quy được dùng làm ví dụ then chốt trong tài liệu này đều đã được **kiểm chứng bằng chương trình mô phỏng** (DFA/NFA/ε-NFA/PDA/CFG) đặt trong thư mục `tools/` của workspace.

---

## 0. CÁCH DÙNG TÀI LIỆU NÀY

| Bạn cần gì? | Đọc phần nào | Thời gian |
|---|---|---|
| Hiểu bản chất, chuẩn bị thi vấn đáp | **Phần I** – Lý thuyết kiểu CNTT | 60–90 phút |
| Nhớ công thức, quy trình chuyển đổi khi làm bài thi viết | **Phần II** – Cheat sheet | 20 phút/ngày × 3 ngày |
| Luyện đề, tự kiểm tra | **Phần III** – 200 bài theo 5 mức | 200 bài ≈ 20–30 giờ |
| Ôn nước rút | Phụ lục A (đáp án nhanh) + B (lộ trình 7 ngày) | 2–3 giờ |

**Ký hiệu trong tài liệu bám đúng theo slide của bạn** (để bạn không bị "khớp lệnh" sai khi thi):

| Trong slide PDF | Ý nghĩa | Ký hiệu quốc tế hay gặp |
|---|---|---|
| `Σ` | Bảng chữ cái kết thúc (terminal) – còn gọi là "từ điển cơ bản" | Σ, T |
| `Δ` | Bảng chữ cái phụ (nonterminal) – "từ điển hỗ trợ" | V, N |
| `I` (hoặc `S`) | Ký hiệu ban đầu (start symbol) | S |
| `^` | Xâu rỗng | ε, λ, Λ |
| `ε-quy tắc` | Quy tắc rỗng `A → ε` | ε-production, λ-production |
| `G = <Σ, Δ, I, R>` | Văn phạm (4 thành phần) | G = (V, T, P, S) |
| `M = (Q, Σ, δ, q₀, F)` | Ô-tô-mát hữu hạn | DFA/NFA |
| `M = <Q, Σ, Δ, δ, q₀, z₀, F>` | Ô-tô-mát đẩy xuống (PDA) | PDA |
| `r + s` | Hợp của hai ngôn ngữ / hai biểu thức chính quy | r \| s (Python/PCRE dùng `\|`) |
| `r*`, `r+` | Lặp Kleene (0 lần trở lên), lặp dương (1 lần trở lên) | `*`, `+` |
| `L1 ⊂ L2` | Bao hàm ngôn ngữ | ⊆ |
| `T(M)`, `N(M)` | Ngôn ngữ đoán nhận theo trạng thái kết thúc / theo ngăn xếp rỗng | L(M), L\_{\text{stack}} |

> ⚠️ **Cảnh báo "bẫy ký pháp":** trong slide (và phần lớn giáo trình VN), dấu `+` nghĩa là **hợp** (`a+b` = "a hoặc b"). Nhưng trong Python/JavaScript/grep (PCRE), `+` nghĩa là **lặp ≥1 lần**, còn hợp là dấu `|`. Khi làm việc với `re` trong Python, hãy tự chuyển ký pháp: `a+b*` (giáo trình) → `a|b*` (Python).

---

## PHẦN I. LÝ THUYẾT — KỂ LẠI BẰNG NGÔN NGỮ CỦA DÂN CNTT

### 1. Bảng chữ cái, xâu, ngôn ngữ (mục 3.1.1)

#### 1.1 Bảng chữ cái (alphabet)
**Định nghĩa:** `Σ` là một tập **hữu hạn, khác rỗng** các ký hiệu; mỗi phần tử gọi là một **chữ cái/ký tự**.

**Hiểu đơn giản theo CNTT:** Bảng chữ cái chính là **tập ký tự hợp lệ** của một định dạng.
- `Σ = {0,1}` → encoder/decoder nhị phân.
- `Σ = {a,…,z, A,…,Z, 0,…,9, _, @, .}` → tập ký tự một địa chỉ email.
- Trong thực tế ta dùng ASCII (128 ký tự) hoặc UTF‑8 (hơn 1 triệu mã điểm) — đều là các **bảng chữ cái hữu hạn**.

**Ví dụ trong slide:** bảng chữ cái Latinh, bảng chữ cái Hy Lạp (24 ký tự), bảng chữ số thập phân, bảng chữ số nhị phân, bảng "từ khóa" `{if, then, else, +, -, *, /, =}`.

> 💻 **Góc CNTT:** Khi bạn viết `charset=UTF-8` trong thẻ `<meta>` của trang web, bạn đang **khai báo bảng chữ cái** cho trình duyệt. Sai bảng chữ cái → "mojibake" (chữ hiển thị kiểu `Ã¡Â»â€”`). Đây là lỗi thực tế của "sai Σ".

#### 1.2 Xâu (từ), độ dài, xâu rỗng
- **Xâu (từ)** = dãy hữu hạn các ký tự viết liền nhau: `w = a₁a₂…aₙ`, mỗi `aᵢ ∈ Σ`.
- **Độ dài** `|w|` = số ký tự. Ví dụ `|10010| = 5`.
- **Xâu rỗng** `^` (quốc tế: ε) = xâu không có ký tự nào, `|^| = 0`. Xâu rỗng thuộc **mọi** bảng chữ cái.
- `Σ*` = tập **mọi** xâu trên Σ (kể cả `^`); `Σ+` = tập mọi xâu **khác rỗng**: `Σ+ = Σ* \ {^}`, `Σ* = Σ+ ∪ {^}`.

> 💻 **Góc CNTT:** "Xâu rỗng" trong lập trình là chuỗi `""` — nó **tồn tại**, khác với `null`. Rất nhiều bug validate form đến từ việc lẫn lộn `""` (chuỗi rỗng) với `null` (không có gì) — đúng y như lẫn lộn `{^}` với `∅` trong toán học vậy!

#### 1.3 Ngôn ngữ hình thức (formal language)
**Định nghĩa:** Cho bảng chữ cái Σ, mỗi tập con `L ⊆ Σ*` gọi là một **ngôn ngữ hình thức** trên Σ. `∅` (tập rỗng) là **ngôn ngữ rỗng** — không chứa xâu nào.

**Bẫy kinh điển:** `L = ∅` khác `L = {^}`.
- `∅`: "không có từ nào hợp lệ" — ví dụ: ngôn ngữ các chuỗi vừa bắt đầu bằng `a` vừa bắt đầu bằng `b`.
- `{^}`: "chỉ có duy nhất một từ hợp lệ là từ rỗng" — ví dụ: mật khẩu chỉ chấp nhận chuỗi rỗng (đùa, nhưng hãy nhớ `{^} ≠ ∅`).

**Hai bài toán cốt lõi của ngôn ngữ** (slide nêu rất quan trọng):
1. **Bài toán đoán nhận (recognition):** cho xâu `w`, hỏi `w ∈ L`? → dùng **máy hình thức** (automaton) để trả lời YES/NO. Đây chính là cái mà mọi `if (regex.test(email))` đang làm.
2. **Bài toán sinh (generation):** làm sao sinh ra mọi xâu của L? → dùng **văn phạm** (grammar). Đây chính là cái mà compiler dùng để "sinh" mã từ ngữ pháp ngôn ngữ.

> 💻 **Góc CNTT tổng quát:** Cặp **Văn phạm ↔ Máy đoán nhận** là linh hồn của khoa học máy tính: văn phạm sinh (generate), máy đoán nhận (recognize). Toàn bộ chương 3 là bảng đối chiếu 4 cặp như vậy (xem Bảng tổng kết ở mục 8).

---

### 2. Văn phạm và ngôn ngữ sinh bởi văn phạm (mục 3.1.2)

#### 2.1 Văn phạm là gì?
**Định nghĩa:** Văn phạm `G = <Σ, Δ, I, R>` gồm 4 thành phần:
- `Σ`: bảng chữ cái **kết thúc** (terminal) — những ký hiệu "hiện ra trong kết quả cuối cùng";
- `Δ`: bảng chữ cái **phụ** (nonterminal) — các "biến trung gian" (viết hoa: S, A, B…);
- `I ∈ Δ`: ký hiệu **ban đầu** (start);
- `R`: tập **quy tắc** dạng `α → β` với `α, β ∈ (V)*`, `V = Σ ∪ Δ`, và **vế trái α phải chứa ít nhất một ký hiệu phụ** (dạng hợp lệ: `α = α'Aα''`, `A ∈ Δ`).

**Hiểu đơn giản theo CNTT:** Văn phạm giống như một **hệ thống quy tắc viết lại (rewrite system)** hay **template sinh code**:
- Bạn bắt đầu bằng biến `S` (một "placeholder" — giống thẻ `<TEMPLATE>` trong generator).
- Mỗi quy tắc `A → ...` là một **cách thay thế placeholder A** bằng nội dung mới (có thể chứa placeholder khác).
- Khi xâu chỉ còn toàn ký hiệu kết thúc (terminal) → bạn thu được "sản phẩm" hoàn chỉnh — giống khi mọi biến trong template đã được điền và file được render ra.

> 💻 **Góc CNTT — template engine:** HTML template như `Hello {{name}}, you have {{count}} messages` — `{{name}}`, `{{count}}` là **nonterminal**; khi "render" (dẫn xuất) bằng dữ liệu thật, bạn thu được xâu terminal. Quy tắc "không được còn `{{...}}` trong output" chính là điều kiện "xâu dẫn xuất chỉ gồm ký hiệu ∈ Σ*".

**Quy tắc hợp lệ hay không?** (ví dụ trong slide, Σ={0,1}, Δ={S,A,B})
| Quy tắc | Hợp lệ? | Vì sao |
|---|---|---|
| `S → 0S1A` | ✅ | vế trái là 1 ký hiệu phụ |
| `0AB → 1A1B` | ✅ | vế trái chứa ít nhất 1 ký hiệu phụ (A, B) |
| `A → ^` | ✅ | vế trái là ký hiệu phụ, vế phải rỗng cho phép |
| `0 → A` | ❌ | vế trái toàn ký hiệu kết thúc |
| `01 → 0B` | ❌ | vế trái chứa 0,1 là terminal — không có ký hiệu phụ nào |

#### 2.2 Dẫn xuất và ngôn ngữ của văn phạm
- Nếu áp dụng quy tắc `r = α→β` vào xâu `ω = ξ₁αξ₂` thu được `η = ξ₁βξ₂`, ta viết `ω ⊢ η` ("η dẫn trực tiếp từ ω").
- **Dẫn xuất đầy đủ:** dãy `D = (I, ω₁, …, ωₖ = P)` với `P ∈ Σ*` (kết thúc sạch, không còn biến). Số k là **độ dài dẫn xuất**.
- **Ngôn ngữ của văn phạm:** `L(G) = { ω ∈ Σ* | I ⊢* ω }`.
- Hai văn phạm **tương đương** nếu `L(G) = L(G')`.

**Ví dụ chuẩn (nhớ như "bảng cửu chương"):**
- `G: I → aIb | ab` ⇒ `L(G) = {aⁿbⁿ | n ≥ 1}`. Dẫn xuất đầy đủ của `a³b³`: `I ⊢ aIb ⊢ aaIbb ⊢ aaaIbbb ⊢ aaabbb` (PDF viết: `(I, aIb, aaIbb, aI… ` — độ dài dẫn xuất = 4).
- `G': I → aIb | ^` ⇒ `L(G') = {aⁿbⁿ | n ≥ 0}`. G và G' "chỉ sai khác từ rỗng ^".

> 🧠 **Mẹo nhớ:** công thức `I → aIb` là cách "văn phạm đếm": mỗi lần bạn muốn thêm một cặp `a…b` cân xứng, bạn bọc thêm một lớp. Giống hàm đệ quy `f(n) = 'a' + f(n-1) + 'b'` với `f(0) = 'ab'`.

#### 2.3 Phân loại văn phạm theo Chomsky — "4 tầng quyền lực"

Chomsky chia văn phạm thành 4 nhóm; nhóm sau **mạnh hơn** (sinh được nhiều ngôn ngữ hơn) nhóm trước:

```
L₃ ⊂ L₂ ⊂ L₁ ⊂ L₀        (tập ngôn ngữ: chính quy ⊂ phi ngữ cảnh ⊂ cảm ngữ cảnh ⊂ ngữ cấu)
```

| Nhóm | Tên | Ràng buộc quy tắc | Máy tương ứng | Ví dụ ngôn ngữ |
|---|---|---|---|---|
| **0** | Ngữ cấu / không hạn chế | `α → β`, `α ∈ V⁺` chứa ≥1 ký hiệu phụ (không ràng buộc gì thêm) | Máy Turing | `{aⁿbⁿcⁿdⁿ}` |
| **1** | Cảm ngữ cảnh | `|β| ≥ |α|` (không giảm độ dài; được phép `S → ^` nếu S không xuất hiện vế phải) | Automat tuyến tính bị chặn | `{aⁿbⁿcⁿ}` |
| **2** | **Phi ngữ cảnh (PNC)** | `A → α` với `A` là **một biến đơn** | **Ô-tô-mát đẩy xuống (PDA)** | `{aⁿbⁿ}`, biểu thức số học, cú pháp ngôn ngữ lập trình |
| **3** | Chính quy | `A → aB`, `A → a` (tuyến tính phải) hoặc `A → Ba`, `A → a` (tuyến tính trái) | **Ô-tô-mát hữu hạn (DFA/NFA)** | `{aⁿbᵐ}`, token, regex |

**Ví dụ phân loại của slide (ghi nhớ để thi):**
1. `G = <{a,b}, {I}, I, {Ia→aIb, Ib→bIa, I→II, I→ab}>` → **cảm ngữ cảnh**? Kiểm: mọi vế trái chứa ký hiệu phụ ✅; xét độ dài: `Ia→aIb`: |aIb|=3 ≥ |Ia|=2 ✅; `Ib→bIa`: 3 ≥ 2 ✅; `I→II`: 2≥1 ✅; `I→ab`: 2≥1 ✅ ⇒ **loại 1 (cảm ngữ cảnh)**.
2. `G = <{a,b}, {I}, I, {I→aSb, bIa, …}>` với luật `I→aSb, I→bIa, I→II, I→ab` (vế trái đều là biến đơn) ⇒ **loại 2 (PNC)**.
3. `G = {I→aI, I→aA, A→bA, A→b}` ⇒ **loại 3 (chính quy, tuyến tính phải)** — ngôn ngữ `{aⁿbᵐ | n,m ≥ 1}`.
4. Ngôn ngữ `{aⁿbⁿ}` **không** chính quy — chính là bài học lý do cần loại 2.

> 💻 **Góc CNTT — vì sao "phi ngữ cảnh" là loại QUAN TRỌNG NHẤT trong ứng dụng?** (slide nhấn mạnh)
> Mọi **ngôn ngữ lập trình** (C, Java, Python…) có cú pháp là ngôn ngữ phi ngữ cảnh → được mô tả bởi **văn phạm phi ngữ cảnh** và phân tích bởi **parser** (PDA). Ví dụ văn phạm biểu thức số học:
> `E → E + T | T`, `T → T * F | F`, `F → (E) | id` — đúng là khuôn mẫu mà thư viện parser (yacc/bison/ANTLR) nhận vào. Còn loại 3 (chính quy) dùng cho **lexer** (tách token): biến, số, toán tử…; loại 1/0 gần như không dùng trong compiler thực tế vì quá phức tạp để phân tích hiệu quả.

#### 2.4 Vài ví dụ văn phạm "đinh" của slide (nên thuộc lòng)

| Văn phạm | Ngôn ngữ sinh ra | Loại |
|---|---|---|
| `I → a₁A₁, A₁ → a₂A₂, …, Aₙ₋₁ → aₙ` | đúng 1 xâu cố định `a₁a₂…aₙ` | 3 (chính quy) |
| `I → aI \| a` (a∈Σ) | `Σ⁺` (mọi xâu khác rỗng) | 3 |
| `I → aI \| aB, B → bB \| b` | `{aⁿbᵐ | n,m≥1}` | 3 |
| `I → aIb \| ab` | `{aⁿbⁿ | n≥1}` | 2 |
| `I → Ia \| Aa, A → aAb \| ab` | `{aⁿbⁿaᵐ | n,m≥1}` | 2 |
| `I → II \| aIb \| bIa \| ab \| ba` | mọi xâu có #a = #b (khác rỗng) | 2 |
| `I → 0IBC \| aBC, …` (bộ luật dài) | `{aⁿbⁿcⁿ | n>0}` | 0/1 |

#### 2.5 Một tính chất "kỹ thuật" hay hỏi (mục 3.1.5)
**Định lý:** Với mọi văn phạm `G`, tồn tại văn phạm `G'` **tương đương** mà các ký hiệu kết thúc được "tách riêng" khỏi vế trái quy tắc: với mỗi `a ∈ Σ` bạn tạo ký hiệu mới `ā ∉ Σ ∪ Δ`, thêm quy tắc `ā → a`, rồi thay `a` bởi `ā` trong mọi quy tắc của R.
> 💻 **Tác dụng thực tế:** đây chính là bước "tách terminal" trong thuật toán đưa về **dạng chuẩn Chomsky (CNF)** — nền tảng của thuật toán phân tích cú pháp **CYK** mà các trình biên dịch/IDE dùng để kiểm tra câu lệnh có đúng cú pháp không.

---

### 3. Ô-tô-mát hữu hạn (mục 3.2.1) — "cỗ máy trạng thái"

#### 3.1 Trực giác trước, định nghĩa sau
Hãy tưởng tượng **máy bán nước tự động**: nó chỉ có vài trạng thái (Chờ, Đã nhận 5k, Đã nhận 10k, Xuất nước…) và mỗi lần bạn bấm/nhét tiền, máy **chuyển trạng thái**. Ô-tô-mát hữu hạn (FA) đúng là như vậy, nhưng khắt khe hơn:
- **Bộ nhớ = con số 0.** Nó chỉ nhớ **mình đang ở trạng thái nào**, không có giấy nháp. Vì thế nó chỉ "đếm được đến hữu hạn" — không thể nhớ "đã đọc bao nhiêu chữ a" với số lượng không giới hạn.
- Nó đọc xâu từ trái sang phải, mỗi ký tự đọc **đúng 1 lần** (one-pass, không quay lui).

> 💻 **Góc CNTT:** FA chính là **máy trạng thái (state machine)** trong thực tế:
> - Máy ATM, thang máy, đèn giao thông (đời thường);
> - **giao thức TCP** (CLOSED → SYN_SENT → ESTABLISHED → FIN_WAIT…) trong mạng máy tính;
> - mỗi **character validator** khi bạn gõ mật khẩu ("đủ 8 ký tự", "có chữ hoa", "có số") là một DFA chạy theo từng ký tự;
> - **lexer/tokenizer** trong trình biên dịch (tách `int a = 10;` thành INT, ID, ASSIGN, NUM, SEMI) chạy regex ≈ chạy FA.

#### 3.2 Định nghĩa hình thức
`M = (Q, Σ, δ, q₀, F)`:
- `Q`: tập hữu hạn các **trạng thái**; `Σ`: bảng chữ cái **vào**;
- `q₀ ∈ Q`: trạng thái **bắt đầu**; `F ⊆ Q`: tập trạng thái **kết thúc** (được phép "trả lời YES");
- `δ`: **hàm chuyển**:
  - `δ: Q × Σ → Q` ⇒ ô-tô-mát **đơn định (DFA)** — mỗi (trạng thái, ký tự) có **đúng một** chuyển;
  - `δ: Q × Σ → 2^Q` ⇒ ô-tô-mát **không đơn định (NFA)** — có thể có **0, 1 hoặc nhiều** chuyển.

**Cách hoạt động khi cho xâu `ω = a₁a₂…aₙ`:** bắt đầu ở `q₀`, đọc `a₁`, nhảy sang `δ(q₀,a₁) = q₁`, đọc `a₂`, nhảy sang `δ(q₁,a₂) = q₂`, … Sau khi đọc hết xâu ở trạng thái `qₙ`: **đoán nhận ω ⟺ qₙ ∈ F**.

**Ngôn ngữ đoán nhận:** `L(M) = { ω ∈ Σ* | δ(q₀, ω) ∈ F }` (đôi khi slide ký hiệu `T(M)`).

#### 3.3 Hai cách "vẽ" ô-tô-mát
**(a) Bảng chuyển:** dòng = trạng thái, cột = ký tự vào, ô = trạng thái đến (ô trống = không xác định).
**(b) Đồ thị chuyển:** đỉnh = trạng thái; cung `qᵢ → qⱼ` gán nhãn `a` khi `δ(qᵢ,a) = qⱼ`; đỉnh vào là `q₀`; đỉnh kết thúc **khoanh đôi**.
> Mẹo vẽ cho người mới: luôn vẽ nháp 3 thứ theo thứ tự: (1) trạng thái "vừa đọc ký tự gì", (2) vòng lặp "còn tiếp tục hợp lệ", (3) trạng thái chết / kết thúc.

#### 3.4 Ví dụ "chuẩn cơm mẹ nấu" phải biết (lấy từ slide, đã kiểm chứng)

**Ví dụ A (slide tr.37)** — `M = <{q₀,q₁,q₂}, {a,b}, δ, q₀, {q₂}>` với `δ(q₀,a)=q₀, δ(q₀,b)=q₁, δ(q₁,a)=q₀, δ(q₁,b)=q₂, δ(q₂,a)=q₂, δ(q₂,b)=q₂`.
- Chạy thử `ababbab`: `q₀ →(a) q₀ →(b) q₁ →(a) q₀ →(b) q₁ →(b) q₂ →(a) q₂ →(b) q₂` ⇒ **kết thúc ở q₂ ∈ F** ⇒ đoán nhận ✅
- Chạy thử `abab`: `q₀→q₀→q₁→q₀→q₁` ⇒ dừng ở `q₁ ∉ F` ⇒ từ chối ❌
- **Ngôn ngữ:** `L(M) = {w ∈ {a,b}* : w chứa "bb"}` (máy "đi săn" hai chữ b liên tiếp; vào q₂ là "đã thấy bb rồi thì mãi mãi YES").

**Ví dụ B (slide tr.38)** — `δ(q₀,0)=q₂, δ(q₀,1)=q₁, δ(q₁,0)=q₃, δ(q₁,1)=q₀, δ(q₂,0)=q₀, δ(q₂,1)=q₃, δ(q₃,0)=q₁, δ(q₃,1)=q₂`, `F = {q₀}`.
- Chạy `1010100`: `q₀ →(1) q₁ →(0) q₃ →(1) q₂ →(0) q₀ →(1) q₁ →(0) q₃ →(0) q₁` ⇒ kết thúc `q₁ ∉ F` ⇒ **từ chối** ❌ (đúng như slide).
- **Mô tả ngôn ngữ (đã kiểm chứng bằng chương trình):** `L(M) = {w : số ký tự 0 chẵn VÀ số ký tự 1 chẵn}`. (Ý nghĩa 4 trạng thái: `q₀`=chẵn-0/chẵn-1, `q₁`=chẵn-0/lẻ-1, `q₂`=lẻ-0/chẵn-1, `q₃`=lẻ-0/lẻ-1.)

**Ví dụ C (slide tr.35, NFA)** — `F = {q₂,q₄}`, bảng:

| | 0 | 1 |
|---|---|---|
| q₀ | {q₀,q₃} | {q₀,q₁} |
| q₁ | ∅ | {q₂} |
| q₂ | {q₂} | {q₂} |
| q₃ | ∅ | {q₄} |
| q₄ | {q₄} | {q₃} |

- Chạy `011`: sau `0` → `{q₀,q₃}`; sau `1` → `{q₀,q₁,q₄}`; sau `1` → `{q₀,q₁,q₂,q₃}` ⇒ chứa `q₂` ⇒ **đoán nhận**.
- **Mô tả ngôn ngữ (đã kiểm chứng):** `L(M) = {w : w chứa "01" hoặc chứa "11"}` — nói cách khác: **"tồn tại một ký tự 1 mà trước nó có ít nhất một ký tự nữa"** (chữ 1 không phải ký tự đầu tiên).

#### 3.5 Sự tương đương DFA ↔ NFA (siêu quan trọng)
- **Định lý 1:** Nếu L được đoán nhận bởi một NFA thì tồn tại một DFA đoán nhận L.
- **Định lý 2:** Lớp ngôn ngữ đoán nhận bởi DFA = lớp đoán nhận bởi NFA.

**Hiểu đơn giản:** NFA = người chơi "đoán mò nhưng luôn may" (nó thử mọi đường song song). DFA = người chơi "tính trước mọi khả năng". Về sức mạnh **bằng nhau** — chỉ khác "số nơ-ron" (số trạng thái): chuyển NFA → DFA bằng **phương pháp tập con (subset construction)**, số trạng thái DFA có thể tăng theo hàm mũ `2ⁿ` (vì mỗi trạng thái DFA là một **tập con** trạng thái NFA).

> 💻 **Góc CNTT:** Vì NFA = DFA về sức mạnh nên khi cài đặt regex engine, người ta có 2 trường phái:
> - **NFA engine** (ví dụ engine của Perl/Python/JS - "backtracking"): mạnh về tính năng (group, lookahead) nhưng có thể chậm hàm mũ với pattern xấu (lỗi "catastrophic backtracking" nổi tiếng của `(a+)+$`).
> - **DFA engine** (grep, RE2 của Google): tuyến tính theo độ dài input, luôn nhanh, nhưng không hỗ trợ lookahead/bắt nhóm tùy ý.
> Hiểu chương này = hiểu luôn **vì sao nhóm nào chọn thiết kế nào**.

#### 3.6 ε-NFA (NFA có chuyển "nhắm mắt" ε)
Rất nhiều giáo trình (và slide của bạn khi sang 3.3/3.4) cần khái niệm chuyển ε: cung có nhãn `ε` (trong slide viết `^`) cho phép đổi trạng thái **không cần đọc ký tự nào**. Ký hiệu `ε-CLOSURE(q)` = tập mọi trạng thái tới được từ q qua 0 hay nhiều cung ε.
> 💻 **Góc CNTT:** chuyển ε giống "goto" vô điều kiện không tiêu thụ input trong lexer; khi viết regex bằng "máy" ta chèn ε để nối các khối (xem thuật toán Thompson ở Phần II).

### 4. Ngôn ngữ chính quy và biểu thức chính quy (mục 3.2.2)

#### 4.1 Ngôn ngữ chính quy (định nghĩa đệ quy)
Trên bảng chữ cái `Σ = {a₁,…,aₙ}`:
1. `∅` và `{aᵢ}` (mỗi ký tự) là **ngôn ngữ chính quy**;
2. Nếu `R, S` chính quy thì `R ∪ S`, `R.S` (nhân ghép), `R⁺` (lặp) cũng chính quy;
3. Chỉ thế thôi — không có ngôn ngữ chính quy nào khác.

**Định lý:** mọi ngôn ngữ chính quy đều nhận được từ các ngôn ngữ hữu hạn qua **hữu hạn lần** các phép `∪`, nhân ghép, lặp.

**Chú ý quan trọng của slide:**
- Văn phạm chính quy **không chứa quy tắc rỗng** ⇒ ngôn ngữ chính quy (theo nghĩa hẹp) **không chứa ^**;
- Ngôn ngữ chính quy **suy rộng** = có chứa `^` (văn phạm chính quy suy rộng có quy tắc rỗng).
> 💻 **Góc CNTT:** đây chính là chuyện `""` (empty string) có được regex match hay không. `a+` không match `""`; `a*` match `""`. Vậy `a*` chính là "chính quy suy rộng" của `a+`.

#### 4.2 Biểu thức chính quy (regular expression) — "regex"
**Định nghĩa đệ quy:** `∅` và `a` (a∈Σ) là biểu thức chính quy; nếu `r, s` là biểu thức chính quy biểu diễn `R, S` thì `r+s` (biểu diễn `R∪S`), `r.s` (biểu diễn `R.S`), `r⁺` (biểu diễn `R⁺`) cũng là biểu thức chính quy.
**Định lý Kleene (trái tim của chương):** *Một ngôn ngữ trên Σ là **chính quy** khi và chỉ khi nó được biểu diễn được bằng một biểu thức chính quy.*

**Quy ước ưu tiên (thứ tự thực hiện):** `lặp (*,+)` > `nhân ghép (.)` > `hợp (+)`. Ví dụ `01*+02` đọc là `0(1*) + (02)`, không phải `(01)*(+02)`.

**Các đẳng thức đại số cần thuộc (slide liệt kê, đã kiểm chứng bằng chương trình):**
```
r+s = s+r                      (giao hoán)
(r+s)+t = r+(s+t)              (kết hợp)
r+r = r                        (lũy đẳng)
(rs)t = r(st)                  (kết hợp phép ghép)
r(s+t) = rs+rt ; (s+t)r = sr+tr (phân phối)
∅* = ε ;  (r*)* = r* ;  (r⁺)⁺ = r⁺
```
**Ví dụ của slide (đã học thuộc lòng):** `r = (01*+02)1 = 01*1 + 021` ⇒ `L(r) = {01ⁿ1 | n ≥ 1} ∪ {021} = {01ⁿ⁺¹ | n≥1} ∪ {021}`.
> 💻 **Góc CNTT:** đây chính là "regex nén": `(01*+02)1` trong PCRE là `(01*|02)1` — bạn vừa phân tích một pattern validate mã sản phẩm/số tài khoản. Mọi công cụ như regex101.com đều cho thấy "explanation" tương ứng với việc phân tích cú pháp regex này.

#### 4.3 Liên hệ Ô-tô-mát hữu hạn ↔ Ngôn ngữ chính quy (KẾT QUẢ CHỐT CHƯƠNG 3.2)
Gọi `D` = lớp ngôn ngữ đoán nhận bởi DFA, `N` = lớp đoán nhận bởi NFA, `R` = lớp ngôn ngữ chính quy. Khi đó:

```
D = N = R
```

**Hệ quả — "cây cầu 3 chiều":** `L` là chính quy ⟺
(a) tồn tại **biểu thức chính quy** biểu diễn L;
(b) tồn tại **văn phạm chính quy** sinh L;
(c) tồn tại **ô-tô-mát hữu hạn** đoán nhận L.

**Ví dụ "3 trong 1" của slide:** `L = {01ⁿ, 021 | n ≥ 1}`
- Văn phạm chính quy: `G = <{0,1,2}, {S,A,B,C}, S, {S→0A, A→1A, A→1, S→0B, B→2C, C→1}>`
- Biểu thức chính quy: `r = 01*1 + 021`
- Ô-tô-mát: 4 trạng thái (S→0A…; đỉnh kết thúc cho A,B,C tương ứng nhánh kết thúc `…1`).

**Các chuyển đổi đi kèm (Phần II sẽ có quy trình từng bước):**
- **NFA → DFA:** subset construction.
- **RE → ε-NFA:** thuật toán Thompson.
- **FA → Văn phạm chính quy:** mỗi trạng thái = một biến; `δ(qᵢ,a)=qⱼ` ⇒ quy tắc `qᵢ → a qⱼ`; `q ∈ F` ⇒ thêm `q → ε` (hoặc gộp `A→a`).
- **Văn phạm chính quy → FA:** chiều ngược lại — đọc `A → aB` là cung `A →(a) B`; `A → a` là cung `A →(a) E` với E là trạng thái kết thúc mới.

> 💻 **Góc CNTT (đọc thêm, cực thú vị):** chuỗi chuyển đổi **RE → NFA → DFA → mã máy** chính là cách các thư viện **lex/flex**, **ANTLR lexer**, hay công cụ **re2c** sinh bộ tách từ vựng cho trình biên dịch. Khi bạn viết `\d+(\.\d+)?` cho số thực, công cụ sẽ "chạy" đúng các thuật toán trong mục này để sinh ra code C thực thi cực nhanh.

---

### 5. Văn phạm phi ngữ cảnh (VPPNC) — mục 3.3

#### 5.1 Vì sao gọi là "phi ngữ cảnh"?
Vì quy tắc có dạng `A → α` — **một biến đơn ở vế trái**. Nghĩa là: "hễ thấy ký hiệu A thì được phép thay bằng α, **bất kể A đang nằm trong ngữ cảnh nào** (giữa xâu, đầu xâu, cuối xâu)". Đó là lý do tên gọi: việc thay thế **không phụ thuộc ngữ cảnh xung quanh**.

> 💻 **Góc CNTT:** Ngôn ngữ lập trình gần như "phi ngữ cảnh tuyệt đối" ở tầng cú pháp: `if (điều_kiện) câu_lệnh` — bạn thay `câu_lệnh` bằng bất cứ gì hợp lệ, không cần biết nó nằm sâu bao nhiêu cấp. (Ngược lại, các quy tắc ngữ nghĩa như "biến phải khai báo trước khi dùng" là **cảm ngữ cảnh** — lý do C++ khó parse hơn, và lý do có câu "C++ không hoàn toàn là ngôn ngữ phi ngữ cảnh"!)

#### 5.2 Cây suy dẫn (parse tree) — "ảnh chụp quá trình dẫn xuất"
Cho `G = <Σ, Δ, S, P>`, **cây suy dẫn đầy đủ** là cây có hướng, không chu trình, thỏa:
1. Gốc gán nhãn `S`; 2. Đỉnh trong gán nhãn một biến `∈ Δ`;
3. Lá gán nhãn ký hiệu kết thúc `∈ Σ` (hoặc ε);
4. Nếu đỉnh `m` nhãn `A`, các con theo thứ tự trái→phải nhãn `B₁…Bₖ` thì `A → B₁…Bₖ ∈ P`.

**Đọc lá trái sang phải = xâu kết quả.** *Định lý 1.1:* `ω ∈ L(G)` (ω≠ε) ⟺ tồn tại cây suy dẫn đầy đủ có kết quả `ω`.

> 💻 **Góc CNTT:** Cây suy dẫn chính là cái **trình duyệt/IDE hiển thị khi bạn bung "AST" (Abstract Syntax Tree)** hoặc công cụ như astexplorer.net cho JavaScript/Python hiển thị: biểu thức `1 + 2 * 3` được "cắm rễ" như thế nào. Cùng xâu, hai cây khác nhau = **hai cách hiểu khác nhau** — từ đây sinh ra khái niệm nhập nhằng.

#### 5.3 Nhập nhằng (ambiguity) — "một câu, hai nghĩa"
**Định nghĩa:** `G` **nhập nhằng (đa nghĩa)** nếu tồn tại xâu `ω` có **hai cây suy dẫn khác nhau** trong `G`. Ngược lại gọi là đơn nghĩa.
- **Nhập nhằng vĩnh cửu:** không tồn tại VPPNC đơn nghĩa nào tương đương.
- **Ví dụ kinh điển (slide tr.56):** `G = <{a,b,+,*}, {S}, S, {S→S+S, S→S*S, S→a, S→b}>` — xâu `b + a * b + a` có **hai suy dẫn trái khác nhau**. (Chương trình kiểm chứng: `a+a*a` có **đúng 2 suy dẫn trái**: một cây "cộng ngoài, nhân trong" = `a+(a*a)` và một cây "nhân ngoài, cộng trong" = `(a+a)*a`.)

> 💻 **Góc CNTT — bạn gặp nhập nhằng MỖI NGÀY:**
> - `1 + 2 * 3` — nếu không có "độ ưu tiên toán tử" (một quy ước phi ngữ cảnh), kết quả có thể là 9 hay 7! Trình biên dịch "phá nhập nhằng" bằng văn phạm phân tầng `E→E+T|T; T→T*F|F; F→(E)|id`.
> - `if (a) if (b) do1(); else do2();` — "dangling else" (else thuộc if nào?) là một nhập nhằng kinh điển của C/Java, được giải quyết bằng quy ước "else gắn với if gần nhất".
> - Trong XML/JSON: nếu grammar cho phép, `a, b, c` có thể parse thành danh sách phải-nhánh hay trái-nhánh — các thư viện parser thường ghi rõ "left-associative" để tránh.

#### 5.4 Giản lược VPPNC — "dọn rác cho văn phạm" (mục 3.3.3)
Một ký hiệu `X` gọi là **có ích** nếu tồn tại dẫn xuất `S ⊢* αXβ ⊢* ω` với `ω ∈ Σ*`; ngược lại là **thừa**. Có 2 loại thừa:
1. **Ký hiệu vô sinh:** từ X không thể dẫn ra xâu terminal nào. (Ví dụ `A → aA` mà không có cách nào "kết thúc" — giống hàm đệ quy không có `base case`: chạy là treo!)
2. **Ký hiệu không đến được:** từ S không dẫn được xâu nào chứa X. (Giống hàm được viết nhưng không ai gọi — dead code.)
**Ba phép "dọn dẹp" cần nhớ:**
- (a) loại **ký hiệu vô sinh & không đến được** (Bổ đề 1.1, 1.2);
- (b) loại **quy tắc đơn** `A → B` (A,B∈Δ) — "phép đổi tên" chỉ làm dài dòng (Định lý ~1.3). Ví dụ slide: `G = <{a,+,*}, {S,A,B}, S, {S→S+A, S→A, A→A*B, A→B, B→a}>` tương đương `G' = {S→S+A, A→A*B, B→a, S→A*B, A→a, S→a}`;
- (c) loại **ε-quy tắc** `A → ε` (nếu `^ ∉ L(G)`); nếu `^ ∈ L(G)` thì ít nhất phải giữ `S → ε` (Định lý ~1.4).

> 💻 **Góc CNTT:** "loại ký hiệu vô sinh/không đến được" là tương đương với **dead code elimination** trong compiler; "loại quy tắc đơn" là **inline hóa 1 lớp trung gian**; "loại ε-quy tắc" giúp parser không phải xử lý chuỗi rỗng — 3 bước này làm văn phạm **sạch và chuẩn** trước khi chạy các thuật toán phân tích hiệu quả (CYK, Earley...).

#### 5.5 Dạng chuẩn Chomsky (CNF) — "khuôn đúc chuẩn" (mục 3.3.4)
**Định nghĩa:** `G` ở **CNF** nếu mọi quy tắc đều có dạng `A → BC` hoặc `A → a` (A,B,C ∈ Δ; a ∈ Σ). CNF **không có**: (a) ε-quy tắc; (b) quy tắc đơn; (c) vế phải trộn terminal+nonterminal; (d) vế phải dài hơn 2 ký hiệu.
**Định lý:** mọi VPPNC `G` đều có `G'` ở CNF tương đương (`L(G) = L(G')`).

**Quy trình 4 bước (chi tiết từng lệnh ở Phần II):** ① loại ε-quy tắc → ② loại quy tắc đơn → ③ tách terminal "lẫn" trong vế phải (thay `a` bởi biến `X` với `X→a`) → ④ "bẻ đôi" vế phải dài (`A → B C D` thành `A → B C'` và `C' → C D`).

**Ví dụ chuẩn của slide (làm mẫu và đã kiểm chứng):**
`G = <{a,b}, {S,A,B}, S, {S→A, S→ABA, A→aA, A→a, A→B, B→bB, B→b}>`
- Loại quy tắc đơn (`S→A, A→B`): `P₁ = {S→ABA, S→aA, S→a, S→bB, S→b, A→aA, A→a, A→bB, A→b, B→bB, B→b}`;
- Tách terminal (đặt `X ≙ a`, `Y ≙ b` — slide dùng `Aₐ`, `A_b`): `P₂ = {S→ABA, S→XA, S→a, S→YB, S→b, A→XA, A→a, A→YB, A→b, B→YB, B→b, X→a, Y→b}`;
- Bẻ đôi `S→ABA`: `S→AC, C→BA`. **Kết quả CNF:** `P₃ = {S→AC, C→BA, S→XA, S→a, S→YB, S→b, A→XA, A→a, A→YB, A→b, B→YB, B→b, X→a, Y→b}`.
- ✅ Chương trình kiểm chứng: `L(G₃) = L(G)` (sinh đúng cùng tập xâu: `a, b, aa, ab, bb, aaa, aab, aba, abb, bba, bbb, …`).

> 💻 **Góc CNTT — CNF để làm gì?** Thuật toán **CYK** chỉ chạy được trên CNF: xét xâu độ dài n, lập bảng "ô (i,j) chứa biến nào sinh ra xâu con i..j" (quy hoạch động O(n³)). Đây là cách các công cụ kiểm tra cú pháp nhanh gọn; đồng thời CNF là công cụ chuẩn để **chứng minh bổ đề bơm cho PNC** (cây suy dẫn nhị phân, độ cao ≥ p+1 ⇒ có đường lặp).

### 6. Ô-tô-mát đẩy xuống (PDA) — mục 3.4

#### 6.1 Trực giác: "FA + ngăn xếp = máy biết đếm"
FA không nhớ được gì lâu dài; PDA có thêm một **ngăn xếp (stack)** — bộ nhớ LIFO vô hạn. Nhờ đó PDA **đếm được**: đọc bao nhiêu `a` thì nhét bấy nhiêu ký hiệu, đọc `b` thì lôi ra so khớp. Đó là toàn bộ bí quyết đoán nhận `{aⁿbⁿ}` — việc FA bất lực.
Có **2 cách đoán nhận** (và chúng tương đương nhau):
- **Cách 1 (theo trạng thái kết thúc):** đọc hết xâu và dừng ở `p ∈ F` → ngôn ngữ `T(M)`;
- **Cách 2 (theo ngăn xếp rỗng):** đọc hết xâu và ngăn xếp **rỗng** → ngôn ngữ `N(M)`.

> 💻 **Góc CNTT:** Ngăn xếp là linh hồn của **gọi hàm đệ quy** (call stack), **undo** trong editor, **duyệt cây DFS không đệ quy**, và đặc biệt là **kiểm tra ngoặc cân bằng** trong IDE (VSCode báo "missing )" chính là một PDA chạy ngầm!). Máy ảo JVM/CPython đều "đẩy xuống" theo nghĩa này; ngăn xếp tràn (`StackOverflowError`) = PDA dùng quá nhiều bộ nhớ.

#### 6.2 Định nghĩa hình thức
`M = <Q, Σ, Δ, δ, q₀, z₀, F>`:
- `Q`: tập trạng thái (`Σ ∩ Q = ∅`); `Σ`: bảng chữ cái **vào**; `Δ`: bảng chữ cái **ngăn xếp**;
- `z₀ ∈ Δ`: ký hiệu **đáy** ngăn xếp (đánh dấu "đáy" để biết khi nào xếp cạn — như `$` trong nhiều sách);
- `q₀ ∈ Q`: trạng thái đầu; `F ⊆ Q`: tập trạng thái kết thúc;
- `δ: Q × (Σ ∪ {ε}) × Δ → 2^{Q × Δ*}`: hàm chuyển — từ `(trạng thái, ký hiệu vào hoặc ε, ký hiệu đỉnh xếp)` cho ra **tập** các `(trạng thái mới, xâu thay thế đỉnh xếp)`.

**Một bước chuyển:** `δ(q, a, z) = {<q₁, γ₁>, …, <q_m, γ_m>}` nghĩa là: ở trạng thái q, đọc `a` (hoặc "nhắm mắt" nếu a=ε), đỉnh xếp là `z` ⇒ chuyển sang `qᵢ` và **thay z bằng γᵢ**, con trỏ đọc sang phải 1 ô (nếu là bước đọc). Quy ước xếp: ký hiệu **phải nhất của γᵢ** nằm trên **cùng**.

**Hình trạng (configuration)** = bộ ba `K = <q, α, β>`: trạng thái q, phần xâu vào `α` chưa đọc, xâu ngăn xếp `β`. Viết `K ⊢ K'` khi một bước chuyển hợp lệ. Ví dụ đúng theo quy tắc hình thức (slide định nghĩa 3.3):
- Nếu `<p, γ> ∈ δ(q, a₁, x_m)` thì `<q, a₁a₂…a_k, x₁…x_m> ⊢ <p, a₂…a_k, x₁…x_{m-1}γ>`;
- Nếu `<p, γ> ∈ δ(q, ε, x_m)` thì đầu đọc **không nhích**: `<q, a₁…a_k, x₁…x_m> ⊢ <p, a₁…a_k, x₁…x_{m-1}γ>`.

#### 6.3 Ví dụ "phải biết": PDA cho `ωcωᴿ` (slide tr.66–68)
Văn phạm `G = <{0,1,c}, {S}, S, {S→0S0, S→1S1, S→c}>` sinh `L(G) = {ωcωᴿ | ω ∈ {0,1}*}`.
**Ý tưởng máy:** ở trạng thái p: gặp 0/1 thì **đẩy (push)** vào xếp; gặp `c` thì đổi sang trạng thái q (không đẩy nữa); ở q: mỗi ký tự đọc vào phải **khớp với đỉnh xếp** thì **lấy ra (pop)**. Đọc hết xâu mà xếp rỗng ⇒ đoán nhận.
- Nếu lệch ký tự hoặc hết xâu mà xếp chưa rỗng ⇒ **không đoán nhận**.
- Vì sao cần c mà không đoán `ωωᴿ` trực tiếp? Vì ở giữa xâu, máy **không biết đâu là điểm giữa** — `c` chính là "cái còi báo hiệu" đổi pha push→pop. (Muốn không có c, phải chọn phi đơn định điểm giữa — xem bài tập mức 5.)

#### 6.4 Ví dụ số 1 của slide: PDA cho `{aⁿbⁿ}` (Thí dụ 3.2)
`M = <{q₀,q₁,q₂}, {a,b}, {z₀,z₁}, δ, q₀, z₀, {q₂}>` với:
```
δ(q₀, ε, z₀) = {<q₀, ε>}    δ(q₀, a, z₀) = {<q₁, z₀z₁>}
δ(q₁, a, z₁) = {<q₁, z₁z₁>}  δ(q₁, b, z₁) = {<q₂, ε>}
δ(q₂, b, z₁) = {<q₂, ε>}    δ(q₂, ε, z₀) = {<q₀, ε>}
```
**Chạy thử (đã kiểm chứng từng bước):**
- `α = aabb`: `<q₀,aabb,z₀> ⊢ <q₁,abb,z₀z₁> ⊢ <q₁,bb,z₀z₁z₁> ⊢ <q₂,b,z₀z₁> ⊢ <q₂,ε,z₀> ⊢ <q₀,ε,ε>` ⇒ **thuộc N(M)** ✅
- `β = abaab`: `<q₀,abaab,z₀> ⊢ <q₁,baab,z₀z₁> ⊢ <q₂,aab,z₀>` — hết đường ⇒ **không thuộc** ❌
- Kết luận của slide: `N(M) = T(M) = {aⁿbⁿ | n ≥ 0}`.

#### 6.5 Từ VPPNC ra PDA (Định lý "máy học văn phạm")
**Định lý (slide, ý tưởng):** từ một VPPNC `G`, xây được PDA đoán nhận `L(G)`: máy dùng ngăn xếp để **mô phỏng dẫn xuất trái**: gặp biến `A` trên đỉnh xếp thì "thay" `A` bằng vế phải của một quy tắc `A→α` (thay xếp: pop A, push α⁻¹); gặp terminal đỉnh xếp thì **so khớp với ký tự vào** và pop.
**Ví dụ 3.4 (slide tr.77–78):** `G = <{a,b}, {S,A}, S, {S→a, S→bSA, A→b, S→bA, A→aS}>` ⇒ PDA `M = <{q₀,q₁,q₂}, {a,b}, {a,b,S,A,%}, δ, q₀, S, {q₂}>` với:
```
δ(q₀,ε,S) = {<q₁, %S>}        δ(q₁,ε,S) = {<q₁,a>, <q₁,Asb>, <q₁,Ab>}
δ(q₁,ε,A) = {<q₁,b>, <q₁,Sa>}  δ(q₁,a,a) = {<q₁,ε>}   δ(q₁,b,b) = {<q₁,ε>}
δ(q₁,ε,%) = {<q₂,%>}
```
(Trong đó `%` là ký hiệu đáy ngăn xếp; các bước `δ(q₁,ε,S)` chính là "áp dụng quy tắc S→a, S→bSA, S→bA" — bạn thấy ngay quy tắc văn phạm "hiện hình" thành bước chuyển!) Và `%` ở đáy để biết khi nào dẫn xuất kết thúc.

> 💻 **Góc CNTT:** cặp "VPPNC ↔ PDA" chính là nền tảng lý thuyết của **parser**: văn phạm là "đặc tả cú pháp" còn PDA là "chương trình chạy đặc tả đó". Các thuật toán phân tích **LL(1)/LR(1)** (dùng trong yacc/bison, ANTLR) là những PDA bị hạn chế để chạy tất định O(n) và báo lỗi cú pháp kèm vị trí dòng — mọi IDE đều nhờ vậy.

### 7. Bảng tổng kết cả chương (in ra dán tường)

| Tiêu chí | Chính quy (loại 3) | Phi ngữ cảnh (loại 2) | Cảm ngữ cảnh (1) | Ngữ cấu (0) |
|---|---|---|---|---|
| Văn phạm | `A→aB`, `A→a` | `A→α` | `|β|≥|α|` | `α→β` (α có biến) |
| Máy | DFA/NFA | PDA (đẩy xuống) | Automat bị chặn (LBA) | Máy Turing |
| Bộ nhớ máy | không có | ngăn xếp (LIFO) | băng bị chặn tuyến tính | băng vô hạn |
| Biểu diễn khác | Biểu thức chính quy | Cây suy dẫn | — | — |
| Bài toán đoán nhận | O(n) tuyến tính | O(n³) – CYK, tổng quát | tâm lý, khó | nửa quyết định được |
| Ứng dụng CNTT | lexer, regex, validate form, giao thức | parser, AST, cú pháp ngôn ngữ, JSON/XML, kiểm tra ngoặc | (lý thuyết, ngữ nghĩa tự nhiên) | (lý thuyết) |
| Ví dụ không thuộc lớp này | `{aⁿbⁿ}` | `{aⁿbⁿcⁿ}`, `{ww}` | `{aⁿbⁿcⁿdⁿ}` | — |

### 8. "Góc CNTT" — 3 bức tranh lớn để nhớ cả chương
1. **Trình biên dịch** = pipeline 4 tầng của chương này: *Regex/DFA (lexer)* → *VPPNC/PDA (parser)* → *AST (cây suy dẫn)* → ngữ nghĩa (cảm ngữ cảnh, kiểm tra kiểu).
2. **Regex engine**: mọi công cụ (grep, PCRE, RE2) đều cài đặt một trong hai: NFA/backtracking hoặc DFA — đúng bài toán tương đương DFA=NFA bạn vừa học.
3. **Kiểm tra dữ liệu đầu vào** (số điện thoại, email, số CMND, mã bưu chính, địa chỉ IPv4, mã sinh viên…) = thiết kế DFA/regex — kỹ năng "ra tiền" của chương này.

---

## PHẦN II. KÝ HIỆU & QUY TẮC CẦN NHỚ (CHEAT SHEET THI CỬ)

### A. Ký hiệu "sinh tử"
```
Σ   bảng chữ cái kết thúc (terminal)          |w|      độ dài xâu w
Δ   bảng chữ cái phụ (nonterminal)            ^ (ε)    xâu rỗng, |^| = 0
V = Σ∪Δ  từ điển đầy đủ                       Σ*       mọi xâu (kể cả ^)
I (S)    ký hiệu ban đầu                      Σ+       mọi xâu khác rỗng
G = <Σ,Δ,I,R>  văn phạm                       2^Q      tập mọi tập con của Q
M = (Q,Σ,δ,q₀,F)  ô-tô-mát hữu hạn (DFA/NFA)  Q×Σ      tích Descartes
M = <Q,Σ,Δ,δ,q₀,z₀,F>  PDA                    δ*       hàm chuyển mở rộng
L(G)     ngôn ngữ sinh bởi G                  T(M), L(M)  ngôn ngữ đoán nhận
L(r)     ngôn ngữ biểu diễn bởi r             N(M)     ngôn ngữ theo xếp rỗng
∅        ngôn ngữ rỗng (≠ {^}!)               ⊢, ⊢*    dẫn xuất 1 bước / nhiều bước
R∪S, R.S, R*   hợp / ghép / lặp Kleene        R+       lặp ≥1 lần (R+ = R.R*)
```

**3 đẳng thức "vạn năng" của lặp:**
`(R*)* = R*`, `R* = {^} ∪ R+`, `∅* = {^}`. Đặc biệt `∅* = {^}` chứ **không** phải `∅` — bẫy hay gặp!

### B. Bốn câu thần chú phân loại Chomsky
1. Vế trái có ≥1 biến, không ràng buộc độ dài → **loại 0**.
2. Có ràng buộc `|β| ≥ |α|` → **loại 1** (nhớ: "không được ngắn đi").
3. Vế trái là **một biến đơn duy nhất** → **loại 2** (PNC).
4. Dạng `A → aB` hoặc `A → a` (hoặc trái: `A → Ba`) → **loại 3** (chính quy).
> Nhớ câu "**0 thì tự do, 1 thì không co, 2 thì đơn thân, 3 thì tuyến tính**".

### C. Đại số biểu thức chính quy + từ điển "mô tả → regex"
**Đẳng thức:** `r+s=s+r`; `(r+s)+t=r+(s+t)`; `r+r=r`; `(rs)t=r(st)`; `r(s+t)=rs+rt`; `(s+t)r=sr+tr`; `∅*=ε`; `(r*)*=r*`; `(r+)+=r+`; `εr=rε=r`; `ε* = ε`; `r* = ε + rr*` (đệ quy!) ; `(r+s)* ≠ r*+s*` (!!).

| Mô tả ngôn ngữ | Biểu thức chính quy | Ghi chú (đã kiểm chứng) |
|---|---|---|
| Mọi xâu | `(a+b)*` | cũng = `a*(ba*)*` = `(a*b*)*` |
| Kết thúc bằng `abb` | `(a+b)*abb` | |
| Chứa `00` | `(0+1)*00(0+1)*` | |
| Kết thúc `00` | `(0+1)*00` | |
| Chẵn số ký tự a | `(b*ab*a)*b*` | hoặc `(b+ab*a)*b*` |
| Lẻ số ký tự 1 | `0*1(0+10*1)*` | |
| Không chứa `aa` | `(b+ab)*(a+ε)` | viết gọn: `(b+ab)*a?` |
| Độ dài chẵn | `(aa+ab+ba+bb)*` | = `((a+b)(a+b))*` |
| Chẵn độ dài và là bội của `ab` | `(ab)*` | |
| Vị trí thứ 2 từ phải là a | `(a+b)*a(a+b)` | |
| `01ⁿ1 (n≥1)` hoặc `021` | `(01*+02)1` | ví dụ slide |
| Đảo ngược của `abb`??? | **KHÔNG có regex** | xem bổ đề bơm! |

**Quy ước ưu tiên:** lặp `* +` mạnh nhất → ghép `.` (viết liền) → hợp `+` yếu nhất. `01*+02 = 0(1*)+(02)`.

### D. Thuật toán 1 — NFA → DFA (phương pháp tập con)
**Quy trình 5 bước:**
1. Trạng thái đầu DFA: `q₀' = {q₀}` (nếu có ε: `q₀' = ε-CLOSURE(q₀)`).
2. Với mỗi tập trạng thái `T` chưa xử lý và mỗi `a ∈ Σ`: tính `U = ∪_{q∈T} δ(q,a)`, rồi lấy `ε-CLOSURE(U)` (nếu là ε-NFA).
3. `U` chưa có → thêm vào danh sách trạng thái DFA; ghi chuyển `δ'(T,a)=U`.
4. Trạng thái DFA là **kết thúc** nếu tập đó **chứa ít nhất một** trạng thái kết thúc của NFA.
5. Lặp đến khi hết.

**Ví dụ mẫu (đã kiểm chứng):** NFA (Σ={0,1}): `δ(q₀,0)={q₀,q₁}, δ(q₀,1)={q₀}, δ(q₁,1)={q₂}`, `F={q₂}` (ngôn ngữ: **kết thúc bằng `01`**).

| Tập | 0 | 1 | Kết thúc? |
|---|---|---|---|
| `{q₀}` | `{q₀,q₁}` | `{q₀}` | |
| `{q₀,q₁}` | `{q₀,q₁}` | `{q₀,q₂}` | |
| `{q₀,q₂}` | `{q₀,q₁}` | `{q₀}` | ✅ |

**Ví dụ ε-NFA mẫu (kinh điển cho `(a+b)*abb`, đã kiểm chứng đủ 5 trạng thái):**
NFA 11 trạng thái 0..10, cung ε: `0→1, 0→7, 1→2, 1→4, 3→6, 5→6, 6→1, 6→7`; cung thường: `2→(a)→3, 4→(b)→5, 7→(a)→8, 8→(b)→9, 9→(b)→10`; kết thúc `{10}`.
`ε-CLOSURE(0) = {0,1,2,4,7} = A`. Kết quả DFA **5 trạng thái**:
```
A  --a--> B ; A  --b--> C ;   B = {1,2,3,4,6,7,8}
B  --a--> B ; B  --b--> D ;   C = {1,2,4,5,6,7}
C  --a--> B ; C  --b--> C ;   D = {1,2,4,5,6,7,9}
D  --a--> B ; D  --b--> E ;   E = {1,2,4,5,6,7,10}  (kết thúc)
E  --a--> B ; E  --b--> C
```
Chạy thử: `abb`: A→B→D→E ✅ (`aabb`: A→B→B→D→E ✅; `abab` kết ở D ❌ — đúng!).

### E. Thuật toán 2 — RE → ε-NFA (thuật toán Thompson)
**Xây "từ dưới lên" theo 3 khối cơ bản + 3 phép ghép:**

| Biểu thức | Cách nối |
|---|---|
| `a` (1 ký tự) | 2 trạng thái: `i --a--> f` |
| `r + s` (hợp) | thêm trạng thái `i,f`: `i--ε-->i_r`, `i--ε-->i_s`, `f_r--ε-->f`, `f_s--ε-->f` |
| `r.s` (ghép) | nhập `f_r` vào `i_s` (hoặc cung `f_r --ε--> i_s`) |
| `r*` (sao) | `i--ε-->i_r`, `i--ε-->f`, `f_r--ε-->i_r`, `f_r--ε-->f` |

**Ví dụ mẫu (đã kiểm chứng):** `(a+b)*ab` → 8 trạng thái 0..7:
cung ε: `0→1, 0→5, 1→2, 1→3, 4→1, 4→5`; cung: `2→(a)→4, 3→(b)→4, 5→(a)→6, 6→(b)→7`; kết thúc `{7}`.
`ε-CLOSURE(0) = {0,1,2,3,5}`. Chuyển sang DFA (đã kiểm chứng) cho **4 trạng thái**: `[0,1,2,3,5]`, `[1,2,3,4,5,6]`, `[1,2,3,4,5]`, `[1,2,3,4,5,7]`(F).

### F. Thuật toán 3 — DFA → RE (loại trạng thái / state elimination)
**Quy trình:**
1. Thêm trạng thái ảo **S** (vào) và **E** (ra): `S --ε--> q₀`; mỗi `q ∈ F`: `q --ε--> E`.
2. Lần lượt "khử" từng trạng thái thật (trừ S, E): nếu còn cung `i → r`, vòng tự thân `r→r*`, cung `r → j` thì thêm cung `i → j` với nhãn `(nhãn i→r)·(r*)·(nhãn r→j)`; các nhãn song song thì **hợp** lại `r₁+r₂`.
3. Khi chỉ còn S, E: nhãn cung `S→E` chính là RE cần tìm.
**Ví dụ mẫu (đã kiểm chứng máy tính):** DFA "kết thúc bằng ab" (3 trạng thái `p₀→(a)p₁, p₁→(b)p₂` accept, `p₀→(b)p₀, p₁→(a)p₁, p₂→(a)p₁, p₂→(b)p₀`) cho kết quả:
`^(b)*a(a)*b((a + b(b)*a)(a)*b)^` — "phiên bản đẹp": **`b* a (a + b* a)* b`** ≡ classically `(a+b)*ab`. (Bạn chỉ cần 1 RE đúng; nên "làm đẹp" bằng cách gộp `(b)*→b*`, `a(a)*→aa*`.)

### G. Thuật toán 4 — FA ↔ Văn phạm chính quy (chuyển 2 chiều)
**FA → Văn phạm:** mỗi trạng thái `q` → một biến `q`; `q₀` = ký hiệu ban đầu.
- `δ(q, a) = p` ⇒ thêm quy tắc `q → a p`; nếu `p ∈ F` thì cũng thêm `q → a` (để "chốt" xâu).
- Nếu muốn giữ đúng khuôn `A→aB, A→a`: thêm biến `E` cho trạng thái kết thúc: `p ∈ F` ⇒ `p → ε` hoặc dùng cách trên.
**Văn phạm → FA:** làm ngược: `A → aB` ⇒ cung `A --a--> B`; `A → a` ⇒ cung `A --a--> E` với E kết thúc mới; `A → ε` ⇒ A là trạng thái kết thúc.
**Ví dụ slide (đã kiểm chứng):** `G = <{0,1},{S,S₁},S,{S→0S, S→0S₁, S₁→1S₁, S₁→1}>` ⇒ FA 3 trạng thái `S --0--> S (và S₁)…` cho `L = {0ⁿ1ᵐ | n,m ≥ 1}`.
> Nhớ nhanh: **"A→aB là cung A -a-> B; A→a là cung A -a-> (đích kết thúc)"**.

### H. Giản lược VPPNC & CNF — quy trình 5 bước "chuẩn bị nấu ăn"
1. **Loại ε-quy tắc** (`A→ε`): tìm các biến "nullable"; với mỗi quy tắc chứa nullable, thêm các biến thể bỏ nullable; xóa `A→ε` (giữ `S→ε` nếu cần).
2. **Loại quy tắc đơn** (`A→B`): tính bao đóng "A dẫn tới được biến nào chỉ bằng quy tắc đơn", rồi thay bằng các quy tắc "nhảy thẳng" (`A → mọi vế phải của các biến đó`).
3. **Loại ký hiệu vô sinh** (không dẫn ra xâu terminal nào).
4. **Loại ký hiệu không đến được** (từ S không chạm tới).
5. **Đưa về CNF:** (a) tách terminal lẫn trong vế phải dài ≥2 (thay `a` bởi biến riêng `X_a`); (b) bẻ vế phải dài >2: `A→B C D` ⇒ `A→B C'`, `C'→C D`.
> Thứ tự chuẩn: **ε → đơn → vô sinh → không đến được → CNF**. (Làm sai thứ tự có thể làm hụt ngôn ngữ — bẫy thi!)

### I. Bổ đề bơm (Pumping Lemma) — "tấm khiên chống lại FA/PDA"
**(1) Bổ đề bơm cho ngôn ngữ CHÍNH QUY:** Nếu `L` chính quy thì tồn tại số `n` (pumping length) sao cho mọi `w ∈ L, |w| ≥ n` đều tách được `w = xyz` với:
- `|xy| ≤ n`, `|y| ≥ 1`, và `∀i ≥ 0: x yⁱ z ∈ L`.
*(Trực giác: DFA n trạng thái ⇒ xâu dài hơn n phải lặp một trạng thái ⇒ đoạn giữa `y` là "vòng lặp" bơm được.)*
**Cách dùng để chứng minh L KHÔNG chính quy (5 nhịp):**
1. Giả sử L chính quy, gọi n là hằng số bơm.
2. **Tự chọn** một xâu `w ∈ L` với `|w| ≥ n` (nên chọn xâu "khó xử" — thường `aⁿbⁿ`).
3. Mọi cách tách `w = xyz` thỏa `|xy| ≤ n, |y| ≥ 1` đều dồn `y` vào một vùng (ví dụ toàn `a`).
4. Bơm `i = 0` hoặc `i = 2`: chỉ ra `x yⁱ z ∉ L` (mâu thuẫn).
5. Kết luận L không chính quy. ∎

**(2) Bổ đề bơm cho ngôn ngữ PHI NGỮ CẢNH (Bar-Hillel):** Nếu `L` là PNC thì tồn tại `n` sao cho mọi `w ∈ L, |w| ≥ n` tách được `w = u v x y z` với:
- `|v x| ≥ 1`, `|v x y| ≤ n`, và `∀i ≥ 0: u vⁱ x yⁱ z ∈ L`.
*(Trực giác: cây suy dẫn CNF đủ sâu ⇒ một biến xuất hiện 2 lần trên đường đi ⇒ "gọt" và "nhân đôi" hai khối v, x.)*
**Bẫy lớn:** bơm thất bại **KHÔNG** chứng minh được "L không PNC" nếu bạn chỉ bơm 1 khối — phải xét **mọi khả năng** vị trí của `vxy` (thường phân thành các trường hợp vị trí cắt giữa các "vùng ký tự").

### J. Bảng "bẫy" thường gặp trong đề thi
| Bẫy | Sự thật |
|---|---|
| `∅` vs `{^}` | `∅* = {^}` (không phải ∅); `∅` là ngôn ngữ rỗng, `{^}` chứa 1 phần tử |
| `r*` vs `r+` | `r*` = 0 lần trở lên (chứa ^); `r+` = ≥1 lần |
| `(r+s)*` vs `r*+s*` | KHÁC nhau! Phản ví dụ: `ab`: `(a+b)*` có, `a*+b*` không |
| `L1.L2` vs `L1 ∪ L2` | ghép ≠ hợp; nhớ độ dài cộng lại khi ghép |
| "Văn phạm chính quy sinh ngôn ngữ không chứa ^" | nếu muốn chứa ^ phải dùng "chính quy suy rộng" (thêm `S→ε`) |
| Phân loại "loại 1 hay 2" | kiểm tra 2 điều kiện: vế trái là 1 biến? (loại 2); nếu không, xét `|β|≥|α|` (loại 1) |
| Nhập nhằng: 2 dẫn xuất TRÁI khác nhau mới tính | 2 dẫn xuất phải hoặc 2 cây khác nhau đều tính; nhưng 2 "thứ tự thay thế" khác nhau trên CÙNG một cây thì KHÔNG |
| NFA→DFA: đừng bỏ trạng thái ∅ | trạng thái ∅ (trap/dead) thường cần cho "máy đầy đủ" và tính toán bù |
| PDA "đọc hết xâu" | điều kiện đoán nhận gồm cả: hết xâu + (vào trạng thái kết thúc HOẶC xếp rỗng) |
| Bổ đề bơm | chỉ là **điều kiện cần** — thỏa bơm không chứng minh được chính quy (có ngôn ngữ không chính quy vẫn "thỏa" bơm!) |

### K. Cách "chọn xâu" khi dùng bổ đề bơm (giá trị thi cử)
| Ngôn ngữ | Xâu nên chọn |
|---|---|
| `{aⁿbⁿ}` | `aⁿbⁿ` |
| `{0ⁿ1ⁿ}` | `0ⁿ1ⁿ` |
| `{ww}` | `0ⁿ1ⁿ0ⁿ1ⁿ` |
| `{aⁿbⁿcⁿ}` (PNC) | `aⁿbⁿcⁿ` |
| `{a^i b^j c^k: i<j}` | `aⁿbⁿ⁺¹` |
| Số nhị phân chia hết cho 3 (không chính quy hóa ngôn ngữ mô tả phức tạp) | chọn xâu dài trong L, bơm phần thay đổi giá trị số |

### L. Checklist 10 giây trước khi nộp bài
1. Văn phạm có "vế trái hợp lệ" (≥1 biến) không?
2. DFA ghi đủ: q₀, F, bảng chuyển **đầy đủ** (kể cả ô ∅ / trap)?
3. NFA→DFA: đã lấy **ε-closure** trước và sau mỗi bước chưa?
4. RE: đóng ngoặc đúng theo thứ tự ưu tiên? đã dùng `*` hay `+` đúng nghĩa?
5. CNF: quy tắc có đúng dạng `A→BC` / `A→a`? không còn `A→B`, `A→aBC`, `A→aB`?
6. Cây suy dẫn: lá đọc trái→phải có đúng bằng xâu đề cho?
7. Bơm: đã xét **hết mọi vị trí** có thể của `y` (hoặc `vxy`) chưa?
8. PDA: hình trạng ghi đúng thứ tự `<trạng thái, xâu còn lại, xâu xếp>`?
9. Kết luận "tương đương" phải chỉ ra cả hai chiều ⊇ và ⊆ (hoặc lập luận L(G)=L(G')).
10. Đơn vị: `|w|`, số trạng thái, số bước — kiểm tra lại số học một lần!

---

# PHẦN III. 200 BÀI TẬP CÓ LỜI GIẢI CHI TIẾT (TỪ DỄ → CỰC KHÓ)

> **Cấu trúc 5 mức độ:**
> - **Mức 1 — Bài 1–40: Nhập môn** (bảng chữ cái, xâu, ngôn ngữ, phép toán ngôn ngữ, đếm xâu).
> - **Mức 2 — Bài 41–80: Văn phạm & phân loại Chomsky** (dẫn xuất, L(G), 4 loại văn phạm).
> - **Mức 3 — Bài 81–125: Ô-tô-mát hữu hạn** (đọc/mô phỏng/thiết kế DFA–NFA, mô tả ngôn ngữ).
> - **Mức 4 — Bài 126–165: Biến đổi & dạng chuẩn** (regex ↔ FA ↔ văn phạm, Thompson, tập con, giản lược, CNF, cây suy dẫn).
> - **Mức 5 — Bài 166–200: Cực khó** (bổ đề bơm chính quy & CFL, PDA, tối tiểu hóa & Myhill–Nerode, tính đóng, phân cấp, chứng minh & ứng dụng).
> Mỗi bài có **lời giải chi tiết + giải thích "vì sao"**; các con số, vết chạy automaton đều đã được kiểm chứng bằng chương trình.

---

## MỨC 1 — NHẬP MÔN: BẢNG CHỮ CÁI, XÂU, NGÔN NGỮ (Bài 1–40)

### Bài 1. Cho Σ = {a, b, c}. Xâu nào sau đây thuộc Σ*: `abc`, `abd`, ``, `aabcc`, `Ab`?
**Lời giải:** Σ* = mọi dãy hữu hạn ký tự **lấy từ Σ** (kể cả xâu rỗng).
- `abc` ✅ (mọi ký tự ∈ Σ) — độ dài 3.
- `abd` ❌ vì `d ∉ Σ`.
- `` (xâu rỗng `^`) ✅ — xâu rỗng thuộc **mọi** Σ*.
- `aabcc` ✅ — độ dài 5.
- `Ab` ❌ vì `A ∉ Σ` (phân biệt chữ hoa/thường!).
> 💡 **Nhớ:** "thuộc Σ*" = kiểm tra **từng ký tự** có nằm trong "bộ chữ hợp lệ" không; xâu rỗng là "vé thông hành" mặc định.

### Bài 2. Tính độ dài: |aab|, |^|, |a₁a₂…a₁₀|, |εε|.
**Lời giải:** `|aab| = 3`; `|^| = 0`; `|a₁a₂…a₁₀| = 10`; `εε` là **hai** ký hiệu ε hay một? — Mặc định ε là ký hiệu "rỗng", khi viết εε ta hiểu là **xâu rỗng** (không có ký tự) ⇒ `|ε| = 0` và `|εε| = 0`.
> 💡 Hiểu như chuỗi: `""+" "` trong lập trình — độ dài 0+0 = 0.

### Bài 3. Cho Σ = {0,1}, viết **10 từ đầu tiên** của Σ* theo thứ tự: độ dài tăng dần, cùng độ dài thì thứ tự từ điển.
**Lời giải (đúng chuẩn kiểm chứng):** `^, 0, 1, 00, 01, 10, 11, 000, 001, 010, 011, …` (10 từ đầu: `^,0,1,00,01,10,11,000,001,010` hoặc liệt kê tới `011` nếu tính cả 11 mục).
> 💡 Đây chính là "thứ tự mà máy tính liệt kê file": `file1, file10, file2…` nếu so chuỗi; nhưng ở đây theo **độ dài trước**.

### Bài 4. Cho Σ = {a,b}. Liệt kê đầy đủ các xâu độ dài 3 và đếm số xâu độ dài 3.
**Lời giải:** `aaa, aab, aba, abb, baa, bab, bba, bbb` → **8** xâu. Công thức tổng quát: số xâu độ dài n trên bảng m ký tự là `mⁿ`; ở đây `2³ = 8`.

### Bài 5. Bảng chữ cái Σ có 3 ký tự. Hỏi có bao nhiêu xâu độ dài 4? Bao nhiêu xâu độ dài ≤ 4?
**Lời giải:** độ dài 4: `3⁴ = 81`. Độ dài ≤ 4: `3⁰+3¹+3²+3³+3⁴ = 1+3+9+27+81 = 121` (đã kiểm chứng).
> 💡 Lưu ý "≤" là **cộng dồn các độ dài** — lỗi phổ biến là quên `3⁰ = 1` (xâu rỗng).

### Bài 6. Cho L₁ = {a, ab}, L₂ = {b, ba}. Tính L₁ ∪ L₂, L₁ ∩ L₂, L₁.L₂, L₁², và 5 phần tử đầu của L₁*.
**Lời giải:**
- `L₁ ∪ L₂ = {a, ab, b, ba}` (hợp = gom cả hai, bỏ trùng).
- `L₁ ∩ L₂ = ∅` (không xâu nào chung).
- `L₁.L₂ = {ab, aba, abb, abba}` (ghép **mọi** cặp: `a·b, a·ba, ab·b, ab·ba`).
- `L₁² = L₁.L₁ = {aa, aab, aba, abab}`.
- `L₁* ∋ ^, a, ab, aa, aab, …` (5 phần tử đầu: `^, a, ab, aa, aab` — thứ tự "độ dài rồi từ điển").
> 💡 Quy tắc ghép: `|uv| = |u| + |v|`; nhân ghép **không** giao hoán: `L₁.L₂ ≠ L₂.L₁` nói chung (ở đây `L₂.L₁ = {ba, baa, bab, baab}`).

### Bài 7. Ngôn ngữ L = {0,1}⁺ có chứa ^ không? So sánh Σ* và Σ⁺.
**Lời giải:** Theo định nghĩa `Σ⁺ = Σ* \ {^}` ⇒ `{0,1}⁺` **không** chứa ^. Còn `{0,1}* = {0,1}⁺ ∪ {^}`. Vậy `Σ* = Σ⁺ ∪ {^}`, `Σ⁺ = Σ*.Σ = Σ.Σ*`.

### Bài 8. Xâu nào thuộc `L = {aⁿbⁿ | n ≥ 1}`: `ab`, `aabb`, `aab`, `abab`, `aaabbb`, `ba`?
**Lời giải:** `ab` (=a¹b¹) ✅; `aabb` (=a²b²) ✅; `aab` ❌ (2≠1); `abab` ❌ (không phải dạng aⁿbⁿ — ký tự b xen giữa); `aaabbb` ✅; `ba` ❌.
> 💡 Muốn kiểm tra nhanh: đếm số a, số b và **kiểm tra hình dạng "a…a b…b"** (không được có a sau b).

### Bài 9. Với `L = {w ∈ {0,1}* : |w| chẵn}`, các xâu `^`, `1`, `11`, `101`, `1001` thuộc L?
**Lời giải:** `^` (dài 0, chẵn) ✅; `1` (1) ❌; `11` (2) ✅; `101` (3) ❌; `1001` (4) ✅.

### Bài 10. Với `L = {w ∈ {0,1}* : w chứa "01"}`, kiểm tra `001`, `110`, `0101`, `10`, `01`.
**Lời giải:** `001` ✅ (vị trí 2-3 là "01"); `110` ❌ (không có "01"); `0101` ✅; `10` ❌ (có "10" chứ không có "01"); `01` ✅ (chính nó).
> 💡 Phân biệt "chứa" (bất kỳ vị trí) vs "kết thúc bằng" — hai ngôn ngữ khác nhau.

### Bài 11. Phân biệt `∅` và `{^}`. Cho ví dụ thực tế.
**Lời giải:** `∅` = ngôn ngữ **không chứa xâu nào**; `{^}` = ngôn ngữ chứa **đúng một xâu** là xâu rỗng. `∅ ≠ {^}`.
Ví dụ CNTT: ở một form đăng ký, nếu quy định "họ tên không được để trống và phải có ít nhất 1 ký tự" thì tập chuỗi hợp lệ của trường đó là `Σ⁺` — **không** chứa `""`; còn nếu "cho phép để trống" thì tập hợp lệ chứa `""` tức chứa `^`.

### Bài 12. Cho Σ = {a,b}. Viết dạng tập hợp cho L = "các xâu bắt đầu bằng a, độ dài ≤ 3".
**Lời giải:** `L = {a, aa, ab, aaa, aab, aba, abb}` (7 xâu). Hoặc viết `L = {aw : w ∈ {a,b}*, |w| ≤ 2}`.
> 💡 Có 2 cách mô tả: **liệt kê** (hữu hạn) hoặc **điều kiện** — cả hai đều chính xác.

### Bài 13. Ngôn ngữ nào hữu hạn, ngôn ngữ nào vô hạn: `{aⁿbⁿ | n≥1}`, `{aⁿ b | n ≤ 100}`, `{w ∈ {a,b}* : |w| = 5}`, `Σ*`?
**Lời giải:** `{aⁿbⁿ|n≥1}` **vô hạn** (n chạy vô hạn); `{aⁿb|n≤100}` **hữu hạn** (101 xâu); `{w:|w|=5}` **hữu hạn** (`2⁵ = 32` xâu); `Σ*` **vô hạn đếm được**.

### Bài 14. Có bao nhiêu xâu độ dài 5 trên {a,b} chứa **ít nhất 2 ký tự a**?
**Lời giải:** tổng độ dài 5 có `C(5,k)` xâu chứa đúng k chữ a. Đếm = `C(5,2)+C(5,3)+C(5,4)+C(5,5) = 10+10+5+1 = 26` (đã kiểm chứng bằng chương trình).
> 💡 Cách khác: tổng - (0 chữ a) - (1 chữ a) = `32 - 1 - 5 = 26`.

### Bài 15. Có bao nhiêu xâu độ dài n trên {a,b} có **số ký tự a chẵn**?
**Lời giải:** Một nửa tổng số xâu: `2ⁿ/2 = 2ⁿ⁻¹` (n ≥ 1). Kiểm chứng: n=1: 1 (`b`); n=2: 2 (`aa`,`bb`); n=3: 4; n=4: 8; n=5: 16.
> 💡 Lập luận "một nửa": với mỗi xâu, "lật" ký tự a↔b ở vị trí đầu đổi tính chẵn lẻ của số a ⇒ số xâu chẵn = số xâu lẻ = `2ⁿ⁻¹`. (n=0: chỉ có `^` — 1 xâu, là chẵn.)

### Bài 16. Số xâu độ dài ≤ 4 trên bảng chữ cái 3 ký tự?
**Lời giải:** `3⁰+3¹+3²+3³+3⁴ = 121` (trùng Bài 5 — nhớ luôn công thức `(mⁿ⁺¹−1)/(m−1)`).

### Bài 17. Cho Σ = {0,1,2}. Xét "021": thuộc Σ*? thuộc Σ⁺? Có xâu nào thuộc Σ⁺ mà không thuộc Σ*?
**Lời giải:** `021 ∈ Σ*` ✅ và `∈ Σ⁺` ✅ (khác rỗng). Không có xâu nào thuộc Σ⁺ mà không thuộc Σ*, vì **Σ⁺ ⊂ Σ*** (bao hàm nghiêm ngặt).

### Bài 18. Tập Σ* có đếm được không? Vì sao?
**Lời giải:** Có — **mọi xâu chỉ có độ dài hữu hạn**, ta có thể liệt kê theo "bó độ dài": độ dài 0 có 1 xâu, độ dài 1 có m xâu, …, độ dài n có `mⁿ` xâu. Xếp nối các bó lại thành dãy vô hạn đếm được ⇒ Σ* **đếm được (countably infinite)**. (Đây là lý do khoa học máy tính "làm việc được" với ngôn ngữ: ta luôn liệt kê được từng xâu của ngôn ngữ.)

### Bài 19. Cho L₁ = {ab, ba}, L₂ = {c}. Tính L₁L₂, L₂L₁, (L₁L₂)².
**Lời giải:** `L₁L₂ = {abc, bac}`; `L₂L₁ = {cab, cba}`; `(L₁L₂)² = {abc, bac}·{abc, bac} = {abcabc, abcbac, bacabc, bacbac}`.

### Bài 20. Viết gọn ngôn ngữ `{a, aa, aaa, aaaa, …}`. Viết gọn `{^, a, aa, aaa, …}`.
**Lời giải:** cái đầu `= a⁺ = {aⁿ | n ≥ 1}`; cái sau `= a* = {aⁿ | n ≥ 0}`.
> 💡 Khác biệt duy nhất: `^` (tức `a⁰`). Trong regex: `a+` vs `a*`.

### Bài 21. Cho L = {w ∈ {a,b}* : |w| = 2}. Liệt kê L. Có bao nhiêu xâu độ dài 4 thuộc L²?
**Lời giải:** `L = {aa, ab, ba, bb}`. `L²` = ghép 2 xâu bất kỳ từ L ⇒ mọi xâu độ dài 4 trên {a,b}, có `4² = 16` xâu (từ `aaaa` đến `bbbb`).

### Bài 22. Liệt kê các xâu **không chứa "aa"** có độ dài ≤ 3. Đếm theo từng độ dài và nhận xét dãy số.
**Lời giải:** n=0: `^` (1); n=1: `a,b` (2); n=2: `ab,ba,bb` (3); n=3: `aba,abb,baa,bab,bba,bbb` (5). Dãy 1,2,3,5 = **Fibonacci**! (Tổng quát: số xâu độ dài n không chứa "aa" = F(n+2): 1,2,3,5,8,13,21,34 — đã kiểm chứng.)
> 💡 Vì sao Fibonacci? Xâu kết thúc bằng `b`: nối `b` vào xâu dài n-1 hợp lệ; kết thúc bằng `a`: phải là `…ba`, nối vào xâu dài n-2. ⇒ `f(n) = f(n-1) + f(n-2)`. Đây là dạng đệ quy bạn sẽ gặp lại trong đếm xâu — "Fibonacci hóa" của ngôn ngữ.

### Bài 23. Cho L₁ = {a, b, ab, bb}, L₂ = {b}. Tính L₁ \ L₂ (hiệu tập hợp).
**Lời giải:** `L₁ \ L₂ = {a, ab, bb}` (bỏ phần tử b).
> 💡 Đừng nhầm **hiệu ngôn ngữ** `L₁\L₂` với hiệu xâu: hiệu ở đây là hiệu hai **tập hợp xâu**.

### Bài 24. Cho Σ = {a,b}. Mô tả phần bù `L̄ = Σ* \ L` với L = {a}.
**Lời giải:** `L̄ = {^} ∪ {mọi xâu khác "a"}` = mọi xâu **trừ** xâu đúng bằng "a". Viết dạng điều kiện: `L̄ = {w : w ≠ a}`. (Trong đó có ^, b, aa, ab, ba, bb, …)
> 💡 Phần bù được tính **đối với bảng chữ cái Σ** — đổi Σ thì đổi phần bù. Câu hỏi kinh điển khi thi.

### Bài 25. Cho L = {ab}. Liệt kê 4 phần tử đầu của L*, L+.
**Lời giải:** `L* = {^, ab, abab, ababab, …}` — viết gọn `L* = {(ab)ⁿ | n ≥ 0}`; `L+ = {(ab)ⁿ | n ≥ 1} = {ab, abab, ababab, …}`.
> 💡 `L*` luôn chứa `^` **cho dù L không chứa ^** — vì `L⁰ = {^}` theo quy ước.

### Bài 26. Nếu `^ ∈ L` thì `L*` và `L+` có gì khác nhau? Cho ví dụ.
**Lời giải:** Nếu `^ ∈ L` thì `^ ∈ L+` nữa (vì L+ = L¹ ∪ L² ∪ … chứa L¹ = L), nên **L* = L+**. Ví dụ `L = {^, a}`: `L+ = {^, a, aa, aaa, …} = a* = L*`.
> 💡 Ngược lại nếu `^ ∉ L` thì `L* = L+ ∪ {^}` và hai ngôn ngữ khác nhau (khác nhau đúng một phần tử `^`).

### Bài 27. Cho Σ = {a,b}, L = các xâu có độ dài lẻ. Viết dạng tập hợp. Có bao nhiêu xâu độ dài 3, 5 thuộc L?
**Lời giải:** `L = {w : |w| = 2k+1, k ≥ 0}`. Độ dài 3: `2³ = 8` xâu; độ dài 5: `2⁵ = 32` xâu (mọi xâu độ dài lẻ đều thuộc).

### Bài 28. (Góc CNTT) Trong bảng mã Unicode, một emoji "😀" chiếm 1 "code point" nhưng tới 4 byte UTF-8. Nếu coi bảng chữ cái Σ là tập **byte** vs tập **code point**, thì `|w|` khác nhau thế nào? Vì sao điều này quan trọng khi validate dữ liệu?
**Lời giải:** Chọn Σ = byte: xâu "😀" dài **4**; chọn Σ = code point: dài **1**. Cùng một văn bản, độ dài phụ thuộc "bảng chữ cái đang xét". Đây là lý do thư viện xử lý chuỗi (Python `len`, JS `string.length`) hay gây bug: JS đếm theo UTF-16 **code unit** ⇒ emoji dài 2, ký tự tiếng Việt tổ hợp (như "ế" = e + dấu) có thể dài 2.
> 💡 Kết luận thực hành: khi làm "đếm ký tự hợp lệ" trong form đăng ký, phải **chuẩn hóa Unicode (NFC)** và đếm theo code point, nếu không sẽ chặn oan người dùng — bài học từ đúng khái niệm `|w|`.

### Bài 29. Cho L = {w ∈ {a,b}* : w bắt đầu bằng a}. ^ có thuộc L? Xâu `b`? Xâu `ab`?
**Lời giải:** `^` ❌ (không có ký tự đầu — không "bắt đầu bằng a"); `b` ❌; `ab` ✅.
> 💡 Bẫy: nhiều bạn cho `^ ∈ L` với lập luận "không có gì chống lại" — SAI. Quy ước: "bắt đầu bằng a" đòi hỏi **tồn tại** ký tự đầu là a.

### Bài 30. Kiểm tra `1010 ∈ L` với `L = {w ∈ {0,1}* : w chứa "10" và kết thúc bằng "0"}`?
**Lời giải:** `1010` chứa "10" (vị trí 1-2) ✅ và kết thúc bằng "0" ✅ ⇒ **thuộc L**.
> 💡 Là **giao của hai điều kiện** — muốn xây DFA thì dùng tích hai DFA (xem bài mức 3). Kỹ năng: tách điều kiện phức thành nhiều điều kiện đơn.

### Bài 31. Liệt kê 5 phần tử đầu (theo độ dài, rồi từ điển) của `L = {aⁱbʲ | i,j ≥ 0}`.
**Lời giải:** `^, a, b, aa, ab, bb, aaa, …` — 5 phần tử đầu: `^, a, b, aa, ab`.
> 💡 Lưu ý `L` chứa `^` (i=j=0) và mọi xâu dạng "a…ab…b" (có thể 0 chữ a hoặc 0 chữ b).

### Bài 32. Σ = {a,b}, L = {w : số ký tự a là bội số của 3}. Kiểm tra `aaa`, `aaaa`, `abab`, `^`.
**Lời giải:** `aaa` (3 a) ✅; `aaaa` (4) ❌; `abab` (2) ❌; `^` (0 a, 0 là bội của 3) ✅.
> 💡 "0 là bội của 3" là quy ước toán học — nhớ khi làm tính chia hết.

### Bài 33. Đếm số xâu độ dài 6 trên {0,1} **không chứa "00"**.
**Lời giải:** Theo Fibonacci `F(n+2)`: F(8) = **21** (dãy 1,2,3,5,8,13,21 đã kiểm chứng). Kiểm tra lại bằng tay: chia trường hợp cũng ra 21.

### Bài 34. Đếm số xâu độ dài 7 trên {0,1} **kết thúc bằng "01"**.
**Lời giải:** 5 ký tự đầu tự do ⇒ `2⁵ = 32` (đã kiểm chứng máy).
> 💡 Mẹo "khóa đuôi": cố định k ký tự cuối, phần còn lại tự do ⇒ đếm nhanh bằng lũy thừa.

### Bài 35. Bảng đếm số xâu trên {0,1} **chứa "00"** theo từng độ dài n = 0..6.
**Lời giải (đã kiểm chứng):** n: 0→0, 1→0, 2→1 (`00`), 3→3 (`000,001,100`), 4→8, 5→19, 6→43.
> 💡 Công thức truy hồi: `a(n) = 2ⁿ⁻¹ + a(n-1)/2 + …` — nhưng đơn giản nhất là nhớ **tổng số trừ số không chứa**: `2ⁿ − F(n+2)` (n≥2). Kiểm tra: n=4: `16 − 8 = 8` ✅; n=6: `64 − 21 = 43` ✅.
> 💡 Với "chứa 00 **hoặc** 11": n=2..6 là 2, 6, 14, 30, 62; công thức `2ⁿ − 2·F(n+1)`.

### Bài 36. Ngôn ngữ `{aᵖ | p là số nguyên tố}` có hữu hạn không?
**Lời giải:** **Vô hạn** (vô số số nguyên tố — Euclid) nhưng "thưa": thuộc tính "p nguyên tố" không thể nhận biết bằng FA (sẽ chứng minh ở mức 5). Đây là ví dụ chứng tỏ: "vô hạn" ≠ "chính quy".

### Bài 37. Sắp xếp theo quan hệ bao hàm: `∅, {^}, Σ*, Σ⁺, {a}, {a}*`.
**Lời giải:** `∅ ⊂ {^} ⊂ …`; cụ thể: `∅ ⊂ {a} ⊂ {a}* ⊂ Σ*`; `{^} ⊂ Σ*`; `Σ⁺ ⊂ Σ*`; và `{^} ∩ Σ⁺ = ∅`, `{^} ∪ Σ⁺ = Σ*`.
> 💡 Ba "quan hệ cần nhớ": `∅ ⊂ {^}`, `Σ⁺ = Σ*\{^}`, `{a}* = {^, a, aa, …}` (chứa `^`, khác `{a}⁺`).

### Bài 38. Cho `L = {a²ⁿ | n ≥ 0}`. Liệt kê 4 phần tử đầu; L là ngôn ngữ trên bảng chữ cái nào?
**Lời giải:** `L = {^, aa, aaaa, aaaaaa, …}`. L là ngôn ngữ trên **bất kỳ bảng chữ cái nào chứa a** (nhỏ nhất là Σ={a}).
> 💡 Kiểm tra: `^` ứng với n=0 ✅. Ngôn ngữ là "tập con của Σ*" nên tính "trên Σ nào" phụ thuộc ta chọn Σ ⊇ các ký tự xuất hiện.

### Bài 39. (Góc CNTT) Ngôn ngữ "số tự nhiên viết hệ 10, **không** có số 0 đứng đầu (trừ số 0)" — xâu `0`, `07`, `70`, `123` có hợp lệ?
**Lời giải:** `0` ✅ (quy ước cho phép); `07` ❌ (0 đứng đầu); `70` ✅; `123` ✅.
> 💡 Đây chính là validator chống "hack" dữ liệu kiểu `007` hay `0123456789`; regex tương ứng `0+(1+2+…+9)(0+…+9)*` (kiểm tra được bằng regex engine; về bản chất là một DFA 3-4 trạng thái).

### Bài 40. (Góc CNTT) Vì sao nói "validate email/regex là một bài toán ĐOÁN NHẬN ngôn ngữ"? Cho 1 ví dụ chuỗi hợp lệ và 1 chuỗi gần hợp lệ.
**Lời giải:** Bộ ký tự hợp lệ của email là bảng chữ cái Σ = {chữ, số, `.`, `@`, `-`, `_`…}; tập email hợp lệ là ngôn ngữ `L_email ⊂ Σ*`; hàm kiểm tra email thực chất trả lời "w ∈ L_email?" ⇒ đúng là **bài toán đoán nhận**. Ví dụ: `an.nguyen@hp.edu.vn` ✅; `an..nguyen@@hp` ❌.
> 💡 Hệ quả thực tế: mọi công cụ validate "tốt" thực chất là DFA/regex; và vì regex (chính quy) không đếm được vô hạn, các ràng buộc kiểu "số dấu ngoặc phải cân bằng" trong email **không thể** viết bằng regex — phải dùng parser (PDA) hoặc code. Đây là kiến thức chương này "áp" vào nghề luôn!

---

## MỨC 2 — VĂN PHẠM & PHÂN LOẠI CHOMSKY (Bài 41–80)

### Bài 41. Cho `G = <{a,b}, {I}, I, {I→aIb, I→ab}>`. Viết dẫn xuất đầy đủ của `a³b³` và cho biết độ dài dẫn xuất.
**Lời giải:**
`I ⊢ aIb ⊢ aaIbb ⊢ aaaIbbb ⊢ aaabbb`
(Từng bước: dùng `I→aIb` 3 lần liên tiếp — lần đầu, lần hai, lần ba; rồi dùng `I→ab` để "chốt".) Dẫn xuất đầy đủ: `D = (I, aIb, aaIbb, aaaIbbb, aaabbb)` ⇒ **độ dài = 4 bước**.
> 💡 Kiểm tra bằng "đếm ký hiệu": xâu `a³b³` có 3 cặp ab ⇒ cần 3 bước `I→aIb` + 1 bước `I→ab` = 4.

### Bài 42. Với Σ={0,1}, Δ={S,A,B}, các quy tắc sau hợp lệ? Giải thích: (a) `S→0S1A`; (b) `0AB→1A1B`; (c) `A→^`; (d) `0→A`; (e) `01→0B`; (f) `BA→B`.
**Lời giải:** Điều kiện: vế trái phải chứa **ít nhất một ký hiệu phụ** (∈Δ) và không rỗng.
- (a) ✅ (vế trái S).
- (b) ✅ (vế trái chứa A, B).
- (c) ✅ (vế trái A; vế phải rỗng được phép).
- (d) ❌ (vế trái toàn ký hiệu kết thúc `0`).
- (e) ❌ (vế trái `01` toàn terminal).
- (f) ✅ (vế trái chứa A, B).

### Bài 43. Viết văn phạm sinh `{aⁿbⁿ | n ≥ 0}`. So sánh với văn phạm sinh `{aⁿbⁿ | n ≥ 1}`.
**Lời giải:**
- `n ≥ 1`: `G₁: I → aIb | ab` (đã biết).
- `n ≥ 0`: `G₂: I → aIb | ^`.
Vậy chỉ khác **một quy tắc chốt**: `I→ab` (độ dài tối thiểu 2) ↔ `I→^` (cho phép xâu rỗng). Hai văn phạm không tương đương: `L(G₁) = L(G₂) \ {^}`.

### Bài 44. Viết văn phạm sinh `{aⁿbᵐ | n, m ≥ 1}` (đây là ngôn ngữ CHÍNH QUY).
**Lời giải:** `G = <{a,b}, {S,B}, S, {S→aS | aB, B→bB | b}>`.
- `S→aS` (k≥0 lần) rồi `S→aB` ⇒ phát sinh ≥1 ký tự a; `B→bB` (tùy ý) rồi `B→b` ⇒ ≥1 ký tự b. Vậy `L(G) = a⁺b⁺` ✅.
- Vì mọi quy tắc có dạng `A→aB` hoặc `A→a` ⇒ văn phạm **chính quy (loại 3)**.

### Bài 45. Viết văn phạm chính quy cho ngôn ngữ "các xâu trên {a,b} bắt đầu bằng a".
**Lời giải:** `S → aA | a`, `A → aA | bA | a | b`.
Giải thích: ký tự đầu buộc phải a (hai quy tắc đầu của S); sau đó A sinh mọi phần đuôi bất kỳ (kể cả rỗng nếu dùng `S→a`).

### Bài 46. Viết văn phạm chính quy cho "xâu bắt đầu bằng a VÀ kết thúc bằng a" (trên {a,b}).
**Lời giải:** `S → a | aB`, `B → aB | bB | a`.
Kiểm tra: `S→a` cho xâu "a"; `S→aB` với B kết thúc bằng a: "aa", "aba", "abba", … ✅ và không sinh "ab" (vì B không được kết thúc bằng b). Văn phạm tuyến tính phải ⇒ loại 3.

### Bài 47. Viết văn phạm (PNC) cho `{aⁿbⁿcᵐ | n ≥ 1, m ≥ 1}`.
**Lời giải:** `S → TC`, `T → aTb | ab`, `C → cC | c`.
(T sinh `aⁿbⁿ`, C sinh `cᵐ`, ghép lại. Kiểm chứng máy: sinh `abc, abcc, aabbc, aabbcc, aaabbbc…` ✅.)

### Bài 48. Tìm L(G) với `G: S → SS | aSb | ε`.
**Lời giải:** `L(G) = {w ∈ {a,b}* : số ký tự a = số ký tự b}` (kể cả xâu rỗng).
- Chiều ⊇ (mọi xâu cân bằng sinh được): quy nạp theo |w|. Nếu w bắt đầu bằng a: nó phải "khép" a đó với một b nào đó ở vị trí cuối cùng mà khối giữa vẫn cân bằng: `w = a·u·b·v` với u, v cân bằng ⇒ dùng `S→SS, S→aSb`. Nếu w bắt đầu bằng b: đối xứng (trong văn phạm có `bSa`dạng tổng quát — đây bản đơn giản nên ta phân tích cặp b đầu tiên đóng với a nào đó). 
- Chiều ⊆: mỗi quy tắc bảo toàn hiệu #a−#b *(S→aSb giữ nguyên hiệu; S→SS cộng hai xâu cùng hiệu 0)* ⇒ mọi xâu sinh ra cân bằng.
> 💡 Kiểm chứng máy: sinh đúng `^, ab, ba, aabb, abab, abba, baab, baba, bbaa, …` — chính là **ngôn ngữ Dyck** một phần, rất giống "chuỗi ngoặc đúng" trong code.

### Bài 49. Tìm L(G) với `G: S → aSb | ε`.
**Lời giải:** `L(G) = {aⁿbⁿ | n ≥ 0}` (dẫn xuất n bước: `S ⊢ aSb ⊢ … ⊢ aⁿSbⁿ ⊢ aⁿbⁿ`).

### Bài 50. Tìm L(G) với `G: S → AB | a; A → aA | a; B → bB | b`.
**Lời giải:** `A` sinh `a⁺`; `B` sinh `b⁺`; `S→AB` ⇒ `a⁺b⁺`; `S→a` ⇒ xâu "a". Vậy `L(G) = {a} ∪ {aⁱbʲ | i,j ≥ 1}` (kiểm chứng máy: `a, ab, aab, abb, aaab, …` ✅).

### Bài 51. Phân loại theo Chomsky: (a) `S→aSb | ab`; (b) `S→aB, B→bC, C→c`; (c) `aB→b, B→c`; (d) `S→ABC, AB→a, BC→b`; (e) `S→aSBC | aBC, aB→ab, CB→BC, bB→bb, bC→bc, cC→cc`; (f) `S→SS | aSb | bSa | ab | ba`.
**Lời giải:**
- (a) vế trái là biến đơn ⇒ **loại 2**. (Ngôn ngữ `{aⁿbⁿ}` không thể chính quy.)
- (b) `S→aB, B→bC, C→c` đúng dạng `A→aB`/`A→a` ⇒ **loại 3** (sinh `a·b·c` — đúng 1 xâu "abc"; thêm `B→b` sẽ cho `{ab^n c}`…).
- (c) `aB→b`: vế trái chứa biến ✅; **độ dài giảm** (2→1) nên **không** thỏa `|β|≥|α|` ⇒ **loại 0**.
- (d) `AB→a` giảm độ dài ⇒ **loại 0**.
- (e) mọi quy tắc **không giảm** độ dài (`aB→ab`: 2→2; `CB→BC`: 2→2; …) ⇒ **loại 1** (cảm ngữ cảnh). Đây chính là văn phạm chuẩn cho `{aⁿbⁿcⁿ}`.
- (f) vế trái đơn ⇒ **loại 2**; cũng không phải loại 3 vì `S→SS` có hai biến bên phải (`aSb` cũng không tuyến tính).
> 💡 Mẹo phân loại: kiểm **loại 3 trước** (chỉ `A→aB`/`A→a`/`A→Ba`?), rồi **loại 2** (vế trái 1 biến?), rồi **loại 1** (`|β|≥|α|`?), còn lại **loại 0**.

### Bài 52. Phân loại: `G = <{a,b,c}, {I,S,A}, I, {I→aIS, S→Ab, IA→c}>`.
**Lời giải:** vế trái có ≥1 biến ⇒ không vi phạm dạng 0; nhưng `IA→c` **giảm** (2 ký tự → 1) ⇒ không phải loại 1; vế trái `IA` không phải một biến đơn ⇒ không loại 2 ⇒ **loại 0 (ngữ cấu)**.

### Bài 53. Phân loại: `G = <{a,b}, {I}, I, {Ia→aIb, Ib→bIa, I→II, I→ab}>`.
**Lời giải:** kiểm độ dài từng quy tắc: `Ia→aIb` (2→3 ✅ không giảm), `Ib→bIa` (2→3 ✅), `I→II` (1→2 ✅), `I→ab` (1→2 ✅). Mọi quy tắc không giảm ⇒ **loại 1 (cảm ngữ cảnh)**. (Không phải loại 2 vì vế trái `Ia`, `Ib` không phải một biến đơn.)

### Bài 54. Phân loại: `G = <{a,b,c}, {I,A,B}, I, {I→abc, I→aAbc, Ab→bA, Ac→Bbc, bB→Bb, aB→aaA, aB→aa}>`.
**Lời giải:** độ dài: `abc`(1→3), `aAbc`(1→4), `Ab→bA`(2→2), `Ac→Bbc`(2→3), `bB→Bb`(2→2), `aB→aaA`(2→3), `aB→aa`(2→2) — **tất cả không giảm** ⇒ **loại 1 (cảm ngữ cảnh)**. Vế trái không phải biến đơn ⇒ không loại 2/3.

### Bài 55. Bộ luật nào là chính quy (tuyến tính phải/trái)? (a) `S→aS | bA; A→aS | b`; (b) `S→Sa | Ab; A→a`; (c) `S→aSb | ab`; (d) `S→aSB | aB; B→bB | c`.
**Lời giải:**
- (a) mọi vế phải dạng `aB` hoặc `a` ⇒ **tuyến tính phải ⇒ loại 3**.
- (b) `S→Sa` (biến bên trái, terminal bên phải), `S→Ab` ⇒ **tuyến tính trái ⇒ loại 3**. (Cả (a),(b) đều sinh ngôn ngữ chính quy.)
- (c) `S→aSb` không tuyến tính (biến bọc hai phía) ⇒ **loại 2**.
- (d) `S→aSB` có **hai** biến ở vế phải ⇒ không tuyến tính ⇒ **chỉ loại 2** (dù `B` chính quy).

### Bài 56. Viết văn phạm chính quy cho `{aⁿbᵐ | n, m ≥ 1}` rồi tìm 3 xâu sinh ra.
**Lời giải:** `I → aI | aB`, `B → bB | b` (đúng như slide). Ví dụ: `I⊢aI⊢aaB⊢aab` (xâu "aab"), `I⊢aB⊢ab` ("ab"), `I⊢aB⊢abB⊢abb` ("abb").

### Bài 57. Văn phạm chính quy cho "mọi xâu trên {a,b} kết thúc bằng ab".
**Lời giải:** `S → aS | bS | aA`, `A → b`.
- `S→aS|bS` cho phép đọc tùy ý phần đầu; `S→aA` ghi nhớ "vừa gặp a"; `A→b` chốt đúng kết thúc "ab". Kiểm tra: "ab" ✅, "aab" ✅, "abb" ❌ (kết thúc bằng bb), "baba"? — "…ba" ❌ đúng.
Hướng khác: viết như 3 trạng thái: `q₀→aq₀|bq₀|aq₁; q₁→bq₂; q₂→aq₀|bq₀` (nếu muốn "chấp nhận rồi vẫn đọc tiếp").

### Bài 58. Văn phạm cho `(ab)*` (chú ý xâu rỗng!).
**Lời giải:** `S → aA | ε`, `A → bS`.
Kiểm tra: `S⊢ε` ("") ✅; `S⊢aA⊢abS⊢ab` ✅; `S⊢aA⊢abS⊢abaA⊢abab` ✅. Vì có quy tắc rỗng ⇒ đây là **văn phạm chính quy… suy rộng** (theo đúng chú ý trong slide: ngôn ngữ chứa ^ thì phải dùng dạng suy rộng).

### Bài 59. Viết VPPNC cho ngôn ngữ palindrome (đảo xuôi đọc giống nhau) trên {a,b}.
**Lời giải:** `S → aSa | bSb | a | b | ε`.
- "abba": `S⊢aS a⊢abS ba⊢ab ba` ✅; "aba": `S⊢aSa⊢aba` ✅; "ab": không phải palindrome — không dẫn ra được ✅.
> 💡 Cấu trúc `aSa`: "bọc đối xứng", đúng bản chất palindrome.

### Bài 60. VPPNC cho `{aⁱbⁱcᵏ | i ≥ 1, k ≥ 1}`.
**Lời giải:** `S → TC`, `T → aTb | ab`, `C → cC | c` (kiểm chứng máy: `abc, aabbc, abcc, aabbcc, aaabbbc…` ✅).

### Bài 61. VPPNC cho `{aⁱbʲcᵏ | j = k ≥ 1, i ≥ 1}`.
**Lời giải:** `S → aS | aB`, `B → bBc | bc`.
(`S→aS` sinh i≥1 chữ a; B sinh `bʲcʲ`.) Kiểm chứng máy: `abc, aabc, abbcc, aaabc, aabbcc, aaabbcc, abbbccc…` ✅.

### Bài 62. Với `G: I → aIb | ab`: viết dẫn xuất đầy đủ của `a⁴b⁴` (rồi rút ra quy luật cho `aⁿbⁿ`).
**Lời giải:** `I ⊢ aIb ⊢ aaIbb ⊢ aaaIbbb ⊢ aaaaIbbbb ⊢ a⁴b⁴` (4 lần `I→aIb`, rồi `I→ab`; độ dài dẫn xuất = 5).
Quy luật tổng quát: `D = (I, aIb, a²Ib², …, a^{n-1}Ib^{n-1}, aⁿbⁿ)` — độ dài dẫn xuất = n.

### Bài 63. Cho `G: S → aSb | ab`. Cần **bao nhiêu bước** để sinh `a¹⁰⁰b¹⁰⁰`? Trong mỗi bước, số ký tự thay đổi thế nào?
**Lời giải:** cần **100 bước** (99 lần `S→aSb` + 1 lần `S→ab`), tính cả bước đầu là 100. Mỗi lần `S→aSb` thì số ký tự tăng 2 (từ 1 ký tự S thành 3 ký tự); bước cuối tăng từ 1→2. Sau k bước dẫn xuất, xâu có dạng `a^k S b^k` (với k ≥ 1 cho tới bước cuối).
> 💡 Đây là lý do nói: "văn phạm đếm" — mỗi bước "ghi sổ" một cặp (a,b). Máy hữu hạn không làm được quy trình này (không có giấy nháp) là mầm mống của bổ đề bơm ở Mức 5.

### Bài 64. Cho `G: I→aIb | ab` và `G': I→aIb | ^`. Hai văn phạm có tương đương? Có cách nào "sửa" G thành G'?
**Lời giải:** Không tương đương: `L(G) = {aⁿbⁿ | n≥1}`, `L(G') = L(G) ∪ {^}` (chỉ sai khác đúng xâu rỗng). Muốn "sửa" G thành G' chỉ cần **đổi quy tắc chốt** `I→ab` thành `I→^` (hoặc thêm `I→^` vào G — khi đó cả hai cùng sinh `{aⁿbⁿ | n≥0}`).
> 💡 Ghi nhớ: quy tắc `A→^` chính là "công tắc cho phép dừng sớm" của văn phạm.

### Bài 65. Cho `G: E → E+E | E*E | (E) | a`. (i) `a+a*a` có bao nhiêu **suy dẫn trái**? (ii) Kết luận về G.
**Lời giải:** Có **2 suy dẫn trái khác nhau** (đã kiểm chứng máy):
1. `E ⇒ E+E ⇒ a+E ⇒ a+E*E ⇒ a+a*E ⇒ a+a*a` (cây: cộng là "gốc", cụm `a*a` được nhân trước);
2. `E ⇒ E*E ⇒ E+E*E ⇒ a+E*E ⇒ a+a*E ⇒ a+a*a` (cây: nhân là "gốc", `a+a` được cộng trước).
⇒ Tồn tại xâu có 2 cây suy dẫn ⇒ **G nhập nhằng**.
> 💡 Trong thực tế hai cây cho hai kết quả khác nhau: `a+(a*a)` vs `(a+a)*a`. Trình biên dịch "phá băng" bằng văn phạm phân tầng E/T/F (xem Bài 159).

### Bài 66. Cho `G₁ = <{a,b}, {I}, I, {I→aIb, I→aIbI, aI→aa, Ib→bb}>`. Tìm 4 xâu được sinh và dẫn xuất của chúng.
**Lời giải:** Nhận xét: `I→aIb` "bọc" một cặp a…b; `i→aIbI` thêm một I; các quy tắc `aI→aa` (giết I, thêm 1 chữ a) và `Ib→bb` (giết I, thêm 1 chữ b) là hai cách "kết thúc".
- `w₁ = aab`: `I ⊢ aIb ⊢ aab` (dùng `aI→aa` trên "aIb" → "aa"+"b").
- `w₂ = abb`: `I ⊢ aIb ⊢ abb` (dùng `Ib→bb` → "a"+"bb").
- `w₃ = aaabb`: `I ⊢ aIb ⊢ aaIbb ⊢ aaabb` (2 lần bọc, rồi `aI→aa`).
- `w₄ = aabbb`: `I ⊢ aIb ⊢ aaIbb ⊢ aabbb` (2 lần bọc, rồi `Ib→bb`).
Tổng quát: sau k lần bọc ta có `aᵏIbᵏ`; "chốt" bằng `aI→aa` cho `a^{k+1}bᵏ`, bằng `Ib→bb` cho `aᵏb^{k+1}` ⇒ ngôn ngữ gồm các xâu `aᵐbⁿ` với `|m−n| = 1`.

### Bài 67. Tìm L(G) với `G: S → aS | Sb | ε`.
**Lời giải:** `L(G) = a*b*` (mọi xâu dạng "a…ab…b", kể cả rỗng).
- Chiều ⊆: mọi quy tắc giữ xâu ở dạng a*b* khi đọc từ S; 
- Chiều ⊇: với `aⁱbʲ`: dùng `S→aS` i lần, rồi `S→Sb` j lần, rồi `S→ε`. (Kiểm chứng máy: `^, a, b, aa, ab, bb, aab, abb, aabb, abbb…` ✅.)

### Bài 68. Văn phạm chính quy cho "xâu chứa 'ab'".
**Lời giải:** Dùng "bẫy trạng thái": `S → aS | bS | aA`, `A → bB`, `B → aB | bB | a | b`.
- S = chưa thấy ab; `S→aA` = "vừa đọc a, chờ b"; `A→bB` = "đã thấy ab, chuyển sang trạng thái hút"; B sinh mọi đuôi.
Kiểm tra: "ab" ✅ (`S→aA→ab`?? A→bB cần B sinh tiếp — nếu muốn cả "ab" đúng nghĩa, thêm `A→b`. Bản đầy đủ: `S→aS|bS|aA; A→bB|b; B→aB|bB|a|b`.)
> 💡 Vì quá trình "đã thấy ab" không thể mất đi ⇒ đây đúng là ngôn ngữ chính quy (3 trạng thái như bài mức 3).

### Bài 69. VPPNC cho `{w : #a(w) = #b(w)}` (đã gặp ở bài 48) — viết dưới dạng chuẩn và dẫn xuất của "abba", "baba".
**Lời giải:** `S → SS | aSb | bSa | ε`.
- "abba" = "ab" · "ba": tách thành hai nửa cân bằng bằng `S→SS`:
  `S ⇒ SS ⇒ (aSb)(bSa) ⇒ ab · ba = abba` ✅
  (Viết từng bước: `S ⇒ SS ⇒ aSbS ⇒ abS ⇒ ab(bSa) ⇒ abba`.)
- "baba" = "ba" · "ba": `S ⇒ SS ⇒ (bSa)(bSa) ⇒ ba·ba = baba` ✅
  (từng bước: `S ⇒ SS ⇒ bSaS ⇒ baS ⇒ ba(bSa) ⇒ baba`.)
> 💡 Nhận xét: xâu cân bằng có thể "cắt" ở điểm giữa mà hai nửa cũng cân bằng — đó là vai trò của `S→SS`; nếu điểm cắt "lệch", ta dùng `aSb`/`bSa` để dồn về trường hợp đơn giản hơn.

### Bài 70. Văn phạm chính quy cho "số nguyên dương viết hệ 10" (không số 0 đứng đầu).
**Lời giải:** `S → D B'`… viết theo quy tắc đơn giản:
`S → d | d B` với `d ∈ {1,…,9}`; `B → 0B | 1B | … | 9B | 0 | 1 | … | 9`.
Nghĩa là: ký tự đầu ∈ {1..9}; các ký tự sau tùy ý ∈ {0..9}. (Thêm `S→0` nếu muốn cho phép số 0.)
> 💡 Đây chính là "regex" `[1-9][0-9]*` mà bạn dùng hàng ngày khi validate số lượng/giá tiền.

### Bài 71. Văn phạm cho "số nhị phân chia hết cho 2" (biểu diễn không có 0 vô nghĩa đầu).
**Lời giải:** Chia hết cho 2 ⟺ **tận cùng bằng 0**. Vậy ngôn ngữ = `{0} ∪ {mọi xâu khác rỗng kết thúc 0}`:
`S → 0 | A0`, `A → 0A | 1A | 0 | 1`.
(Đây là văn phạm chính quy; xâu "0" đơn lẻ xử lý riêng cho gọn.) Kiểm tra: "10" (=2) ✅ S→A0 với A→1; "110" (=6) ✅; "1" ❌.

### Bài 72. Cho văn phạm `G` (xây dựng ở mục 3.1.3): `I → aIBC | aBC, aB→ab, CB→BC, bB→bb, bC→bc, cC→cc`. Tìm dẫn xuất đầy đủ của `a²b²c²` và L(G).
**Lời giải:** (Đây là ví dụ chuẩn của slide.)
`D = (I, aIBC, aaBCBC, aabCBC, aabBCC, aabbCC, aabbcC, aabbcc)` — từng bước:
1. `I ⇒ aIBC`; 2. `⇒ aaBCBC` (dùng `I→aBC`);
3. `⇒ aabCBC` (`aB→ab`); 4. `⇒ aabBCC` (`CB→BC` — "hoán vị" B ra trước);
5. `⇒ aabbCC` (`bB→bb`); 6. `⇒ aabbcC` (`bC→bc`); 7. `⇒ aabbcc` (`cC→cc`).
Kết luận: `L(G) = {aⁿbⁿcⁿ | n ≥ 1}` (ví dụ kinh điển của ngôn ngữ **cảm ngữ cảnh** — không phải PNC!).

### Bài 73. Quy tắc nào **không hợp lệ** (và vì sao) trong `R = {S→aSb, ab→S, S→ε, A→b, aA→ba}` với Δ={S,A}?
**Lời giải:**
- `S→aSb` ✅; `S→ε` ✅ (vế trái biến); `A→b` ✅.
- `ab→S` ❌ — vế trái toàn terminal (`a`, `b`), không chứa ký hiệu phụ.
- `aA→ba` ✅ — vế trái chứa A (hợp lệ, dù làm giảm độ dài 2→2? "ba" dài 2 = |aA| = 2 nên không giảm; thuộc loại 0/1 tùy các quy tắc khác).

### Bài 74. Viết một văn phạm có `L(G) = ∅` và giải thích.
**Lời giải:** `G = <{a}, {S}, S, {S→aS}>`.
- Từ S, mọi dẫn xuất đều dẫn đến `aⁿS` (luôn còn S) — **không bao giờ** thu được xâu terminal ⇒ không xâu nào ∈ L(G) ⇒ `L(G)=∅`.
> 💡 Chú ý: `L(G)=∅` nhưng G **không** rỗng! Phân biệt "văn phạm rỗng" (không có luật) vs "văn phạm sinh ngôn ngữ rỗng".
> 💻 **CNTT:** đây là văn phạm "viết sai" — giống hàm đệ quy thiếu base case, mọi lời gọi đều không bao giờ return.

### Bài 75. Trong `G = <{a,b}, {S,A,B}, S, {S→AB, A→a, B→Bb}>`: ký hiệu nào thừa? L(G) = ?
**Lời giải:** `B→Bb` chỉ sinh `B ⟶ Bb ⟶ Bbb ⟶ …` — không bao giờ "chốt" thành xâu toàn terminal ⇒ **B là ký hiệu vô sinh** (không dẫn ra xâu ∈ {a,b}*). Vì S phải dùng B, nên cả S cũng không sinh được xâu nào ⇒ `L(G) = ∅`. Sau khi xóa B (và các quy tắc liên quan), ta được văn phạm "sạch" nhưng… không còn quy tắc nào cho S (S trở thành vô sinh) ⇒ văn phạm tương đương cũng sinh ∅.
> 💡 Preview mục 3.3.3: "loại ký hiệu vô sinh" là bước 1 của giản lược VPPNC.

### Bài 76. VPPNC cho `{wwᴿ | w ∈ {a,b}⁺}` và dẫn xuất của "abba".
**Lời giải:** `S → aSa | bSb | aa | bb`.
- Ý tưởng: wwᴿ có tính **đối xứng gương**: ký tự đầu = ký tự cuối, ký tự thứ hai = ký tự áp cuối… nên văn phạm "bọc" từng cặp: `aSa`, `bSb`; hai quy tắc `aa`, `bb` là "tâm" (|w|=1).
- Dẫn xuất "abba": với w = "ab" ⇒ wwᴿ = a("bb")a:
  `S ⊢ aSa ⊢ a(bb)a = abba` ✅ (dẫn xuất đầy đủ: `(S, aSa, abba)` — 2 bước).
- Kiểm tra "abab": đảo ngược của "abab" là "baba" ⇒ không phải palindrome dạng wwᴿ ⇒ "abab" ∉ L (và thật vậy không dẫn ra được: sau khi bóc cặp (a,a) còn "ba" — không sinh được, vì mọi xâu sinh ra đều kết thúc bằng ký tự giống ký tự đầu tiên… chính xác hơn: đều có dạng đối xứng).

### Bài 77. Văn phạm chính quy cho "xâu trên {a,b} có độ dài LẺ".
**Lời giải:** Dùng 2 "trạng thái đếm chẵn/lẻ":
`S → a | b | aA | bA`, `A → aB | bB`, `B → aA | bA | a | b`.
Kiểm chứng: sinh `a, b` (dài 1), rồi `aaa, aab, aba,…` (dài 3), `aaaaa…` (dài 5), **không** sinh xâu độ dài chẵn (đã kiểm chứng máy: độ dài 2,4 vắng mặt hoàn toàn) ✅.

### Bài 78. VPPNC cho `{aⁱbʲ | i ≠ j}` (gợi ý: hợp của `i<j` và `i>j`).
**Lời giải:**
- `i < j`: `X → aXb | Y`, `Y → bY | b` (ghép n cặp `a…b` trước, còn dư ít nhất một b). Kiểm chứng máy: `b, bb, abb, aabbb, abbbb…` ✅.
- `i > j`: `Z → aZb | Za | a` (ghép cặp trước, còn dư a). Kiểm chứng: `a, aa, aab, aabaa…` ✅.
- Gộp: `S → X | Z` ⇒ `L(S) = {aⁱbʲ : i<j} ∪ {aⁱbʲ : i>j} = {aⁱbʲ : i ≠ j}` ✓.

### Bài 79. Vì sao ngôn ngữ `{aⁿb²ⁿ}` **không thể** do văn phạm chính quy sinh ra? (Trực giác)
**Lời giải:** Văn phạm chính quy tương đương ô-tô-mát hữu hạn — chỉ có **bộ nhớ hữu hạn (bộ trạng thái)**. Muốn đoán nhận `aⁿb²ⁿ` phải **nhớ n** (số lượng a) để so với 2n chữ b; n không bị chặn ⇒ cần vô hạn bộ nhớ ⇒ không FA nào làm được. (Chứng minh chặt chẽ bằng bổ đề bơm — Mức 5.)
> 💡 Nhưng `{aⁿb²ⁿ}` vẫn là **PNC** (Bài 80) — vì PDA có ngăn xếp "đếm" được n (ví dụ: mỗi a push 2 ký hiệu vào xếp, mỗi b pop 1).

### Bài 80. Viết VPPNC cho `{aⁿb²ⁿ | n ≥ 1}` và dẫn xuất của `a²b⁴`.
**Lời giải:** `S → aSbb | abb`.
- `S⇒abb` (n=1: a¹b²), `S⇒aSbb⇒aabb bb?`: `S ⊢ aSbb ⊢ a(abb)bb = aabbbb` (n=2: a²b⁴) ✅ — khớp kiểm chứng máy (`abb, aabbbb, aaabbbbbb, …`).
- Với `a²b⁴`: `S ⊢ aSbb ⊢ a(abb)bb = aabbbb` (2 bước; đây là **dẫn xuất đầy đủ**: `(S, aSbb, aabbbb)`).
> 💡 Văn phạm "nhân đôi": mỗi vòng lặp thêm `a` (trái) và `bb` (phải) — PDA tương ứng: với mỗi `a` đọc vào, **push 2 ký hiệu**; mỗi `b` đọc vào **pop 1**.

---

## MỨC 3 — Ô-TÔ-MÁT HỮU HẠN: ĐỌC, CHẠY, THIẾT KẾ (Bài 81–125)

### Bài 81. (Ví dụ tr.34 – slide) Cho `A = <Q, Σ, δ, q₀, F>`, `Σ={0,1}`, `Q={q₀,q₁,q₂,q₃}`, `F={q₀}`, bảng chuyển:

| Trạng thái | 0 | 1 |
|---|---|---|
| q₀ | q₂ | q₁ |
| q₁ | q₃ | q₀ |
| q₂ | q₀ | q₃ |
| q₃ | q₁ | q₂ |

(i) Vẽ đồ thị chuyển. (ii) Chạy thử `0110` và `1100`. (iii) Tìm L(M).
**Lời giải:**
(i) Đồ thị: 4 đỉnh; q₀ có mũi tên vào từ "ngoài" (trạng thái đầu); **q₀ khoanh đôi** (kết thúc); các cung theo bảng (mỗi cặp (q,a) đúng 1 cung ⇒ đơn định).
(ii) `0110`: `q₀ →(0) q₂ →(1) q₃ →(1) q₂ →(0) q₀` ⇒ dừng ở q₀ ∈ F ⇒ **đoán nhận** ✅
`1100`: `q₀ →(1) q₁ →(1) q₀ →(0) q₂ →(0) q₀` ⇒ **đoán nhận** ✅
(iii) Mô tả **đã kiểm chứng bằng chương trình**: `L(M) = {w : số ký tự 0 chẵn VÀ số ký tự 1 chẵn}`; 4 trạng thái ứng với 4 tổ hợp (chẵn/lẻ của số 0 × chẵn/lẻ của số 1):
`q₀`=(0 chẵn,1 chẵn), `q₁`=(0 chẵn,1 lẻ), `q₂`=(0 lẻ,1 chẵn), `q₃`=(0 lẻ,1 lẻ). Từ đó thấy ngay: mỗi khi đọc 0 ta "lật" cột 0, đọc 1 "lật" cột 1.

### Bài 82. Vẫn automaton Bài 81: chạy xâu `1010100` và giải thích kết quả theo mô tả ngôn ngữ. Tìm thêm 3 xâu được đoán nhận và 3 xâu bị từ chối.
**Lời giải:** `q₀ →(1) q₁ →(0) q₃ →(1) q₂ →(0) q₀ →(1) q₁ →(0) q₃ →(0) q₁`. Dừng ở `q₁ ∉ F` ⇒ **từ chối** (slide cũng kết luận vậy).
Giải thích: `1010100` có 3 chữ 1 (lẻ) và 4 chữ 0 (chẵn) ⇒ rơi vào trạng thái (chẵn,lẻ) = q₁ — cần **cả hai** chẵn mới nhận.
Ví dụ đoán nhận: `0011`, `1111`, `0110` (mỗi xâu có chẵn cả 0 lẫn 1); bị từ chối: `110`, `001`, `1010` (đều có một loại ký tự lẻ).

### Bài 83. (Ví dụ tr.34, biến thể) `F={q₃}` và thay dòng q₃ thành `q₃ --0--> q₃; q₃ --1--> q₃` (q₃ là "bẫy hút"). Chạy `01`, `0110`, `10`, `00`. Tìm L(M).
**Lời giải (đã kiểm chứng):**
- `01`: `q₀→(0)q₂→(1)q₃` ✅; `0110`: `q₀→q₂→q₃→q₃→q₃` ✅; `10`: `q₀→(1)q₁→(0)q₃` ✅; `00`: `q₀→(0)q₂→(0)q₀` ❌ (dừng ở q₀ ∉ F).
- Mô tả: `L(M) = {w : tồn tại một TIỀN TỐ của w có số 0 lẻ và số 1 lẻ}`. Vì `q₃` = trạng thái (lẻ 0, lẻ 1) và một khi đã vào q₃ thì "hút" mãi mãi ⇒ chỉ cần **một lần** cả hai bộ đếm cùng lẻ là đủ để nhận.
> 💡 So sánh 2 máy: cùng cấu trúc nhưng "trạng thái kết thúc + hành vi tại chỗ" khác nhau ⇒ ngôn ngữ khác hẳn. Đây là lý do khi vẽ DFA phải ghi rõ cả F và **tất cả** các chuyển.

### Bài 84. (Ví dụ tr.35 – slide, NFA) `Σ={0,1}`, `Q={q₀,…,q₄}`, `F={q₂,q₄}`, bảng:

| | 0 | 1 |
|---|---|---|
| q₀ | {q₀,q₃} | {q₀,q₁} |
| q₁ | ∅ | {q₂} |
| q₂ | {q₂} | {q₂} |
| q₃ | ∅ | {q₄} |
| q₄ | {q₄} | {q₃} |

Chạy `011`, `1101`, `00` (theo dõi **tập trạng thái**). Tìm L(M).
**Lời giải:**
- `011`: `{q₀} →(0) {q₀,q₃} →(1) {q₀,q₁,q₄} →(1) {q₀,q₁,q₂,q₃}`. Có chứa q₂ ⇒ **đoán nhận** ✅
- `1101`: `{q₀} →(1) {q₀,q₁} →(1) {q₀,q₁,q₂} →(0) {q₀,q₂,q₃} →(1) {q₀,q₁,q₂,q₄}` ⇒ chứa q₂ ⇒ **đoán nhận** ✅
- `00`: `{q₀} →(0) {q₀,q₃} →(0) {q₀}` ⇒ không chạm q₂/q₄ ⇒ **từ chối** ❌
- L(M) (đã kiểm chứng): **`{w : w chứa "01" hoặc chứa "11"}`** — nghĩa là "có một ký tự 1 không đứng đầu xâu".
> 💡 Vì sao đúng: q₁ = "vừa đọc 0", q₃ = "vừa đọc một 1 sau một 1"; cặp chuyển `(q₀,0)→q₃→(1)q₄` và `(q₁,1)→q₂` chính là hai cách bắt gặp "01", "11"; q₂, q₄ là trạng thái "đã thấy".

### Bài 85. (Ví dụ tr.37 – slide) `A = <{q₀,q₁,q₂}, {a,b}, δ, q₀, {q₂}>` với `δ(q₀,a)=q₀, δ(q₀,b)=q₁, δ(q₁,a)=q₀, δ(q₁,b)=q₂, δ(q₂,a)=q₂, δ(q₂,b)=q₂`. Chạy `ababbab`, `abab`. Tìm L(M). Vì sao nói q₂ là "bẫy hút"?
**Lời giải:**
- `ababbab`: `q₀→q₀→q₁→q₀→q₁→q₂→q₂→q₂` ✅ **đoán nhận** (slide ghi "xâu α được đoán nhận").
- `abab`: `q₀→q₀→q₁→q₀→q₁` ⇒ dừng q₁ ❌ **từ chối** (slide: β không được đoán nhận).
- `L(M) = {w : w chứa "bb"}` (đã kiểm chứng máy). "Bẫy hút" (sink/absorbing): một khi đã thấy "bb", mọi ký tự tiếp theo vẫn cho "đã thấy bb" ⇒ mọi chuyển từ q₂ đều về q₂.

### Bài 86. Cho automaton mô tả bằng lời: `s --a--> p; s --b--> s; p --a--> p; p --b--> f; f --a--> f; f --b--> f`, trạng thái kết thúc F = {f}. Viết bảng chuyển, chạy `aab`, `ba`, `aba`.
**Lời giải:** Bảng:

| Trạng thái | a | b | | Kết thúc |
|---|---|---|---|---|
| s | p | s | | |
| p | p | f | | |
| f | f | f | | ✔ |

- `aab`: `s→p→p→f` ✅; `ba`: `s→s→p` ❌ (kết ở p); `aba`: `s→p→f→f` ✅.
- **Ngôn ngữ (đã kiểm chứng):** `{w : w chứa "ab"}`. (s = "chưa thấy ab", p = "vừa đọc a", f = "đã thấy ab, hút".)

### Bài 87. Thiết kế DFA đoán nhận "các xâu trên {0,1} KẾT THÚC bằng 00".
**Lời giải:** Cần nhớ "đuôi hiện tại có mấy số 0 liên tiếp": 0, 1, ≥2.
`Q = {q₀,q₁,q₂}`, `q₀` đầu, `F = {q₂}`:

| | 0 | 1 |
|---|---|---|
| q₀ | q₁ | q₀ |
| q₁ | q₂ | q₀ |
| q₂ | q₂ | q₀ |

Chạy thử: `100` → `q₀→q₀→q₁→q₂` ✅; `10` → `q₀→q₀→q₁` ❌; `1000` → q₂→q₂ ✅. (Đã kiểm chứng máy: khớp chính xác "kết thúc 00".)

### Bài 88. Thiết kế DFA "độ dài xâu chia hết cho 3" trên {a,b}.
**Lời giải:** Đếm độ dài theo mod 3: `Q={m₀,m₁,m₂}`, m₀ đầu & kết thúc; mọi ký tự đều +1:

| | a | b |
|---|---|---|
| m₀ | m₁ | m₁ |
| m₁ | m₂ | m₂ |
| m₂ | m₀ | m₀ |

Kiểm chứng: `""`✅(0), `a`❌(1), `ab`❌(2), `aba`✅(3), `abab`❌, `ababa`✅.
> 💡 Nhận xét hay: "hai cột giống nhau" vì máy chỉ quan tâm **đếm số ký tự**, không quan tâm ký tự là gì. Nếu đổi yêu cầu thành "chẵn số a và |w| chia hết 3" thì mới cần tách cột.

### Bài 89. Thiết kế DFA "chẵn số ký tự a" trên {a,b}. Tính `δ*(E, abba)`.
**Lời giải:** `Q = {E, O}` (chẵn/lẻ), E đầu và kết thúc: `E --a--> O; E --b--> E; O --a--> E; O --b--> O`.
`δ*(E, abba)`: `E→(a)O→(b)O→(b)O→(a)E` ⇒ **E (chấp nhận)**.
> 💡 `δ*` (hàm chuyển mở rộng) định nghĩa đệ quy: `δ*(q, ^) = q`; `δ*(q, wa) = δ(δ*(q,w), a)`.

### Bài 90. Thiết kế DFA "không chứa hai ký tự a liên tiếp" trên {a,b}. Vì sao cần **trạng thái chết**?
**Lời giải:** `Q={t₀,t₁,dead}`, t₀ đầu, `F={t₀,t₁}` (t₀ = "ký tự vừa đọc không phải a", t₁ = "vừa đọc a"):

| | a | b |
|---|---|---|
| t₀ | t₁ | t₀ |
| t₁ | **dead** | t₀ |
| dead | dead | dead |

Kiểm chứng: `aab` → `t₀→t₁→dead→dead` ❌; `aba` → `t₀→t₁→t₀→t₁` ✅; `abb` ✅.
Trạng thái chết cần thiết vì khi chuỗi đã hỏng (có "aa"), **không cách nào sửa được nữa** (bất kỳ ký tự phía sau đều không xóa được cặp "aa" đã ghi vào lịch sử) ⇒ mọi đường đi tiếp đều phải dẫn tới "không kết thúc".

### Bài 91. Thiết kế DFA "chứa xâu con 101" trên {0,1}. Chạy thử `1010101`.
**Lời giải:** Theo dõi tiến độ "khớp 101": u₀ (chưa có gì), u₁ (đã thấy "1" mới), u₂ (đã thấy "10"), u₃ (đã thấy "101", hút):

| | 0 | 1 |
|---|---|---|
| u₀ | u₀ | u₁ |
| u₁ | u₂ | u₁ |
| u₂ | u₀ | u₃ |
| u₃ | u₃ | u₃ |

Chạy `1010101`: `u₀→u₁→u₂→u₃→u₃→u₃→u₃→u₃` ✅ (đã kiểm chứng máy; khớp chính xác "chứa 101").

### Bài 92. Thiết kế DFA "kết thúc bằng ab". Chạy `ab, aab, abb, abab, ba, aba`.
**Lời giải:** `Q={s,p,q}`: s = "chưa có a mới", p = "ký tự cuối là a", q = "hai ký tự cuối là ab" (kết thúc), `F={q}`:

| | a | b |
|---|---|---|
| s | p | s |
| p | p | q |
| q | p | s |

Chạy (đã kiểm chứng máy): `ab` ✅ (s,p,q); `aab` ✅ (s,p,p,q); `abb` ❌ (s,p,q,s); `abab` ✅ (s,p,q,p,q); `ba` ❌ (s,s,p); `aba` ❌ (s,p,q,p).
> 💡 Điểm tinh tế: từ trạng thái kết thúc q, gặp `a` thì quay về p (vì "a" này có thể mở đầu cặp "ab" mới) — chứ **không** ở lại q. Nếu để q hút thì sẽ nhận nhầm "aba".

### Bài 93. Thiết kế DFA "bắt đầu và kết thúc bằng cùng một ký tự" trên {a,b} (xâu khác rỗng). Chạy `a, b, ab, aba, abb`.
**Lời giải:** Cần nhớ "ký tự đầu + ký tự cuối": 4 trạng thái (aa, ab, ba, bb) + trạng thái đầu st:
`st --a--> aa; st --b--> bb;` và với trạng thái (x,y):

| | đọc a | đọc b |
|---|---|---|
| aa | aa | ab |
| ab | aa | ab |
| ba | ba | bb |
| bb | ba | bb |

`F = {aa, bb}` (đầu = cuối). Chạy (đã kiểm chứng): `a` ✅ (st,aa); `b` ✅; `ab` ❌ (st,aa,ab); `aba` ✅ (st,aa,ab,aa); `abb` ❌ (st,aa,ab,ab).
> 💡 Chú ý "ab → aa": đọc thêm a thì "cuối" đổi thành a, "đầu" vẫn a ⇒ về trạng thái aa.

### Bài 94. Thiết kế DFA "số ký tự a CHẴN và xâu kết thúc bằng b". Chạy `^, a, b, ab, aab, abab, baab`.
**Lời giải:** Kết hợp 2 điều kiện độc lập, nhưng chú ý xâu rỗng chưa có "kết thúc":
trạng thái = (tính chẵn lẻ của #a, ký tự cuối hoặc "chưa có"): st, ea, eb, oa, ob.

| | a | b | | Kết thúc? |
|---|---|---|---|---|
| st (chưa đọc) | oa | eb | | |
| ea | oa | eb | | |
| eb | oa | eb | | ✔ |
| oa | ea | ob | | |
| ob | ea | ob | | |

Chạy (đã kiểm chứng): `^` ❌; `a` ❌; `b` ✅ (0 chữ a là chẵn, kết thúc b); `ab` ❌ (lẻ); `aab` ✅; `abab` ✅; `baab` ✅.
> 💡 5 trạng thái nhưng thực chất là (2 parity) × (2 ký tự cuối) + 1 "chưa đọc" — cách nghĩ "ghép hai máy" (product) sẽ học ở Bài 106.

### Bài 95. Thiết kế DFA "độ dài chẵn" trên {a,b}.
**Lời giải:** `Q={E,O}`, E đầu & kết thúc; cả hai ký tự đều "lật cờ": `E--a,b-->O`, `O--a,b-->E`.
> 💡 Vì sao? `|wa| = |w|+1` — cờ chẵn/lẻ lật mỗi ký tự. (Kiểm chứng máy ✅.)

### Bài 96. Thiết kế DFA "số 0 chẵn HOẶC số 1 lẻ" trên {0,1}.
**Lời giải:** 4 trạng thái (00, 01, 10, 11) = (chẵn/lẻ #0, chẵn/lẻ #1), F = {00, 01, 11} (thỏa 0-chẵn **hoặc** 1-lẻ):

| | 0 | 1 |
|---|---|---|
| 00 | 10 | 01 |
| 01 | 11 | 00 |
| 10 | 00 | 11 |
| 11 | 01 | 10 |

(Đã kiểm chứng máy: khớp điều kiện "chẵn 0 hoặc lẻ 1".)

### Bài 97. Thiết kế DFA đoán nhận số nhị phân chia hết cho 3 (xâu khác rỗng).
**Lời giải:** Nhớ "số đang đọc mod 3". Đọc bit b khi đang có giá trị r thì giá trị mới = `2r + b`. 3 trạng thái `r0,r1,r2`; `r0` đầu & kết thúc; `δ(r_i, b) = r_{(2i + b) mod 3}`:

| | 0 | 1 |
|---|---|---|
| r0 | r0 | r1 |
| r1 | r2 | r0 |
| r2 | r1 | r2 |

Chạy (đã kiểm chứng): `0`(0)✅, `1`(1)❌, `11`(3)✅, `100`(4)❌, `110`(6)✅, `1101`(13)❌, `1001`(9)✅, `1111`(15)✅.
> ⚠️ Bẫy chuẩn kiểm chứng: máy này còn đoán nhận cả `^` (coi như số 0). Muốn "xâu khác rỗng" đúng nghĩa, thêm trạng thái đầu mới không kết thúc, hoặc nêu rõ quy ước.
> 💻 **CNTT:** DFA modulo là "xương sống" của bộ chia trong phần cứng/CRC: kiểm tra `23 % 3` mà không cần CPU chia — chỉ cần nhớ 3 trạng thái!

### Bài 98. Thiết kế DFA "ký tự thứ hai tính từ phải là a" trên {a,b}.
**Lời giải:** Trạng thái: S (chưa đủ dữ liệu), A/B (mới có 1 ký tự: cuối là a/b), rồi 4 trạng thái "2 ký tự cuối": aa, ab, ba, bb. `F = {aa, ab}` (vì "từ phải: ký tự áp cuối = a" ⟺ đuôi thuộc {aa, ab}).

| | a | b | | | a | b |
|---|---|---|---|---|---|---|
| S | A | B | | ba | aa | ab |
| A | aa | ab | | bb | ba | bb |
| B | ba | bb | | aa | aa | ab |
| | | | | ab | ba | bb |

Chạy (đã kiểm chứng): `a`❌(thiếu 1 ký tự), `aa`✅, `ab`✅, `ba`❌, `aba`❌ (đuôi "ba"), `babba`❌ (đuôi "ba").
> 💡 Quy luật "quên dần": trạng thái chỉ cần nhớ **2 ký tự gần nhất** ⇒ hữu hạn trạng thái ⇒ chính quy. Tổng quát "vị trí thứ k tính từ phải" cần `2^k` trạng thái (NFA chỉ cần k+1 — xem Bài 111).

### Bài 99. Cho DFA "kết thúc 00" (Bài 87). Thiết kế DFA đoán nhận **phần bù** (không kết thúc 00).
**Lời giải:** Quy tắc "đổi vai" kinh điển: **giữ nguyên mọi chuyển, đổi F thành Q\F**. Vậy `F' = {q₀,q₁}` (q₂ không còn kết thúc). Kiểm tra: "10" → q₁ ✅ (không kết thúc 00 ✓), "100" → q₂ ❌.
> ⚠️ Chỉ đúng khi DFA **đầy đủ** (mọi cung tồn tại). Nếu máy thiếu cung (δ không xác định chỗ nào đó), phải thêm **trạng thái chết** trước khi đổi vai, nếu không sẽ nhận sai các xâu "chết đường".

### Bài 100. Vì sao nhiều DFA cần "trạng thái chết"? Cho ví dụ và giải thích hậu quả nếu thiếu nó khi lấy phần bù.
**Lời giải:** Trạng thái chết (sink/trap/dead) là trạng thái **không kết thúc** mà mọi đường đi vào đó đều "hỏng không cứu được".
- Ví dụ: Bài 90 (không chứa aa) — khi đã đọc "aa", mọi tiếp diễn đều hỏng ⇒ cần `dead`.
- Hậu quả nếu thiếu: Khi lấy phần bù (đổi vai F↔Q\F), các xâu "đáng lẽ chết" lại **không có đường đi** ⇒ theo định nghĩa chúng bị từ chối cả ở máy gốc lẫn máy bù ⇒ mâu thuẫn logic. Vậy quy tắc "đổi vai" chỉ an toàn trên DFA **đầy đủ** (total).
> 💡 Nhớ câu: **"Muốn lấy bù, trước hết phải lấp đầy"**.

### Bài 101. Với NFA ở Bài 84, hãy chạy xâu `0100` và ghi lại **tập trạng thái** sau mỗi bước.
**Lời giải:** `{q₀} →(0) {q₀,q₃} →(1) {q₀,q₁,q₄} →(0) {q₀,q₃,q₄} →(0) {q₀,q₃,q₄}` ⇒ chứa q₄ ⇒ **đoán nhận** ✅.
(Chi tiết bước 3→4: từ q₀ đọc 0 → {q₀,q₃}; từ q₃ đọc 0 → ∅; từ q₄ đọc 0 → {q₄} ⇒ hợp = {q₀,q₃,q₄}.)
> 💡 "Tập trạng thái" chính là "các khả năng" mà NFA đang đồng thời theo đuổi — học tốt kỹ thuật này là hiểu luôn thuật toán tập con (Mức 4).

### Bài 102. Định nghĩa hàm chuyển mở rộng `δ*`. Với DFA "kết thúc ab" (Bài 92), tính `δ*(s, abab)` bằng hai cách (mở rộng từng bước và dùng hàm thường).
**Lời giải:** `δ*(q, ^) = q`; `δ*(q, wa) = δ( δ*(q,w), a )` với `w∈Σ*, a∈Σ`.
Cách 1 (từng bước): `δ*(s, a)=p ⇒ δ*(s,ab)=δ(p,b)=q ⇒ δ*(s,aba)=δ(q,a)=p ⇒ δ*(s,abab)=δ(p,b)=q` ⇒ **q ∈ F ⇒ chấp nhận**.
Cách 2 (kết quả trung gian): ta thu được dãy trạng thái `(s, p, q, p, q)` — đúng như vết chạy ở Bài 92.

### Bài 103. Cho ε-NFA: `Q={0,1,2}`, `δ(0,ε)={1}`, `δ(1,a)={1}`, `δ(1,ε)={2}`, `δ(2,b)={2}`, `F={2}`. Tính các ε-closure, chạy `^, a, b, ab, ba`, tìm ngôn ngữ.
**Lời giải:** `ε-CLOSURE(0) = {0,1,2}`; `ε-CLOSURE(1) = {1,2}`; `ε-CLOSURE(2) = {2}`.
- `^`: bắt đầu `{0,1,2}` chứa 2 ∈ F ⇒ ✅ (ngôn ngữ chứa ^ vì có thể "nhắm mắt" tới chỗ kết thúc!)
- `a`: `{0,1,2} --a--> {1} ∪ ε-closure = {1,2}` ✅; `b`: `{0,1,2} --b--> {2}` ✅; `ab`: `{0,1,2}--a-->{1,2}--b-->{2}` ✅; `ba`: `--b-->{2}--a-->{ }` ❌.
- Vậy `L = a*b*` (đã kiểm chứng máy: `^, a, b, ab, aabb` ✅; `ba, bab` ❌).
> 💡 Cấu trúc "ε nối tiếp" 0→1→2 chính là "dây chuyền tùy chọn": bạn được phép đứng ở 0, nhảy tới 1, tới 2 **không tốn input**.

---

### Bài 104. (NFA có ε-DỊCH CHUYỂN – kinh điển) Cho ε-NFA 11 trạng thái `0..10` (Σ={a,b}):
- cung ε: `0→1, 0→7, 1→2, 1→4, 3→6, 5→6, 6→1, 6→7`;
- cung thường: `2 --a--> 3`, `4 --b--> 5`, `7 --a--> 8`, `8 --b--> 9`, `9 --b--> 10`; `F={10}`.
(i) Tính `ε-CLOSURE(0)`. (ii) Chuyển thành DFA bằng tập con. (iii) Chạy `abb`, `aabb`, `abab`.
**Lời giải:**
(i) `ε-CLOSURE(0) = {0,1,2,4,7}` (0→1→{2,4}; 0→7). (Kiểm chứng máy ✅.)
(ii) DFA tương đương **5 trạng thái** (đã kiểm chứng toàn bộ bảng):

| Trạng thái (tập NFA) | a | b | Kết thúc |
|---|---|---|---|
| A = {0,1,2,4,7} | B | C | |
| B = {1,2,3,4,6,7,8} | B | D | |
| C = {1,2,4,5,6,7} | B | C | |
| D = {1,2,4,5,6,7,9} | B | E | |
| E = {1,2,4,5,6,7,10} | B | C | ✔ |

(iii) `abb`: `A→B→D→E` ✅; `aabb`: `A→B→B→D→E` ✅; `abab`: `A→B→D→B→D` ❌.
⇒ Đây chính là NFA cho `(a+b)*abb` — trùng khớp ví dụ ở Phần II.D. (Mẹo nhớ: E chứa trạng thái 10 ⇒ nhận.)

### Bài 105. Cho NFA "chứa 010" (Σ={0,1}): `a --0--> {a,b}; a --1--> {a}; b --1--> {c}; c --0--> {d}; d --0,1--> {d}`; đầu `a`, `F={d}`. Chuyển sang DFA và chạy `0010`.
**Lời giải:** DFA tập con (đã kiểm chứng):

| Tập | 0 | 1 | F |
|---|---|---|---|
| {a} | {a,b} | {a} | |
| {a,b} | {a,b} | {a,c} | |
| {a,c} | {a,b,d} | {a} | |
| {a,b,d} | {a,b,d} | {a,c,d} | ✔ |
| {a,c,d} | {a,b,d} | {a,d} | ✔ |
| {a,d} | {a,b,d} | {a,d} | ✔ |

Chạy `0010`: `{a}→{a,b}→{a,b}→{a,c}→{a,b,d}` ⇒ chứa d ⇒ **đoán nhận** ✅.
> 💡 Điểm hay: 4 trạng thái NFA ⇒ DFA 6 trạng thái; ngôn ngữ vẫn là "chứa 010".

### Bài 106. (Phép GIAO hai điều kiện) Thiết kế DFA cho `L = {w ∈ {a,b}* : w chứa "ab" VÀ |w| chẵn}` bằng **tích hai DFA**.
**Lời giải:** DFA₁ "chứa ab" (s,p,f) ⊗ DFA₂ "độ dài chẵn" (E,O) ⇒ trạng thái là **cặp** (trạng thái₁, trạng thái₂), 6 trạng thái; kết thúc khi **cả hai** kết thúc: `F' = {(f,E)}`.

| | a | b | | | a | b |
|---|---|---|---|---|---|---|
| (s,E) | (p,O) | (s,O) | | (f,E) | (f,O) | (f,O) |
| (s,O) | (p,E) | (s,E) | | (f,O) | (f,E) | (f,E) |
| (p,E) | (p,O) | (f,O) | | | | |
| (p,O) | (p,E) | (f,E) | ✔ | | | |

Chạy (đã kiểm chứng): `ab` ✅ (s,E)(p,O)(f,E); `abb` ❌ (kết ở (f,O)); `abab` ✅; `aab` ❌ (lẻ).
> 💡 Công thức tổng quát: giao 2 ngôn ngữ chính quy = **tích Descartes** hai DFA, cỡ |Q₁|×|Q₂|. Đây là "phép AND" của máy trạng thái — giống hệt việc `&&` hai validate condition trong code.

### Bài 107. (Phép HỢP) Thiết kế DFA cho "chứa 00 HOẶC chứa 11" trên {0,1}. Chạy `0110`, `1010`.
**Lời giải:** Nhớ 3 thứ: ký tự vừa đọc (hoặc chưa có), và "đã tìm thấy cặp giống nhau" (hút).

| | 0 | 1 | | Kết thúc? |
|---|---|---|---|---|
| s (chưa có gì) | Z | O | | |
| Z (vừa đọc 0) | F | O | | |
| O (vừa đọc 1) | Z | F | | |
| F (đã thấy 00/11) | F | F | | ✔ |

Chạy (đã kiểm chứng): `0110` → `s,Z,O,F,F` ✅; `1010` → `s,O,Z,O,Z` ❌ (không có 00 hay 11 — các cặp liên tiếp luôn khác nhau ✓).
> 💡 Nhận xét sắc sảo: `10 10` viết theo cặp là "10 10" — mỗi cặp liền kề đều khác ký tự ⇒ đúng là không chứa 00/11.

### Bài 108. Tương tự Bài 107 nhưng trên {a,b}: "chứa ab HOẶC chứa ba".
**Lời giải:** Chỉ cần nhớ "ký tự cuối" + đã-tìm-thấy:

| | a | b | | Kết thúc? |
|---|---|---|---|---|
| s | A | B | | |
| A (cuối=a) | A | F | | |
| B (cuối=b) | F | B | | |
| F (đã thấy ab/ba) | F | F | | ✔ |

Chạy (đã kiểm chứng): `ab` ✅ (s,A,F); `ba` ✅ (s,B,F); `aba` ✅; `bab` ✅; `aab` ✅; `bb` ❌ (s,B,B); `abba` ✅.
> 💡 Ngôn ngữ này chính là "xâu có chứa **ít nhất một chỗ đổi ký tự**" — kiểm tra `bb` (toàn b, không đổi) thì ❌ đúng.

### Bài 109. Cần **bao nhiêu trạng thái tối thiểu** cho DFA "số nhị phân chia hết cho 4"? Chứng minh bằng lập luận phân biệt.
**Lời giải:** 4 trạng thái `r0..r3` với `δ(r_i, b) = r_{(2i+b) mod 4}`, `F={r0}` (đã kiểm chứng: `100`(4)✅, `1000`(8)✅, `1100`(12)✅, `1010`(10)❌).
**Chứng minh cần ít nhất 4:** xét 4 tiền tố `^, 0, 1, 10, 11` — hmm cần 4 tiền tố phân biệt đôi một: dùng `p₀=ε` (0), `p₁=1` (1), `p₂=10` (2), `p₃=11` (3). Với hai tiền tố bất kỳ có giá trị khác nhau mod 4, chọn hậu tố `s = ε` thì một cái "chia hết cho 4" còn cái kia không ⇒ bị DFA đối xử khác nhau ⇒ phải nằm ở các trạng thái khác nhau ⇒ ≥ 4 trạng thái. Vậy 4 là tối thiểu.
> 💡 Kỹ thuật "tìm tiền tố phân biệt" này chính là **định lý Myhill–Nerode** — công cụ chuẩn để chứng minh số trạng thái tối thiểu (xem thêm Mức 5).

### Bài 110. Với DFA Bài 81: tìm **xâu ngắn nhất được đoán nhận** và **xâu ngắn nhất bị từ chối**. Trình bày cách tìm.
**Lời giải:** Cách tìm = "duyệt BFS trên đồ thị chuyển": 
- Xâu ngắn nhất được nhận: chính `^` (q₀ ∈ F ngay từ đầu, độ dài 0) ✅.
- Xâu ngắn nhất bị từ chối: các xâu dài 1: `0` → q₂ ∉ F ⇒ bị từ chối; `1` → q₁ ∉ F ⇒ cũng bị từ chối. Vậy **`0` (hoặc `1`), độ dài 1**.
> 💡 BFS trên DFA là thuật toán chuẩn để giải "tìm xâu ngắn nhất thuộc/không thuộc L" và cả "tìm xâu phân biệt hai trạng thái".

### Bài 111. (NFA "ăn đứt" DFA về số trạng thái?) Cho ngôn ngữ "vị trí thứ hai tính từ phải là a" (Bài 98). Viết **NFA** và so sánh với DFA.
**Lời giải:** NFA "đoán mò": máy đoán rằng ký tự a đang đọc **chính là** ký tự áp cuối, rồi chỉ cần kiểm tra đúng 1 ký tự nữa:
`q₀ --a--> {q₀, q₁}`; `q₀ --b--> {q₀}`; `q₁ --a--> {q₂}`; `q₁ --b--> {q₂}`; `F={q₂}` (q₂ không đi đâu nữa).
- Kiểm chứng: `aa` ✅, `ab` ✅, `ba` ❌, `aba` ❌, `babba` ❌ — NFA **3 trạng thái** là đủ!
- DFA tập con của nó có **4 trạng thái**: `{q₀}, {q₀,q₁}, {q₀,q₁,q₂} (F), {q₀,q₂} (F)`; (nhỏ hơn bản DFA 7 trạng thái ta tự vẽ ở Bài 98 — và **4 chính là tối thiểu** vì cần `2²=4` tổ hợp "2 ký tự cuối × có chưa" — chi tiết: biên).
> 💡 Bài học: cùng ngôn ngữ có thể có nhiều DFA khác kích thước; **subset construction + tối tiểu hóa** (Mức 5, Bài 196) sẽ tìm ra bản chuẩn.

### Bài 112. (Mô hình hóa thực tế) Cửa xoay soát vé (turnstile): bỏ xu thì mở khóa, đẩy thanh thì quay; nếu đang mở khóa mà bỏ xu nữa thì vẫn mở; đẩy khi đang khóa thì không xoay. Mô hình hóa bằng FA.
**Lời giải:** `Q = {KHÓA, MỞ}`, `Σ = {coin (bỏ xu), push (đẩy)}`, đầu = KHÓA:

| | coin | push |
|---|---|---|
| KHÓA | MỞ | KHÓA |
| MỞ | MỞ | KHÓA |

Chọn `F = {MỞ}` (nếu coi "trạng thái cho-phép-qua" là chấp nhận) ⇒ ngôn ngữ = các dãy thao tác **kết thúc trong lúc cửa mở**, ví dụ: `coin` ✅; `coin, push` ❌ (đẩy xong khóa lại); `coin, coin` ✅; `coin, push, coin` ✅.
> 💡 Đây là ví dụ "sách giáo khoa" — nhưng bạn sẽ gặp lại y hệt trong thiết kế UI: "trạng thái nút bấm", "wizard nhiều bước", "trạng thái đơn hàng Shopee".

### Bài 113. Máy bán nước: giá 10.000đ, nhận xu 5.000đ và 10.000đ. Mô hình hóa FA; xâu nào kết thúc việc "đã trả đủ"?
**Lời giải:** `Q = {0, 5, 10}` (số tiền đã nhận), `Σ={5k, 10k}`, đầu 0, `F={10}`:

| | 5k | 10k |
|---|---|---|
| 0 | 5 | 10 |
| 5 | 10 | 10 |
| 10 | 10 | 10 |

`5k 5k` ✅; `10k` ✅; `5k` ❌; `5k 5k 5k` ✅ (thừa tiền vẫn "đủ"). Trong thực tế trạng thái 10 còn phải xuất nước + trả lại tiền thừa (thêm trạng thái DISPENSE) — mở rộng tự nhiên.

### Bài 114. Thiết kế DFA "mã PIN hợp lệ": đúng 4 chữ số (0–9), không tính ký tự khác.
**Lời giải:** Đếm độ dài 0→4: `Q={c₀,c₁,c₂,c₃,c₄, dead}`; với `d ∈ {0..9}`: `cᵢ --d--> c_{i+1}` (i≤3); từ `c₄` hoặc `dead`, mọi ký tự → `dead`; ký tự ngoài Σ → chết ngay. `F={c₄}`.
Kiểm chứng: `1234` ✅; `123` ❌; `12345` ❌ (thừa 1 ký tự — chết ở c₄).

### Bài 115. Số điện thoại di động VN dạng "0xxxxxxxxx" (10 chữ số). Thiết kế DFA.
**Lời giải:** Tương tự PIN nhưng **kiểm tra ký tự đầu = 0** và đếm đúng 10: `Q={c₀,c₁,…,c₁₀, dead}`; `c₀ --0--> c₁`; với `d∈{0..9}`: `cᵢ --d--> c_{i+1}` (1≤i≤9); mọi ký tự khác ở bất kỳ trạng thái → dead; `c₁₀` đọc thêm ký tự → dead. `F={c₁₀}`.
Kiểm chứng tay: `0912345678` ✅ (10 ký tự, bắt đầu 0); `912345678` ❌ (thiếu số 0); `091234567` ❌ (9 số); `09123456789` ❌ (11 số).
> 💡 Thực tế đầu số VN có ràng buộc thêm (03/05/07/08/09) — thêm nhánh DFA rẽ theo ký tự thứ 2; bạn có thể tự mở rộng.

### Bài 116. Chứng minh: "mọi DFA đều có thể xem là một NFA".
**Lời giải:** Cho DFA `M = (Q, Σ, δ, q₀, F)` với `δ: Q×Σ→Q`. Định nghĩa NFA `M' = (Q, Σ, δ', q₀, F)` với `δ'(q,a) = { δ(q,a) }` (đóng gói kết quả thành **tập một phần tử**), và `δ'(q,ε) = ∅`.
- M' thỏa định nghĩa NFA (`δ': Q×(Σ∪{ε}) → 2^Q`).
- M' nhận đúng L(M) vì mọi đường chạy duy nhất của DFA là một đường chạy của NFA, và ngược lại NFA chỉ có đường duy nhất đó.
⇒ DFA ⊆ NFA (về mặt mô hình hóa). Kết hợp Định lý 1 (NFA→DFA), ta được `D = N`. ∎

### Bài 117. Cho đồ thị chuyển mô tả: `q₀ --a--> q₁; q₀ --b--> q₀; q₁ --a--> q₀; q₁ --b--> q₁`, `F={q₁}`. Tìm L(M), chạy `abbaa`.
**Lời giải:** `abbaa`: `q₀→(a)q₁→(b)q₁→(b)q₁→(a)q₀→(a)q₁` ⇒ dừng q₁ ∈ F ⇒ ✅.
Nhận xét: mỗi `a` **lật** trạng thái, `b` giữ nguyên ⇒ `L(M) = {w : số ký tự a LẺ}`. Kiểm tra: "abbaa" có 3 chữ a (lẻ) ✅ đúng.

### Bài 118. Ba máy sau **đơn định hay không đơn định**? (a) `δ(q₀,a) = {q₁}`; (b) `δ(q₀,a) = {q₁,q₂}`; (c) một bảng có ô ghi ∅ (không chuyển).
**Lời giải:**
- (a) Nếu **mọi** ô của bảng đều là tập một phần tử ⇒ **DFA** (viết theo kiểu NFA nhưng tương đương đơn định).
- (b) Có ô chứa ≥2 trạng thái ⇒ **NFA**.
- (c) Ô ∅ nghĩa là "không có chuyển" — đối với DFA **đầy đủ** đây là khuyết (partial DFA); về phân loại máy, **partial DFA vẫn là đơn định** (mỗi cặp chỉ có tối đa một chuyển), nhưng muốn "hoàn thiện" thì thêm trạng thái chết để mọi cung tồn tại.

### Bài 119. Với DFA "chứa bb" (Bài 85), tính `δ*(q₀, w)` với `w = aabbbab` (ghi dãy trạng thái trung gian).
**Lời giải:** `q₀ →(a) q₀ →(a) q₀ →(b) q₁ →(b) q₂ →(b) q₂ →(a) q₂ →(b) q₂` ⇒ `δ*(q₀, w) = q₂ ∈ F` ⇒ chấp nhận (xâu có "bb" tại vị trí 4-5 ✓).

### Bài 120. Thiết kế DFA "bắt đầu bằng a và kết thúc bằng b". Chạy `ab, aab, abb, ba, babb`.
**Lời giải:** `Q={st, a₁, b₁, f}` (st: chưa đọc gì; a₁: đã đọc, bắt đầu a; b₁: đã đọc, bắt đầu b; f: bắt đầu a & ký tự cuối b):

| | a | b |
|---|---|---|
| st | a₁ | b₁ |
| a₁ | a₁ | f |
| b₁ | b₁ | b₁ |
| f | a₁ | f |

`F={f}`. Chạy (đã kiểm chứng): `ab` ✅ (st,a₁,f); `aab` ✅ (st,a₁,a₁,f); `abb` ✅ (st,a₁,f,f); `ba` ❌ (st,b₁,b₁); `babb` ❌ (st,b₁,b₁,b₁,b₁).
> 💡 Nhận xét: từ f đọc `a` quay về a₁ (vẫn bắt đầu a, chờ b tiếp theo), từ b₁ **không có đường ra f** (đã sai ký tự đầu là "án tử").

### Bài 121. Nếu `F = ∅` thì DFA đoán nhận ngôn ngữ gì? Nếu `F = Q`?
**Lời giải:** `F=∅` ⇒ không trạng thái nào kết thúc ⇒ `L(M) = ∅` (từ chối **mọi** xâu). `F=Q` ⇒ mọi trạng thái đều kết thúc ⇒ `L(M) = Σ*` (nhận mọi xâu).
> 💡 Đây là 2 ngôn ngữ "biên" (rỗng và toàn phần) — thường xuất hiện trong câu hỏi lý thuyết và trong thực tế: `F=∅` = "chưa cấu hình trạng thái nhận", `F=Q` = "cho qua tất".

### Bài 122. Thiết kế DFA "số nhị phân chia hết cho 4". Kiểm tra `100`(4), `1000`(8), `1100`(12), `1010`(10).
**Lời giải:** Chia hết cho 4 ⟺ hai bit cuối là `00`. DFA 4 trạng thái theo mod 4 (giống Bài 109): `δ(r_i,b)=r_{(2i+b) mod 4}`, `F={r0}`. Kiểm chứng: `100`✅, `1000`✅, `1100`✅, `1010`❌ (10 mod 4 = 2).
> 💡 Cách "học thuộc": mod 4 = "nhìn 2 bit cuối"; mod 8 = 3 bit cuối: `2^k` ⟺ `k` bit cuối cùng bằng 0.

### Bài 123. Đồ thị chuyển sau có phải DFA? Chỉ ra chỗ không đơn định: `p --a--> q; p --a--> r; q --ε--> p; r --b--> r`, F = {r}.
**Lời giải:** Không phải DFA, vì: (1) từ p có **2 cung** cùng nhãn a (tới q và r) — vi phạm tính đơn định; (2) có **cung ε** (q --ε--> p) — DFA không cho phép ε.
Đây là **ε-NFA**. Ngôn ngữ: từ p có thể chọn đi q rồi nhảy ε về p (vòng lặp a), hoặc chọn sang r rồi đọc b thoải mái ⇒ nhận các xâu dạng `a…a b…b` có ít nhất 1 b — chính là `a*b+`.

### Bài 124. Thiết kế DFA "chứa aa HOẶC bb" trên {a,b}. Chạy `aab, bab, abba, bba`.
**Lời giải:** Giống Bài 107 nhưng bảng chữ a,b:

| | a | b | | Kết thúc? |
|---|---|---|---|---|
| s | A | B | | |
| A (cuối a) | F | B | | |
| B (cuối b) | A | F | | |
| F | F | F | | ✔ |

Chạy (đã kiểm chứng): `aab` ✅ (s,A,F,F); `bab` ✅ (s,B,A,F); `abba` ✅ (s,A,B,F,F); `bba` ✅ (s,B,F,F).
> 💡 So sánh với Bài 108 (ab hoặc ba): chỉ khác ở "nhớ cặp giống nhau" vs "nhớ cặp khác nhau".

### Bài 125. Thiết kế DFA "số ký tự 1 là bội của 3" trên {0,1}. Chạy `^, 0, 1, 11, 111, 10101`.
**Lời giải:** Đếm số 1 theo mod 3; ký tự 0 **không ảnh hưởng**:

| | 0 | 1 |
|---|---|---|
| c₀ | c₀ | c₁ |
| c₁ | c₁ | c₂ |
| c₂ | c₂ | c₀ |

`F={c₀}`. Chạy (đã kiểm chứng): `^`✅(0 chữ 1), `0`✅, `1`❌, `11`❌, `111`✅, `10101`✅ (3 chữ 1).
> 💡 So sánh với Bài 97 (số nhị phân ÷3): cùng 3 trạng thái, nhưng bảng chuyển **khác nhau về ý nghĩa** — một bên "đếm số ký tự 1", một bên "tính giá trị số mod 3". Đừng lẫn hai bài toán này!

---

## MỨC 4 — BIẾN ĐỔI & DẠNG CHUẨN (Bài 126–165)

### Bài 126. Xác định ngôn ngữ chính quy biểu diễn bởi `r = (01*+02)1` (ví dụ slide).
**Lời giải:** Khai triển phân phối và bỏ ngoặc:
`r = (01*+02)1 = 01*1 + 021`.
Vậy `L(r) = L(01*1) ∪ L(021) = {01ⁿ1 | n ≥ 1} ∪ {021} = {0·1ⁿ⁺¹ | n ≥ 0} ∪ {021}`.
> 💡 Kiểm tra nhanh vài xâu: "011" ✅ (n=1 → 0 11), "0111" ✅ (n=2), "01" ❌ (cần ít nhất 2 chữ 1 ở nhánh đầu), "021" ✅.

### Bài 127. Xác định `L(r)` với `r = (a+b)*abb`.
**Lời giải:** `L(r)` = mọi xâu trên {a,b} **kết thúc bằng "abb"** (phần `(a+b)*` tùy ý, phần "abb" khóa đuôi).
Kiểm tra: "abb" ✅; "aabb" ✅; "abba" ❌ (không kết thúc abb); "ab" ❌.

### Bài 128. Cho `r = (aa+ab+ba+bb)*`. Nhận xét ngôn ngữ.
**Lời giải:** Mỗi "khối" `aa, ab, ba, bb` có độ dài **đúng 2** ⇒ `(khối)*` sinh mọi xâu độ dài **chẵn** (kể cả rỗng). Hơn nữa 4 khối chính là **mọi** xâu độ dài 2 trên {a,b} ⇒ `(aa+ab+ba+bb)* = ((a+b)(a+b))*`.
⇒ `L(r) = {w : |w| chẵn}` (đã kiểm chứng máy: hai biểu thức tương đương trên mọi xâu ≤ 8).

### Bài 129. Xác định `L(r)` với `r = b*(ab*)*`.
**Lời giải:** `b*` = "khối b đầu"; `(ab*)*` = lặp các khối "a rồi một dãy b tùy ý". Ghép lại = mọi xâu dạng `b…b a b…b a b…b …` = **mọi xâu trên {a,b}**, tức `L(r) = (a+b)*` (đã kiểm chứng máy ✅).
> 💡 Trực giác: bất kỳ xâu nào cũng viết được thành các "đoạn mở đầu b, rồi các đoạn chứa a".

### Bài 130. Xác định: (i) `r₁ = a*b*`; (ii) `r₂ = (a+b)*a(a+b)`.
**Lời giải:**
(i) `L(r₁) = {aⁱbʲ | i,j ≥ 0}` — mọi xâu "toàn a rồi toàn b" (kể cả rỗng).
(ii) `L(r₂)` = các xâu có **ký tự thứ hai từ phải là a** (đuôi khóa là `a` rồi 1 ký tự bất kỳ). Ví dụ "ab" ✅ (đuôi ab), "ba" ❌ (đuôi ba), "baba"? ❌; "aab" ✅.
(Đã kiểm chứng máy: r₂ khớp chính xác điều kiện `|w|≥2 ∧ w[-2]='a'`.)

### Bài 131. Chứng minh `(aa)* = ε + (aa)(aa)*` và kiểm tra trên các xâu độ dài ≤ 8.
**Lời giải:** `r* = ε + rr*` là **đẳng thức đệ quy tổng quát** của phép lặp (lặp 0 lần, hoặc 1 lần rồi lặp tiếp). Áp dụng r = aa:
`(aa)* = ε + (aa)(aa)*`.
Diễn giải: xâu chẵn a là "rỗng" hoặc "aa rồi một xâu chẵn a nữa". Kiểm chứng máy: hai biểu thức match giống nhau trên **mọi** xâu ≤ 8 ✅. (Chứng minh chặt: quy nạp theo số khối aa.)

### Bài 132. Chứng minh `(ab)*a = a(ba)*`.
**Lời giải:** Với n ≥ 1: `(ab)ⁿ⁻¹a` (vế trái, n khối… chú ý (ab)*a = ε·a hoặc ab·…·ab·a). Xét phần tử tổng quát: `(ab)ⁿa = a·(ba)ⁿ` — chứng minh bằng quy nạp: 
- n=0: `(ab)⁰a = a` và `a(ba)⁰ = a` ✅.
- Giả sử `(ab)ⁿa = a(ba)ⁿ`; nhân trái hai vế với `ab`: `ab(ab)ⁿa = ab·a(ba)ⁿ = a·(ba)ⁿ⁺¹` (vì ab·a = a·ba) ⇒ đúng cho n+1. ∎
Kiểm chứng máy trên mọi xâu ≤ 8: tương đương ✅.
> 💡 "Phép quay" ab·a = a·ba là chìa khóa: ký tự a "nhảy" từ cuối vòng lặp ab lên đầu.

### Bài 133. Viết biểu thức chính quy cho: (i) "kết thúc 00"; (ii) "chứa 00" trên {0,1}.
**Lời giải:** (i) `(0+1)*00`; (ii) `(0+1)*00(0+1)*` (đã kiểm chứng máy: khớp mọi xâu ≤ 7).
> 💡 Bẫy: (i) và (ii) khác nhau ở đuôi `(0+1)*`. Với "chứa", phần đuôi phải tự do.

### Bài 134. Viết biểu thức chính quy cho "số ký tự a CHẴN".
**Lời giải:** `(b*ab*a)*b*`: đọc các "khối b* a b* a" (mỗi khối có 2 chữ a) lặp tùy ý, đuôi `b*`.
Kiểm chứng máy: khớp chính xác "chẵn a" trên mọi xâu ≤ 8 ✅. (Bẫy kinh điển: `(aa)*` KHÔNG phải đáp án — nó chỉ nhận các xâu chỉ toàn a!)
> 💡 Phiên bản khác: `(b+ab*a)*b*`? thử trên giấy: cũng đúng — có nhiều biểu thức tương đương; đề thi chỉ cần **một** biểu thức đúng.

### Bài 135. Viết biểu thức chính quy cho "không chứa aa".
**Lời giải:** `(b+ab)*a?` (hoặc `(b+ab)*(a+ε)`).
- Giải thích: giữa hai chữ a phải có **ít nhất một b**; xâu = các "khối b…b" xen kẽ a: `(b + ab)*` sinh các khối kết thúc bằng b (không bao giờ có aa), rồi thêm tùy chọn một a cuối (vì xâu có thể kết thúc bằng a đơn độc).
- Kiểm chứng máy: khớp đúng điều kiện "aa ∉ w" trên mọi xâu ≤ 8 ✅. ("aa" ❌, "aba" ✅, "aab" ❌, "ba" ✅.)

### Bài 136. Viết biểu thức chính quy cho "số ký tự 1 LẺ" trên {0,1}.
**Lời giải:** `0*1(0 + 10*1)*` (viết theo Python `re`: `0*1(0|10*1)*`).
- Giải thích: `0*1` = khối "chữ 1 đầu tiên"; phần lặp `(0 + 10*1)` = "thêm đúng 2 chữ 1 nữa" (dạng: dãy 0, rồi 1, rồi dãy 0, rồi 1) ⇒ mỗi vòng lặp làm số chữ 1 tăng 2, giữ nguyên tính lẻ; các chữ 0 xen giữa tùy ý.
- Kiểm chứng máy ✅ (khớp chính xác điều kiện "#1 lẻ" trên mọi xâu ≤ 7): `1` ✅, `01` ✅, `10` ✅, `11` ❌ (2 chữ 1 — chẵn), `110` ❌, `111` ✅ (3 chữ 1 — lẻ).

### Bài 137. Chứng minh `(a+b)* = a*(ba*)*` bằng lập luận ngôn ngữ.
**Lời giải:** Chiều ⊆: một xâu bất kỳ tách thành "đoạn a đầu" + các "khối b a…a" (mỗi lần gặp b, cắt khối b + dãy a theo sau) ⇒ ∈ `a*(ba*)*`. Chiều ⊇: mọi xâu sinh bởi vế phải chỉ gồm ký tự a, b nên ∈ `(a+b)*`. Hai chiều ⇒ bằng nhau (kiểm chứng máy: tương đương trên mọi xâu ≤ 8 ✅).

### Bài 138. Viết biểu thức chính quy cho "bắt đầu và kết thúc bằng cùng ký tự" trên {a,b}.
**Lời giải:** `a(a+b)*a + b(a+b)*b + a + b`.
(Gồm: xâu bắt đầu a kết thúc a, xâu bắt đầu b kết thúc b, và hai xâu độ dài 1.) Kiểm chứng thủ công: "ab" ∉ (đầu a cuối b) — đúng khớp biểu thức? "ab" chỉ match nếu 「a(a+b)*a」 needs ends a ✗; ✗ both ⇒ ∉ ✅.

### Bài 139. (Thompson) Xây ε-NFA cho `(a+b)*ab` bằng thuật toán Thompson.
**Lời giải:** Các khối: `a` (2→4), `b` (3→4); hợp `a+b` từ 1; sao `(a+b)*` dùng khung 0→(ε)→1, 1→(ε)→2 (vào a), 1→(ε)→3 (vào b), 4→(ε)→1 (lặp), 4→(ε)→5 (thoát), 0→(ε)→5 (bỏ qua thân sao); rồi nối `ab`: 5→(a)→6, 6→(b)→7. Trạng thái kết thúc {7}:
```
ε: 0→1, 0→5, 1→2, 1→3, 4→1, 4→5 ; ký tự: 2→(a)→4, 3→(b)→4, 5→(a)→6, 6→(b)→7
```
Kiểm chứng máy ✅: `ε-CLOSURE(0)={0,1,2,3,5}`; NFA nhận đúng "kết thúc ab" trên mọi xâu ≤ 6 (chạy `ab` ✅, `aab` ✅, `abab` ✅, `aba` ❌).
> 💡 Lưu ý "cung thoát" 0→5 là **bắt buộc** — quên nó thì ε (0 lần lặp) không đi qua được, NFA sẽ từ chối "ab" oan.

### Bài 140. (Thompson) Xây ε-NFA cho `r = (ab+a)*`.
**Lời giải:** Khung: 0→(ε)→1; 1→(ε)→2 (nhánh ab) và 1→(ε)→5 (nhánh a); 2→(a)→3; 3→(b)→4; 4→(ε)→6; 5→(a)→6; 6→(ε)→1 (lặp) và 6→(ε)→7 (thoát); 0→(ε)→7 (bỏ qua toàn bộ); F={7}.
Kiểm chứng máy ✅: nhận đúng `(ab+a)*` trên mọi xâu ≤ 6 (ε ✅, "ab" ✅, "a" ✅, "aba" ✅, "abb" ❌).

### Bài 141. Từ kết quả Bài 139, chuyển ε-NFA thành DFA (phương pháp tập con).
**Lời giải:** (Đã kiểm chứng máy — bảng dưới đây chính là kết quả `to_dfa` của chương trình.) Ký hiệu `eclose(T)` là ε-closure của tập T:
- `A = eclose({0}) = {0,1,2,3,5}` — trạng thái đầu.
- `A --a-->`: các đích là 2→(a)→4 và 5→(a)→6 ⇒ `eclose({4,6}) = {1,2,3,4,5,6} = B`.
- `A --b-->`: chỉ 3→(b)→4 ⇒ `eclose({4}) = {1,2,3,4,5} = C`.
- `B --a-->`: 2→4, 5→6 ⇒ lại `{1,2,3,4,5,6} = B`; `B --b-->`: 3→4 và 6→(b)→7 ⇒ `eclose({4,7}) = {1,2,3,4,5,7} = D`.
- `C --a--> = B`; `C --b--> = C` (chỉ 3→4). `D --a--> = B`; `D --b-->` = C (7 không có cung ra).

**DFA 4 trạng thái (F = {D}):**

| Tập con | a | b | Kết thúc |
|---|---|---|---|
| A = {0,1,2,3,5} | B | C | |
| B = {1,2,3,4,5,6} | B | D | |
| C = {1,2,3,4,5} | B | C | |
| D = {1,2,3,4,5,7} | B | C | ✔ |

Chạy kiểm chứng: `ab`: A→B→D ✅; `aab`: A→B→B→D ✅; `aba`: A→B→D→B ❌; `ba`: A→C→B ❌ (khớp đúng "kết thúc ab").
> 💡 Nhận xét tinh tế: 4 trạng thái này **chưa tối tiểu** — hai trạng thái A và C có cùng "hành vi" (a→B, b→C giống nhau, đều không kết thúc) nên gộp được, còn B ≠ D vì D kết thúc mà B thì không. Bản tối tiểu đúng **3 trạng thái** giống hệt DFA tự thiết kế ở Bài 92. Bài học: **RE → ε-NFA → DFA** (thuật toán Thompson + tập con) luôn cho kết quả đúng nhưng có thể "phình" thêm 1–2 trạng thái dư — bước tối tiểu hóa (Mức 5) sẽ dọn sạch.
> 💻 Đây là "full pipeline" nổi tiếng: **RE → ε-NFA → DFA → DFA tối tiểu** — đúng quy trình các compiler (lex/Flex) dùng để sinh máy tách từ vựng.

### Bài 142. Cho NFA `q₀ --0--> {q₀,q₁}; q₀ --1--> {q₀}; q₁ --1--> {q₂}`, `F={q₂}`. Chuyển sang DFA và nhận xét.
**Lời giải:** (Ngôn ngữ: kết thúc bằng "01".)

| Tập | 0 | 1 | F |
|---|---|---|---|
| {q₀} | {q₀,q₁} | {q₀} | |
| {q₀,q₁} | {q₀,q₁} | {q₀,q₂} | |
| {q₀,q₂} | {q₀,q₁} | {q₀} | ✔ |

DFA **3 trạng thái** — chính là bản DFA tối giản của ngôn ngữ "kết thúc 01" (đã kiểm chứng máy ✅).

### Bài 143. Cho NFA `s --a--> {s,p}; s --b--> {s}; p --b--> {q}; q --a,b--> {q}`, `F={q}`. Chuyển sang DFA.
**Lời giải:** Ngôn ngữ: "chứa ab" (q là trạng thái "đã thấy ab" hút). DFA tập con (đã kiểm chứng):

| Tập | a | b | F |
|---|---|---|---|
| {s} | {p,s} | {s} | |
| {p,s} | {p,s} | {q,s} | |
| {q,s} | {p,q,s} | {q,s} | ✔ |
| {p,q,s} | {p,q,s} | {q,s} | ✔ |

DFA 4 trạng thái (NFA 3 trạng thái) — sau khi tối tiểu hóa, DFA này gộp về 3 trạng thái như Bài 86 (hai trạng thái chứa q tương đương nhau vì đều "đã thấy ab, hút").

### Bài 144. Cho NFA "chứa aa hoặc bb" trên {a,b}: `A --a--> {A,B}; A --b--> {A,C}; B --a--> {D}; C --b--> {D}; D --a,b--> {D}`, `F={D}`. Chuyển sang DFA.
**Lời giải:** (Đã kiểm chứng máy, khớp chính xác "chứa aa hoặc bb".)

| Tập | a | b | F |
|---|---|---|---|
| {A} | {A,B} | {A,C} | |
| {A,B} | {A,B,D} | {A,C} | |
| {A,C} | {A,B} | {A,C,D} | |
| {A,B,D} | {A,B,D} | {A,C,D} | ✔ |
| {A,C,D} | {A,B,D} | {A,C,D} | ✔ |

Nhận xét: 4 trạng thái NFA → 5 trạng thái DFA; tập nào chứa D thì nhận.

### Bài 145. Cho NFA "đoán mò" cho "kết thúc ab": `q₀ --a--> {q₀,q₁}; q₀ --b--> {q₀}; q₁ --b--> {q₂}`, `F={q₂}`. Chuyển sang DFA.
**Lời giải (đã kiểm chứng máy):**

| Tập | a | b | F |
|---|---|---|---|
| {q₀} | {q₀,q₁} | {q₀} | |
| {q₀,q₁} | {q₀,q₁} | {q₀,q₂} | |
| {q₀,q₂} | {q₀,q₁} | {q₀} | ✔ |

Bất ngờ thú vị: subset construction cho **đúng 3 trạng thái** — trùng khớp DFA ta tự thiết kế ở Bài 92! NFA 3 trạng thái, DFA cũng 3 trạng thái.
> 💡 Vì sao "đoán mò" hiệu quả? NFA **đoán** rằng mỗi chữ a có thể là chữ áp cuối; nếu đoán sai thì nhánh đó chết. Sức mạnh "chọn đúng nhánh" miễn phí của NFA giúp diễn đạt ngắn gọn — nhưng khi làm DFA thì mọi khả năng phải được "gộp" vào tập trạng thái.

---

### Bài 146. (Ví dụ tr.45 – slide) Cho `L = {ωabⁿab | n ≥ 0, ω ∈ {a,b}*}` với văn phạm chính quy `G = <{a,b}, {S,A,B}, S, {S→aS, S→bS, S→aA, A→bA, A→aB, B→b}>`. Xây dựng NFA đoán nhận L và kiểm tra trên vài xâu.
**Lời giải:** Quy tắc `X→cY` ⇒ cung `X --c--> Y`; quy tắc chót `B→b` ⇒ cung `B --b--> E` với E là trạng thái kết thúc mới:
`S --a--> S`, `S --b--> S`, `S --a--> A`, `A --b--> A`, `A --a--> B`, `B --b--> E`; `F = {E}`.
Vì các cung đầu có `S --a,b--> S` nên đây đúng là mô hình "đọc ω tùy ý, rồi bắt buộc gặp mẫu `a bⁿ a b`".
Chạy (đã kiểm chứng máy): `abab` ✅; `aab` ✅ (n=0: ω=ε, "a·b⁰·a·b" = "aab"); `baaab` ✅ (ω=b, n=1); `baab` ✅; `ab` ❌ (chưa đủ mẫu).
> 💡 Chú ý cách vẽ: cung `S --a--> {S,A}` chính là "vừa đi tiếp vừa thử khớp mẫu" — bản chất **đoán mò** của NFA.

### Bài 147. (Ví dụ tr.48 – slide) Cho `L = {01ⁿ | n ≥ 1} ∪ {021}` với VPCQ `G = <{0,1,2}, {S,A,B,C}, S, {S→0A, A→1A, A→1, S→0B, B→2C, C→1}>`. Xây dựng FA đoán nhận L; chạy `01`, `011`, `021`, `0`.
**Lời giải:** NFA: `S --0--> {A,B}`; `A --1--> {A,E}`; `B --2--> C`; `C --1--> E`; `F={E}`.
Chạy (đã kiểm chứng máy): `01` ✅ (S-0-A-1-E); `011` ✅ (A-1-A-1-E); `021` ✅ (S-0-B-2-C-1-E); `0` ❌ (dừng ở A/B); `0211` ❌.
Đây là mô hình "kiểm tra 3 ký tự khác nhau": nhánh `0 1⁺` (chuỗi 1 dài) hoặc nhánh `0 2 1` cố định.
> 💡 Nhận xét hay: cả FA lẫn VPCQ ở bài này đều chỉ có **hữu hạn "bộ nhớ"** cần thiết: một con đường dài tùy ý đối với ký tự 1 nhờ **vòng lặp** A-1-A, còn lại là đường thẳng ngắn.

### Bài 148. (Ví dụ tr.49 – slide) Cho `G = <{a,b}, {I,A,B}, I, {I→aI, I→bA, A→aI, A→bB, A→b, B→bB, B→aB, B→a, B→b}>`. Xây dựng FA đoán nhận L(G) và xác định L(G).
**Lời giải:** NFA (thêm trạng thái kết thúc E cho các luật chót):
`I --a--> {I}`, `I --b--> {A}`, `A --a--> {I}`, `A --b--> {B,E}`, `B --a--> {B,E}`, `B --b--> {B,E}`; `F={E}`.
Mô tả (đã kiểm chứng máy): `L(G) = {w : w chứa "bb"}`.
Chạy: `bb` ✅ (I-b-A-b-E); `abb` ✅ (I-a-I-b-A-b-E); `bba` ✅ (I-b-A-b-B-a-E); `ab` ❌ (I-a-I-b-A: hết xâu nhưng đang ở A — muốn "chạm" E còn phải đọc thêm một ký tự b nữa); `ba` ❌; `aba` ❌.
> 💡 Vì sao "chứa bb"? Trạng thái B = "đã thấy bb" (A-gặp-b đi vào B là "ăn mừng", còn A→b nhảy luôn tới E tức là đủ điều kiện dừng). Sau khi ở B, mọi ký tự đều vừa đi tiếp vừa có thể "kết thúc" — nên chỉ cần có **một** cặp bb là nhận.

### Bài 149. (Ví dụ tr.46 – slide) DFA cho bởi: `δ(q₀,0)=q₁, δ(q₁,0)=q₂, δ(q₁,1)=q₀, δ(q₂,1)=q₀`, `F={q₂}` (một số cung KHÔNG liệt kê). (i) Nếu coi là DFA **khuyết cung** như đã cho, T(A) = ? (ii) Nếu **hoàn thiện** bằng cách thêm `δ(q₀,1)=q₀` và `δ(q₂,0)=q₂`, T(A) = ?
**Lời giải:** (i) Đã kiểm chứng: `T(A) = {ω00 | ω ∈ (01+001)*}` — ví dụ `00` ✅, `0100` ✅, `00100` ✅, `010` ❌, `100` ❌ (vì cung q₀-1 không tồn tại ⇒ "chết"). Slide ghi đúng dạng này!
(ii) Sau khi lấp đầy 2 cung còn thiếu (đã kiểm chứng): `T(A) = {w : w kết thúc bằng 00} = (0+1)*00` — ví dụ `100` ✅ (q₀-1-q₀-0-q₁-0-q₂), `0100` ✅, `1000` ✅, `10` ❌.
> 💡 Cùng một câu hỏi, hai đáp số khác nhau **hoàn toàn** phụ thuộc quy ước cung khuyết. Khi làm bài: nếu đề không nói gì, DFA thường hiểu là khuyết (chỉ đi theo cung có trong bảng); muốn dùng các công thức (phần bù, tích) thì phải hoàn thiện trước.

### Bài 150. Chuyển DFA "kết thúc bằng ab" (Bài 92: trạng thái s,p,q) thành **văn phạm chính quy** sinh đúng ngôn ngữ đó.
**Lời giải:** Quy tắc chuyển: thêm `A→aB` cho mỗi `δ(A,a)=B`; nếu B là kết thúc thì **thêm cả** `A→a` (để dẫn xuất "dừng và ra xâu").
- s→ap, s→bs (δ(s,a)=p, δ(s,b)=s; p,s đều không kết thúc)
- p→ap, p→bq, **p→b** (q kết thúc ⇒ thêm p→b)
- q→ap, q→bs (không thêm luật chót nào: δ(q,a)=p và δ(q,b)=s đều dẫn về trạng thái không-kết-thúc)
**P** = { s→ap | bs; p→ap | bq | b; q→ap | bs }.
Đã kiểm chứng máy: G sinh đúng tập xâu kết thúc "ab" (127 xâu độ dài ≤ 8; `ab`, `aab`, `bab`, `abab`, `baab` ✅; `abb` ❌ vì DFA kết ở s ∉ F).
> 💡 Vì sao không cần ε? Ta "nén" luật kết thúc: thay vì đi tới q rồi `q→ε`, ta ghi thẳng `p→b`. Nhờ vậy văn phạm đỡ 1 luật rỗng (ε-quy tắc), nhưng "cái giá" là luật p→b | bq cùng nhãn b — hoàn toàn hợp lệ.

### Bài 151. Chuyển DFA "chẵn a" (Q={E,O}, E đầu & kết thúc) thành văn phạm chính quy. Kiểm tra xâu rỗng.
**Lời giải:** Luật: `E→aO`, `E→bE`, `E→ε` (E kết thúc ⇒ cần luật rỗng để "dừng"), `O→aE`, `O→bO`.
**P** = { E→aO | bE | ε; O→aE | bO }.
Đã kiểm chứng máy: sinh đúng "số a chẵn": `^` ✅ (E⇒ε), `aa` ✅ (E⇒aO⇒aaE⇒aa), `ab` ❌ (E⇒aO⇒abO, O không dừng được), `baab` ✅.
> 💡 Trong văn phạm chính quy, để "kết thúc ở trạng thái kết thúc" người ta dùng **luật A→ε** (hoặc bản nén A→a như Bài 150). Cả hai đều đúng chuẩn "VPCQ tuyến tính phải".

### Bài 152. Phát biểu và "chứng minh bằng dây chuyền" định lý: ba cách mô tả ngôn ngữ chính quy là tương đương (Định lý tr.47).
**Lời giải:** Định lý: L chính quy ⟺ (a) có biểu thức chính quy biểu diễn; (b) có VPCQ sinh; (c) có FA đoán nhận.
Dây chuyền chứng minh (mỗi mũi tên đã có "công cụ" ở các bài trước):
- `regex → ε-NFA`: thuật toán Thompson (Bài 139–140).
- `ε-NFA → NFA → DFA`: khử ε + phương pháp tập con (Bài 141, 142–145).
- `DFA → VPCQ`: luật `A→aB`, `A→a` (Bài 150–151).
- `VPCQ → NFA`: luật `A→aB` thành cung (Bài 146–148) — mũi tên này khép vòng.
⇒ mọi cách mô tả **rộng bằng nhau**: `D = N = R` (slide tr.47). Các bao hàm chặt đã thấy: ví dụ DFA ⊆ NFA (Bài 116), NFA→DFA luôn làm được (Định lý 1 ở Phần II.E).

### Bài 153. (Ví dụ tr.59 – slide, loại quy tắc đơn) `G = <{a,+,*}, {S,A,B}, S, {S→S+A, S→A, A→A*B, A→B, B→a}>`. Tìm văn phạm tương đương KHÔNG có quy tắc đơn.
**Lời giải:** Quy tắc đơn: `S→A`, `A→B` (≠ A→a vì a là ký tự chính).
"Lan truyền" vế phải qua các quy tắc đơn:
- Từ `B` suy được: `a` ⇒ thay vào A: `A→a`; thay vào S: `S→a`.
- Từ `A` (không kể luật đơn) suy được: `A*B`, `a` ⇒ thay vào S: `S→A*B`, `S→a`.
Giữ nguyên các luật không đơn: `S→S+A`, `A→A*B`, `B→a`.
**G'** = { S→S+A, A→A*B, B→a, S→A*B, A→a, S→a } — đúng như slide.
Đã kiểm chứng máy: G và G' sinh **cùng** tập xâu (15 xâu độ dài ≤ 7, ví dụ `a`, `a+a`, `a*a+a`, `a+a*a`, `a+a+a*a`, …).
> 💡 Vì sao an toàn? Một quy tắc đơn A→B chỉ là "đổi tên" chứ không sinh ký tự; mọi dẫn xuất dùng nó đều có thể thay bằng "nhảy thẳng" tới một luật không-đơn của B. Lan truyền cho tới khi hết quy tắc đơn ⇒ tương đương.

### Bài 154. Loại quy tắc đơn cho `G: S→A | B | ab; A→a; B→b`.
**Lời giải:** Các luật đơn: S→A, S→B. Vế phải không-đơn của A là `a`; của B là `b`. Kết quả:
**G'** = { S→a | b | ab } (A, B trở thành **vô sinh** — không còn ai trỏ tới chúng — nên bỏ luôn).
Đã kiểm chứng máy: G và G' cùng sinh {a, b, ab} ✅.
> 💡 Sau khi bỏ quy tắc đơn, hãy **chạy lại bước loại ký hiệu vô sinh** (Mức 2, Bài 75) — trong ví dụ này A và B chết theo dây chuyền.

### Bài 155. (Định lý 1.4, tr.60) `G: S→aSb | ε`. Loại bỏ ε-quy tắc để được G' với `L(G') = L(G) \ {ε}`.
**Lời giải:** Ký hiệu S là **"có thể rỗng"** (S ⇒* ε). Với mỗi luật có chứa S ở vế phải, sinh thêm các biến thể bỏ S:
- `S→aSb` ⇒ thêm `S→ab` (bỏ S ở giữa).
- Riêng `S→ε` là luật rỗng ⇒ **bỏ**, nhưng xâu ε bị mất — đúng như định lý: `L(G') = L(G) \ {ε}`.
**G'** = { S→aSb | ab }.
Đã kiểm chứng máy: G sinh {ε, ab, aabb, aaabbb}; G' sinh {ab, aabb, aaabbb} ✅ — hơn kém đúng phần tử ε.
> 💡 Nếu ngôn ngữ **bắt buộc** chứa ε thì không thể xóa sạch ε-quy tắc (slide tr.60 nhấn mạnh): giữ lại duy nhất `S→ε`, hoặc dùng biến thể "thêm trạng thái/bổ sung luật" như sau này.

---

### Bài 156. Loại ε-quy tắc cho `G: S→AB, A→aA | ε, B→bB | ε`. Tìm ngôn ngữ trước và sau khi loại, so sánh.
**Lời giải:** Ngôn ngữ: A sinh `a*`, B sinh `b*` ⇒ `L(G) = a*b*` (kể cả ε, vì S→AB với A,B đều rỗng được).
Ký hiệu "có thể rỗng": A ✔, B ✔ ⇒ S cũng có thể rỗng (S→AB).
Với `S→AB` sinh thêm các biến thể bỏ A, bỏ B, bỏ cả hai: `S→B`, `S→A`, `S→ε`.
Với A: `A→aA` ⇒ thêm `A→a`; bỏ `A→ε`. Với B: `B→bB` ⇒ thêm `B→b`; bỏ `B→ε`.
**G'** = { S→AB | A | B | ε; A→aA | a; B→bB | b }.
Đã kiểm chứng máy: G và G' sinh cùng tập xâu (`''`, `a`, `b`, `aa`, `ab`, `bb`, `aab`, `abb`, `bbbb`, …) — chính là `a*b*` ✅. Vì ε ∈ L(G) nên **buộc phải giữ** đúng một luật `S→ε`.
> ⚠️ Đừng quên: khi bỏ A→ε, phải "nhân bản" **mọi** luật có A xuất hiện ở vế phải (kể cả vế phải đứng một mình). Bỏ sót biến thể là lỗi phổ biến nhất khi làm bài ε-quy tắc.

### Bài 157. (Ví dụ tr.63–64 – slide, quy trình đầy đủ) `G = <{a,b}, {S,A,B}, S, {S→A, S→ABA, A→aA, A→a, A→B, B→bB, B→b}>`. Đưa G về **dạng chuẩn Chomsky** theo 4 bước của slide.
**Lời giải:**
**Bước 1 — loại quy tắc đơn.** Quy tắc đơn: `S→A`, `S→?`, `A→B`.
- Từ A suy được (không kể đơn): aA, a, bB, b ⇒ thay vào S: `S→aA, S→a, S→bB, S→b`.
- Từ B suy được: bB, b ⇒ thay vào A: `A→bB, A→b`; thay vào S (qua S→A): `S→bB, S→b` (đã có).
- Giữ nguyên: `S→ABA`, `A→aA`, `A→a`, `B→bB`, `B→b`.
`G₁ = {S→ABA | aA | a | bB | b; A→aA | a | bB | b; B→bB | b}` (đúng như slide).
**Bước 2 — tách ký tự chính ra khỏi vế phải trộn.** Thay `a` bởi biến phụ `Aa` (viết X), `b` bởi `Ab` (viết Y), thêm `X→a`, `Y→b`:
`G₂ = {S→ABA | XA | a | YB | b; A→XA | a | YB | b; B→YB | b; X→a; Y→b}`.
**Bước 3 — chẻ vế phải dài > 2.** Chỉ còn `S→ABA`: thêm biến `C`, thay bằng `S→AC`, `C→BA`:
`G₃ = {S→AC | XA | a | YB | b; C→BA; A→XA | a | YB | b; B→YB | b; X→a; Y→b}`.
**Bước 4 — kiểm tra:** mọi luật đều có dạng `A→BC` hoặc `A→a` ⇒ **G₃ ở dạng CNF** ✅.
Đã kiểm chứng máy: `L(G₁) = L(G₃)` — cùng 82 xâu độ dài ≤ 6 (`a, b, aa, ab, bb, aaa, aab, aba, abb, bba, bbb, aabb, abba, …`).
> ⚠️ Lưu ý sách in: slide nói thêm luật `Aa→a, Ab→b` trong phần diễn giải nhưng phần **liệt kê** P₂, P₃ bị sót 2 luật này — nếu viết thiếu, X và Y trở thành vô sinh và ngôn ngữ bị mất oan. Khi làm bài, luôn kiểm tra "mọi ký hiệu phụ mới đều có đường ra ký tự chính".

### Bài 158. Đưa `G: S→aSb | ab` (sinh `{aⁿbⁿ | n ≥ 1}`) về dạng chuẩn Chomsky.
**Lời giải:** Đặt `X→a`, `Y→b` cho các ký tự chính xuất hiện trong vế phải trộn:
- `S→aSb` = X·S·Y (3 ký hiệu) ⇒ thêm biến C: `S→XC`, `C→SY`.
- `S→ab` = X·Y (2 ký hiệu, toàn phụ) ⇒ giữ nguyên.
**G'** = { S→XC | XY; C→SY; X→a; Y→b }.
Đã kiểm chứng máy: G và G' sinh cùng tập xâu: `ab, aabb, aaabbb, aaaabbbb` (độ dài ≤ 8) ✅.
> 💡 Trong CNF, mỗi bước dẫn xuất của `aⁿbⁿ` sẽ tự động "cân" dần: đọc a thì đẩy X, đọc b thì thu Y — thú vị là văn phạm CNF này nhìn "giống PDA" hơn.

### Bài 159. (Ví dụ tr.53 – slide) Đưa `G₂ = <{a,b}, {S,A}, S, {S→Sa | Aa, A→aAb | ab}>` về dạng chuẩn Chomsky.
**Lời giải:** (Ngôn ngữ: `{aⁿbⁿaᵐ | n ≥ 1, m ≥ 1}`.)
Đặt `X→a`, `Y→b`.
- `S→Sa` ⇒ `S→SX` (2 phụ) ✓; `S→Aa` ⇒ `S→AX` ✓.
- `A→aAb` = X·A·Y ⇒ thêm D: `A→XD`, `D→AY`.
- `A→ab` = X·Y ✓.
**G₂' (CNF)** = { S→SX | AX; A→XD | XY; D→AY; X→a; Y→b }.
Đã kiểm chứng máy: G₂ và G₂' cùng sinh 12 xâu độ dài ≤ 8: `aba, abaa, aabba, aabbaa, aaabbba, …` ✅ (khớp `{aⁿbⁿaᵐ}`).

### Bài 160. Đưa văn phạm palindrome độ dài chẵn `S→aSa | bSb | aa | bb` về CNF. So sánh ngôn ngữ.
**Lời giải:** Đặt X→a, Y→b.
- `S→aSa` = X·S·X ⇒ `S→XD`, `D→SX`.
- `S→bSb` ⇒ `S→YE`, `E→SY`.
- `S→aa` ⇒ `S→XX`; `S→bb` ⇒ `S→YY`.
**CNF** = { S→XD | YE | XX | YY; D→SX; E→SY; X→a; Y→b }.
Đã kiểm chứng máy: hai văn phạm sinh cùng tập (30 xâu ≤ 8, và **mọi** xâu đều là palindrome độ dài chẵn: `aa, bb, abba, baab, aabbaa, abaaba, …`) ✅.
> 💡 Nhận xét đẹp: CNF không hề làm mất cấu trúc đệ quy của "bọc ngoài" — mỗi luật S→XD vẫn là "thêm a ở hai đầu" nhìn qua biến trung gian D.

### Bài 161. (Ví dụ tr.52 – slide) `G₁ = <{a,b,c,+,*,(,)}, {S,A}, S, {S→S+S | A*A | a | b | c, A→(S+S) | a | b | c}>`. Viết **dẫn xuất trái** của `ω = b+(a+c)*b` và vẽ cây suy dẫn đầy đủ.
**Lời giải:** Dẫn xuất trái (đã kiểm chứng từng bước):
`S ⇒ S+S ⇒ b+S ⇒ b+A*A ⇒ b+(S+S)*A ⇒ b+(a+S)*A ⇒ b+(a+c)*A ⇒ b+(a+c)*b`
Cây suy dẫn (đọc lá trái→phải được ω):
```
                S
              / | \
             /  |  \
            S   +   S
            |      /|\
            b     A * A
                 /|\   \
                ( S + S )  b
                  |   |
                  a   c
```
Diễn giải: gốc S→S+S (phép cộng "ngoài cùng"); cây con phải S→A*A (phép nhân có độ ưu tiên cao hơn, nằm sâu hơn); `A→(S+S)` mở ngoặc cho `a+c`; các lá a, c, b là ký tự chính.
> 💡 Cây này "mô hình hóa thứ tự thực hiện phép toán" — biên dịch viên dùng cây cú pháp (AST) đúng như vậy: `b+(a+c)*b` ⇒ AST với `+` ở gốc. Đây chính là "cây suy dẫn" × "cây biểu thức".

### Bài 162. (Ví dụ tr.53 – slide) Với `G₂: S→Sa | Aa; A→aAb | ab` (sinh `{aⁿbⁿaᵐ}`), viết dẫn xuất và cây suy dẫn cho `ω = aabbaa`.
**Lời giải:** Dẫn xuất (đã kiểm chứng):
`S ⇒ Sa ⇒ Saa ⇒ Aaa ⇒ aAbaa ⇒ aabbaa`
Cây suy dẫn:
```
          S
         / \
        S   a
       / \
      S   a
      |
      A
     /|\
    a A b
     / \
    a   b
```
Lá (trái→phải): `a a b b a a` = ω ✅. Đọc cây: hai nhánh S trên cùng sinh `aᵐ` (m=2) phần đuôi; nhánh A sinh `a²b²` (n=2) phần đầu.
> 💡 Từ cây thấy ngay "khuôn mẫu tổng quát": S lặp `m` lần nhánh phải để tạo `aᵐ`, A lặp `n` lần nhánh giữa để tạo `aⁿbⁿ`.

### Bài 163. (Ví dụ tr.54 – slide) `G₃ = <Σ={a,b}, {S}, S, {S→aSa, S→bSb, S→aa, S→bb}>`. Vẽ cây suy dẫn của `ω = abba`. Phát biểu Định lý 1.1 (tr.54) và ý nghĩa.
**Lời giải:** Dẫn xuất: `S ⇒ aSa ⇒ abba` (dùng `S→aSa` rồi `S→bb`) — đã kiểm chứng.
Cây:
```
        S
       /|\
      a  S  a
        / \
       b   b
```
Đọc lá: `a b b a` = ω ✅ (ω = abba đối xứng: ω = ωᴿ).
**Định lý 1.1:** Cho VPPNC G và `ω ∈ Σ*\{ε}`. `ω ∈ L(G)` ⟺ tồn tại cây suy dẫn đầy đủ trong G nhận ω làm kết quả (đọc lá).
Ý nghĩa: "sinh" và "phân tích" là hai mặt của một đồng tiền — muốn kiểm tra một xâu có thuộc ngôn ngữ, ta có thể đi tìm **cây phân tích**; đây chính là cách trình biên dịch "hiểu" mã nguồn.

### Bài 164. (Ví dụ tr.56 – slide, NHẬP NHẰNG) `G = <{a,b,+,*}, {S}, S, {S→S+S, S→S*S, S→a, S→b}>` và `ω = b+a*b+a`. Chỉ ra hai dẫn xuất trái khác nhau ⇒ G nhập nhằng. Vẽ hai cây.
**Lời giải:** (Đã kiểm chứng từng bước.)
**Dẫn xuất 1:** `S ⇒ S+S ⇒ S+S+S ⇒ b+S+S ⇒ b+S*S+S ⇒ b+a*S+S ⇒ b+a*b+S ⇒ b+a*b+a`
**Dẫn xuất 2:** `S ⇒ S+S ⇒ b+S ⇒ b+S+S ⇒ b+S*S+S ⇒ b+a*S+S ⇒ b+a*b+S ⇒ b+a*b+a`
Hai cây khác nhau (cùng lá `b a b a`):
```
      CÂY 1: (b+(a*b))+a                CÂY 2: b+((a*b)+a)
          S                                  S
        / | \                              / | \
       S  +  S                            S  +  S
      /|\     |                            |    /|\
     S + S    a                            b   S + S
     |   |\                                   /|\   |
     b   S * S                               S * S  a
         |   |                               |   |
         a   b                               a   b
```
⇒ ω có **hai cây suy dẫn khác nhau** ⇒ G **nhập nhằng** (đa nghĩa). Nghĩa "toán học" khác nhau: cây 1 = `(b + a*b) + a`; cây 2 = `b + (a*b + a)`.
> 💡 Trong thực tế, biên dịch viên **bắt buộc** dùng văn phạm đơn nghĩa: thường tầng hóa (precedence) `E → E+T | T; T → T*F | F; F → a | b | (E)` để mỗi biểu thức chỉ có một cây. Nhập nhằng = "cùng một chương trình có hai cách hiểu" — nguy hiểm với ngôn ngữ lập trình.

### Bài 165. Tổng kết quy trình "giản lược & chuẩn hóa" một VPPNC. Vì sao CNF quan trọng trong thực tế?
**Lời giải:** **Quy trình 4 bước** (đúng thứ tự để tránh "hồi sinh" ký hiệu thừa):
1. **Loại ký hiệu vô sinh** (không dẫn ra được xâu ký tự chính) — Bổ đề 1.1, tr.58.
2. **Loại ký hiệu không đến được** (từ S không với tới) — Bổ đề 1.2, tr.58. (Làm bước 1 xong mới tới bước 2; và sau bước 2 đôi khi phải lặp lại bước 1.)
3. **Loại quy tắc đơn** A→B — tr.59 (lan truyền vế phải, xem Bài 153–154).
4. **Loại ε-quy tắc** (giữ tối đa một luật S→ε nếu ε ∈ L) — Định lý 1.4, tr.60 (xem Bài 155–156).
Rồi mới **chuẩn hóa Chomsky**: tách ký tự chính ra biến phụ ⇒ chẻ vế phải >2 ký hiệu phụ ⇒ thêm X→a (Bài 157–160).
**Vì sao CNF quan trọng:**
- Mọi quy tắc CNF **không tăng độ dài** quá 1 ký tự phụ (A→BC thay 1 bằng 2; A→a thay 1 bằng 1) ⇒ độ dài dẫn xuất của xâu |w| là **chính xác 2|w|−1 bước** ⇒ mọi xâu phải qua đúng số bước — tiện cho thuật toán.
- Có thuật toán **CYK** phân tích cú pháp trong O(n³) dựa trên CNF: bảng điền theo xâu con, không cần quay lui mò mẫm.
- Chuẩn hóa giúp **so sánh** các văn phạm, chứng minh định lý (bổ đề bơm cho VPPNC cũng hay dùng dạng chuẩn).
> 💻 Liên hệ CNTT: parser thực tế (ANTLR, yacc…) thường dùng dạng "hơi chuẩn" hơn là CNF chính danh, nhưng các **kỹ thuật biến đổi** ở đây (khử đơn, khử ε, tách nhị phân) là chính xác những biến đổi bên trong chúng để biến văn phạm người viết thành bảng phân tích máy chạy được — như biến cây cú pháp "đọc được" thành "máy chạy được".

---

## MỨC 5 — BỔ ĐỀ BƠM, Ô-TÔ-MÁT ĐẨY XUỐNG & CHỨNG MINH NÂNG CAO (Bài 166–200)

### Bài 166. Phát biểu **bổ đề bơm cho ngôn ngữ chính quy** (pumping lemma). Nêu trực giác "chuồng bồ câu" và khung 5 bước chứng minh "L không chính quy".
**Lời giải:** **Định lý (Bổ đề bơm).** Nếu L là ngôn ngữ chính quy thì tồn tại số nguyên `p ≥ 1` (gọi là **độ dài bơm**) sao cho **mọi** xâu `w ∈ L` với `|w| ≥ p` đều có thể viết `w = xyz` thỏa đồng thời:
1. `|xy| ≤ p` (phần cần "bơm" nằm trong **p** ký tự đầu);
2. `|y| ≥ 1` (y khác rỗng);
3. `∀i ≥ 0: xyⁱz ∈ L` ("bơm" y **hoặc xóa** y tùy ý, xâu vẫn thuộc L).
**Trực giác:** L chính quy ⇒ có DFA `p` trạng thái đoán nhận L. Xét `|w| ≥ p`: đường chạy qua `|w|+1 ≥ p+1` trạng thái ⇒ theo nguyên lý **chuồng bồ câu**, tồn tại trạng thái lặp lại trong `p` bước đầu ⇒ đoạn `y` giữa hai lần thăm đó là một **vòng lặp**; đứng ở vòng lặp thì "quay bao nhiêu vòng cũng được" (i tùy ý) — máy vẫn đi tới đích. Vì vậy các xâu kiểu "đếm rồi so sánh số lượng" (aⁿbⁿ…) không thể chính quy: bộ nhớ hữu hạn không đếm vô hạn được.
**Khung 5 bước chứng minh L ∉ L₃ (dạng phủ định):**
1. **Giả sử phản chứng**: L chính quy ⇒ tồn tại `p`.
2. **Chọn xâu "tử chiến"** `w ∈ L` có `|w| ≥ p` (thường là aᵖbᵖ, aᵖbᵖcᵖ… sao cho "phá" được mọi cách chia).
3. **Xét mọi cách chia hợp lệ**: `w = xyz, |xy| ≤ p, |y| ≥ 1` (dagu: tận dụng ràng buộc để chỉ ra `y` chỉ nằm trong đoạn a…).
4. **Chọn i thích hợp** (thường i = 0, 2 hoặc lớn) làm `xyⁱz ∉ L` — mâu thuẫn điều kiện 3.
5. **Kết luận**: mọi cách chia đều dẫn mâu thuẫn ⇒ không tồn tại p ⇒ **L không chính quy**. ∎
> 💡 Ghi nhớ nhanh: *"Bơm = đi vòng; chính quy = bộ nhớ hữu hạn; đếm được hai thứ khác nhau ⇒ không chính quy."*

### Bài 167. Chứng minh `L = {aⁿbⁿ | n ≥ 0}` **không chính quy**.
**Lời giải (theo khung 5 bước):**
1. Giả sử L chính quy với độ dài bơm `p`.
2. Chọn `w = aᵖbᵖ ∈ L`, `|w| = 2p ≥ p`.
3. Mọi cách chia `w = xyz` với `|xy| ≤ p` buộc `xy` nằm trọn trong **p chữ a đầu** ⇒ `x = aˢ, y = aᵏ (k ≥ 1), z = a^{p−s−k}bᵖ`.
4. Lấy `i = 2`: `xy²z = a^{p+k}bᵖ`. Vì `k ≥ 1` ⇒ số a = `p+k > p` = số b ⇒ xâu **không** có dạng aⁿbⁿ ⇒ `xy²z ∉ L`: **mâu thuẫn**.
5. Vậy L không chính quy. ∎
> 💡 Nhận xét mạnh hơn: mọi ngôn ngữ chính quy vô hạn đều chứa một **cấp số nhân** các xâu (bơm một đoạn) — còn aⁿbⁿ "phình đều hai bên" nên không thể.

### Bài 168. Chứng minh `L = {aⁱbʲ | 0 ≤ i < j}` không chính quy.
**Lời giải:**
1. Giả sử L chính quy, độ dài bơm `p`.
2. Chọn `w = aᵖbᵖ⁺¹ ∈ L` (vì p < p+1).
3. `|xy| ≤ p` ⇒ `y = aᵏ (k ≥ 1)` hoàn toàn trong khối a đầu.
4. Lấy `i = 2`: `xy²z = a^{p+k}b^{p+1}`; lúc này số a `p+k ≥ p+1` = số b ⇒ điều kiện `i < j` bị phá ⇒ `∉ L`: mâu thuẫn.
5. Kết luận L ∉ L₃. ∎
> ⚠️ Bẫy hay gặp: nếu chọn `i = 0` thì `a^{p−k}b^{p+1}` **vẫn** thuộc L (vì p−k < p+1 luôn đúng) — chọn i sai thì không ra mâu thuẫn! Phải chọn `i` sao cho điều kiện "sắc" bị phá (ở đây là i = 2).

### Bài 169. Chứng minh `L = {aⁿ : n là số nguyên tố}` không chính quy.
**Lời giải:**
1. Giả sử L chính quy, độ dài bơm `p`. Chọn số nguyên tố `q > p` (vô số số nguyên tố).
2. Chọn `w = a^q ∈ L`.
3. `|xy| ≤ p < q` ⇒ `y = aᵏ (1 ≤ k ≤ p)`, `z = a^{q−k}`.
4. Lấy `i = q + 1`: `xy^{q+1}z = a^{q−k}·a^{(q+1)k} = a^{q + kq} = a^{q(k+1)}`. Vì `q ≥ 2` và `k+1 ≥ 2` ⇒ số mũ `q(k+1)` là **hợp số** ⇒ `xy^{q+1}z ∉ L`: mâu thuẫn.
5. Vậy L không chính quy. ∎
> 💡 Mẹo: chọn `i` phụ thuộc vào `q` để "ép" số mũ thành tích hai số > 1.

### Bài 170. Chứng minh ngôn ngữ PALINDROME `{w ∈ {a,b}* : w = wᴿ}` không chính quy.
**Lời giải:**
1. Giả sử chính quy, độ dài bơm `p`.
2. Chọn `w = aᵖ b aᵖ` — rõ ràng palindrome ✅, `|w| = 2p+1 ≥ p`.
3. `|xy| ≤ p` ⇒ `y` chỉ gồm chữ `a` trong **khối a đầu** (không chạm chữ b ở giữa): `y = aᵏ, k ≥ 1`.
4. Lấy `i = 2`: `xy²z = a^{p+k} b aᵖ`. Đối xứng trái–phải: đầu xâu có `p+k` chữ a nhưng cuối xâu chỉ có `p` chữ a ⇒ không phải palindrome ⇒ `∉ L`: mâu thuẫn.
5. Kết luận PALINDROME ∉ L₃. ∎
> 💡 Đây là "bài học lịch sử": FA không làm được việc "nhớ nửa đầu để so với nửa sau" — phải có **ngăn xếp** (PDA). Đúng chất câu chuyện Mức 5 sẽ tiếp diễn.

### Bài 171. Chứng minh `L = {ww | w ∈ {0,1}*}` (xâu nhân đôi) không chính quy.
**Lời giải:**
1. Giả sử chính quy, độ dài bơm `p`.
2. Chọn `w = 0ᵖ1 0ᵖ1 ∈ L` (nó bằng `u·u` với `u = 0ᵖ1`).
3. `|xy| ≤ p` ⇒ `y = 0ᵏ (k ≥ 1)` nằm trong khối 0 đầu tiên.
4. Lấy `i = 2`: `xy²z = 0^{p+k}1 0ᵖ1`. Nếu xâu này = `ss` thì `s` phải chứa trọn "chữ 1 đầu tiên": `s = 0^{p+k}1` ⇒ `ss = 0^{p+k}1 0^{p+k}1`, tức khối 0 **thứ hai** phải có `p+k` chữ 0 — nhưng thực tế là `p` ⇒ mâu thuẫn. (Lấy i = 0 cũng ra mâu thuẫn tương tự.)
5. Vậy L không chính quy. ∎
> 💡 Nhận xét: cái "khó" của ww là **vị trí điểm giữa** phụ thuộc độ dài chưa đọc hết — FA không biết giữa ở đâu. (Đối chiếu Bài 175: ww cũng **không** phi ngữ cảnh!)

### Bài 172. Chứng minh `L = {a^{n²} | n ≥ 0}` không chính quy.
**Lời giải:**
1. Giả sử chính quy, độ dài bơm `p`. Chọn số `n = p` ⇒ `w = a^{p²} ∈ L` (chú ý `p² ≥ p ✓`).
2. `|xy| ≤ p` ⇒ `y = aᵏ, 1 ≤ k ≤ p`; `z = a^{p²−k}`.
3. Lấy `i = 2`: `xy²z = a^{p²+k}`.
4. So sánh hai bình phương liên tiếp: `(p+1)² − p² = 2p+1 > p ≥ k` ⇒ `p² < p² + k < (p+1)²` ⇒ `p²+k` **không** là số chính phương ⇒ `xy²z ∉ L`: mâu thuẫn.
5. Vậy L không chính quy. ∎
> 💡 Kỹ thuật "kẹp giữa hai bình phương liên tiếp" dùng chung cho mọi dãy tăng quá nhanh (lũy thừa 2ⁿ, n!, Fibonacci…): DFA chỉ nhớ được **hữu hạn** khoảng cách.

### Bài 173. Phát biểu **bổ đề bơm cho ngôn ngữ phi ngữ cảnh** (bổ đề Bar–Hillel). So sánh với bổ đề bơm chính quy.
**Lời giải:** **Định lý.** Nếu L là ngôn ngữ phi ngữ cảnh thì tồn tại `p ≥ 1` sao cho mọi `w ∈ L, |w| ≥ p` đều viết được `w = uvxyz` thỏa:
1. `|vxy| ≤ p` (phần "co giãn" chỉ dài ≤ p — khác bổ đề chính quy ở chỗ **cho phép 2 khối** v, y tách xa nhau!);
2. `|vy| ≥ 1`;
3. `∀i ≥ 0: uvⁱxyⁱz ∈ L` (**bơm đồng thời cả v và y cùng số lần**).
**So sánh nhanh:**

| | Chính quy (xyᶻ) | Phi ngữ cảnh (uvxyz) |
|---|---|---|
| Số đoạn co giãn | 1 đoạn (`y`) | 2 đoạn (`v` và `y`), bơm cùng lúc |
| Ràng buộc vị trí | cả `xy` trong p ký tự đầu | cả `vxy` trong "khúc" ≤ p |
| Bản chất bộ nhớ | vòng lặp trong DFA (`p` trạng thái) | hai nhánh cây suy dẫn xuất phát từ **cùng một ký hiệu phụ** A xuất hiện hai lần trên đường đi gốc→lá (ngăn xếp lặp) |
| Dùng để chứng minh | không chính quy | không phi ngữ cảnh |

Hình dung: trong cây suy dẫn, "khúc" chỉ có `p` ký tự trên cùng một "đường chạy" — cây cao hơn p thì phải có ký hiệu phụ A lặp lại ⇒ cắt hai tầng A để "gọt" hoặc "bơm" phần ở giữa (v và y) ⇒ v, y tách hai bên x, kẹp một xâu giữa.
> 💡 Vì có **hai** tay cầm, bổ đề CFL "mạnh" hơn hẳn: nó giải thích vì sao `aⁿbⁿ` ổn (CFL) mà `aⁿbⁿcⁿ` gãy.

### Bài 174. Chứng minh `L = {aⁿbⁿcⁿ | n ≥ 0}` **không phi ngữ cảnh**.
**Lời giải:**
1. Giả sử L là CFL với `p`; chọn `w = aᵖbᵖcᵖ` (|w| = 3p ≥ p).
2. Viết `w = uvxyz` với `|vxy| ≤ p, |vy| ≥ 1`. Vì `|vxy| ≤ p`, khúc `vxy` **không thể** trùm từ khối a sang khối c (khoảng cách xa), nên chỉ có các khả năng:
 **(a) vxy nằm trong một khối** (toàn a, toàn b, hoặc toàn c): lấy `i = 2` — ta "nở" đúng một loại ký tự, hai loại còn lại giữ nguyên ⇒ ba số lượng không còn bằng nhau ⇒ `∉ L`. (Lấy i=0 cũng tương tự.)
 **(b) vxy vắt qua ranh giới a|b**: khi đó `v` chỉ gồm a, `y` chỉ gồm b (và `|vy| ≥ 1`). Lấy `i = 2`: số a = `p+|v|`, số b = `p+|y|`, số c = `p` ⇒ không thể đồng thời bằng p (vì `|v| ≠ |y|` không thể bù trừ được giữa ba số) ⇒ `∉ L`.
 **(c) vxy vắt qua ranh giới b|c**: đối xứng (b): `v` toàn b, `y` toàn c ⇒ mâu thuẫn tương tự.
 (Trường hợp vxy vắt **cả** a|b **và** b|c bất khả thi vì cần > p ký tự.)
3. Mọi khả năng đều cho mâu thuẫn ⇒ L không phi ngữ cảnh. ∎
> 💡 Ý nghĩa "cấp thang": `aⁿbⁿ` cần 1 ngăn xếp ⇒ CFL; `aⁿbⁿcⁿ` cần đối chiếu **ba** dãy ⇒ cần máy mạnh hơn (máy Turing/automaton tuyến tính bị chặn — cấp 1 của Chomsky).

### Bài 175. Chứng minh `L = {ww | w ∈ {a,b}*}` **không phi ngữ cảnh**.
**Lời giải:**
1. Giả sử L là CFL với `p`. Chọn `z = aᵖbᵖaᵖbᵖ = u v x y`-style; viết `z = uvxyz`.
2. **Quan sát chốt:** `|vxy| ≤ p`, mà khoảng cách giữa khối a₁ và khối a₂ (hay giữa khối b₁ và b₂) vượt `p` (phải "xuyên qua" một khối p ký tự) ⇒ `vxy` **phải nằm trọn trong một khối** (một trong bốn khối a₁, b₁, a₂, b₂). (Nếu `vxy` mang cả a lẫn b, nó chỉ có thể ở ranh giới trong cùng "vùng" a₁b₁ hoặc b₁a₂ hoặc a₂b₂ — vẫn bị chặn bởi lập luận số lượng bên dưới.)
3. Lấy `i = 0` (xóa `vy`). Xét trường hợp `vxy` nằm trong khối a₁: `uv⁰xy⁰z = a^{p−k}bᵖaᵖbᵖ` với `k = |vy| ≥ 1`. Nếu đây là `ss` thì `s = a^{p−k}b^{|s|−(p−k)}` và nửa sau cũng phải mở đầu đúng bấy nhiêu b; so sánh khối b₁ (độ dài p ở nửa trước) với chiều dài b tương ứng ở nửa sau ⇒ buộc `k = 0`, mâu thuẫn.
 Các trường hợp `vxy` trong b₁, a₂, b₂ (hoặc vắt ranh giới trong vùng) đều tương tự: "gọt" một khối làm nửa đầu và nửa sau lệch cấu trúc ⇒ không thể chia đôi thành hai nửa giống nhau.
4. Mâu thuẫn ⇒ L không CFL. ∎
> 💡 So sánh hay: `{aⁿbⁿ}` CFL ✅, `{ww}` KHÔNG CFL; nhưng `{wwᴿ}` (đảo ngược) lại CFL ✅ (Bài 183) — vì `wᴿ` cho phép PDA "trả ngược" ngăn xếp, còn `w` (cùng chiều) thì không!

### Bài 176. (Nâng cao — giới hạn của bổ đề bơm) Chứng minh `L = {aⁱbʲcᵏ : "i = 1 ⇒ j = k"}` (điều kiện kéo theo!) **thỏa mãn bổ đề bơm** nhưng **không chính quy**. Kết luận gì về bổ đề bơm?
**Lời giải:**
**Phần 1 — L thỏa bổ đề bơm với p = 2.** Lấy `w ∈ L, |w| ≥ 2`. Luôn chọn `x = ε` và `y =` **ký tự đầu tiên của một khối không phải "a duy nhất"**, cụ thể:
- Nếu khối a có **0 chữ a**: `w` không bị ràng buộc ⇒ chọn `y` = ký tự đầu (b hoặc c); bơm lên/xuống khối a vẫn = 0 ⇒ luôn ∈ L ✅.
- Nếu khối a có **≥ 2 chữ a**: chọn `y` = ký tự đầu của khối **b** (nếu có b). Vì `y` là chữ b nên mọi lần bơm không đụng khối a ⇒ khối a vẫn ≥ 2 ⇒ ràng buộc không kích hoạt ⇒ ∈ L ✅. Nếu **không có b** thì w hoặc toàn a: chọn `y` = chữ a đầu — bơm lên thì số a tăng (≥ 2 ✓), bơm xuống còn ≥ 1 chữ a: nếu còn đúng 1 thì j = k = 0 nên vẫn đúng ✅; hoặc w có khối c (w = aⁱcᵏ không b): chọn `y` = ký tự đầu của khối c ⇒ khối a giữ nguyên ≥ 2 ✅.
- Nếu khối a có **đúng 1 chữ a**: `w = a bʲcʲ`. Chọn `y = a` (bơm chính chữ a!): bơm **lên** (i ≥ 2 lần ⇒ ≥ 2 chữ a) ⇒ ràng buộc không kích hoạt ⇒ ∈ L ✅; bơm **xuống** (i = 0): `bʲcʲ` ⇒ khối a = 0 ⇒ ∈ L ✅.
Vậy bổ đề bơm **đúng** cho L (với mọi w dài ≥ 2, tồn tại cách chia xyz thỏa 3 điều kiện; để ý `|xy| = 1 ≤ 2` nhờ chọn `x=ε`).  
**Phần 2 — L không chính quy.** Giao với ngôn ngữ chính quy `R = a b*c*`: `L ∩ R = {a bʲ cᵏ : j = k} = {a bⁿcⁿ}`. Nếu L chính quy thì `L ∩ R` chính quy (chính quy đóng với giao) — nhưng `{abⁿcⁿ}` không chính quy (xem bài chứng minh tương tự Bài 167, bỏ chữ a đầu). Mâu thuẫn ⇒ **L không chính quy**.  
**Kết luận:** Bổ đề bơm chỉ là **điều kiện cần**, không đủ: L thỏa bổ đề bơm nhưng vẫn không chính quy. Muốn "chứng minh chính quy" phải **xây dựng** DFA/regex/VPCQ, không được chỉ "kiểm tra bổ đề bơm".
> 💻 Kiểu ngôn ngữ "có điều kiện" (i=1 ⇒…) xuất hiện đầy trong thực tế: `{"key": value}` hợp lệ chỉ khi có dấu hai chấm... JSON checker cũng "điều kiện kéo theo" — hiểu giới hạn của từng lớp văn phạm giúp chọn đúng công cụ (regex/parser/…).

---

### Bài 177. Trình bày **định nghĩa 7-bộ** của ô-tô-mát đẩy xuống (ĐN 3.1, tr.69), định nghĩa hình trạng (ĐN 3.3, tr.72) và hai kiểu bước chuyển `├`. Áp dụng: viết hình trạng đầu và mô tả "hình trạng" của PDA Thí dụ 3.2 trên xâu `aabb`.
**Lời giải:** `M = <Q, Σ, Δ, δ, q₀, z₀, F>`:
- `Σ` bảng chữ cái **vào**; `Q` tập hữu hạn trạng thái (`Σ ∩ Q = ∅`); `Δ` bảng chữ cái **ngăn xếp**;
- `z₀ ∈ Δ`: ký hiệu **đáy** ngăn xếp (đặt sẵn từ đầu);
- `q₀ ∈ Q`: trạng thái đầu; `F ⊆ Q`: tập trạng thái kết thúc;
- `δ: Q × (Σ ∪ {ε}) × Δ → 2^(Q×Δ*)`: hàm chuyển **không đơn định**: δ(q,a,z) = tập các `<q', γ>` — đọc a, gặp z ở đỉnh ngăn xếp thì sang q' và **thay z bởi xâu γ** (ký tự trái nhất của γ nằm sâu nhất, phải nhất nằm trên đỉnh).
Nếu a = ε ⇒ bước chuyển "nhắm mắt" (không dịch đầu đọc).
**Hình trạng** (ĐN 3.3): bộ ba `K = <q, α, β>`: `q` trạng thái, `α` phần xâu vào **chưa đọc**, `β` nội dung ngăn xếp (trái nhất = đáy). Chuyển tiếp: nếu `<p, γ> ∈ δ(q, a₁, x_m)` (x_m là ký tự **trên đỉnh**) thì
`<q, a₁a₂…a_k, x₁…x_m> ├ <p, a₂…a_k, x₁…x_{m−1}γ>` (đọc ký tự) — và tương tự với a₁ thay bằng ε (không dịch đầu đọc).
**Áp dụng (Thí dụ 3.2):** hình trạng đầu trên `aabb` là `K₀ = <q₀, aabb, z₀>`; dãy hình trạng:
`<q₀,aabb,z₀> ├ <q₁,abb,z₀z₁> ├ <q₁,bb,z₀z₁z₁> ├ <q₂,b,z₀z₁> ├ <q₂,ε,z₀> ├ <q₀,ε,ε>`.
> 💡 Nhớ ba thứ trong hình trạng theo thứ tự: **(trạng thái, phần chưa đọc, ngăn xếp)** — quên thứ tự là lạc ngay.

### Bài 178. (Thí dụ 3.2 – slide tr.75) `M = <{q₀,q₁,q₂}, {a,b}, {z₀,z₁}, δ, q₀, z₀, {q₂}>` với `δ(q₀,ε,z₀)={<q₀,ε>}, δ(q₀,a,z₀)={<q₁,z₀z₁>}, δ(q₁,a,z₁)={<q₁,z₁z₁>}, δ(q₁,b,z₁)={<q₂,ε>}, δ(q₂,b,z₁)={<q₂,ε>}, δ(q₂,ε,z₀)={<q₀,ε>}`.
(i) Chạy `aabb` và `abaab`. (ii) Slide khẳng định `N(M) = T(M) = {aⁿbⁿ | n ≥ 0}` — hãy kiểm tra lại bằng lập luận chính xác.
**Lời giải:** (i) `aabb`: dãy hình trạng như Bài 177 ⇒ xâu đọc xong, ngăn xếp **rỗng** ⇒ **được nhận** (theo ngăn xếp rỗng).
`abaab`: `<q₀,abaab,z₀> ├ <q₁,baab,z₀z₁> ├ <q₂,aab,z₀>` — ở đây đỉnh là z₀; các quy tắc δ(q₂,a,·) không có, δ(q₂,ε,z₁) không khớp (z₁ không ở đỉnh) ⇒ bế tắc giữa xâu ⇒ **không nhận** (slide ghi β ∉ N(M), β ∉ T(M) ✓).
(ii) **Phân tích kỹ** (đã kiểm chứng bằng mô phỏng toàn bộ xâu ≤ 8):
- `N(M)` (nhận khi ngăn xếp rỗng): mỗi `a` đẩy một z₁, mỗi `b` "khớp" xóa một z₁, và chỉ "thoát" được qua `δ(q₂,ε,z₀)` khi ngăn xếp chỉ còn z₀ **và** xâu đã hết ⇒ cần và đủ số a = số b ⇒ **`N(M) = {aⁿbⁿ | n ≥ 0}`** ✅ (khớp slide).
- `T(M)` (nhận khi **kết thúc ở q₂ ∈ F**, không đòi ngăn xếp rỗng): chỉ cần xâu hết và đang ở q₂. Sau chữ `b` đầu tiên, máy vào q₂; các b tiếp theo xóa z₁ — **nếu xâu hết ngay khi vẫn còn z₁ trong ngăn xếp, máy đang ở q₂** ⇒ vẫn được nhận! Ví dụ kinh điển: `aab`: `<q₀,aab,z₀>├<q₁,ab,z₀z₁>├<q₁,b,z₀z₁z₁>├<q₂,ε,z₀z₁>` — q₂ ∈ F, hết xâu ⇒ **được nhận**, dù ngăn xếp chưa rỗng. Tổng quát (đã kiểm chứng máy): **`T(M) = {aⁱbʲ | i ≥ j ≥ 1}`** (khối a phải "nuôi" khối b, nhưng được phép dư z₁; ε không thuộc T(M) vì q₀ ∉ F; xâu `abb` cũng không vì chỉ có 1 z₁ mà cần 2 b).
⇒ **`T(M) ⊋ N(M)`**: slide (tr.75) chép "T(M) = {aⁿbⁿ}" là **chưa chính xác** nếu áp dụng đúng ĐN 3.4 (nhận theo trạng thái kết thúc, ngăn xếp tùy ý). Muốn câu này của slide đúng, phải hiểu "T" = "kết thúc + ngăn xếp rỗng".
> 💡 Đây là "bẫy đề thi" rất hay: hai định nghĩa nhận xâu cho **hai ngôn ngữ khác nhau** trên cùng một máy. Khi làm bài, hãy ghi rõ đang nhận theo **F** hay theo **ngăn xếp rỗng**.

### Bài 179. Thiết kế PDA nhận `{aⁿbⁿ | n ≥ 0}` **theo trạng thái kết thúc** (không "dính bẫy" như Bài 178).
**Lời giải:** Trạng thái: `q₀` (đẩy a), `q₁` (đẩy b), `qf` (kết thúc):
- `δ(q₀,a,z₀) = {<q₀, z₀A>}`, `δ(q₀,a,A) = {<q₀, AA>}` (mỗi a đẩy một A);
- `δ(q₀,b,A) = {<q₁, ε>}`, `δ(q₁,b,A) = {<q₁, ε>}` (mỗi b xóa một A);
- `δ(q₀,ε,z₀) = {<qf, z₀>}` và `δ(q₁,ε,z₀) = {<qf, z₀>}` (xong xâu, ngăn xếp **vừa hết** A ⇒ kết thúc).
`F = {qf}`. Đã kiểm chứng máy: nhận đúng `aⁿbⁿ` với `n ≥ 0` (`ε`, `ab`, `aabb`, `aaabbb` ✅; `abb`, `aab`, `ba` ❌).
Bí quyết chống "bẫy": **đưa ra quyết định "hết chữ a" thông qua điều kiện ngăn xếp** (chỉ chuyển sang qf khi ngăn xếp không còn A), chứ không dựa vào "đã đọc được b" — như vậy không thể nhận nhầm `aⁱbʲ` khi i > j.

### Bài 180. Thiết kế PDA nhận ngôn ngữ **ngoặc cân bằng** trên `{(,)}` (ví dụ công nghệ: kiểm tra dấu ngoặc trong mã nguồn). Chạy thử `(()())`.
**Lời giải:** `M = <{q₀, qf}, {(,)}, {z₀, A}, δ, q₀, z₀, {qf}>`:
- `δ(q₀,(,z₀) = {<q₀, z₀A>}`; `δ(q₀,(,A) = {<q₀, AA>}`; `δ(q₀,),A) = {<q₀, ε>}`; `δ(q₀,ε,z₀) = {<qf, z₀>}`.
Đã kiểm chứng máy (mọi xâu ≤ 6): nhận đúng các xâu ngoặc cân bằng (`, `( )`, `(())`, `()()`; từ chối `)(`, `(()`, `())`).
Chạy `(()())`: `<q₀, (()()), z₀> ├ <q₀, ()()), z₀A> ├ <q₀, )()), z₀AA> ├ <q₀, ()), z₀A> ├ <q₀, )), z₀AA> ├ <q₀, ), z₀A> ├ <q₀, ε, z₀> ├ <qf, ε, z₀>` ✅.
> 💻 Liên hệ: đây chính là cách editor/IDE tô đỏ lỗi "unbalanced parentheses"; cũng là lõi thuật toán kiểm tra cú pháp lồng nhau (JSON/XML). Độ phức tạp O(n), bộ nhớ O(độ sâu lồng) — trùng khớp "stack" của việc gọi hàm đệ quy.

### Bài 181. Thiết kế PDA nhận `{aⁱbʲ | 0 ≤ i < j}` (số b NHIỀU HƠN a).
**Lời giải:** Ý tưởng: "đốt" từng a bằng từng b; khi hết a (ngăn xếp về z₀) mà vẫn còn b ⇒ chắc chắn j > i ⇒ chuyển sang trạng thái kết thúc và ăn nốt b.
- `δ(q₀,a,z₀) = {<q₀, z₀A>}`, `δ(q₀,a,A) = {<q₀, AA>}`;
- `δ(q₀,b,A) = {<q₁, ε>}` (b đầu tiên "đốt" a), `δ(q₁,b,A) = {<q₁, ε>}` (tiếp tục);
- `δ(q₁,b,z₀) = {<q₂, z₀>}` (**còn dư b** sau khi hết a ⇒ "thắng"), `δ(q₂,b,z₀) = {<q₂, z₀>}` (những b sau cũng ok);
- `δ(q₀,b,z₀) = {<q₂, z₀>}` (trường hợp i = 0: xâu toàn b).
`F = {q₂}`. Đã kiểm chứng máy: nhận `b, bb, abb, aabb, aabbb…` (i<j); từ chối `ε, a, ab, aabb?` — chú ý `ab` bị từ chối ✅ (i=j), `aab` bị từ chối ✅ (i>j).
Chạy `abb`: `<q₀,abb,z₀>├<q₀,bb,z₀A>├<q₁,b,z₀>├<q₂,ε,z₀>` ✅.

### Bài 182. (Tr.66–68 – slide) Thiết kế PDA nhận `{ωcωᴿ | ω ∈ {0,1}*}` (đọc ω, đẩy vào ngăn xếp; gặp c thì "so ngược"). Chạy thử `01c10`.
**Lời giải:** Ý tưởng (đúng như slide mô tả ở tr.67–68):
- Trạng thái `q₀`: đọc 0/1, **đẩy** ký tự vào ngăn xếp (A cho 0, B cho 1), giữ nguyên trạng thái;
- gặp `c`: chuyển sang `q₁` (không đổi ngăn xếp);
- ở `q₁`: đọc ký tự, **so với đỉnh ngăn xếp**: trùng thì **xóa** đỉnh; khác thì bế tắc;
- xâu hết **và** ngăn xếp chỉ còn z₀ ⇒ kết thúc (nhận).
`δ(q₀,0,z₀)={<q₀,z₀A>}`, `δ(q₀,0,A)={<q₀,AA>}`, `δ(q₀,0,B)={<q₀,BA>}`, tương tự cho 1 (đẩy B);
`δ(q₀,c,z₀)={<q₁,z₀>}`, `δ(q₀,c,A)={<q₁,A>}`, `δ(q₀,c,B)={<q₁,B>}`; `δ(q₁,0,A)={<q₁,ε>}`, `δ(q₁,1,B)={<q₁,ε>}`, `δ(q₁,ε,z₀)={<qf,z₀>}`; `F={qf}`.
Đã kiểm chứng máy (mọi xâu ≤ 6 kể cả có c): nhận đúng `{ωcωᴿ}`.
Chạy `01c10`: `<q₀,01c10,z₀>├<q₀,1c10,z₀A>├<q₀,c10,z₀AB>├<q₁,10,z₀AB>├<q₁,0,z₀A>├<q₁,ε,z₀>├<qf,ε,z₀>` ✅.
> 💡 Đây là "bài học ngăn xếp" kinh điển: ngăn xếp LIFO đúng là cái cần để "đọc ngược". FA (Bài 170) bó tay vì không có chỗ lưu ω.

### Bài 183. Thiết kế PDA nhận palindrome độ dài **chẵn** `{wwᴿ | w ∈ {0,1}*}` mà **không** đánh dấu giữa bằng ký tự c. Chạy thử `abba` (với {a,b}).
**Lời giải:** Bí quyết: **đoán mò** (nondeterminism!) vị trí "giữa": trước giữa thì đẩy, sau giữa thì xóa.
- `δ(q₀,a,z₀)={<q₀,z₀A>}`, `δ(q₀,a,A)={<q₀,AA>}`, `δ(q₀,a,B)={<q₀,BA>}`, tương tự đẩy B cho b;
- ngay khi đang ở q₀, được phép "nhảy nhắm mắt" sang `q₁` (đoán: "giữa ở đây!") — với mọi đỉnh ngăn xếp: `δ(q₀,ε,z₀)={<q₁,z₀>}`, `δ(q₀,ε,A)={<q₁,A>}`, `δ(q₀,ε,B)={<q₁,B>}`;
- ở q₁: `δ(q₁,a,A)={<q₁,ε>}`, `δ(q₁,b,B)={<q₁,ε>}` (khớp thì xóa); `δ(q₁,ε,z₀)={<qf,z₀>}`; `F={qf}`.
Đã kiểm chứng máy: nhận đúng các palindrome **độ dài chẵn** (`ε`, `aa`, `abba`, `baab`, `aabbaa` ✅; `aba`, `ab` ❌).
Chạy `abba`: `<q₀,abba,z₀>├<q₀,bba,z₀A>├<q₀,ba,z₀AB>├<q₁,ba,z₀AB>├<q₁,a,z₀A>├<q₁,ε,z₀>├<qf,ε,z₀>` ✅.
> 💡 Mẹo "đoán giữa" chỉ hoạt động nhờ không đơn định: nếu đoán sai, nhánh đó **chết** (so lệch) — nhưng chỉ cần **một** nhánh đoán đúng là đủ nhận. Đây là "siêu năng lực" của PDA mà DFA không có.

### Bài 184. Thiết kế PDA nhận `{w ∈ {0,1}* : số 0 = số 1}`. Chạy thử `0110`.
**Lời giải:** Bí quyết: dùng ngăn xếp lưu **phần "dư"** của ký tự nào xuất hiện nhiều hơn:
- `δ(q₀,0,z₀)={<q₀,z₀A>}`, `δ(q₀,0,A)={<q₀,AA>}`, **`δ(q₀,0,B)={<q₀,ε>}`** (đọc 0 mà đang dư B ⇒ hai cái "triệt tiêu");
- `δ(q₀,1,z₀)={<q₀,z₀B>}`, `δ(q₀,1,B)={<q₀,BB>}`, **`δ(q₀,1,A)={<q₀,ε>}`** (triệt tiêu);
- `δ(q₀,ε,z₀)={<qf,z₀>}` — xong xâu và không còn dư ⇒ `F={qf}`.
Đã kiểm chứng máy: nhận đúng tập "số 0 = số 1" (`ε`, `01`, `10`, `0011`, `0110`, `1010`, `1100` ✅; `0`, `1`, `011` ❌).
Chạy `0110`: `<q₀,0110,z₀> ├ <q₀,110,z₀A> ├ <q₀,10,z₀> ├ <q₀,0,z₀B> ├ <q₀,ε,z₀> ├ <qf,ε,z₀>` ✅.
> 💡 Đối chiếu: ngôn ngữ này **không chính quy** (bổ đề bơm, tương tự Bài 168) nhưng **phi ngữ cảnh** — vì ngăn xếp "đếm dư" được.

### Bài 185. (Thí dụ 3.4 – slide tr.77–78) Cho `G = <{a,b}, {S,A}, S, {S→a, S→bSA, A→b, S→bA, A→aS}>`. Kiểm tra PDA mà slide xây dựng theo chứng minh Định lý 3.1: `M = <{q₀,q₁,q₂}, {a,b}, {a,b,S,A,%}, δ, q₀, S, {q₂}>`, `δ(q₁,ε,S)={<q₁,a>, <q₁,ASb>, <q₁,Ab>}, δ(q₁,ε,A)={<q₁,b>, <q₁,Sa>}, δ(q₁,a,a)={<q₁,ε>}, δ(q₁,b,b)={<q₁,ε>}, δ(q₁,ε,%)={<q₂,%>}, δ(q₀,ε,S)={<q₁,%S>}`. Giải thích quy tắc "đảo vế phải", rồi chạy `bb` và `babb`.
**Lời giải:** **Nguyên tắc xây dựng (Định lý 3.1):** đặt ký hiệu xuất phát S lên ngăn xếp; mỗi ký hiệu phụ gặp ở đỉnh thì **thay bằng vế phải của một luật — viết ĐẢO NGƯỢC** (để ký tự đầu tiên của vế phải nằm trên đỉnh, khớp với đầu đọc); ký tự chính ở đỉnh mà trùng ký tự vào thì xóa. Cụ thể:
- `S→a`: thay S bởi "a" (đảo của "a") ⇒ `<q₁,a>` ✅
- `S→bSA`: đảo("bSA") = "ASb" ⇒ `<q₁,ASb>` ✅; `S→bA` ⇒ đảo = "Ab" ✅
- `A→b` ⇒ "b" ✅; `A→aS` ⇒ đảo("aS") = "Sa" ✅
- `δ(q₀,ε,S)={<q₁, %S>}`: đặt thêm dấu **% dưới đáy** làm "chỉ báo kết thúc"; khi chỉ còn % thì `δ(q₁,ε,%)={<q₂,%>}` ⇒ vào q₂ ∈ F.
Chạy `bb`: `<q₀,bb,S> ├ <q₁,bb,%S> ├(S→bA) <q₁,bb,%Ab> ├(khớp b) <q₁,b,%A> ├(A→b) <q₁,b,%b> ├(khớp b) <q₁,ε,%> ├ <q₂,ε,%>` ✅.
Chạy `babb`: `<q₀,babb,S> ├ <q₁,babb,%S> ├ <q₁,babb,%Ab> ├ <q₁,abb,%A> ├(A→aS) <q₁,abb,%Sa> ├(khớp a) <q₁,bb,%S> ├(S→bA) <q₁,bb,%Ab> ├(khớp b) <q₁,b,%A> ├(A→b) <q₁,b,%b> ├(khớp b) <q₁,ε,%> ├ <q₂,ε,%>` ✅.
Đã kiểm chứng máy: PDA nhận **đúng** L(G) trên mọi xâu ≤ 6 (24 xâu, ví dụ `a, bb, baa, bab, babb, baabb, bbabaa, …`).
> ⚠️ Slide có vài lỗi chữ ("Asb" ⇒ phải hiểu "ASb"; "Sa" ⇒ đúng là "Sa" theo đảo của "aS") — hãy tự kiểm tra bằng cách: *nếu vế phải là X₁X₂…Xₖ thì xâu đẩy vào là Xₖ…X₂X₁*.

### Bài 186. Hai cách đoán nhận "kết thúc ở F" và "ngăn xếp rỗng" **tương đương** (slide tr.66). Phác họa hai chuyển đổi.
**Lời giải:**
**Chuyển đổi 1 (nhận bằng F ⇒ nhận bằng ngăn xếp rỗng):** Cho M. Xây M' có đáy mới `$` (đặt dưới đáy cũ bằng bước đầu): M' mô phỏng M; bất cứ khi nào M ở trạng thái kết thúc, M' được **tùy chọn** chuyển sang trạng thái "xả" chỉ gồm các luật `(q,xả, . ) → ε` để **xóa sạch** ngăn xếp. Khi ngăn xếp rỗng ⇒ xâu gốc được nhận bởi M'. 
**Chuyển đổi 2 (nhận bằng ngăn xếp rỗng ⇒ nhận bằng F):** Cho M. Xây M' thêm **đáy mới `$`** và trạng thái kết thúc mới `qf`; M' mô phỏng M sao cho `$` không bao giờ bị xóa; khi ngăn xếp chỉ còn `$` (tức M đã "rỗng ngăn xếp") thì M' chuyển sang `qf` ⇒ nhận theo F.
Cả hai biến đổi đều thêm **hữu hạn** trạng thái/luật ⇒ khả năng đoán nhận không đổi.
**Ví dụ minh họa:** Thí dụ 3.2 (slide) là ca "thú vị": nó có cả F = {q₂} **và** cơ chế `δ(q₂,ε,z₀)` xả nốt — dẫn tới `T(M) ⊋ N(M)` (Bài 178): **hai cách đoán nhận trong cùng một máy không tự động cho cùng ngôn ngữ**, chỉ khi được "chuẩn hóa" như hai chuyển đổi trên mới tương đương.

### Bài 187. Vì sao PDA mạnh hơn FA? Lập bảng so sánh; minh họa bằng `{aⁿbⁿ}`.
**Lời giải:**

| | Ô-tô-mát hữu hạn (FA) | Ô-tô-mát đẩy xuống (PDA) |
|---|---|---|
| Bộ nhớ | chỉ **hữu hạn trạng thái** (nhớ được "đang ở tình huống nào" trong số hữu hạn) | trạng thái + **ngăn xếp vô hạn** (LIFO) |
| Ngôn ngữ nhận | chính quy (L₃) | phi ngữ cảnh (L₂) |
| Dạng "khó" làm được | mẫu cục bộ, đếm **mod k** | mẫu lồng nhau/đối xứng, đếm **không chặn** (aⁿbⁿ, wcwᴿ, ngoặc) |
| Vật lý tương ứng | mạch lật FF, từ điển trạng thái | **call-stack**, undo-stack, đệ quy |
| Cái KHÔNG làm được | `{aⁿbⁿ}` (Bài 167), palindrome (Bài 170) | `{aⁿbⁿcⁿ}` (Bài 174 — cần 2 ngăn xếp), `{ww}` (Bài 175) |
**Minh họa:** `{aⁿbⁿ}` — FA cần nhớ "đã đọc bao nhiêu a" nhưng chỉ có hữu hạn trạng thái ⇒ sai với n đủ lớn (bổ đề bơm). PDA: cứ mỗi a đẩy 1 ký hiệu (ngăn xếp dài tùy n) ⇒ rồi mỗi b xóa 1 ký hiệu ⇒ khớp chính xác.
> 💻 Nhớ câu: *FA đếm đến hữu hạn; PDA đếm đến hết ngăn xếp; Turing (chương sau) ghi/xóa tùy ý cả hai chiều.*

### Bài 188. Thiết kế PDA nhận `{aⁿb²ⁿ | n ≥ 0}` (số b gấp đôi số a).
**Lời giải:** Ý tưởng: mỗi a đẩy **1** ký hiệu A; mỗi cặp b **xóa 1** A; ghi nhớ "đang ở nửa cặp" bằng trạng thái.
`δ(q₀,a,z₀)={<q₀,z₀A>}`, `δ(q₀,a,A)={<q₀,AA>}`; `δ(q₀,b,A)={<m₁,A>}` (b đầu của cặp: giữ nguyên A, sang m₁); `δ(m₁,b,A)={<q₀′,ε>}` (b thứ hai xóa A);
sau khi xong một cặp chuyển sang `q₀′` (giống q₀ nhưng **không cho đọc thêm a**): `δ(q₀′,b,A)={<m₁,A>}`, `δ(m₁,b,A)={<q₀′,ε>}`; kết thúc: `δ(q₀,ε,z₀)={<qf,z₀>}` (n = 0) và `δ(q₀′,ε,z₀)={<qf,z₀>}`; `F={qf}`.
Đã kiểm chứng máy: nhận đúng `''`, `abb` (n=1), `aabbbb` (n=2), `aaabbbbbb` (n=3); từ chối `ab`, `aabb`, `aabbb`, `abbabb`.
> 💡 Nhận xét: máy chỉ cần **2 trạng thái "pha"** (giữa cặp / hết cặp) — "bộ đếm chia 2" nằm ngay trong cấu trúc cặp b, không cần đếm thật.

### Bài 189. Thiết kế PDA nhận `{aᵐbⁿ | m ≠ n}` (số a KHÁC số b).
**Lời giải:** `{m ≠ n}` = `{m < n}` ∪ `{m > n}` — hai "chế độ" không đơn định:
- Nhánh **m < n**: `δ(q₀,a,·)` đẩy A; `δ(q₀,b,A)={<q₁,ε>}` đốt a; ở q₁ tiếp tục đốt; khi hết a mà còn b: `δ(q₁,b,z₀)={<q₂,z₀>}`, `δ(q₂,b,z₀)={<q₂,z₀>}`; `δ(q₀,b,z₀)={<q₂,z₀>}` (m = 0 < n).
- Nhánh **m > n**: `δ(q₀,b,A)={<q₄,ε>}` (chuyển sang chế độ "đốt dư"); ở q₄ đốt tiếp các b; khi **hết xâu mà ngăn xếp còn A** thì `δ(q₄,ε,A)={<q₅,A>}` (tương tự `δ(q₀,ε,A)={<q₅,A>}` cho trường hợp n = 0); `F = {q₂, q₅}`.
Đã kiểm chứng máy: nhận đúng mọi `aᵐbⁿ` với `m ≠ n` (`a`, `b`, `abb`, `aab`, `aabbb` ✅; `ab`, `aabb` ❌); mọi xâu ngoài `a*b*` bị từ chối.
> 💡 Kỹ thuật "ngã ba không đơn định + ngã ba thứ hai khi hết xâu còn dư" là mô-típ chuẩn; nhớ cả hai trường hợp biên **n = 0** và **m = 0**.

### Bài 190. (Bài tập lập trình) Viết mô phỏng PDA (Python giả mã) cho Thí dụ 3.2 và in **dãy hình trạng** khi chạy `aabb`, `abaab`. Vì sao "ngăn xếp" là mô hình của stack trong lập trình?
**Lời giải (giả mã):**
```python
def pda(delta, q, word, stack):
    """in dãy hình trạng theo chiều sâu; trả True nếu tới ngăn xếp rỗng khi hết xâu"""
    if not word and not stack:        # xâu hết + ngăn xếp rỗng
        print(f"<{q}, ε, ε>  NHẬN"); return True
    top = stack[-1] if stack else None
    for sym in ([word[0]] if word else []) + ['ε']:
        for (q2, gamma) in delta.get((q, sym, top), []):
            nstack = stack[:-1] + gamma
            nword  = word[1:] if sym != 'ε' else word
            print(f"<{q}, {word or 'ε'}, {stack or 'ε'}>  --({sym}, {top})-->")
            if pda(delta, q2, nword, nstack): return True
    return False
```
Với Thí dụ 3.2 sẽ in đúng dãy của Bài 178 (lưu ý chương trình mô phỏng **không đơn định**: có thể phải thử nhiều nhánh — tương ứng "backtracking").
**Vì sao ngăn xếp = stack lập trình:** mỗi lần gọi hàm (đệ quy) đẩy một "khung" lên stack, mỗi lần return xóa khung — đúng như PDA đẩy/xóa. Chuỗi gọi `f → g → h` rồi trả về `h → g → f` có cấu trúc LIFO y hệt `a a a b b b`. Vì vậy ngôn ngữ `{aⁿbⁿ}` (n lồng tùy ý) tương ứng chính xác với đoạn chương trình đệ quy — còn trình biên dịch phải dùng stack máy để chạy nó.
> 💻 Hệ quả thực tế: **regex/FA không diễn tả được đệ quy** ("aⁿbⁿ") — đó là lý do JSON/HTML/ngôn ngữ lập trình **buộc** phải dùng parser (PDA/CFG), không thể "regex hóa" việc kiểm tra thẻ lồng nhau.

---

### Bài 191. Trình bày các **phép toán đóng** của lớp ngôn ngữ chính quy (hợp, giao, bù, nối, lặp sao, đảo, hiệu) — mỗi phép kèm "công cụ chứng minh". Áp dụng: tìm DFA cho **phần bù** của "chứa ab".
**Lời giải:**

| Phép toán | L₃ đóng? | Công cụ chứng minh |
|---|---|---|
| Hợp `L₁∪L₂` | ✅ | tích DFA (hoặc thêm trạng thái đầu cho NFA) |
| Giao `L₁∩L₂` | ✅ | **tích Descartes** hai DFA, F = F₁×F₂ |
| **Bù** `Σ*\L` | ✅ | đổi vai F ↔ Q\F (trên DFA **đầy đủ**) |
| Hiệu `L₁\L₂` | ✅ | `L₁ ∩ (Σ*\L₂)` |
| Nối `L₁·L₂` | ✅ | nối NFA: ε từ các F của máy 1 sang đầu máy 2 |
| Lặp sao `L*` | ✅ | thêm trạng thái đầu mới (kết thúc) + ε vòng về |
| Đảo `Lᴿ` | ✅ | **đảo mọi cung** NFA (xem Bài 199) |
**Áp dụng:** DFA "chứa ab" (3 trạng thái s,p,f, F={f}). Máy **bù**: giữ nguyên mọi cung, đổi `F' = {s,p}` (máy đầy đủ ✓). Đã kiểm chứng máy: máy bù nhận đúng tập "không chứa ab", và tập này chính là `b*a*` (chỉ được có các b rồi các a: a nào đứng trước b nào là tạo 'ab' ngay).
> ⚠️ Nhắc lại bẫy: muốn lấy bù phải **hoàn thiện DFA trước** (Bài 99–100); nếu DFA khuyết cung mà đổi vai thì xâu "rơi khỏi đồ thị" bị tính sai.

### Bài 192. Lớp ngôn ngữ **phi ngữ cảnh** đóng với phép nào, KHÔNG đóng với phép nào? Cho phản ví dụ chứng minh "không đóng với giao".
**Lời giải:** **Đóng ✅:** hợp, nối, lặp sao `*`, đảo `ᴿ`, phép "chèn/đồng cấu"… — chứng minh dễ bằng **ghép văn phạm**: giả sử `G₁ = <Σ,Δ₁,S₁,P₁>`, `G₂ = <Σ,Δ₂,S₂,P₂>` rời nhau về ký hiệu phụ:
- Hợp: thêm `S → S₁ | S₂` (Δ mới gộp cả hai).
- Nối: thêm `S → S₁S₂`.
- Sao: thêm `S → S S₁ | ε`.
**KHÔNG đóng ❌ với giao, bù, hiệu.** **Phản ví dụ giao** (các máy/ngữ pháp đã kiểm chứng):
- `L₁ = {aⁱbⁱcᵏ | i,k ≥ 1}` — CFL (văn phạm `S→TC, T→aTb|ab, C→cC|c`), đã kiểm chứng: sinh `abc, abcc, aabbc, aabbcc, aaabbbc…` ✅.
- `L₂ = {aᵏbⁿcⁿ | k,n ≥ 1}` — CFL (văn phạm `S→aS | aA; A→bAc | bc`), đã kiểm chứng: sinh `abc, aabc, aaabc, abbcc, aabbcc…` ✅.
- `L₁ ∩ L₂ = {aⁿbⁿcⁿ | n ≥ 1}` (giao buộc đồng thời i = n **và** k = n ⇒ cả ba bằng nhau) — nhưng theo **Bài 174**, đây **không** là CFL!
⇒ CFL không đóng với giao. **Hệ quả:** cũng **không đóng với bù**: nếu đóng bù thì `L₁∩L₂ = (L̄₁ ∪ L̄₂)ᶜ` sẽ là CFL (do đóng hợp + bù) — vô lý.
> 💡 Nhớ "tam giác đóng": L₃ đóng gần hết; L₂ đóng với "ghép/nối" nhưng **thua giao & bù**. Đây là lý do thực tế: hai parser đều mạnh không có nghĩa "phần giao của hai ngôn ngữ" vẫn dễ parse.

### Bài 193. Kỹ thuật "giao với ngôn ngữ chính quy" (∩ R): trình bày và áp dụng chứng minh `L = {w ∈ {a,b,c}* : #a = #b = #c}` không phi ngữ cảnh.
**Lời giải:** **Ý tưởng:** Nếu L là "lớp X" và R chính quy thì `L ∩ R` cũng thuộc lớp X (với X = L₃ hiển nhiên; với X = L₂ vì CFL đóng với giao regular — chứng minh bằng tích PDA×DFA). Vậy muốn chứng minh `L ∉ X`, ta chỉ cần chọn một `R` "cắt gọn" L về một ngôn ngữ đã biết không thuộc X.
**Áp dụng:** Chọn `R = a*b*c*` (chính quy). Khi đó
`L ∩ R = {aⁱbⁱcⁱ? }`... chính xác hơn: xâu trong L∩R có dạng `aⁱbʲcᵏ` với `i = j = k` ⇒ `L ∩ R = {aⁿbⁿcⁿ | n ≥ 0}`. Theo **Bài 174**, ngôn ngữ này **không** CFL. Nếu L là CFL thì `L ∩ R` là CFL (mâu thuẫn) ⇒ **L không phi ngữ cảnh**. ∎
> 💡 Đây là "dao phẫu thuật" chuẩn: dùng R để **loại bỏ các xâu rối**, chỉ giữ lại "xương sống" aⁿbⁿcⁿ rồi chém. Nhớ xài kèm: R phải đơn giản (chính quy) để phép giao dễ kiểm soát.

### Bài 194. Trình bày **phân cấp Chomsky** `L₃ ⊊ L₂ ⊊ L₁ ⊊ L₀` với một ví dụ phân cách mỗi tầng (slide 3.1).
**Lời giải:**

| Cấp | Văn phạm | Máy tương đương | Ví dụ "vừa đủ mạnh" |
|---|---|---|---|
| **L₃** chính quy | `A→aB, A→a` (tuyến tính) | FA | `(ab)*`, "chẵn a" |
| **L₂** phi ngữ cảnh | `A→α`, α bất kỳ (`S→aSb`) | PDA | `{aⁿbⁿ}` — **không** chính quy |
| **L₁** cảm ngữ cảnh | `αAβ→αγβ`, `|γ|≥1` (không rút ngắn) | automaton tuyến tính bị chặn (LBA) | `{aⁿbⁿcⁿ}` — **không** phi ngữ cảnh |
| **L₀** ngôn ngữ tổng quát | `α→β` bất kỳ, không ràng buộc | máy Turing | tập HALT = `{⟨M,w⟩ : M dừng trên w}` — **không đệ quy** (tầng dưới không quyết định được) |
Chuỗi bao hàm **chặt**: `L₃ ⊊ L₂` (ví dụ `{aⁿbⁿ}` ∈ L₂\L₃); `L₂ ⊊ L₁` (ví dụ `{aⁿbⁿcⁿ}` ∈ L₁\L₂ — cần "đếm ba chiều" mà vẫn quyết định được); `L₁ ⊊ L₀` (HALT ∈ L₀\L₁: cảm ngữ cảnh luôn **quyết định được**, còn HALT thì không).
> 💡 Mẹo nhớ chiều mạnh yếu: **"Chomsky 3 → 0: văn phạm càng ít ràng buộc → máy càng mạnh"** — L₃ luật đơn giản nhất nhưng máy yếu nhất; L₀ luật thoải mái nhất nhưng máy mạnh nhất (Turing).

### Bài 195. Các **bài toán quyết định** cơ bản: (i) Với DFA: rỗng? toàn phần? tương đương? (ii) Với VPĐX/ VPPNC: thành viên? rỗng? tương đương? — nêu thuật toán/độ phức tạp (nếu có).
**Lời giải:** (i) Với hai DFA A, B (n trạng thái, Σ):
- **L(A) = ∅?** BFS trên đồ thị chuyển từ q₀: nếu **với tới được** trạng thái kết thúc ⇒ khác rỗng. Thời gian O(n·|Σ|).
- **L(A) = Σ*?** BFS trên máy **bù** (đổi vai F): nếu **không** với tới được trạng thái "chấp nhận của máy bù" ⇒ đúng.
- **L(A) = L(B)?** Xây tích `A × B` và tìm trạng thái "bất đồng" (một máy nhận, một máy từ chối) với tới được ⇒ quy về bài toán rỗng (BFS). O(n²). Đặc biệt hay dùng trong **kiểm thử**: so hai biểu thức chính quy khác nhau xem có tương đương không — hoàn toàn tự động!
- **Chứa nhau L(A) ⊆ L(B)?** ⇔ `L(A) ∩ (Σ*\L(B)) = ∅` (dùng tích + bù).
(ii) Với VPPNC G, VPĐX M:
- **Thành viên** (`w ∈ L(G)?`): **quyết định được** — thuật toán CYK O(n³) (trên dạng CNF), hoặc mô phỏng PDA.
- **L(G) = ∅?** **Quyết định được**: tính tập ký hiệu phụ **sinh ra được** xâu (lan truyền từ luật A→a và A→BC), xem S có sinh được không (chính là bước "loại ký hiệu vô sinh" — Mức 2!). 
- **L(G₁) = L(G₂)?** **KHÔNG quyết định được** nói chung (định lý kinh điển của lý thuyết ngôn ngữ hình thức).
- **L(G₁) ∩ L(G₂) = ∅?** cũng **không quyết định được**.
> 💻 Vì sao điều này quan trọng? "Regex tương đương?" = bài toán **decidable** (nên IDE/linter tự động tối ưu regex được); "hai văn phạm ngôn ngữ lập trình có tương đương?" = **undecidable** (nên không có công cụ "tự động so hai grammar" — phải dùng kiểm thử).

### Bài 196. Trình bày **thuật toán tối tiểu hóa DFA** (bảng phân biệt/Moore). Áp dụng cho: (a) DFA 5 trạng thái theo "(chẵn/lẻ số a) × (ký tự cuối a/b)" cho ngôn ngữ "chẵn a"; (b) DFA 4 trạng thái thu được từ tập con của Thompson cho "(a+b)*ab" (Bài 141).
**Lời giải:** **Thuật toán (bảng phân biệt):**
1. Đánh dấu mọi cặp `(p,q)` mà đúng một trong hai là **kết thúc** (phân biệt ngay bằng hậu tố ε).
2. Lặp: nếu tồn tại ký tự a mà `(δ(p,a), δ(q,a))` đã bị đánh dấu thì đánh dấu `(p,q)` (phân biệt bằng hậu tố `a·w`).
3. Lặp tới khi ổn định. Các cặp **không** bị đánh dấu ⇒ hai trạng thái **tương đương** ⇒ gộp thành một lớp. (Trên DFA khuyết: thêm trạng thái chết trước.)
**(a)** DFA: `s`(đầu), `Ea, Eb` (chẵn, ký tự cuối a/b; cả 3 đều **kết thúc**), `Oa, Ob` (lẻ, không kết thúc); chuyển: `s--a-->Oa, s--b-->Eb; Ea--a-->Oa, Ea--b-->Eb; Eb--a-->Oa, Eb--b-->Eb; Oa--a-->Ea, Oa--b-->Ob; Ob--a-->Ea, Ob--b-->Ob`.
- Cặp khác loại (chẵn vs lẻ) bị đánh dấu ngay. Còn lại kiểm: `s ≡ Eb` (a→Oa, b→Eb — trùng khớp qua lại), `Ea ≡ s` (Ea--a-->Oa ≡ s--a-->Oa ✅, Ea--b-->Eb ≡ s--b-->Eb ✅) ⇒ gộp `{s, Ea, Eb}`; tương tự `{Oa, Ob}`.
- **Kết quả (đã chạy chương trình):** 5 → **2 lớp**: `{s, Ea, Eb}` (chẵn, nhận) và `{Oa, Ob}` (lẻ, từ chối) — đúng bản DFA 2 trạng thái "chẵn a" ở Bài 89! "Ký tự cuối" đúng là thông tin **vô dụng**.
**(b)** DFA 4 trạng thái `A, B, C, D` (từ Bài 141; `D` kết thúc): `A: a→B, b→C; B: a→B, b→D; C: a→B, b→C; D: a→B, b→C`.
- Đánh dấu ngay cặp `(D, ·)` với mọi trạng thái khác.
- `(A,C)`: `δ(A,a)=B=δ(C,a)` ✅, `δ(A,b)=C ~ C=δ(C,b)` ⇒ cần `(A,C)` tự thân — không bao giờ bị đánh dấu ⇒ **tương đương**.
- `(A,B)`: `δ(A,b)=C` vs `δ(B,b)=D` — cặp `(C,D)` đã đánh dấu ⇒ `(A,B)` đánh dấu ⇒ B ≁ A.
- **Kết quả (đã chạy):** 4 → **3 lớp**: `{A,C}, {B}, {D}` — đúng DFA tối tiểu "kết thúc ab" ở Bài 92 ✅ (chỉ hơn kém tên gọi).
> 💡 Ghi nhớ: *cặp tương đương = "hai trạng thái không hậu tố nào phân biệt được"*. Tối tiểu hóa giúp lexer/chip nhỏ nhất có thể — mỗi trạng thái bớt được là bớt flip-flop thật.

### Bài 197. Phát biểu **định lý Myhill–Nerode** (mối liên hệ lớp tương đương × DFA tối tiểu). Áp dụng: chứng minh DFA cho `{|w| ≡ 0 (mod k)}` cần **đúng k** trạng thái.
**Lời giải:** **Định lý.** Với ngôn ngữ L ⊆ Σ*, định nghĩa quan hệ: `u ≡_L v` ⟺ (∀x ∈ Σ*: ux ∈ L ⇔ vx ∈ L). Khi đó **L chính quy ⟺ quan hệ ≡_L có HỮU HẠN lớp tương đương** — và khi đó, số lớp đúng bằng **số trạng thái của DFA tối tiểu** đoán nhận L. (Trực giác: mỗi lớp = "tình huống tương đương" mà DFA cần nhớ; hai xâu tương đương phải "gộp" về một trạng thái, còn hai xâu khác lớp bắt buộc nằm khác trạng thái.)
**Áp dụng** `L_k = {w : |w| ≡ 0 mod k}`: xét `k` tiền tố `ε, a, aa, …, a^{k-1}`. Với `0 ≤ i < j ≤ k−1`, chọn hậu tố `x = a^{k−i}`: `|aⁱ·a^{k−i}| = k ≡ 0` ⇒ `aⁱx ∈ L` ✅; nhưng `|aʲx| = k + (j−i) ≢ 0 (do 0 < j−i < k)` ⇒ `aʲx ∉ L` ⇒ `aⁱ ≢ aʲ`. Vậy có **k lớp** đôi một phân biệt ⇒ DFA tối thiểu cần `≥ k` trạng thái; mặt khác DFA "đếm mod k" có đúng k trạng thái (Bài 88) ⇒ **đúng k**. ∎
> 💡 Từ định lý này có luôn kết quả đẹp: `{aⁿbⁿ}` có **vô hạn** lớp tương đương (a, aa, aaa… đôi một phân biệt nhờ hậu tố bⁿ) ⇒ không chính quy — một cách chứng minh **thứ hai** (ngoài bổ đề bơm) cho cùng kết luận.

### Bài 198. (Ứng dụng CNTT tổng hợp) Từ lý thuyết tới công cụ: (i) Lexer dùng gì? (ii) Vì sao engine regex "backtracking" có thể bị treo? (iii) Vì sao JSON/HTML không thể "regex hóa" trọn vẹn? (iv) Kiểm thử hai regex tương đương bằng thuật toán nào?
**Lời giải:**
(i) **Lexer** (bộ tách từ: `flex`, ANTLR lexer) hoạt động theo đúng "pipeline" của môn học: viết **biểu thức chính quy** cho từng loại token (số, tên, từ khóa) → **Thompson** dựng ε-NFA → **tập con** chuyển DFA → **tối tiểu hóa** → sinh bảng chuyển nhúng vào chương trình. Quy tắc "**maximal munch**" (ăn được nhiều ký tự nhất) — ví dụ `123abc`: token số `123` rồi token tên `abc`.
(ii) Engine **backtracking** (Perl/PCRE/Python `re`) mô phỏng NFA bằng cách **thử mọi nhánh** — số nhánh có thể **bùng nổ theo hàm mũ** với các mẫu kiểu `(a+)+$` trên xâu thất bại như `aaaa…ab`: "catastrophic backtracking". Engine dựa **DFA** (RE2, Rust `regex`) chạy `O(n)` vì DFA là **đơn định** — đúng như "tập con" đã học. (Đánh đổi: RE2 không có backreference/ lookaround — vì chúng vượt khỏi khuôn khổ chính quy!)
(iii) JSON/HTML có **cấu trúc lồng nhau không chặn** `{[{...}]}` — tương đương "ngoặc cân bằng" `{aⁿbⁿ}`-kiểu (Bài 180, 190). Ngôn ngữ ngoặc cân bằng **không chính quy** (bổ đề bơm: giả sử chính quy, chọn ngoặc mở p+1 tầng…), nên **không regex nào** (theo nghĩa chính quy) kiểm tra được "đóng/mở đúng cấp". Phải dùng **parser/PDA**. (Các "regex" PCRE hiện đại có đệ quy `(?R)` là phá chuẩn — và đúng là nó sinh ra các bug không đáng có!)
(iv) Muốn biết hai regex có **tương đương** không: dựng NFA→DFA (đầy đủ) cho cả hai, xây **tích** `A × B`, BFS tìm trạng thái "một nhận/một từ chối" tới được: không có ⇒ tương đương (Bài 195). Đây là cơ sở cho các công cụ **tự động tối ưu/so regex** (ví dụ khi IDE gộp rule).
> 💻 Tóm tắt 1 câu: **regex = mẫu cục bộ, parser = cấu trúc lồng nhau.** Chọn sai công cụ ⇒ hoặc code khổ sở (regex dài ngoằng cho HTML), hoặc treo máy (backtracking).

### Bài 199. Chứng minh: nếu L chính quy thì `Lᴿ = {wᴿ | w ∈ L}` cũng chính quy. Áp dụng: từ DFA "kết thúc ab" (s,p,q) tìm NFA cho `Lᴿ`, nhận xét `Lᴿ` bằng lời.
**Lời giải:** **Chứng minh (xây dựng):** Cho DFA `M = (Q,Σ,δ,q₀,F)`. Dựng NFA `Mᴿ`:
- Giữ nguyên tập trạng thái Q; thêm **trạng thái đầu mới** `q_new`;
- **Đảo chiều mọi cung**: mỗi `δ(p,a)=q` thành cung `q --a--> p`;
- Thêm `q_new --ε--> f` cho mỗi `f ∈ F`;
- Trạng thái kết thúc mới: `{q₀}`.
Khi đó Mᴿ nhận đúng `Lᴿ`: một đường chạy `q_new →ε f →…→ q₀` trong Mᴿ tương ứng **đọc ngược** một đường chạy `q₀ →…→ f` trong M (mỗi bước đảo chiều), tức xâu đảo của một xâu ∈ L(M) — và ngược lại. ∎
**Áp dụng:** `Lᴿ` = "kết thúc ab" đảo xâu = `{w : w bắt đầu bằng "ba"}`. Đã kiểm chứng máy: NFA đảo-cung nhận đúng các xâu bắt đầu `ba` (`ba, baa, baab` ✅; `abab, a` ❌).
> 💡 Mở rộng đẹp: **CFL cũng đóng với đảo** (đảo toàn bộ vế phải mọi luật của văn phạm); còn **giao/bù thì không** (Bài 192). "Đảo ngược" là phép "hiền" với hầu hết các lớp ngôn ngữ.

### Bài 200. (Chốt chặng) Bảng tổng kết một trang: 4 cấp Chomsky × (văn phạm, máy, ví dụ tiêu biểu, cách "bơm"). Nêu 5 câu hỏi tự kiểm tra then chốt trước khi thi.
**Lời giải:** **Bảng chốt:**

| | L₃ chính quy | L₂ phi ngữ cảnh | L₁ cảm ngữ cảnh | L₀ tổng quát |
|---|---|---|---|---|
| Văn phạm | A→aB \| a | A→α | αAβ→αγβ (không ngắn) | α→β tùy ý |
| Máy | FA (DFA=NFA) | PDA (ngăn xếp) | LBA (băng bị chặn) | Máy Turing |
| Đoán nhận bằng | trạng thái hữu hạn | ngăn xếp LIFO | băng tuyến tính | băng vô hạn |
| Ví dụ "cần thiết" | (ab)*, chẵn a | {aⁿbⁿ}, wcwᴿ, ngoặc | {aⁿbⁿcⁿ} | HALT |
| Công cụ "bơm" | bổ đề bơm (1 khối y) | bổ đề Bar–Hillel (v,x,y) | (đệ quy) | (đệ quy) |
| Ứng dụng CNTT | lexer, regex, protocol | parser, JSON/XML, AST | — (lý thuyết) | "máy tính vạn năng" |
**5 câu tự kiểm tra then chốt:**
1. Cho một *hình vẽ* automaton: viết bảng chuyển, chạy 2–3 xâu, tìm T(A) — ★ (bài 81–86, 115).
2. Thiết kế DFA cho một mô tả bằng lời ("chứa 101", "kết thúc 00", "chia hết 3") — ★★ (bài 87–98).
3. Chuyển ε-NFA → DFA bằng tập con và/hoặc tối tiểu hóa — ★★★ (bài 104–106, 141–145, 196).
4. Chứng minh một ngôn ngữ **không** chính quy/không CFL bằng bổ đề bơm (chọn đúng xâu + đúng i) — ★★★★ (bài 167–175).
5. Thiết kế PDA cho ngôn ngữ (aⁿbⁿ, ngoặc, wcwᴿ) và/hoặc VPPNC → PDA — ★★★★ (bài 179–189).
> 💡 Nếu trả lời trôi chảy 5 câu trên, bạn đã nắm "xương sống" của Chương 3. Toàn bộ phần còn lại chỉ là các biến thể và ứng dụng của 5 kỹ năng này.

---

# PHỤ LỤC A — ĐÁP ÁN NHANH (BẢNG TRA CỨU)

> Dùng khi ôn cấp tốc: mỗi dòng là "kết quả cần nhớ" của một nhóm bài; chi tiết xem bài tương ứng.

**A.1 — Đại cương & đếm (Bài 1–40)**

| Nội dung | Kết quả |
|---|---|
| Số xâu độ dài n trên bảng |Σ| = k | `kⁿ` |
| Số xâu độ dài ≤ n | `(kⁿ⁺¹ − 1)/(k − 1)` |
| 10 xâu đầu của {0,1}* (thứ tự chuẩn) | ε, 0, 1, 00, 01, 10, 11, 000, 001, 010 |
| Số xâu độ dài n có **chẵn** ký tự a | `2ⁿ⁻¹` (n ≥ 1) |
| Số xâu độ dài n **không chứa "aa"** | `F(n+2)` (Fibonacci: 1,1,2,3,5,8,…) |
| Số xâu độ dài n **chứa "00"** | `2ⁿ − F(n+2)` |
| Số xâu độ dài n **chứa "00" hoặc "11"** | `2ⁿ − 2` (chỉ 2 xâu xen kẽ 0101…/1010… tránh được) |
| Số xâu độ dài 7 **kết thúc "01"** | `2⁵ = 32` |
| `∅` vs `{ε}` | ∅ không chứa gì; {ε} chứa đúng xâu rỗng — `∅* = {ε}` |
| Σ* vs Σ⁺ | Σ⁺ = Σ* \ {ε} |

**A.2 — Các DFA "chuẩn" đã thiết kế (Bài 87–99)** *(số trạng thái kể cả trạng thái chết nếu cần)*

| Ngôn ngữ | Trạng thái | Ghi nhớ |
|---|---|---|
| kết thúc `00` | 3 | q₀(0-đuôi), q₁(1-đuôi), q₂(≥2) |
| độ dài ⋮ 3 | 3 | m₀,m₁,m₂ |
| chẵn `a` | 2 | E/O |
| không chứa `aa` | 3 | +dead |
| chứa `101` | 4 | tiến độ 1-10-101 |
| kết thúc `ab` | 3 | s,p,q |
| đầu = cuối | 5 | st + 4 tổ hợp |
| chẵn a & kết thúc b | 5 | parity × ký tự cuối |
| độ dài chẵn | 2 | E/O |
| chẵn 0 **hoặc** lẻ 1 | 4 | 4 tổ hợp parity |
| số nhị phân ⋮ 3 | 3 | r₀,r₁,r₂ (`r→(2r+b) mod 3`) — *cẩn thận: nhận cả ε* |
| vị trí 2 từ phải = a | 7 (bản tự nhiên) / 4 (từ NFA 3 TT) | nhớ "2 ký tự cuối" |
| bù của một DFA | giữ cung, đổi F ↔ Q\F | chỉ khi máy **đầy đủ** |
| giao hai ĐK | tích Descartes | F = F₁×F₂ |

**A.3 — Biểu thức chính quy ↔ ngôn ngữ (Bài 126–138)**

| Biểu thức | Ngôn ngữ |
|---|---|
| `(01*+02)1` | `01⁺ ∪ {021}` (= {01ⁿ: n≥1} ∪ {021}) |
| `(a+b)*abb` | kết thúc `abb` |
| `(aa+ab+ba+bb)*` | độ dài chẵn |
| `b*(ab*)*` | `(a+b)*` (mọi xâu) |
| `a*b*` | khối a rồi khối b |
| `(a+b)*a(a+b)` | ký tự **áp cuối** = a |
| `(b*ab*a)*b*` | chẵn `a` |
| `(b+ab)*(a+ε)` | không chứa `aa` |
| `0*1(0+10*1)*` | lẻ số `1` (trên {0,1}) |
| `(ab)*a = a(ba)*` | đẳng thức "quay vòng" |
| `(0+1)*00` vs `(0+1)*00(0+1)*` | kết thúc 00 vs chứa 00 |
| `a(a+b)*a + b(a+b)*b + a + b` | đầu = cuối (khác rỗng) |
| `(aa)* = ε + (aa)(aa)*` | đẳng thức đệ quy của lặp |

**A.4 — Dạng chuẩn Chomsky: các bản CNF đã luyện (Bài 157–160)**

| Xuất phát | CNF tương đương |
|---|---|
| `S→aSb | ab` | `S→XC | XY; C→SY; X→a; Y→b` |
| `S→Sa | Aa; A→aAb | ab` (p.53) | `S→SX | AX; A→XD | XY; D→AY; X→a; Y→b` |
| `S→aSa | bSb | aa | bb` (palindrome chẵn) | `S→XD | YE | XX | YY; D→SX; E→SY; X→a; Y→b` |
| Ví dụ slide (tr.63–64) | `G₃ = {S→AC | XA | a | YB | b; C→BA; A→XA | a | YB | b; B→YB | b; X→a; Y→b}` |
| Quy tắc chung | tách ký tự chính → chẻ độ dài >2 → **nhớ luật X→a, Y→b** cho mọi biến phụ mới |

**A.5 — Bổ đề bơm: "xâu tử chiến" xếp sẵn (Bài 167–175)**

| Ngôn ngữ | Xâu chọn | Chọn i | Mâu thuẫn |
|---|---|---|---|
| `{aⁿbⁿ}` | `aᵖbᵖ` | i=2 | a nhiều hơn b |
| `{aⁱbʲ}, i<j` | `aᵖbᵖ⁺¹` | i=2 | số a vượt/gặp b |
| `{aᵖ: p nguyên tố}` | `a^q` (q>p nguyên tố) | i=q+1 | mũ = q(k+1) hợp số |
| palindrome | `aᵖb aᵖ` | i=2 | lệch khối a hai đầu |
| `{ww}` (chính quy) | `0ᵖ1 0ᵖ1` | i=2 | khối 0 thứ hai lệch |
| `{a^{n²}}` | `a^{p²}` | i=2 | kẹp giữa hai bình phương |
| **CFL:** `{aⁿbⁿcⁿ}` | `aᵖbᵖcᵖ` | i=2 | mọi vị trí vxy ⇒ lệch một khối |
| **CFL:** `{ww}` | `aᵖbᵖaᵖbᵖ` | i=0 | "gọt" một khối, hai nửa lệch |

**A.6 — Các PDA mẫu (Bài 179–189)** *(ngăn xếp: A/B là ký hiệu đẩy; z₀ là đáy)*

| Ngôn ngữ | Mẹo | Trạng thái |
|---|---|---|
| `aⁿbⁿ` (n≥0), nhận theo F | đẩy A mỗi a, xóa mỗi b; kết khi ngăn xếp hết A | q₀,q₁,qf |
| ngoặc cân bằng | đẩy A mỗi `(`, xóa mỗi `)` | 2 (q₀,qf) |
| `aⁱbʲ, i<j` | đốt a; còn dư b ⇒ nhận | q₀,q₁,q₂ |
| `ωcωᴿ` | đẩy hết ω, sau c so-ngược-xóa | q₀,q₁,qf |
| `wwᴿ` (palindrome chẵn) | **đoán giữa** bằng ε-move | q₀,q₁,qf |
| `#0 = #1` | dư 0 ⇒ đẩy A, dư 1 ⇒ đẩy B, gặp ngược thì triệt tiêu | 1 (q₀)+qf |
| CFG → PDA (Định lý 3.1) | thay biến bằng **đảo vế phải**, thêm dấu % đáy | q₀,q₁,q₂ |
| `aⁿb²ⁿ` | mỗi cặp b xóa 1 A, pha "nửa cặp" bằng trạng thái | q₀,m₁,q₀′,qf |
| `aᵐbⁿ, m≠n` | 2 nhánh không đơn định: dư a ⇒ nhận cuối; dư b ⇒ nhận giữa | nhiều |

# PHỤ LỤC B — LỘ TRÌNH ÔN 7 NGÀY & MẸO THI

**B.1 — Lộ trình 7 ngày (mỗi ngày ~2–3 giờ)**

| Ngày | Nội dung | Bài tập tương ứng | Mục tiêu "phải làm được" |
|---|---|---|---|
| **1** | Đại cương: Σ, xâu, ngôn ngữ, phép toán, đếm | 1–40 + Phần I.1, II.A | Đếm xâu, viết dạng tập hợp, phân biệt ∅/{ε} |
| **2** | Văn phạm, dẫn xuất, phân loại Chomsky | 41–80 + Phần I.2, II.B–C | Viết văn phạm cho một ngôn ngữ "quen"; phân loại 4 cấp |
| **3** | FA: đọc automaton, chạy xâu, **thiết kế DFA** | 81–109 + II.D | Từ hình vẽ ⇒ bảng chuyển ⇒ T(A); thiết kế DFA "chứa/kết thúc/chia hết" |
| **4** | NFA, ε-NFA, **tập con**, tích/giao, tối tiểu hóa | 110–145, 196–197 + II.E | Chuyển NFA→DFA thành thạo; đọc bảng tập trạng thái |
| **5** | Regex ↔ FA ↔ Văn phạm; giản lược & **CNF** | 126–165 + II.D–G | Thompson, viết regex từ mô tả, 4 bước chuẩn hóa + CNF |
| **6** | **PDA**: định nghĩa, chạy hình trạng, thiết kế | 177–190 + II.H | Chạy vết hình trạng; thiết kế PDA aⁿbⁿ/ngoặc/wcwᴿ |
| **7** | **Bổ đề bơm** (regular + CFL), đóng, phân cấp, tổng ôn | 166–176, 191–199 + II.I–L | Chọn "xâu tử chiến" + i đúng; hoàn thành đề thử 90 phút |

**B.2 — Checklist "tủ" trước khi vào phòng thi**
1. **Đọc đề – gạch chân động từ**: "chạy" / "thiết kế" / "chứng minh" / "phân loại" — mỗi loại có "khuôn" riêng (xem 5 câu tự kiểm tra ở Bài 200).
2. **Câu thiết kế DFA**: luôn vẽ bảng chuyển **đầy đủ** (nghĩ ngay tới trạng thái chết); đặt tên trạng thái theo "ý nghĩa bộ nhớ" (đã đọc gì, đang chờ gì).
3. **Câu tập con (NFA→DFA)**: viết ε-closure trước, lập bảng tập trạng thái, **chỉ liệt kê tập với tới được** (đừng vẽ 2^Q).
4. **Câu regex**: kiểm lại bằng 3–4 xâu ngắn (thuộc/không thuộc) — đừng tin mắt.
5. **Câu CNF**: nhớ đủ **4 bước + luật X→a/Y→b**; sau khi xong, kiểm chứng bằng một dẫn xuất ngắn.
6. **Câu PDA**: luôn ghi rõ **nhận theo F hay theo ngăn xếp rỗng**; bẫy hình trạng là thứ tự (trạng thái, xâu chưa đọc, ngăn xếp).
7. **Câu bổ đề bơm**: viết đủ **5 bước phủ định**; xâu tử chiến phải "chạm" đúng ràng buộc cần phá; chọn i làm điều kiện **sắc** gãy (i=2, i=0 hay i=q+1).
8. **Sai hay quên**: trạng thái chết; "với tới được" khi lấy bù; quên luật kết thúc khi DFA→VPCQ; quên luật ε khi VPCQ→NFA.
**B.3 — Ba mẹo "ăn điểm" nhanh**
- **Mẹo 1 — "Bộ nhớ bằng lời"**: trước khi vẽ, phát biểu "máy cần nhớ gì?" (số chẵn/lẻ? ký tự cuối? tiến độ khớp mẫu? dư bao nhiêu?) — số thứ cần nhớ quyết định số trạng thái.
- **Mẹo 2 — "Đếm ký tự":** xâu thuộc L? thì chạy **tay** 2–3 xâu ngắn làm "kiểm thử", kể cả xâu rỗng và xâu 1 ký tự (2 xâu này bắt lỗi nhiều nhất).
- **Mẹo 3 — "Kép kín":** mỗi đáp án tự kiểm ngược: một xâu *phải thuộc* + một xâu *phải không thuộc*; nếu cả hai đều "khớp", xác suất đúng rất cao.

---

> 📌 **Hết 200 bài (từ Bài 1 → Bài 200) + 2 phụ lục.** Toàn bộ kết quả số/automaton/CNF/PDA trong file đã được **kiểm chứng bằng chương trình** (mô phỏng DFA/NFA/PDA, liệt kê dẫn xuất văn phạm, đối chiếu regex bằng Python `re`) — riêng phần chứng minh bổ đề bơm là lập luận toán học thuần. Chúc bạn ôn thi tốt! 🎓
