import { useMemo, useState } from 'react';
import { quizBank } from '../../data/quizBank.js';
import { useProgress } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Barcode, Button, Chip } from '../../components/ui.jsx';

const QUESTIONS = 5;

/** Mini quiz 5 câu — chọn đáp án, xem giải thích, tổng kết và ghi vào tiến độ. */
export function QuizModal({ onClose }) {
  const { recordQuiz } = useProgress();
  const { go } = useUi();
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(
    () => [...quizBank].sort(() => Math.random() - 0.5).slice(0, QUESTIONS),
    [round],
  );

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const pick = (optionIndex) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === question.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (!isLast) {
      setIndex((value) => value + 1);
      setPicked(null);
      return;
    }
    const finalScore = score;
    recordQuiz({ date: new Date().toISOString().slice(0, 10), score: finalScore, total: questions.length, timestamp: Date.now() });
    setFinished(true);
  };

  const retry = () => {
    setRound((value) => value + 1);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const ratio = score / questions.length;
    const title = ratio === 1 ? 'Xuất sắc — trọn điểm!' : ratio >= 0.6 ? 'Bạn đang đi đúng hướng.' : 'Mỗi lần sai là một lần hiểu sâu hơn.';
    const message = ratio === 1
      ? 'Bạn nắm rất chắc những ý quan trọng của chương. Giữ vững nhịp học này nhé.'
      : ratio >= 0.6
        ? 'Bạn đã nắm phần lớn kiến thức. Xem lại lời giải những câu sai rồi thử thêm một lượt.'
        : 'Đừng lo — mở sổ tay công thức, ôn lại các ý chính rồi làm lại mini quiz.';

    return (
      <Modal open onClose={onClose} meta="HOÀN THÀNH MINI QUIZ" title={title}>
        <div className="rr-quiz-result">
          <span className="rr-quiz-score">{score}<small>/{questions.length}</small></span>
          <span className="rr-label">CÂU ĐÚNG</span>
        </div>
        <p className="rr-lead">{message}</p>
        <Barcode seed={`quiz-${score}-${round}`} bars={30} />
        <div className="rr-inline" style={{ marginTop: 'var(--sp-5)' }}>
          <Button tone="solid" onClick={retry}>Làm lại <span aria-hidden="true">↻</span></Button>
          <Button onClick={() => { onClose(); go('practice'); }}>Mở ngân hàng bài tập ↗</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      meta={`MINI QUIZ · CÂU ${index + 1}/${questions.length}`}
      title={question.question}
      footer={(
        <>
          <span className="rr-label"><Chip tone="madder">{question.topic}</Chip></span>
          <div className="rr-inline">
            <span className="rr-label">{score} ĐÚNG</span>
            <Button size="sm" tone="solid" disabled={picked === null} onClick={next}>
              {isLast ? 'Xem kết quả' : 'Câu tiếp theo'} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </>
      )}
    >
      <div className="rr-quiz-track" aria-hidden="true">
        <span style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <div className="rr-quiz-options">
        {question.options.map((option, optionIndex) => {
          const classes = ['rr-quiz-option'];
          if (picked !== null && optionIndex === question.answer) classes.push('is-correct');
          if (picked === optionIndex && optionIndex !== question.answer) classes.push('is-wrong');
          return (
            <button
              key={option}
              type="button"
              className={classes.join(' ')}
              disabled={picked !== null}
              onClick={() => pick(optionIndex)}
            >
              <span className="rr-quiz-letter">{String.fromCharCode(65 + optionIndex)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <p className={`rr-callout${picked === question.answer ? ' rr-callout--green' : ''}`}>
          <b aria-hidden="true">{picked === question.answer ? '✓' : '!'}</b>
          <span><strong>{picked === question.answer ? 'Chính xác!' : 'Chưa đúng lần này.'}</strong> {question.explanation}</span>
        </p>
      )}
    </Modal>
  );
}
