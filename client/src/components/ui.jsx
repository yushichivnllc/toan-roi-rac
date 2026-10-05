/**
 * Thư viện thành phần dùng chung — hình khối "in ấn" của ảnh tham chiếu:
 * barcode, chấm halftone, con dấu số, mũi tên khối, nhãn kỹ thuật, vé xé.
 */
import { useEffect, useRef, useState } from 'react';

/* ------------------------------- Icon ------------------------------- */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Icon = {
  burger: (props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M3 6.5h18M3 12h18M3 17.5h18" {...stroke} strokeWidth={2} />
    </svg>
  ),
  close: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M5 5l14 14M19 5L5 19" {...stroke} strokeWidth={2} />
    </svg>
  ),
  search: (props) => (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" {...props}>
      <circle cx="10.5" cy="10.5" r="6" {...stroke} />
      <path d="M15.2 15.2 20 20" {...stroke} />
    </svg>
  ),
  mail: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" {...stroke} />
      <path d="m3.5 7 8.5 6 8.5-6" {...stroke} />
    </svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="m4 12.5 5 5L20 6.5" {...stroke} strokeWidth={2.2} />
    </svg>
  ),
  copy: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <rect x="9" y="8" width="11" height="12.5" rx="2" {...stroke} />
      <path d="M15 8V5.5A2 2 0 0 0 13 3.5H6a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h3" {...stroke} />
    </svg>
  ),
  play: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M7 4.5 19 12 7 19.5z" {...stroke} strokeWidth={1.9} />
    </svg>
  ),
  clock: (props) => (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" {...stroke} />
      <path d="M12 7v5.3l3.4 2" {...stroke} />
    </svg>
  ),
  book: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M4 4.5h7v15H4zM13 4.5h7v15h-7z" {...stroke} />
      <path d="M6.5 8.5h2M15.5 8.5h2" {...stroke} />
    </svg>
  ),
  route: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <circle cx="6" cy="18" r="2.4" {...stroke} />
      <circle cx="18" cy="6" r="2.4" {...stroke} />
      <path d="M8.4 18h3.6a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2" {...stroke} />
    </svg>
  ),
  grid: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" {...stroke} />
    </svg>
  ),
  chart: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M4.5 19.5V12M10 19.5V5M15.5 19.5v-6M21 19.5V9" {...stroke} strokeWidth={2} />
      <path d="M2.5 21h19" {...stroke} />
    </svg>
  ),
};

/* ------------------------------ Barcode ------------------------------ */
/** Sinh thanh barcode ổn định theo seed — dùng cho thẻ thư viện, tem, đường phân cách. */
export function Barcode({ seed = 'roi-rac', bars = 34, small = false, className = '' }) {
  const widths = useRef(null);
  if (!widths.current) {
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) % 100000;
    widths.current = Array.from({ length: bars }, (_, index) => {
      hash = (hash * 1103515245 + 12345) % 2147483648;
      return 1 + ((hash >> (index % 7)) % 3);
    });
  }
  return (
    <div className={`rr-barcode${small ? ' rr-barcode--sm' : ''} ${className}`} aria-hidden="true">
      {widths.current.map((width, index) => (
        <span key={index} style={{ width: `${width}px`, opacity: index % 9 === 0 ? 0.55 : 1 }} />
      ))}
    </div>
  );
}

/* ------------------------------ Halftone ----------------------------- */
export function Halftone({ className = '', style }) {
  return <span className={`rr-halftone ${className}`} style={style} aria-hidden="true" />;
}

/* -------------------------------- Chip ------------------------------- */
export function Chip({ tone = 'ink', children, className = '' }) {
  return <span className={`rr-chip rr-chip--${tone} ${className}`}>{children}</span>;
}

/* ------------------------------- Button ------------------------------ */
export function Button({ tone = 'outline', size, block, children, className = '', ...rest }) {
  const classes = [
    'rr-btn',
    tone !== 'outline' && `rr-btn--${tone}`,
    size === 'sm' && 'rr-btn--sm',
    block && 'rr-btn--block',
    className,
  ].filter(Boolean).join(' ');
  return <button type="button" className={classes} {...rest}>{children}</button>;
}

