import { useUi } from '../../state/ui.jsx';
import { LessonModal } from './LessonModal.jsx';
import { ExerciseModal } from './ExerciseModal.jsx';
import { QuizModal } from './QuizModal.jsx';
import { AboutModal } from './AboutModal.jsx';

/** Điều phối modal: mỗi thời điểm chỉ một lớp phủ được mở. */
export function ModalHost() {
  const { modal, closeModal } = useUi();
  if (!modal) return null;

  switch (modal.type) {
    case 'lesson':
      return <LessonModal dayId={modal.dayId} onClose={closeModal} />;
    case 'exercise':
      return <ExerciseModal exerciseId={modal.exerciseId} onClose={closeModal} />;
    case 'quiz':
      return <QuizModal onClose={closeModal} />;
    case 'about':
      return <AboutModal onClose={closeModal} />;
    default:
      return null;
  }
}
