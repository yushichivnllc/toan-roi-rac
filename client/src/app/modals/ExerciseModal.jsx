import { useEffect, useState } from 'react';
import { getExerciseById } from '../../api/exercises.js';
import { markdownToHtml } from '../../lib/markdown.js';
import { useProgress } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Barcode, Button, Chip } from '../../components/ui.jsx';

/** Modal bài tập: đề bài + lời giải markdown, kèm nút đánh dấu đã ôn. */
export function ExerciseModal({ exerciseId, onClose }) {
  const { isSolved, toggleSolved } = useProgress();
  const { toast } = useUi();
  const [exercise, setExercise] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setExercise(null);
    setError('');
    getExerciseById(exerciseId)
      .then((data) => { if (alive) setExercise(data); })
      .catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, [exerciseId]);

  const solved = isSolved(exerciseId);

  return (
    <Modal
      open
      onClose={onClose}
      wide
      meta={exercise ? `BÀI ${String(exercise.id).padStart(3, '0')} · ${exercise.levelLabel.toUpperCase()}` : 'ĐANG MỞ BÀI TẬP'}
      title={exercise ? exercise.title : 'Một chút xíu nhé…'}
      footer={(
        <>
          <span className="rr-label">BÀI {exerciseId} TRONG BỘ 200 BÀI TẬP</span>
          <div className="rr-inline">
            <Button size="sm" onClick={() => { navigator.clipboard?.writeText(`${exercise?.title || ''}`); toast('Đã sao chép tiêu đề bài tập.'); }}>
              Sao chép đề
            </Button>
            <Button
              size="sm"
              tone={solved ? 'outline' : 'solid'}
              onClick={() => {
                toggleSolved({
                  id: exerciseId,
                  title: exercise?.title || `Bài ${exerciseId}`,
                  level: exercise?.level,
                  levelLabel: exercise?.levelLabel,
                });
                toast(solved ? 'Đã bỏ đánh dấu bài tập.' : `Bài ${exerciseId} đã được ghi nhận. Tốt lắm!`);
              }}
            >
              {solved ? 'Bỏ đánh dấu ✓' : 'Đánh dấu đã ôn →'}
            </Button>
          </div>
        </>
      )}
    >
      {error && <p className="rr-lead">{error}</p>}

      {!exercise && !error && (
        <div className="rr-stack" aria-busy="true">
          <span className="rr-sk rr-sk--line" />
          <span className="rr-sk rr-sk--line" />
          <span className="rr-sk rr-sk--line rr-sk--short" />
        </div>
      )}

      {exercise && (
        <>
          <div className="rr-inline" style={{ marginBottom: 'var(--sp-4)' }}>
            <Chip tone="madder">{exercise.shortLevelLabel}</Chip>
            {solved && <Chip tone="accent">✓ ĐÃ ÔN</Chip>}
            <span className="rr-label">NGUỒN: README.MD</span>
          </div>

          {exercise.promptMarkdown ? (
            <div className="rr-prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(exercise.promptMarkdown) }} />
          ) : (
            <p className="rr-prose"><strong>{exercise.title}</strong></p>
          )}

          <div className="rr-answer-head">
            <span className="rr-label rr-label--accent">LỜI GIẢI CHI TIẾT</span>
            <Barcode seed={`ex-${exercise.id}`} small bars={22} />
          </div>

          <div className="rr-answer">
            {exercise.solutionMarkdown
              ? <div className="rr-prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(exercise.solutionMarkdown) }} />
              : <p className="rr-prose">Bài này chưa có lời giải tách riêng trong tài liệu.</p>}
          </div>
        </>
      )}
    </Modal>
  );
}
