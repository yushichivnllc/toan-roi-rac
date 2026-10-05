import { useEffect, useMemo, useState } from 'react';
import { getExerciseCatalog, filterExercises } from '../../api/exercises.js';
import { levels } from '../../data/levels.js';
import { useProgress, TOTAL_EXERCISES } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { Barcode, Button, Chip, Icon } from '../../components/ui.jsx';

const PAGE_SIZE = 12;

/** Ngân hàng bài tập — danh sách kiểu hoá đơn in, bộ lọc dạng tem dán. */
export function PracticeView() {
  const { isSolved, state } = useProgress();
  const { openExercise, openQuiz, practiceLevel } = useUi();
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState(practiceLevel || 0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    getExerciseCatalog()
      .then((data) => { if (alive) setCatalog(data); })
      .catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, []);

  // Khi mở từ modal bài học (nút "Luyện bài N"), áp mức lọc tương ứng.
  useEffect(() => { if (practiceLevel) setLevel(practiceLevel); }, [practiceLevel]);
  useEffect(() => { setPage(1); }, [query, level]);

  const filtered = useMemo(
    () => (catalog ? filterExercises(catalog, { query, level }) : []),
    [catalog, query, level],
  );
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const levelCounts = useMemo(() => {
    const source = catalog || [];
    return source.reduce((acc, exercise) => {
      acc[exercise.level] = (acc[exercise.level] || 0) + 1;
      return acc;
    }, {});
  }, [catalog]);

  if (error) {
    return (
      <div className="rr-frame">
        <div className="rr-panel rr-panel--dashed">
          <span className="rr-label rr-label--accent">LỖI KẾT NỐI</span>
          <h1 className="rr-h2" style={{ marginTop: 8 }}>Chưa tải được thư viện bài tập.</h1>
          <p className="rr-lead" style={{ marginTop: 8 }}>{error} Hãy tải lại trang để thử lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rr-frame rr-practice">
      <header className="rr-page-head">
        <div>
          <span className="rr-label rr-label--accent">LUYỆN TẬP CÓ CHỦ ĐÍCH</span>
          <h1 className="rr-h1">Ngân hàng bài tập.</h1>
          <p className="rr-lead">
            {TOTAL_EXERCISES} bài từ README, chia theo 5 mức độ, kèm lời giải chi tiết.
          </p>
        </div>
        <div className="rr-inline">
          <Button tone="accent" onClick={openQuiz}><Icon.play /> Mini quiz 5 câu</Button>
        </div>
      </header>

      <section className="rr-panel rr-archive">
        <div className="rr-archive-copy">
          <span className="rr-label">KHO TÀI LIỆU</span>
          <strong className="rr-h3">{catalog ? `${filtered.length} bài phù hợp` : 'Đang tải bài tập…'}</strong>
          <span className="rr-mono rr-dim" style={{ fontSize: 'var(--fs-label)' }}>
            Đã đánh dấu ôn tập: {state.solvedExercises.length}/{TOTAL_EXERCISES}
          </span>
        </div>
        <Barcode seed={`archive-${filtered.length}`} bars={28} />
      </section>

      <div className="rr-toolbar">
        <label className="rr-search">
          <Icon.search />
          <input
            id="rrExerciseSearch"
            type="search"
            value={query}
            placeholder="Tìm từ khóa: DFA, pumping lemma…"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm bài tập"
          />
          <kbd>/</kbd>
        </label>
        <div className="rr-filters" role="group" aria-label="Lọc theo mức độ">
          <button
            type="button"
            className="rr-filter"
            aria-pressed={level === 0}
            onClick={() => setLevel(0)}
          >
            Tất cả <b>{catalog ? catalog.length : TOTAL_EXERCISES}</b>
          </button>
          {levels.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rr-filter"
              aria-pressed={level === item.id}
              onClick={() => setLevel(item.id)}
            >
              {String(item.id).padStart(2, '0')} · {item.shortLabel} <b>{levelCounts[item.id] ?? 0}</b>
            </button>
          ))}
        </div>
      </div>

      <section className="rr-panel rr-panel--flush rr-list">
        {!catalog && Array.from({ length: 6 }, (_, index) => (
          <div className="rr-line rr-line--skeleton" key={index} aria-hidden="true">
            <span className="rr-sk rr-sk--no" />
            <span className="rr-sk rr-sk--title" />
            <span className="rr-sk rr-sk--tag" />
          </div>
        ))}

        {catalog && visible.map((exercise) => {
          const solved = isSolved(exercise.id);
          return (
            <button
              key={exercise.id}
              type="button"
              className="rr-line rr-exercise"
              onClick={() => openExercise(exercise.id)}
            >
              <span className="rr-line-no">{String(exercise.id).padStart(3, '0')}</span>
              <span className="rr-exercise-copy">
                <span className="rr-line-title">{exercise.title}</span>
                <span className="rr-line-meta">
                  {solved ? '✓ ĐÃ ĐÁNH DẤU ÔN TẬP' : 'CÓ LỜI GIẢI CHI TIẾT'}
                </span>
              </span>
              <span className="rr-exercise-right">
                <Chip tone={solved ? 'accent' : 'madder'}>{exercise.shortLevelLabel}</Chip>
                <span className="rr-arrow rr-arrow--side" aria-hidden="true" />
              </span>
            </button>
          );
        })}

        {catalog && !filtered.length && (
          <div className="rr-empty">
            <span className="rr-empty-mark" aria-hidden="true">∅</span>
            <strong className="rr-h3">Chưa tìm thấy bài phù hợp.</strong>
            <p className="rr-lead">Thử một từ khóa khác hoặc chọn mức “Tất cả”.</p>
          </div>
        )}
      </section>

      <div className="rr-row-between rr-list-foot">
        <span className="rr-label">
          {catalog ? `HIỂN THỊ ${visible.length}/${filtered.length} BÀI` : 'ĐANG TẢI…'}
        </span>
        {filtered.length > visible.length && (
          <Button tone="solid" onClick={() => setPage((value) => value + 1)}>
            Xem thêm bài tập <span aria-hidden="true">↓</span>
          </Button>
        )}
      </div>
    </div>
  );
}
