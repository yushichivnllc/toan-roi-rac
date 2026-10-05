// Trình dựng markdown gọn nhẹ — port 1:1 từ public/app.js để nội dung README hiển thị y hệt.
// Chỉ dùng cho nội dung nội bộ (README.md) nên an toàn khi render qua dangerouslySetInnerHTML.

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


/**
 * Thay emoji trong nội dung README bằng nhãn in kiểu "mực đỏ" cho hợp ngôn ngữ
 * thị giác của giao diện (✅ ❌ 💡 ⚠️ …), tránh emoji màu làm lệch tông in ấn.
 */
function replaceEmojiWithBadges(value = '') {
  return String(value)
    .replace(/✅/g, '<span class="rr-badge rr-badge--ok">OK</span>')
    .replace(/❌/g, '<span class="rr-badge rr-badge--no">X</span>')
    .replace(/⚠️|⚠/g, '<span class="rr-badge rr-badge--warn">!</span>')
    .replace(/💡/g, '<span class="rr-badge rr-badge--note">*</span>')
    .replace(/🔹|🔸|➡️|➡|👉/g, '<span class="rr-badge rr-badge--arrow">→</span>')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '');
}

export function markdownToHtml(markdown = '') {
  return replaceEmojiWithBadges(renderMarkdown(markdown));
}

export { escapeHtml, inlineMarkdown };
