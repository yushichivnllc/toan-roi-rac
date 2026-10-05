import { dayById } from '../../data/days.js';
import { useProgress } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Button, Chip, Icon } from '../../components/ui.jsx';

const tips = {
  1: 'Bẫy kinh điển: ∅ là ngôn ngữ rỗng; {ε} là ngôn ngữ có đúng một xâu — xâu rỗng.',
  2: 'Mẹo nhớ: “0 thì tự do, 1 thì không co, 2 thì đơn thân, 3 thì tuyến tính”.',
  3: 'Mẹo thiết kế: đặt tên trạng thái theo phần thông tin máy cần giữ lại, thay vì đặt tên tùy ý.',
  4: 'Đừng liệt kê toàn bộ 2^Q — chỉ tạo các tập con có thể tới được từ trạng thái đầu.',
  5: 'Kiểm tra lại thứ tự: ε → quy tắc đơn → vô sinh → không đến được → CNF.',
  6: 'Trong hình trạng PDA, luôn ghi: trạng thái, phần input chưa đọc, nội dung ngăn xếp.',
  7: 'Bổ đề bơm là điều kiện cần. Không thể chứng minh tính chính quy chỉ bằng một phép tách đẹp.',
};

/** Modal bài học của một ngày trong lộ trình. */
export function LessonModal({ dayId, onClose }) {
  const day = dayById(dayId);
  const { state, toggleDay } = useProgress();
  const { go, setPracticeLevel } = useUi();
  if (!day) return null;

  const done = state.completedDays.includes(day.id);

  return (
    <Modal
      open
      onClose={onClose}
      meta={`NGÀY ${String(day.id).padStart(2, '0')} · ${day.range.toUpperCase()} · ${day.time}`}
      title={day.title}
      footer={(
        <>
          <span className="rr-label">NGUỒN: README.MD · LỘ TRÌNH 7 NGÀY</span>
          <div className="rr-inline">
            <Button
              size="sm"
              onClick={() => { onClose(); setPracticeLevel(day.filter); go('practice'); }}
            >
              Luyện {day.range}
            </Button>
            <Button size="sm" tone={done ? 'outline' : 'solid'} onClick={() => toggleDay(day.id)}>
              {done ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'} <span aria-hidden="true">{done ? '✓' : '→'}</span>
            </Button>
          </div>
        </>
      )}
    >
      <p className="rr-lead">{day.subtitle}</p>

      <div className="rr-lesson-focus">
        <span className="rr-label rr-label--accent">TRỌNG TÂM</span>
        <p>{day.focus}</p>
      </div>

      <div className="rr-formula rr-formula--big">{day.formula}</div>

      <h3 className="rr-h3" style={{ marginTop: 'var(--sp-5)' }}>Mục tiêu cần đạt</h3>
      <ol className="rr-steps">
        {day.objectives.map((item, index) => (
          <li key={item}>
            <span className="rr-steps-no">{String(index + 1).padStart(2, '0')}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>

      <h3 className="rr-h3" style={{ marginTop: 'var(--sp-5)' }}>Ý chính cần nhớ</h3>
      <p>{day.concept}</p>

      <p className="rr-callout" style={{ marginTop: 'var(--sp-4)' }}>
        <b aria-hidden="true">✳</b>
        <span>{tips[day.id]}</span>
      </p>

      <div className="rr-inline" style={{ marginTop: 'var(--sp-5)' }}>
        <Chip>Σ</Chip>
        <Chip tone="madder">δ</Chip>
        <Chip tone="accent">q₀</Chip>
        <span className="rr-label"><Icon.clock /> {day.time} mỗi ngày</span>
      </div>
    </Modal>
  );
}
