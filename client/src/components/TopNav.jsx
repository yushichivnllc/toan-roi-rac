import { useUi } from '../state/ui.jsx';
import { useProgress, TOTAL_EXERCISES } from '../state/progress.jsx';
import { viewLabels, viewOrder } from '../data/overview.js';
import { Icon } from './ui.jsx';

const navItems = viewOrder.map((key, index) => ({ key, label: viewLabels[key], index: String(index + 1).padStart(2, '0') }));

/** Thanh điều hướng trên cùng — dải giấy có viền mực, mục đang mở được bôi đen. */
export function TopNav() {
  const { view, go, setMenuOpen, openAbout } = useUi();
  const { solvedCount } = useProgress();

  return (
    <header className="rr-nav">
      <div className="rr-nav-inner">
        <button type="button" className="rr-brand" onClick={() => go('overview')} aria-label="Rời Rạc — về trang tổng quan">
          <span className="rr-brand-mark" aria-hidden="true">✳</span>
          <span className="rr-brand-copy">
            <strong>rời rạc</strong>
            <span className="rr-label">ELECTRIC STUDY STUDIO</span>
          </span>
        </button>

        <nav className="rr-nav-links" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="rr-nav-link"
              aria-current={view === item.key ? 'page' : undefined}
              onClick={() => go(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="rr-nav-right">
          <button type="button" className="rr-nav-count" onClick={() => go('progress')} title="Số bài đã đánh dấu ôn tập">
            <b>{String(solvedCount).padStart(3, '0')}</b>
            <i>/{TOTAL_EXERCISES}</i>
          </button>
          <button type="button" className="rr-icon-btn" onClick={openAbout} aria-label="Giới thiệu ứng dụng">
            <span aria-hidden="true">?</span>
          </button>
          <button type="button" className="rr-icon-btn rr-icon-btn--burger" onClick={() => setMenuOpen(true)} aria-label="Mở menu">
            <Icon.burger />
          </button>
        </div>
      </div>
    </header>
  );
}

/** Menu toàn màn hình — chữ tiêu đề cỡ lớn, đánh số như mục lục tạp chí. */
export function MenuOverlay() {
  const { menuOpen, setMenuOpen, view, go, openQuiz, openAbout } = useUi();
  if (!menuOpen) return null;

  return (
    <div className="rr-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="rr-row-between">
        <span className="rr-label">RỜI RẠC® — MỤC LỤC</span>
        <button type="button" className="rr-modal-close" onClick={() => setMenuOpen(false)} aria-label="Đóng menu">
          <Icon.close />
        </button>
      </div>

      <nav className="rr-menu-list">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className="rr-menu-item"
            aria-current={view === item.key ? 'page' : undefined}
            onClick={() => go(item.key)}
          >
            <span>{item.index}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="rr-inline" style={{ marginTop: 'var(--sp-6)' }}>
        <button type="button" className="rr-btn rr-btn--solid" onClick={() => { setMenuOpen(false); openQuiz(); }}>
          <Icon.play /> Mini quiz 5 câu
        </button>
        <button type="button" className="rr-btn" onClick={() => { setMenuOpen(false); openAbout(); }}>
          Về không gian học tập
        </button>
      </div>

      <p className="rr-label" style={{ marginTop: 'auto', paddingTop: 'var(--sp-6)' }}>
        TOÁN RỜI RẠC · CHƯƠNG 03 · Ô-TÔ-MÁT &amp; NGÔN NGỮ HÌNH THỨC
      </p>
    </div>
  );
}
