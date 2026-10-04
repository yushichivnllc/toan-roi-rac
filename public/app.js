(() => {
  'use strict';

  const STORAGE_KEY = 'roi-rac-study-studio-v1';
  const PAGE_SIZE = 10;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const viewLabels = {
    overview: 'Tổng quan',
    roadmap: 'Lộ trình 7 ngày',
    practice: 'Ngân hàng bài tập',
    notes: 'Sổ tay công thức',
    progress: 'Tiến độ của tôi',
  };

  const days = [
    {
      id: 1,
      title: 'Đại cương & phép đếm',
      subtitle: 'Bảng chữ cái, xâu, ngôn ngữ và phép toán trên ngôn ngữ.',
      time: '2–3 giờ',
      range: 'Bài 1–40',
      filter: 1,
      focus: 'Nắm thật chắc những viên gạch đầu tiên: Σ, xâu, ngôn ngữ, phép ghép và cách đếm.',
      formula: 'Σ* = Σ⁺ ∪ {ε}     ·     |Σⁿ| = |Σ|ⁿ',
      objectives: ['Phân biệt ∅ với {ε} và Σ* với Σ⁺.', 'Tính độ dài, phép ghép và số lượng xâu.', 'Mô tả một ngôn ngữ bằng tập hợp hoặc điều kiện.'],
      concept: 'Một ngôn ngữ hình thức là tập con của Σ*. Xâu rỗng ε luôn có độ dài 0 và thuộc Σ*, nhưng không thuộc Σ⁺.',
    },
    {
      id: 2,
      title: 'Văn phạm & phân loại Chomsky',
      subtitle: 'Dẫn xuất, ngôn ngữ sinh và bốn tầng văn phạm.',
      time: '2–3 giờ',
      range: 'Bài 41–80',
      filter: 2,
      focus: 'Xem văn phạm như một hệ thống viết lại: bắt đầu ở ký hiệu gốc, áp dụng quy tắc, sinh ra xâu.',
      formula: 'G = ⟨Σ, Δ, I, R⟩     ·     L₃ ⊂ L₂ ⊂ L₁ ⊂ L₀',
      objectives: ['Viết dẫn xuất đầy đủ và đọc ra L(G).', 'Phân loại chính quy, phi ngữ cảnh, cảm ngữ cảnh, ngữ cấu.', 'Nhớ mẹo: tự do → không co → đơn thân → tuyến tính.'],
      concept: 'Kiểm tra quy tắc từ loại mạnh nhất xuống: loại 3 cần dạng tuyến tính; loại 2 cần vế trái là một biến; loại 1 không giảm độ dài.',
    },
    {
      id: 3,
      title: 'Ô-tô-mát hữu hạn · DFA',
      subtitle: 'Đọc bảng chuyển, mô phỏng xâu và thiết kế máy trạng thái.',
      time: '2–3 giờ',
      range: 'Bài 81–109',
      filter: 3,
      focus: 'Trước khi vẽ DFA, hãy hỏi: máy cần nhớ điều gì để quyết định xâu có hợp lệ không?',
      formula: 'M = (Q, Σ, δ, q₀, F)     ·     nhận ⇔ δ*(q₀,w) ∈ F',
      objectives: ['Mô phỏng một xâu từng ký tự một.', 'Thiết kế DFA cho “chứa”, “kết thúc”, “chia hết”.', 'Hoàn thiện bảng chuyển, kể cả trạng thái chết.'],
      concept: 'DFA chỉ có hữu hạn trạng thái và không có bộ nhớ phụ. Tên trạng thái nên mô tả ý nghĩa cần ghi nhớ: parity, hậu tố hoặc tiến độ khớp mẫu.',
    },
    {
      id: 4,
      title: 'NFA, ε-NFA & phương pháp tập con',
      subtitle: 'Tính đóng, ε-closure, chuyển đổi NFA thành DFA.',
      time: '2–3 giờ',
      range: 'Bài 110–145, 196–197',
      filter: 3,
      focus: 'NFA và DFA có cùng sức mạnh biểu diễn; khác biệt nằm ở số trạng thái và cách tính chuyển.',
      formula: 'T₀ = ε-closure({q₀})     ·     Fᴰ = {T : T ∩ Fᴺ ≠ ∅}',
      objectives: ['Tính ε-closure trước và sau mỗi bước nếu có ε.', 'Gộp các trạng thái NFA thành một tập trạng thái DFA.', 'Chỉ lập các tập con đi tới được; xác định tập kết thúc.'],
      concept: 'Trong phép xây dựng tập con, một trạng thái DFA chính là một tập trạng thái NFA. Tập rỗng có thể đóng vai trò trạng thái chết.',
    },
    {
      id: 5,
      title: 'Regex, văn phạm & dạng chuẩn',
      subtitle: 'Thompson, chuyển đổi FA ↔ văn phạm và CNF.',
      time: '2–3 giờ',
      range: 'Bài 126–165',
      filter: 4,
      focus: 'Nhìn một ngôn ngữ từ ba góc: biểu thức chính quy, ô-tô-mát và văn phạm.',
      formula: 'A → BC  |  A → a     ·     ε → đơn → vô sinh → không đến được → CNF',
      objectives: ['Đọc regex đúng thứ tự ưu tiên: lặp, ghép, hợp.', 'Dùng Thompson để xây ε-NFA từ regex.', 'Đưa văn phạm về dạng chuẩn Chomsky đúng thứ tự.'],
      concept: 'Trong ký hiệu của giáo trình, dấu + là phép hợp. CNF cho phép A → BC hoặc A → a (ngoại lệ S → ε nếu ngôn ngữ chứa ε).',
    },
    {
      id: 6,
      title: 'PDA · máy có ngăn xếp',
      subtitle: 'Hình trạng, quy tắc đẩy/lấy và ngôn ngữ phi ngữ cảnh.',
      time: '2–3 giờ',
      range: 'Bài 177–190',
      filter: 5,
      focus: 'Thêm một ngăn xếp LIFO vào FA để máy có thể nhớ số lượng chưa biết trước.',
      formula: 'PDA = (Q, Σ, Γ, δ, q₀, z₀, F)     ·     aⁿbⁿ: push A / pop A',
      objectives: ['Ghi hình trạng theo đúng thứ tự: (trạng thái, xâu còn lại, ngăn xếp).', 'Thiết kế PDA cho aⁿbⁿ và ngoặc cân bằng.', 'Nêu rõ nhận theo trạng thái kết thúc hay ngăn xếp rỗng.'],
      concept: 'FA không thể nhớ số lượng a tùy ý; PDA dùng ngăn xếp để đẩy một ký hiệu cho mỗi a, rồi lấy ra cho mỗi b.',
    },
    {
      id: 7,
      title: 'Bổ đề bơm & tổng ôn',
      subtitle: 'Chứng minh, tính đóng, phân cấp và ứng dụng CNTT.',
      time: '2–3 giờ',
      range: 'Bài 166–176, 191–200',
      filter: 5,
      focus: 'Kết nối mọi mảnh ghép và luyện cách lập luận đủ chặt trong bài thi.',
      formula: 'w = xyz;  |xy| ≤ n;  |y| ≥ 1;  ∀i ≥ 0: xyⁱz ∈ L',
      objectives: ['Chọn xâu “khó xử” và xét mọi cách tách hợp lệ.', 'Phân biệt điều kiện cần với điều kiện đủ của bổ đề bơm.', 'Ôn tính đóng, Myhill–Nerode và phân cấp Chomsky.'],
      concept: 'Để chứng minh không chính quy, giả sử L chính quy, chọn w đủ dài, xét mọi cách tách xyz, rồi tìm i làm xâu bị bơm ra ngoài L.',
    },
  ];

  const quizBank = [
    {
      question: 'Với Σ = {a, b}, xâu nào KHÔNG thuộc Σ*?',
      options: ['abba', 'ε', 'aab', 'abca'],
      answer: 3,
      topic: 'Bảng chữ cái & xâu',
      explanation: 'Mọi ký tự của một xâu trong Σ* phải thuộc Σ. Chữ c không nằm trong {a, b}, nên “abca” không hợp lệ. Xâu rỗng ε thì luôn thuộc Σ*.',
    },
    {
      question: 'Ngôn ngữ {aⁿbⁿ | n ≥ 1} chứa xâu nào?',
      options: ['aabb', 'abab', 'abb', 'ba'],
      answer: 0,
      topic: 'Ngôn ngữ hình thức',
      explanation: 'aabb có đúng hai chữ a đứng trước hai chữ b, đúng dạng aⁿbⁿ với n = 2. “abab” sai hình dạng vì a và b bị xen kẽ.',
    },
    {
      question: 'Biểu thức chính quy (a+b)*abb mô tả ngôn ngữ nào?',
      options: ['Xâu bắt đầu bằng abb', 'Xâu kết thúc bằng abb', 'Xâu chứa đúng một abb', 'Chỉ xâu abb'],
      answer: 1,
      topic: 'Biểu thức chính quy',
      explanation: '(a+b)* cho phép một tiền tố bất kỳ trên {a,b}; hậu tố abb khóa ba ký tự cuối. Vì vậy ngôn ngữ gồm mọi xâu kết thúc bằng “abb”.',
    },
    {
      question: 'Văn phạm S → aSb | ε sinh ra ngôn ngữ nào?',
      options: ['{aⁿbⁿ | n ≥ 0}', '{aⁿbᵐ | n,m ≥ 0}', '{aⁿbⁿ | n ≥ 1}', 'Mọi palindrome trên {a,b}'],
      answer: 0,
      topic: 'Văn phạm phi ngữ cảnh',
      explanation: 'Mỗi lần dùng S → aSb sẽ thêm một a bên trái và một b bên phải. Quy tắc S → ε cho phép n = 0, nên L = {aⁿbⁿ | n ≥ 0}.',
    },
    {
      question: 'NFA và DFA có sức mạnh nhận dạng ngôn ngữ chính quy như thế nào?',
      options: ['NFA mạnh hơn DFA', 'DFA mạnh hơn NFA', 'Tương đương về sức mạnh', 'Không thể chuyển đổi qua lại'],
      answer: 2,
      topic: 'NFA → DFA',
      explanation: 'Mọi NFA đều có thể chuyển thành DFA tương đương bằng phương pháp tập con. Ngôn ngữ nhận bởi DFA và NFA là cùng một lớp; số trạng thái DFA có thể tăng đến 2ⁿ.',
    },
    {
      question: 'Muốn nhận ngôn ngữ {aⁿbⁿ | n ≥ 1}, mô hình nào phù hợp?',
      options: ['DFA', 'PDA', 'Regex thuần', 'Máy trạng thái 2 trạng thái'],
      answer: 1,
      topic: 'PDA & ngăn xếp',
      explanation: 'PDA có ngăn xếp để ghi nhớ số lượng a chưa được ghép. Đẩy một A cho mỗi a, rồi lấy một A ra cho mỗi b. Ngôn ngữ này không chính quy nên DFA không đủ.',
    },
    {
      question: 'Ký hiệu ∅* biểu diễn tập nào?',
      options: ['∅', '{ε}', '{∅}', 'Σ*'],
      answer: 1,
      topic: 'Bẫy ký hiệu',
      explanation: 'Phép lặp Kleene cho phép lặp 0 lần. Lặp ngôn ngữ rỗng 0 lần tạo ra đúng xâu rỗng, vì vậy ∅* = {ε}.',
    },
    {
      question: 'Dạng chuẩn Chomsky cho phép quy tắc nào?',
      options: ['A → BC hoặc A → a', 'AB → a', 'A → aBC', 'A → B'],
      answer: 0,
      topic: 'CNF',
      explanation: 'Trong CNF, mỗi quy tắc có dạng A → BC (hai biến) hoặc A → a (một terminal). Có thể cho phép S → ε nếu ngôn ngữ cần xâu rỗng.',
    },
  ];

  let state = loadState();
  let currentView = 'overview';
  let exerciseLevel = 0;
  let exerciseQuery = '';
  let exercisePage = 1;
  let exercisePages = 1;
  let exerciseResults = [];
  let exerciseRequestId = 0;
  let modalVersion = 0;
  let searchTimer = null;
  let toastTimer = null;
  let currentQuiz = null;
  let previousFocus = null;
  const exerciseCache = new Map();
  let exerciseCatalogPromise = null;

  function defaultState() {
    return {
      solvedExercises: [],
      completedDays: [],
      quizHistory: [],
      activity: {},
      challengeDate: '',
      challengeAnswer: null,
      challengeCorrect: false,
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return defaultState();
      return {
        ...defaultState(),
        ...saved,
        solvedExercises: Array.isArray(saved.solvedExercises) ? saved.solvedExercises : [],
        completedDays: Array.isArray(saved.completedDays) ? saved.completedDays : [],
        quizHistory: Array.isArray(saved.quizHistory) ? saved.quizHistory : [],
        activity: saved.activity && typeof saved.activity === 'object' ? saved.activity : {},
      };
    } catch (_error) {
      return defaultState();
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_error) { /* Storage may be unavailable in private mode. */ }
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function recordActivity(amount = 1) {
    const key = todayKey();
    state.activity[key] = Math.min(999, (Number(state.activity[key]) || 0) + amount);
    saveState();
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[character]));
  }

  function inlineMarkdown(value = '') {
    return escapeHtml(value)
      .replace(/``/g, '<code>ε</code>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>');
  }

  function renderMarkdown(markdown = '') {
    const lines = String(markdown).split(/\r?\n/);
    const html = [];
    let index = 0;
    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line) { index += 1; continue; }

      if (line.startsWith('```')) {
        const codeLines = [];
        index += 1;
        while (index < lines.length && !lines[index].trim().startsWith('```')) {
          codeLines.push(lines[index]);
          index += 1;
        }
        if (index < lines.length) index += 1;
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        continue;
      }

      if (/^\|.*\|$/.test(line)) {
        const tableLines = [];
        while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
          tableLines.push(lines[index].trim());
          index += 1;
        }
        const rows = tableLines
          .filter((row) => !/^\|?\s*:?-{2,}/.test(row))
          .map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()));
        if (rows.length) {
          const [head, ...body] = rows;
          html.push(`<div class="markdown-table-wrap"><table><thead><tr>${head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
        }
        continue;
      }

      const heading = line.match(/^(#{1,4})\s+(.*)$/);
      if (heading) {
        const level = Math.min(4, heading[1].length + 1);
        html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }

      if (/^---+$/.test(line)) { html.push('<hr>'); index += 1; continue; }

      if (/^>\s?/.test(line)) {
        const quote = [];
        while (index < lines.length && /^\s*>/.test(lines[index])) {
          quote.push(lines[index].replace(/^\s*>\s?/, '').trim());
          index += 1;
        }
        html.push(`<blockquote>${quote.map(inlineMarkdown).join('<br>')}</blockquote>`);
        continue;
      }

      const listMatch = line.match(/^\s*([-*+] |\d+\.\s)(.*)$/);
      if (listMatch) {
        const ordered = /^\d+\./.test(line);
        const items = [];
        while (index < lines.length) {
          const match = lines[index].trim().match(/^([-*+] |\d+\.\s)(.*)$/);
          if (!match || /^\d+\./.test(lines[index].trim()) !== ordered) break;
          items.push(`<li>${inlineMarkdown(match[2])}</li>`);
          index += 1;
        }
        const tag = ordered ? 'ol' : 'ul';
        html.push(`<${tag}>${items.join('')}</${tag}>`);
        continue;
      }

      const paragraph = [line];
      index += 1;
      while (index < lines.length && lines[index].trim() &&
        !/^#{1,4}\s/.test(lines[index].trim()) &&
        !/^\|.*\|$/.test(lines[index].trim()) &&
        !/^```/.test(lines[index].trim()) &&
        !/^>/.test(lines[index].trim()) &&
        !/^([-*+] |\d+\.\s)/.test(lines[index].trim()) &&
        !/^---+$/.test(lines[index].trim())) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    }
    return html.join('');
  }

  function animateIn(target, vars = {}) {
    if (!window.gsap || prefersReducedMotion || !target) return;
    window.gsap.fromTo(target,
      { y: 12, opacity: 0, ...vars.from },
      { y: 0, opacity: 1, duration: .42, ease: 'power2.out', stagger: .055, clearProps: 'transform,opacity', ...vars.to },
    );
  }

  function setView(name, options = {}) {
    if (!viewLabels[name]) return;
    currentView = name;
    document.querySelectorAll('[data-view-panel]').forEach((panel) => {
      const active = panel.dataset.viewPanel === name;
      panel.hidden = !active;
      panel.classList.toggle('is-visible', active);
    });
    document.querySelectorAll('.nav-link[data-view-target], .mobile-nav [data-view-target]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.viewTarget === name);
    });
    const title = document.getElementById('topbarCurrent');
    if (title) title.textContent = viewLabels[name];
    if (name === 'roadmap') renderRoadmap();
    if (name === 'progress') renderProgress();
    if (name === 'practice' && !options.skipExercises) loadExercises(true);
    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    const panel = document.querySelector(`[data-view-panel="${name}"]`);
    if (panel) animateIn(panel.querySelectorAll('[data-animate], .panel, .roadmap-day-card, .note-card'));
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    const label = document.getElementById('toastMessage');
    if (!toast || !label) return;
    label.textContent = message;
    toast.classList.add('is-visible');
    if (window.gsap && !prefersReducedMotion) {
      window.gsap.killTweensOf(toast);
      window.gsap.to(toast, { y: 0, opacity: 1, duration: .24, ease: 'power2.out' });
    } else {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      if (window.gsap && !prefersReducedMotion) {
        window.gsap.to(toast, { y: 12, opacity: 0, duration: .2, ease: 'power1.in', onComplete: () => toast.classList.remove('is-visible') });
      } else {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        toast.classList.remove('is-visible');
      }
    }, 2600);
  }

  function showModal(content) {
    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modalCard');
    const body = document.getElementById('modalContent');
    modalVersion += 1;
    if (backdrop.hidden) previousFocus = document.activeElement;
    body.innerHTML = content;
    backdrop.hidden = false;
    document.body.classList.add('modal-open');
    if (window.gsap && !prefersReducedMotion) {
      window.gsap.fromTo(modal, { y: 18, opacity: 0, scale: .985 }, { y: 0, opacity: 1, scale: 1, duration: .28, ease: 'power2.out' });
    }
    window.setTimeout(() => document.getElementById('modalClose')?.focus(), 30);
  }

  function closeModal() {
    const backdrop = document.getElementById('modalBackdrop');
    if (!backdrop || backdrop.hidden) return;
    modalVersion += 1;
    const finish = () => {
      backdrop.hidden = true;
      document.body.classList.remove('modal-open');
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
      previousFocus = null;
    };
    if (window.gsap && !prefersReducedMotion) {
      window.gsap.to(document.getElementById('modalCard'), { y: 8, opacity: 0, duration: .16, ease: 'power1.in', onComplete: finish });
    } else finish();
  }

  function getNextDay() {
    const complete = new Set(state.completedDays);
    return days.find((day) => !complete.has(day.id)) || days[days.length - 1];
  }

  function renderPreviewDays() {
    const container = document.getElementById('previewDays');
    const current = getNextDay();
    const visibleDays = days.slice(0, 3);
    container.innerHTML = visibleDays.map((day) => {
      const done = state.completedDays.includes(day.id);
      const isCurrent = !done && day.id === current.id;
      const status = done ? 'is-complete' : isCurrent ? 'is-current' : '';
      return `<article class="preview-day ${status}" role="button" tabindex="0" data-open-day="${day.id}" aria-label="Mở nội dung ngày ${day.id}: ${escapeHtml(day.title)}">
        <span class="preview-day-marker">${done ? '✓' : String(day.id).padStart(2, '0')}</span>
        <span class="preview-day-copy"><strong>${escapeHtml(day.title)}</strong><span>${escapeHtml(day.subtitle)}</span></span>
        <span class="preview-day-time">${done ? 'Đã xong' : day.time}</span>
      </article>`;
    }).join('');
    const suggestion = document.querySelector('.roadmap-footer > span:nth-child(2)');
    if (suggestion) suggestion.textContent = `Ngày ${current.id} · ${current.title}`;
  }

  function renderRoadmap() {
    const container = document.getElementById('roadmapList');
    if (!container) return;
    const complete = new Set(state.completedDays);
    const current = getNextDay();
    const percent = Math.round((state.completedDays.length / days.length) * 100);
    const value = document.getElementById('roadmapProgressValue');
    const label = document.getElementById('roadmapProgressLabel');
    const ring = document.getElementById('roadmapRing');
    if (value) value.textContent = `${percent}%`;
    if (label) label.textContent = `${state.completedDays.length} / 7 ngày hoàn thành`;
    if (ring) ring.style.strokeDashoffset = String(132 - (132 * percent / 100));

    container.innerHTML = days.map((day) => {
      const done = complete.has(day.id);
      const isCurrent = !done && day.id === current.id;
      const status = done ? 'HOÀN THÀNH' : isCurrent ? 'CHẶNG TIẾP THEO' : 'TRONG LỘ TRÌNH';
      const cardState = done ? 'is-complete' : isCurrent ? 'is-current' : '';
      return `<article class="roadmap-day-card ${cardState}">
        <div class="day-number-block"><span>NGÀY</span><strong>${String(day.id).padStart(2, '0')}</strong></div>
        <div class="roadmap-day-copy">
          <div class="roadmap-day-meta"><span class="day-status ${done ? 'is-done' : ''}">${done ? '✓ ' : ''}${status}</span><span>${escapeHtml(day.time)}</span></div>
          <h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.subtitle)}</p>
        </div>
        <div class="roadmap-day-actions"><span class="roadmap-exercise-range"><strong>${escapeHtml(day.range)}</strong><span>đọc &amp; luyện tập</span></span><button class="day-open-button" type="button" data-open-day="${day.id}" aria-label="Mở ngày ${day.id}">↗</button></div>
      </article>`;
    }).join('');
    renderPreviewDays();
  }

  function lessonMarkup(day) {
    const done = state.completedDays.includes(day.id);
    return `<div class="modal-eyebrow"><i></i>NGÀY ${String(day.id).padStart(2, '0')} · ${escapeHtml(day.range.toUpperCase())}</div>
      <h2 class="modal-title" id="modalTitle">${escapeHtml(day.title)}</h2>
      <p class="modal-subtitle">${escapeHtml(day.subtitle)}</p>
      <div class="modal-body-copy"><p>${escapeHtml(day.focus)}</p>
        <div class="lesson-formula">${escapeHtml(day.formula)}</div>
        <h3 class="lesson-objective-heading">Mục tiêu cần đạt</h3>
        <div class="lesson-objectives">${day.objectives.map((item, index) => `<div class="lesson-objective"><span>0${index + 1}</span><span>${escapeHtml(item)}</span></div>`).join('')}</div>
        <h3 class="lesson-objective-heading">Ý chính cần nhớ</h3><p>${escapeHtml(day.concept)}</p>
        <blockquote>${day.id === 1 ? 'Bẫy kinh điển: ∅ là ngôn ngữ rỗng; {ε} là ngôn ngữ có đúng một xâu — xâu rỗng.' : day.id === 2 ? 'Mẹo nhớ: “0 thì tự do, 1 thì không co, 2 thì đơn thân, 3 thì tuyến tính”.' : day.id === 3 ? 'Mẹo thiết kế: đặt tên trạng thái theo phần thông tin máy cần giữ lại, thay vì đặt tên tùy ý.' : day.id === 4 ? 'Đừng liệt kê toàn bộ 2^Q — chỉ tạo các tập con có thể tới được từ trạng thái đầu.' : day.id === 5 ? 'Kiểm tra lại thứ tự: ε → quy tắc đơn → vô sinh → không đến được → CNF.' : day.id === 6 ? 'Trong hình trạng PDA, luôn ghi: trạng thái, phần input chưa đọc, nội dung ngăn xếp.' : 'Bổ đề bơm là điều kiện cần. Không thể chứng minh tính chính quy chỉ bằng cách tìm một phép tách đẹp.'}</blockquote>
      </div>
      <div class="modal-action-row"><span class="modal-source">Nguồn: README.md · Lộ trình ôn tập 7 ngày</span><div><button class="button button-outline" type="button" data-practice-level="${day.filter}">Luyện ${escapeHtml(day.range)} <span>↗</span></button><button class="button ${done ? 'button-outline' : 'button-dark'}" type="button" data-complete-day="${day.id}">${done ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'} <span>${done ? '✓' : '→'}</span></button></div></div>`;
  }

  function openDay(dayId) {
    const day = days.find((item) => item.id === Number(dayId));
    if (!day) return;
    showModal(lessonMarkup(day));
  }

  function currentDayKey() { return todayKey(); }

  function renderChallenge() {
    const question = quizBank[0];
    const questionNode = document.getElementById('challengeQuestion');
    const optionsNode = document.getElementById('challengeOptions');
    const feedbackNode = document.getElementById('challengeFeedback');
    if (!questionNode || !optionsNode || !feedbackNode) return;
    questionNode.textContent = question.question;
    const hasAnswer = state.challengeDate === currentDayKey() && Number.isInteger(state.challengeAnswer);
    optionsNode.innerHTML = question.options.map((option, index) => {
      let classes = 'challenge-option';
      if (hasAnswer && index === question.answer) classes += ' is-correct';
      if (hasAnswer && index === state.challengeAnswer && index !== question.answer) classes += ' is-wrong';
      return `<button type="button" class="${classes}" data-challenge-answer="${index}" ${hasAnswer ? 'disabled' : ''}>${escapeHtml(option)}</button>`;
    }).join('');
    feedbackNode.className = 'challenge-feedback';
    if (hasAnswer) {
      feedbackNode.classList.add(state.challengeCorrect ? 'is-correct' : 'is-wrong');
      feedbackNode.textContent = state.challengeCorrect ? 'Chính xác! Mọi ký tự phải thuộc bảng chữ cái Σ.' : 'Chưa chính xác — chữ c không nằm trong Σ = {a, b}.';
    } else feedbackNode.textContent = '';
  }

  async function getExerciseCatalog() {
    if (!exerciseCatalogPromise) {
      exerciseCatalogPromise = fetch('/exercises.json')
        .then((response) => {
          if (!response.ok) throw new Error('Không thể tải bài tập.');
          return response.json();
        })
        .then((catalog) => {
          if (!Array.isArray(catalog)) throw new Error('Không thể tải bài tập.');
          return catalog;
        })
        .catch(() => {
          exerciseCatalogPromise = null;
          throw new Error('Không thể tải bài tập.');
        });
    }
    return exerciseCatalogPromise;
  }

  async function loadExercises(reset = false) {
    if (reset) {
      exercisePage = 1;
      exerciseResults = [];
    }
    const list = document.getElementById('exerciseList');
    const resultsCount = document.getElementById('exerciseResultsCount');
    const empty = document.getElementById('exerciseEmpty');
    const loadMore = document.getElementById('loadMoreExercises');
    if (!list || !resultsCount) return;
    const requestId = ++exerciseRequestId;
    list.classList.add('is-loading');
    resultsCount.textContent = 'Đang tải bài tập...';

    try {
      const catalog = await getExerciseCatalog();
      const query = exerciseQuery.trim().toLocaleLowerCase('vi');
      const filtered = catalog.filter((exercise) => {
        const matchesLevel = !exerciseLevel || exercise.level === exerciseLevel;
        const searchableText = [
          exercise.title,
          exercise.titleMarkdown,
          exercise.promptMarkdown,
          exercise.solutionMarkdown,
        ].join('\n').toLocaleLowerCase('vi');
        return matchesLevel && (!query || searchableText.includes(query));
      });
      const total = filtered.length;
      const pages = Math.ceil(total / PAGE_SIZE);
      const results = filtered.slice((exercisePage - 1) * PAGE_SIZE, exercisePage * PAGE_SIZE).map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        level: exercise.level,
        levelLabel: exercise.levelLabel,
        shortLevelLabel: exercise.shortLevelLabel,
        hasSolution: Boolean(exercise.solutionMarkdown),
      }));
      if (requestId !== exerciseRequestId) return;
      exercisePages = pages;
      exerciseResults = exercisePage === 1 ? results : [...exerciseResults, ...results];
      renderExerciseRows();
      resultsCount.textContent = total === 0
        ? '0 bài tập phù hợp'
        : `Hiển thị ${exerciseResults.length} / ${total} bài tập`;
      if (loadMore) loadMore.hidden = pages <= exercisePage;
      const hint = document.getElementById('paginationHint');
      if (hint) hint.textContent = total ? `${total} bài · ${pages} trang nội dung` : '';
      if (empty) empty.hidden = results.length > 0 || exercisePage > 1;
      const totalLabel = document.getElementById('practiceTotalLabel');
      if (totalLabel) totalLabel.textContent = `${total} bài tập phù hợp`;
    } catch (error) {
      if (requestId !== exerciseRequestId) return;
      resultsCount.textContent = 'Chưa thể tải bài tập';
      list.innerHTML = '<div class="solved-empty">Hãy tải lại trang để kết nối lại với thư viện bài tập.</div>';
      if (empty) empty.hidden = true;
      console.error(error);
    } finally {
      if (requestId === exerciseRequestId) list.classList.remove('is-loading');
    }
  }

  function renderExerciseRows() {
    const list = document.getElementById('exerciseList');
    if (!list) return;
    list.innerHTML = exerciseResults.map((exercise) => {
      const solved = state.solvedExercises.some((item) => item.id === exercise.id);
      return `<button type="button" class="exercise-row ${solved ? 'is-solved' : ''}" data-open-exercise="${exercise.id}" data-level="${exercise.level}">
        <span class="exercise-number">${String(exercise.id).padStart(3, '0')}</span>
        <span class="exercise-row-copy"><strong>${escapeHtml(exercise.title)}</strong><span>${solved ? '✓ Đã đánh dấu ôn tập' : 'Có lời giải chi tiết'} · Bài ${exercise.id}</span></span>
        <span class="exercise-level-tag">${escapeHtml(exercise.shortLevelLabel)}</span><span class="exercise-row-arrow">↗</span>
      </button>`;
    }).join('');
  }

  async function fetchExercise(id) {
    const numericId = Number(id);
    if (exerciseCache.has(numericId)) return exerciseCache.get(numericId);
    const catalog = await getExerciseCatalog();
    const exercise = catalog.find((item) => item.id === numericId);
    if (!exercise) throw new Error('Không tìm thấy bài tập này.');
    exerciseCache.set(numericId, exercise);
    return exercise;
  }

  function exerciseModalMarkup(exercise) {
    const solved = state.solvedExercises.some((item) => item.id === exercise.id);
    const prompt = exercise.promptMarkdown
      ? renderMarkdown(exercise.promptMarkdown)
      : `<p>${inlineMarkdown(exercise.titleMarkdown || exercise.title)}</p>`;
    const answer = exercise.solutionMarkdown
      ? renderMarkdown(exercise.solutionMarkdown)
      : '<p>Bài này chưa có lời giải tách riêng trong tài liệu.</p>';
    return `<div class="modal-eyebrow"><i></i>BÀI ${String(exercise.id).padStart(3, '0')} · ${escapeHtml(exercise.levelLabel.toUpperCase())}</div>
      <h2 class="modal-title" id="modalTitle">${inlineMarkdown(exercise.titleMarkdown || exercise.title)}</h2>
      <p class="modal-subtitle">${escapeHtml(exercise.shortLevelLabel)} · Nguồn: README.md</p>
      <div class="modal-body-copy"><h3>Đề bài</h3><div class="exercise-modal-question">${prompt}</div>
      <div class="modal-divider"></div><h3>Lời giải chi tiết ${solved ? '<span class="exercise-solved-tag">✓ ĐÃ ÔN</span>' : ''}</h3><div class="exercise-modal-solution">${answer}</div></div>
      <div class="modal-action-row"><span class="modal-source">Bài ${exercise.id} trong bộ 200 bài tập</span><div><button class="button ${solved ? 'button-outline' : 'button-dark'}" type="button" data-mark-exercise="${exercise.id}">${solved ? 'Bỏ đánh dấu' : 'Đánh dấu đã ôn'} <span>${solved ? '✓' : '→'}</span></button></div></div>`;
  }

  async function openExercise(id) {
    showModal('<div class="modal-eyebrow"><i></i>ĐANG MỞ BÀI TẬP</div><h2 class="modal-title" id="modalTitle">Một chút xíu nhé...</h2><p class="modal-subtitle">Đang tải đề bài và lời giải từ README.md.</p>');
    const requestVersion = modalVersion;
    try {
      const exercise = await fetchExercise(id);
      if (!document.getElementById('modalBackdrop').hidden && requestVersion === modalVersion) showModal(exerciseModalMarkup(exercise));
    } catch (error) {
      if (requestVersion === modalVersion) showModal(`<div class="modal-eyebrow"><i></i>THƯ VIỆN BÀI TẬP</div><h2 class="modal-title" id="modalTitle">Không mở được bài tập.</h2><p class="modal-subtitle">${escapeHtml(error.message)}</p>`);
    }
  }

  function toggleSolved(exerciseId) {
    const id = Number(exerciseId);
    const requestVersion = modalVersion;
    const wasSolved = state.solvedExercises.some((item) => item.id === id);
    if (wasSolved) {
      state.solvedExercises = state.solvedExercises.filter((item) => item.id !== id);
      saveState();
      renderExerciseRows();
      renderProgress();
      showToast('Đã bỏ đánh dấu bài tập.');
      return fetchExercise(id).then((exercise) => {
        if (!document.getElementById('modalBackdrop').hidden && requestVersion === modalVersion) showModal(exerciseModalMarkup(exercise));
      }).catch(() => {});
    }
    fetchExercise(id).then((exercise) => {
      state.solvedExercises.push({ id, title: exercise.title, level: exercise.level, levelLabel: exercise.levelLabel });
      state.solvedExercises.sort((a, b) => a.id - b.id);
      recordActivity();
      saveState();
      renderExerciseRows();
      renderProgress();
      showToast(`Bài ${id} đã được ghi nhận. Tốt lắm!`);
      if (!document.getElementById('modalBackdrop').hidden && requestVersion === modalVersion) showModal(exerciseModalMarkup(exercise));
    }).catch((error) => showToast(error.message));
  }

  function setExerciseFilter(level) {
    exerciseLevel = Number(level) || 0;
    document.querySelectorAll('[data-level-filter]').forEach((button) => {
      button.classList.toggle('is-selected', Number(button.dataset.levelFilter) === exerciseLevel);
    });
    loadExercises(true);
  }

  function startQuiz() {
    const shuffled = [...quizBank].sort(() => Math.random() - .5);
    currentQuiz = { questions: shuffled.slice(0, 5), index: 0, score: 0, answered: false };
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    if (!currentQuiz) return;
    const question = currentQuiz.questions[currentQuiz.index];
    const progress = Math.round((currentQuiz.index / currentQuiz.questions.length) * 100);
    const letters = ['A', 'B', 'C', 'D'];
    showModal(`<div class="modal-eyebrow"><i></i>MINI QUIZ · ÔN TẬP CHƯƠNG 3</div>
      <div class="quiz-progress"><span>CÂU ${currentQuiz.index + 1} / ${currentQuiz.questions.length}</span><div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${progress}%"></div></div><span>${currentQuiz.score} ĐÚNG</span></div>
      <h2 class="quiz-question" id="modalTitle">${escapeHtml(question.question)}</h2><span class="quiz-topic">${escapeHtml(question.topic.toUpperCase())}</span>
      <div class="quiz-options">${question.options.map((option, index) => `<button class="quiz-option" type="button" data-quiz-answer="${index}"><span class="option-letter">${letters[index]}</span><span>${escapeHtml(option)}</span></button>`).join('')}</div>
      <div class="quiz-explanation" id="quizExplanation" aria-live="polite"></div><div class="quiz-next-row" id="quizNextRow" hidden><button class="button button-dark" type="button" id="quizNextButton">${currentQuiz.index === currentQuiz.questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'} <span>→</span></button></div>`);
  }

  function answerQuiz(selected) {
    if (!currentQuiz || currentQuiz.answered) return;
    const question = currentQuiz.questions[currentQuiz.index];
    currentQuiz.answered = true;
    if (Number(selected) === question.answer) currentQuiz.score += 1;
    document.querySelectorAll('.quiz-option').forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('is-correct');
      else if (index === Number(selected)) button.classList.add('is-wrong');
    });
    const explanation = document.getElementById('quizExplanation');
    explanation.innerHTML = `<strong>${Number(selected) === question.answer ? 'Chính xác!' : 'Chưa đúng lần này.'}</strong> ${escapeHtml(question.explanation)}`;
    explanation.classList.add('is-visible');
    const nextRow = document.getElementById('quizNextRow');
    nextRow.hidden = false;
    const nextButton = document.getElementById('quizNextButton');
    nextButton?.focus();
  }

  function nextQuizQuestion() {
    if (!currentQuiz || !currentQuiz.answered) return;
    if (currentQuiz.index >= currentQuiz.questions.length - 1) {
      finishQuiz();
      return;
    }
    currentQuiz.index += 1;
    currentQuiz.answered = false;
    renderQuizQuestion();
  }

  function finishQuiz() {
    const score = currentQuiz.score;
    const total = currentQuiz.questions.length;
    const entry = { date: todayKey(), score, total, timestamp: Date.now() };
    state.quizHistory.push(entry);
    state.quizHistory = state.quizHistory.slice(-40);
    recordActivity();
    saveState();
    renderProgress();
    const percent = Math.round((score / total) * 100);
    const title = score === total ? 'Xuất sắc — trọn điểm!' : score >= 3 ? 'Bạn đang đi đúng hướng.' : 'Mỗi lần sai là một lần hiểu sâu hơn.';
    const message = score === total
      ? 'Bạn nắm rất chắc những ý quan trọng của chương. Giữ vững nhịp học này nhé.'
      : score >= 3
        ? 'Bạn đã nắm được phần lớn kiến thức. Xem lại lời giải những câu sai rồi thử thêm một lượt.'
        : 'Đừng lo — hãy mở sổ tay công thức, ôn lại các ý chính rồi làm lại mini quiz.';
    showModal(`<div class="quiz-result"><div class="quiz-result-icon">${score >= 3 ? '✳' : '↗'}</div><div class="modal-eyebrow" style="justify-content:center">HOÀN THÀNH MINI QUIZ</div><h2 id="modalTitle">${title}</h2><div class="quiz-score">${score}<small> / ${total} câu đúng</small></div><p>${message}</p><button class="button button-dark" type="button" id="quizRetryButton">Làm lại mini quiz <span>↻</span></button><br><button class="text-link" type="button" id="quizGoPractice" style="margin-top:12px">Mở ngân hàng bài tập <span>↗</span></button></div>`);
    currentQuiz = null;
  }

  function renderProgress() {
    const solved = state.solvedExercises.length;
    const percent = Math.round((solved / 200) * 100);
    const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    setText('solvedCount', String(solved));
    setText('completedDayCount', String(state.completedDays.length));
    setText('quizCount', String(state.quizHistory.length));
    setText('largeProgressPercent', `${percent}%`);
    const ring = document.getElementById('largeProgressRing');
    if (ring) ring.style.strokeDashoffset = String(427 - (427 * percent / 100));
    const encouragement = document.getElementById('progressEncouragement');
    if (encouragement) {
      encouragement.textContent = solved >= 50
        ? 'Bạn đã xây được nền tảng vững. Tiếp tục giải thích lại mỗi đáp án bằng lời của mình.'
        : solved > 0
          ? 'Bạn đã có những bước đầu tiên. Thêm một vài bài tập ngắn để kiến thức bắt đầu kết nối.'
          : 'Bắt đầu bằng một câu hỏi nhỏ. Nhịp học đều đặn quan trọng hơn học thật nhiều trong một buổi.';
    }
    renderWeeklyChart();
    renderAchievements();
    renderSolvedList();
  }

  function renderWeeklyChart() {
    const chart = document.getElementById('weeklyChart');
    if (!chart) return;
    const now = new Date();
    const dates = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - offset);
      dates.push(date);
    }
    const max = Math.max(1, ...dates.map((date) => Number(state.activity[todayKey(date)]) || 0));
    const names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    chart.innerHTML = dates.map((date) => {
      const value = Number(state.activity[todayKey(date)]) || 0;
      const height = value ? Math.max(12, Math.round(76 * value / max)) : 5;
      const isToday = todayKey(date) === todayKey();
      return `<div class="chart-column ${value ? 'is-active' : ''}" title="${value} hoạt động"><div class="chart-bar-wrap"><div class="chart-bar" style="height:${height}px"></div></div><span>${isToday ? 'Hôm nay' : names[date.getDay()]}</span></div>`;
    }).join('');
    const activeDays = dates.filter((date) => Number(state.activity[todayKey(date)]) > 0).length;
    const label = document.getElementById('weeklyActivityLabel');
    if (label) label.textContent = activeDays ? `${activeDays} / 7 ngày có hoạt động` : 'Chưa có hoạt động ghi nhận';
  }

  function renderAchievements() {
    const achievements = [
      { title: 'Bước đầu tiên', desc: 'Hoàn thành một mini quiz', icon: '↗', unlocked: state.quizHistory.length > 0 },
      { title: 'Người giải bài', desc: 'Đánh dấu 10 bài đã ôn', icon: '✓', unlocked: state.solvedExercises.length >= 10 },
      { title: 'Học đều đặn', desc: 'Hoàn thành 3 ngày lộ trình', icon: '✳', unlocked: state.completedDays.length >= 3 },
      { title: 'Bứt phá', desc: 'Hoàn thành đủ 7 ngày', icon: '★', unlocked: state.completedDays.length === 7 },
    ];
    const list = document.getElementById('achievementList');
    if (!list) return;
    list.innerHTML = achievements.map((item) => `<div class="achievement-item ${item.unlocked ? 'is-unlocked' : ''}"><span class="achievement-medal">${item.icon}</span><span class="achievement-copy"><strong>${item.title}</strong><span>${item.desc}</span></span><span class="achievement-state">${item.unlocked ? 'ĐÃ MỞ' : 'CHƯA MỞ'}</span></div>`).join('');
    const count = document.getElementById('achievementCount');
    if (count) count.textContent = `${achievements.filter((item) => item.unlocked).length} / ${achievements.length}`;
  }

  function renderSolvedList() {
    const list = document.getElementById('solvedExerciseList');
    if (!list) return;
    const latest = [...state.solvedExercises].sort((a, b) => b.id - a.id).slice(0, 6);
    if (!latest.length) {
      list.innerHTML = '<div class="solved-empty">Chưa có bài nào được đánh dấu. Mở một bài tập và chọn “Đánh dấu đã ôn” để bắt đầu.</div>';
      return;
    }
    list.innerHTML = latest.map((item) => `<div class="solved-exercise-row"><span class="exercise-number">${String(item.id).padStart(3, '0')}</span><strong>${escapeHtml(item.title)}</strong><button type="button" data-open-exercise="${item.id}">Mở lại ↗</button></div>`).join('');
  }

  function markDayComplete(dayId) {
    const id = Number(dayId);
    const exists = state.completedDays.includes(id);
    state.completedDays = exists
      ? state.completedDays.filter((value) => value !== id)
      : [...state.completedDays, id].sort((a, b) => a - b);
    if (!exists) recordActivity();
    saveState();
    renderRoadmap();
    renderProgress();
    closeModal();
    showToast(exists ? 'Đã cập nhật lộ trình.' : `Ngày ${id} đã hoàn thành. Tiến bộ tốt lắm!`);
  }

  function filterToLevel(level) {
    closeModal();
    exerciseQuery = '';
    const searchInput = document.getElementById('exerciseSearch');
    if (searchInput) searchInput.value = '';
    setView('practice', { skipExercises: true });
    setExerciseFilter(level);
    const filterButton = document.querySelector(`[data-level-filter="${level}"]`);
    filterButton?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function renderNotesSearch(query = '') {
    const cards = [...document.querySelectorAll('.note-card')];
    const normalized = query.trim().toLocaleLowerCase('vi');
    let visible = 0;
    cards.forEach((card) => {
      const matches = !normalized || `${card.dataset.note} ${card.textContent}`.toLocaleLowerCase('vi').includes(normalized);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    document.getElementById('noNotes').hidden = visible > 0;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Đã sao chép công thức.');
    } catch (_error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('Đã sao chép công thức.');
    }
  }

  function openAbout() {
    showModal(`<div class="modal-eyebrow"><i></i>VỀ KHÔNG GIAN HỌC TẬP</div><h2 class="modal-title" id="modalTitle">Rời Rạc — ôn chắc chương 3.</h2><p class="modal-subtitle">Một giao diện học tập tương tác được xây dựng từ nội dung README.md.</p><div class="modal-body-copy"><p>Toàn bộ nội dung học tập tập trung vào <strong>Ô-tô-mát &amp; Ngôn ngữ hình thức</strong>: bảng chữ cái, văn phạm Chomsky, DFA/NFA, biểu thức chính quy, CNF, PDA và bổ đề bơm.</p><ul><li>200 bài tập và lời giải được nạp trực tiếp từ tài liệu gốc.</li><li>Lộ trình học 7 ngày cùng mini quiz tương tác.</li><li>Tiến độ, bài đã ôn và huy hiệu được lưu cục bộ trên thiết bị.</li><li>Hoạt ảnh giao diện được vận hành bằng GSAP.</li></ul><blockquote>Được thiết kế để “hiểu sâu – nhớ lâu – làm được”.</blockquote></div><div class="modal-action-row"><span class="modal-source">Node.js · Express · GSAP</span><div><button class="button button-dark" type="button" data-view-target="practice">Khám phá 200 bài <span>↗</span></button></div></div>`);
  }

  function openSearch() {
    closeModal();
    setView('practice');
    window.setTimeout(() => document.getElementById('exerciseSearch')?.focus(), 180);
  }

  function handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.id === 'modalBackdrop') { closeModal(); return; }
    if (target.closest('#modalClose')) { closeModal(); return; }

    const challenge = target.closest('[data-challenge-answer]');
    if (challenge) {
      if (state.challengeDate === currentDayKey()) return;
      const answer = Number(challenge.dataset.challengeAnswer);
      state.challengeDate = currentDayKey();
      state.challengeAnswer = answer;
      state.challengeCorrect = answer === quizBank[0].answer;
      recordActivity();
      saveState();
      renderChallenge();
      renderProgress();
      return;
    }

    const quizAnswerButton = target.closest('[data-quiz-answer]');
    if (quizAnswerButton) { answerQuiz(Number(quizAnswerButton.dataset.quizAnswer)); return; }
    if (target.closest('#quizNextButton')) { nextQuizQuestion(); return; }
    if (target.closest('#quizRetryButton')) { startQuiz(); return; }
    if (target.closest('#quizGoPractice')) { closeModal(); setView('practice'); return; }

    const markButton = target.closest('[data-mark-exercise]');
    if (markButton) { toggleSolved(markButton.dataset.markExercise); return; }
    const completeButton = target.closest('[data-complete-day]');
    if (completeButton) { markDayComplete(completeButton.dataset.completeDay); return; }
    const practiceLevelButton = target.closest('[data-practice-level]');
    if (practiceLevelButton) { filterToLevel(practiceLevelButton.dataset.practiceLevel); return; }

    const dayButton = target.closest('[data-open-day]');
    if (dayButton) { openDay(dayButton.dataset.openDay); return; }
    const exerciseButton = target.closest('[data-open-exercise]');
    if (exerciseButton) { openExercise(exerciseButton.dataset.openExercise); return; }

    const viewButton = target.closest('[data-view-target]');
    if (viewButton) {
      if (viewButton.closest('#modalContent')) closeModal();
      setView(viewButton.dataset.viewTarget);
      return;
    }

    const levelButton = target.closest('[data-level-filter]');
    if (levelButton) { setExerciseFilter(levelButton.dataset.levelFilter); return; }
    const copyButton = target.closest('[data-copy]');
    if (copyButton) { copyText(copyButton.dataset.copy); return; }
    if (target.closest('#startQuizButton, #startQuizFromChallenge')) { startQuiz(); return; }
    if (target.closest('#continueLearning')) { openDay(getNextDay().id); return; }
    if (target.closest('#aboutButton, #aboutButtonTop')) { openAbout(); return; }
    if (target.closest('#openSearch')) { openSearch(); return; }
    if (target.closest('#sidebarCollapse')) {
      if (window.innerWidth > 980) document.getElementById('appShell').classList.toggle('sidebar-collapsed');
      return;
    }
    if (target.closest('#startRoadmapButton')) { openDay(1); return; }
    if (target.closest('#resetProgressButton')) {
      if (window.confirm('Đặt lại tiến độ đã lưu trên thiết bị này?')) {
        state = defaultState();
        saveState();
        exerciseCache.clear();
        renderChallenge();
        renderRoadmap();
        renderProgress();
        renderExerciseRows();
        showToast('Tiến độ đã được đặt lại.');
      }
    }
  }

  function init() {
    const date = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    const dateLabel = document.getElementById('todayLabel');
    if (dateLabel) dateLabel.textContent = `HÀNH TRÌNH ÔN TẬP · ${date.toLocaleUpperCase('vi-VN')}`;

    document.addEventListener('click', handleClick);
    document.getElementById('modalBackdrop').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) closeModal();
    });
    document.getElementById('loadMoreExercises').addEventListener('click', () => {
      if (exercisePage < exercisePages) {
        exercisePage += 1;
        loadExercises(false);
      }
    });
    document.getElementById('exerciseSearch').addEventListener('input', (event) => {
      exerciseQuery = event.target.value.trim();
      clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => loadExercises(true), 180);
    });
    document.getElementById('notesSearch').addEventListener('input', (event) => renderNotesSearch(event.target.value));
    window.addEventListener('keydown', (event) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const isSlash = event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (isShortcut || isSlash) { event.preventDefault(); openSearch(); }
      if (event.key === 'Escape') closeModal();
      if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLElement && event.target.matches('.preview-day[role="button"]')) {
        event.preventDefault(); openDay(event.target.dataset.openDay);
      }
    });

    renderChallenge();
    renderRoadmap();
    renderProgress();
    loadExercises(true);

    if (window.gsap && !prefersReducedMotion) {
      window.gsap.from('.sidebar', { x: -16, opacity: 0, duration: .55, ease: 'power2.out' });
      window.gsap.from('.topbar', { y: -9, opacity: 0, duration: .45, ease: 'power2.out', delay: .06 });
      window.gsap.from('.edition-line', { y: 14, opacity: 0, duration: .42, ease: 'power2.out', delay: .12 });
      window.gsap.from('.hero-card', { y: 17, opacity: 0, duration: .6, ease: 'power2.out', delay: .18 });
      window.gsap.from('.metric-card', { y: 12, opacity: 0, duration: .4, stagger: .08, ease: 'power2.out', delay: .32 });
      const pulse = document.getElementById('automatonPulse');
      if (pulse) window.gsap.to(pulse, { attr: { cx: 415 }, duration: 1.9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: .7 });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
