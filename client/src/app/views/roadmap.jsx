import { days } from '../../data/days.js';
import { roadmapTip } from '../../data/overview.js';
import { useProgress } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { Barcode, Button, Chip, Icon } from '../../components/ui.jsx';

/** Lộ trình 7 ngày — mỗi chặng là một "tấm vé" có số thứ tự cỡ lớn. */
export function RoadmapView() {
  const { state, nextDay, toggleDay } = useProgress();
  const { openLesson, go } = useUi();
  const completed = state.completedDays.length;
  const percent = Math.round((completed / days.length) * 100);

  return (
    <div className="rr-frame rr-roadmap">
      <header className="rr-page-head">
        <div>
          <span className="rr-label rr-label--accent">KẾ HOẠCH ÔN TẬP</span>
          <h1 className="rr-h1">Lộ trình 7 ngày.</h1>
          <p className="rr-lead">
            Đi từ nền tảng đến những dạng bài thử thách nhất, theo đúng nhịp của chương 3.
          </p>
        </div>
        <aside className="rr-panel rr-panel--raised rr-roadmap-score">
          <span className="rr-label">HOÀN THÀNH</span>
          <span className="rr-roadmap-percent">{percent}%</span>
          <span className="rr-mono rr-dim">{completed}/7 ngày</span>
          <Barcode seed={`roadmap-${completed}`} small />
        </aside>
      </header>

      <div className="rr-rule" />

      <section className="rr-day-list">
        {days.map((day) => {
          const done = state.completedDays.includes(day.id);
          const current = !done && day.id === nextDay.id;
          const status = done ? 'HOÀN THÀNH' : current ? 'CHẶNG TIẾP THEO' : 'TRONG LỘ TRÌNH';
          return (
            <article
              key={day.id}
              className={`rr-day${done ? ' is-done' : ''}${current ? ' is-current' : ''}`}
            >
              <div className="rr-day-no">
                <span className="rr-day-no-value">{String(day.id).padStart(2, '0')}</span>
                <span className="rr-label">NGÀY</span>
              </div>

              <div className="rr-day-copy">
                <div className="rr-inline">
                  <Chip tone={done ? 'accent' : current ? 'madder' : 'outline'}>
                    {done ? '✓ ' : ''}{status}
                  </Chip>
                  <span className="rr-label"><Icon.clock /> {day.time}</span>
                  <span className="rr-label">{day.range}</span>
                </div>
                <h2 className="rr-h3" style={{ marginTop: 10 }}>{day.title}</h2>
                <p className="rr-day-sub">{day.subtitle}</p>
                <p className="rr-day-formula rr-mono">{day.formula}</p>
              </div>

              <div className="rr-day-actions">
                <Button size="sm" tone="solid" onClick={() => openLesson(day.id)}>Mở bài học</Button>
                <Button size="sm" tone={done ? 'outline' : 'madder'} onClick={() => toggleDay(day.id)}>
                  {done ? 'Bỏ đánh dấu' : 'Đánh dấu xong'}
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="rr-panel rr-panel--dashed rr-tip">
        <span className="rr-tip-mark" aria-hidden="true">✳</span>
        <p>
          <strong>{roadmapTip.title}</strong> {roadmapTip.body}
        </p>
        <Button size="sm" onClick={() => go('practice')}>Luyện ngay</Button>
      </aside>
    </div>
  );
}
