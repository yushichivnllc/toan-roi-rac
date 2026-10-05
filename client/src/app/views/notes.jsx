import { useState } from 'react';
import { noteCards, notesBanner } from '../../data/notes.js';
import { useUi } from '../../state/ui.jsx';
import { Button, Icon, NoteBlock } from '../../components/ui.jsx';

/** Sổ tay công thức — lưới thẻ viền mực, công thức in trên nền mận như nhãn dán. */
const blockText = (block) => [
  block.text, block.bottom, block.machine,
  ...(block.lines || []), ...(block.items || []), ...(block.steps || []),
].filter(Boolean).join(' ');

/** Toàn bộ chữ của một thẻ, gồm id (chomsky, pumping…) như bản vanilla vẫn tìm được. */
const cardHaystack = (card) => [
  card.id, card.tag, card.title, card.description, card.copyText,
  ...card.blocks.map(blockText),
].join(' ').toLocaleLowerCase('vi');

export function NotesView() {
  const { toast } = useUi();
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase('vi');

  const visible = noteCards.filter((card) => !normalized || cardHaystack(card).includes(normalized));

  const copyFormula = async (card) => {
    try {
      await navigator.clipboard.writeText(card.copyText);
      toast('Đã sao chép công thức.');
    } catch {
      toast('Không sao chép được — hãy chọn thủ công.');
    }
  };

  return (
    <div className="rr-frame rr-notes">
      <header className="rr-page-head">
        <div>
          <span className="rr-label rr-label--accent">ÔN NHANH TRƯỚC GIỜ THI</span>
          <h1 className="rr-h1">Sổ tay công thức.</h1>
          <p className="rr-lead">
            Ký hiệu, quy trình chuyển đổi và những “bẫy” thường gặp — gom trên một trang.
          </p>
        </div>
        <label className="rr-search rr-search--compact">
          <Icon.search />
          <input
            type="search"
            value={query}
            placeholder="Tìm trong sổ tay…"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm trong sổ tay"
          />
        </label>
      </header>

      <aside className="rr-notes-banner">
        <span className="rr-notes-symbol" aria-hidden="true">{notesBanner.symbol}</span>
        <div>
          <span className="rr-label rr-label--on-dark">{notesBanner.overline}</span>
          <strong>{notesBanner.headline}</strong>
        </div>
        <span className="rr-notes-mark" aria-hidden="true">✳</span>
      </aside>

      <div className="rr-note-grid">
        {visible.map((card, index) => (
          <article key={card.id} className={`rr-note rr-note--${card.tone}`} style={{ '--tilt': `${index % 3 === 1 ? '-0.5deg' : index % 3 === 2 ? '0.45deg' : '0deg'}` }}>
            <header className="rr-note-head">
              <span className={`rr-chip rr-chip--${card.tone === 'default' ? 'ink' : card.tone}`}>{card.tag}</span>
              <button
                type="button"
                className="rr-icon-btn rr-icon-btn--small"
                onClick={() => copyFormula(card)}
                aria-label={`Sao chép: ${card.title}`}
              >
                <Icon.copy />
              </button>
            </header>
            <h2 className="rr-h3">{card.title}</h2>
            <p className="rr-note-desc">{card.description}</p>
            <div className="rr-note-blocks">
              {card.blocks.map((block, blockIndex) => (
                <NoteBlock key={blockIndex} block={block} />
              ))}
            </div>
          </article>
        ))}
      </div>

      {!visible.length && (
        <div className="rr-panel rr-panel--dashed rr-empty">
          <span className="rr-empty-mark" aria-hidden="true">⌕</span>
          <strong className="rr-h3">Không tìm thấy nội dung phù hợp.</strong>
          <p className="rr-lead">Thử một từ khóa khác nhé.</p>
          <Button size="sm" onClick={() => setQuery('')}>Xoá tìm kiếm</Button>
        </div>
      )}
    </div>
  );
}
