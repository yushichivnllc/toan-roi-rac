import { useMemo } from 'react';
import { useProgress, todayKey, TOTAL_EXERCISES } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { achievements } from '../../data/overview.js';
import { Barcode, Button, Chip, Icon } from '../../components/ui.jsx';

/** Tiến độ của tôi — số liệu cỡ lớn, biểu đồ cột in trên lưới, huy hiệu dạng con dấu. */
export function ProgressView() {
  const { state, solvedCount, solvedPercent, reset } = useProgress();
  const { go, openExercise } = useUi();

  const weekly = useMemo(() => {
    const names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = todayKey(date);
      return {
        key,
        label: names[date.getDay()],
        value: Number(state.activity[key]) || 0,
        isToday: index === 6,
      };
    });
  }, [state.activity]);

  const max = Math.max(1, ...weekly.map((day) => day.value));
  const activeDays = weekly.filter((day) => day.value > 0).length;

  const unlocked = {
    'first-quiz': state.quizHistory.length > 0,
    'ten-solved': state.solvedExercises.length >= 10,
    'three-days': state.completedDays.length >= 3,
    'all-days': state.completedDays.length === 7,
  };
  const unlockedCount = Object.values(unlocked).filter(Boolean).length;

  const encouragement = solvedCount >= 50
    ? 'Bạn đã xây được nền tảng vững. Tiếp tục giải thích lại mỗi đáp án bằng lời của mình.'
    : solvedCount > 0
      ? 'Bạn đã có những bước đầu tiên. Thêm vài bài ngắn nữa để kiến thức bắt đầu kết nối.'
      : 'Bắt đầu bằng một câu hỏi nhỏ. Nhịp học đều đặn quan trọng hơn học thật nhiều trong một buổi.';

  const latest = [...state.solvedExercises].sort((a, b) => b.id - a.id).slice(0, 6);

  return (
    <div className="rr-frame rr-progress">
      <header className="rr-page-head">
        <div>
          <span className="rr-label rr-label--accent">NHỊP HỌC CỦA BẠN</span>
          <h1 className="rr-h1">Tiến độ của tôi.</h1>
          <p className="rr-lead">Mọi thứ bạn đánh dấu được lưu ngay trên thiết bị này.</p>
        </div>
        <Button
          size="sm"
          onClick={() => { if (window.confirm('Đặt lại tiến độ đã lưu trên thiết bị này?')) reset(); }}
        >
          Đặt lại tiến độ
        </Button>
      </header>

      <section className="rr-progress-hero">
        <article className="rr-panel rr-panel--raised rr-progress-score">
          <span className="rr-label">ĐÃ ÔN LUYỆN</span>
          <p className="rr-progress-percent">{solvedPercent}<small>%</small></p>
          <p className="rr-mono">{solvedCount}/{TOTAL_EXERCISES} bài</p>
          <Barcode seed={`progress-${solvedCount}`} bars={40} />
        </article>

        <div className="rr-progress-stats">
          <div className="rr-panel rr-panel--tight rr-stat">
            <span className="rr-stat-icon" aria-hidden="true">✓</span>
            <span className="rr-label">BÀI ĐÃ ĐÁNH DẤU</span>
            <strong className="rr-num">{solvedCount}<small>/{TOTAL_EXERCISES}</small></strong>
          </div>
          <div className="rr-panel rr-panel--tight rr-stat">
            <span className="rr-stat-icon" aria-hidden="true">✳</span>
            <span className="rr-label">NGÀY HOÀN THÀNH</span>
            <strong className="rr-num">{state.completedDays.length}<small>/7</small></strong>
          </div>
          <div className="rr-panel rr-panel--tight rr-stat">
            <span className="rr-stat-icon" aria-hidden="true">◎</span>
            <span className="rr-label">MINI QUIZ</span>
            <strong className="rr-num">{state.quizHistory.length}<small> lần</small></strong>
          </div>
        </div>

        <aside className="rr-panel rr-panel--block rr-progress-note">
          <Chip tone="on-dark">CHƯƠNG 3 · Ô-TÔ-MÁT</Chip>
          <h2 className="rr-h3" style={{ marginTop: 12 }}>Mỗi lần luyện tập, bạn tiến thêm một bước.</h2>
          <p>{encouragement}</p>
          <Button tone="accent" size="sm" onClick={() => go('practice')}>Luyện một bài ↗</Button>
        </aside>
      </section>

      <section className="rr-progress-grid">
        <article className="rr-panel rr-weekly">
          <div className="rr-panel-head">
            <div>
              <span className="rr-label">NHỊP HỌC</span>
              <h2 className="rr-h2" style={{ marginTop: 6 }}>Hoạt động 7 ngày.</h2>
            </div>
            <span className="rr-label">{activeDays}/7 NGÀY</span>
          </div>
          <div className="rr-chart">
            {weekly.map((day) => (
              <div className={`rr-chart-col${day.isToday ? ' is-today' : ''}`} key={day.key}>
                <span className="rr-chart-value">{day.value || ''}</span>
                <span className="rr-chart-bar" style={{ height: `${day.value ? Math.max(10, Math.round((day.value / max) * 100)) : 3}%` }} />
                <span className="rr-label">{day.isToday ? 'NAY' : day.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rr-panel rr-achievements">
          <div className="rr-panel-head">
            <div>
              <span className="rr-label">CỘT MỐC</span>
              <h2 className="rr-h2" style={{ marginTop: 6 }}>Huy hiệu học tập.</h2>
            </div>
            <span className="rr-label">{unlockedCount}/4</span>
          </div>
          <ul className="rr-achievement-list">
            {achievements.map((item) => (
              <li key={item.id} className={unlocked[item.id] ? 'is-on' : ''}>
                <span className="rr-seal rr-achievement-seal">{item.icon}</span>
                <span className="rr-achievement-copy">
                  <strong>{item.title}</strong>
                  <span className="rr-label">{item.description}</span>
                </span>
                <span className="rr-label">{unlocked[item.id] ? 'ĐÃ MỞ' : 'CHƯA MỞ'}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rr-panel rr-panel--flush rr-solved">
        <div className="rr-row-between rr-solved-head">
          <div>
            <span className="rr-label">BÀI TẬP CỦA BẠN</span>
            <h2 className="rr-h2" style={{ marginTop: 6 }}>Đã đánh dấu ôn tập.</h2>
          </div>
          <Button size="sm" onClick={() => go('practice')}>Tìm thêm bài <Icon.search /></Button>
        </div>
        {latest.length ? latest.map((item) => (
          <button key={item.id} type="button" className="rr-line" onClick={() => openExercise(item.id)}>
            <span className="rr-line-no">{String(item.id).padStart(3, '0')}</span>
            <span className="rr-line-title">{item.title}</span>
            <span className="rr-line-meta">MỞ LẠI ↗</span>
          </button>
        )) : (
          <div className="rr-empty">
            <span className="rr-empty-mark" aria-hidden="true">✓</span>
            <strong className="rr-h3">Chưa có bài nào được đánh dấu.</strong>
            <p className="rr-lead">Mở một bài tập và chọn “Đánh dấu đã ôn” để bắt đầu vẽ tiến độ.</p>
            <Button size="sm" tone="solid" onClick={() => go('practice')}>Mở ngân hàng bài tập</Button>
          </div>
        )}
      </section>
    </div>
  );
}
