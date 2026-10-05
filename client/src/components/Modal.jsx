import { useEffect, useRef } from 'react';
import { Icon } from './ui.jsx';

/**
 * Khung modal kiểu "tờ giấy dán đè": viền mực dày, đầu trang có nhãn kỹ thuật,
 * nút đóng hình tròn. Xử lý Esc, khoá cuộn nền và trả tiêu điểm về nơi cũ.
 */
export function Modal({ open, onClose, title, meta, tone = 'paper', wide = false, children, footer }) {
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    document.body.classList.add('rr-locked');
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('rr-locked');
      if (previousFocus.current?.focus) previousFocus.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="rr-modal-backdrop"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}
    >
      <section
        className={`rr-modal${wide ? ' rr-modal--wide' : ''} rr-modal--${tone}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <header className="rr-modal-head">
          <div>
            {meta && <div className="rr-label rr-label--accent">{meta}</div>}
            {title && <div className="rr-h2" style={{ marginTop: 6 }}>{title}</div>}
          </div>
          <button ref={closeRef} type="button" className="rr-modal-close" onClick={onClose} aria-label="Đóng">
            <Icon.close />
          </button>
        </header>
        <div className="rr-modal-body">{children}</div>
        {footer && <footer className="rr-modal-foot">{footer}</footer>}
      </section>
    </div>
  );
}
