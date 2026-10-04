const LEVELS = [
  { id: 1, label: 'Nhập môn', shortLabel: 'Nền tảng', range: [1, 40] },
  { id: 2, label: 'Văn phạm & Chomsky', shortLabel: 'Văn phạm', range: [41, 80] },
  { id: 3, label: 'Ô-tô-mát hữu hạn', shortLabel: 'DFA / NFA', range: [81, 125] },
  { id: 4, label: 'Biến đổi & dạng chuẩn', shortLabel: 'Regex / CNF', range: [126, 165] },
  { id: 5, label: 'Nâng cao', shortLabel: 'PDA / chứng minh', range: [166, 200] },
];

function stripInlineMarkdown(value = '') {
  return value
    .replace(/``/g, 'ε')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\\([|*_])/g, '$1')
    .trim();
}

function levelForExercise(number) {
  return LEVELS.find(({ range: [start, end] }) => number >= start && number <= end) || LEVELS[0];
}

function extractExercises(markdown) {
  const exercises = [];
  const lines = markdown.split(/\r?\n/);
  let current = null;

  const flush = () => {
    if (!current) return;

    const rawBody = current.bodyLines.join('\n').trim();
    const solutionMatch = rawBody.match(/^\*\*(?:Lời giải|Đáp án)(?:\s*\([^)]*\))?:\*\*/m);
    const promptMarkdown = solutionMatch
      ? rawBody.slice(0, solutionMatch.index).trim()
      : rawBody;
    const solutionMarkdown = solutionMatch
      ? rawBody.slice(solutionMatch.index).replace(/^\*\*(?:Lời giải|Đáp án)(?:\s*\([^)]*\))?:\*\*\s*/m, '').trim()
      : '';
    const level = levelForExercise(current.number);

    exercises.push({
      id: current.number,
      title: stripInlineMarkdown(current.title),
      titleMarkdown: current.title,
      level: level.id,
      levelLabel: level.label,
      shortLevelLabel: level.shortLabel,
      promptMarkdown,
      solutionMarkdown,
      searchableText: `${current.title}\n${rawBody}`.toLocaleLowerCase('vi'),
    });
    current = null;
  };

  for (const line of lines) {
    const heading = line.match(/^###\s+Bài\s+(\d+)\.\s*(.*)$/);
    if (heading) {
      flush();
      current = {
        number: Number(heading[1]),
        title: heading[2].trim(),
        bodyLines: [],
      };
      continue;
    }

    // Các tiêu đề chương/phụ lục kết thúc phần nội dung của bài trước đó.
    if (current && /^#{1,2}\s/.test(line)) {
      flush();
      continue;
    }

    if (current) current.bodyLines.push(line);
  }

  flush();
  return exercises;
}

module.exports = { LEVELS, extractExercises, levelForExercise, stripInlineMarkdown };