/* ------------------------------- Stamp ------------------------------- */
export function Stamp({ value, label, tone = 'paper', className = '' }) {
  return (
    <div className={`rr-stamp${tone !== 'paper' ? ` rr-stamp--${tone}` : ''} ${className}`}>
      <span className="rr-stamp-value">{value}</span>
      {label && <span className="rr-stamp-label">{label}</span>}
    </div>
  );
}

/* ------------------------- Số đếm tăng dần --------------------------- */
/** Đếm số khi cuộn tới — thay cho hiệu ứng GSAP của bản cũ. */
export function CountUp({ value, pad = 0, duration = 900 }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setDisplay(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{String(display).padStart(pad, '0')}</span>;
}

/* --------------------------- Khối sổ tay ----------------------------- */
/** Dựng các khối nội dung có cấu trúc của thẻ sổ tay công thức. */
export function NoteBlock({ block }) {
  switch (block.type) {
    case 'chomsky-stack':
      return (
        <ul className="rr-chomsky">
          {block.items.map((item) => (
            <li key={item.index}>
              <span className="rr-chomsky-index">{item.index}</span>
              <span className="rr-chomsky-name">{item.name}</span>
              <code className="rr-chomsky-machine">{item.machine}</code>
            </li>
          ))}
        </ul>
      );
    case 'formula':
      return (
        <div className={`rr-formula${block.tone && block.tone !== 'default' ? ` rr-formula--${block.tone}` : ''}`}>
          {(block.lines || [block.text]).map((line, index) => (
            <span key={line} className={index === block.emphasisLine ? 'is-strong' : undefined}>{line}</span>
          ))}
        </div>
      );
    case 'steps':
      return (
        <ol className="rr-steps">
          {block.items.map((item, index) => (
            <li key={item}>
              <span className="rr-steps-no">{String(index + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'pipeline':
      return (
        <div className="rr-pipeline">
          {block.steps.map((step, index) => (
            <span key={step} className="rr-pipeline-node">
              {step}
              {index < block.steps.length - 1 && <b aria-hidden="true">→</b>}
            </span>
          ))}
        </div>
      );
    case 'stack':
      return (
        <div className="rr-stackviz">
          <span className="rr-stackviz-top">đỉnh</span>
          {block.items.map((item, index) => <b key={index}>{item}</b>)}
          <i>{block.bottom}</i>
        </div>
      );
    case 'checklist':
      return (
        <ul className="rr-checklist">
          {block.items.map((item) => (
            <li key={item}><Icon.check /> <span>{item}</span></li>
          ))}
        </ul>
      );
    case 'note':
      return (
        <p className={`rr-callout${block.tone && block.tone !== 'default' ? ` rr-callout--${block.tone}` : ''}`}>
          <b aria-hidden="true">{block.icon || '!'}</b>
          <span>{block.text}</span>
        </p>
      );
    default:
      return <p className="rr-label">{block.text}</p>;
  }
}

/** Ba vòng tròn mũi tên ↗ — cụm "ARE YOU READY?" ở mép poster tham chiếu. */
export function CircleArrows({ count = 3 }) {
  return (
    <span className="rr-circle-arrows" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <span key={index}>↗</span>)}
    </span>
  );
}

/** Tia sao 4 cánh phát sáng — điểm nhấn lấp lánh trên tiêu đề poster. */
export function Sparkle({ className = '', style }) {
  return <span className={`rr-sparkle ${className}`} style={style} aria-hidden="true" />;
}

/** Dấu căn lề 4 góc trang — chi tiết "bản in" của ảnh tham chiếu. */
export function CropMarks() {
  return (
    <span className="rr-cropmarks" aria-hidden="true">
      <i className="rr-cropmark rr-cropmark--tl" />
      <i className="rr-cropmark rr-cropmark--tr" />
      <i className="rr-cropmark rr-cropmark--bl" />
      <i className="rr-cropmark rr-cropmark--br" />
    </span>
  );
}

/** Các cung tròn đồng tâm — hoạ tiết sóng wireframe góc poster. */
export function WaveArcs({ className = '' }) {
  return (
    <svg className={`rr-wave-arcs ${className}`} viewBox="0 0 120 60" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <path
          key={index}
          d={`M ${8 + index * 4} 60 A ${52 - index * 7} ${52 - index * 7} 0 0 1 ${112 - index * 4} 60`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}
