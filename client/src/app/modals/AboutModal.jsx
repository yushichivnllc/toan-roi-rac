import { useUi } from '../../state/ui.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Barcode, Button, Chip } from '../../components/ui.jsx';

/** Giới thiệu ứng dụng và nguồn nội dung. */
export function AboutModal({ onClose }) {
  const { go } = useUi();

  return (
    <Modal
      open
      onClose={onClose}
      meta="VỀ KHÔNG GIAN HỌC TẬP"
      title="Rời Rạc — ôn chắc chương 3."
      footer={(
        <>
          <span className="rr-label">REACT · VITE · EXPRESS</span>
          <Button size="sm" tone="solid" onClick={() => { onClose(); go('practice'); }}>
            Khám phá 200 bài <span aria-hidden="true">↗</span>
          </Button>
        </>
      )}
    >
      <p className="rr-lead">
        Toàn bộ nội dung tập trung vào <strong>Ô-tô-mát &amp; Ngôn ngữ hình thức</strong>: bảng chữ cái,
        văn phạm Chomsky, DFA/NFA, biểu thức chính quy, CNF, PDA và bổ đề bơm.
      </p>
      <ul className="rr-checklist" style={{ marginTop: 'var(--sp-4)' }}>
        <li><b aria-hidden="true">✓</b> <span>200 bài tập và lời giải nạp trực tiếp từ README.md.</span></li>
        <li><b aria-hidden="true">✓</b> <span>Lộ trình 7 ngày cùng mini quiz tương tác.</span></li>
        <li><b aria-hidden="true">✓</b> <span>Tiến độ, bài đã ôn và huy hiệu lưu cục bộ trên thiết bị.</span></li>
        <li><b aria-hidden="true">✓</b> <span>Phím tắt ⌘K / Ctrl+K / “/” để tìm bài tập tức thì.</span></li>
      </ul>
      <div className="rr-inline" style={{ marginTop: 'var(--sp-5)' }}>
        <Chip>Σ</Chip><Chip tone="madder">δ</Chip><Chip tone="accent">q₀</Chip>
        <Chip tone="outline">PDA</Chip>
      </div>
      <Barcode seed="about-roi-rac" bars={36} className="rr-about-barcode" />
    </Modal>
  );
}
