/**
 * Trạng thái giao diện dùng chung: màn hình đang mở, lớp phủ menu, modal và toast.
 * Tách khỏi `progress.jsx` để phần tiến độ học tập thuần dữ liệu.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHashRoute } from '../app/useHashRoute.js';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [view, setView] = useHashRoute();
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [practiceLevel, setPracticeLevel] = useState(0);

  const closeModal = useCallback(() => setModal(null), []);
  const openLesson = useCallback((dayId) => setModal({ type: 'lesson', dayId: Number(dayId) }), []);
  const openExercise = useCallback((exerciseId) => setModal({ type: 'exercise', exerciseId: Number(exerciseId) }), []);
  const openQuiz = useCallback(() => setModal({ type: 'quiz' }), []);
  const openAbout = useCallback(() => setModal({ type: 'about' }), []);

  const toast = useCallback((message) => {
    window.dispatchEvent(new CustomEvent('roi-rac:toast', { detail: { message } }));
  }, []);

  // Phím tắt: ⌘K / Ctrl+K / "/" mở ngân hàng bài tập, Esc đóng lớp phủ.
  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      const isSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const isSlash = event.key === '/' && !typing;
      if (isSearch || isSlash) {
        event.preventDefault();
        setMenuOpen(false);
        setModal(null);
        setView('practice');
        window.setTimeout(() => document.querySelector('#rrExerciseSearch')?.focus(), 200);
      }
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setView]);

  const go = useCallback((next) => {
    setMenuOpen(false);
    setModal(null);
    setView(next);
  }, [setView]);

  const value = useMemo(() => ({
    view, go, modal, menuOpen, setMenuOpen,
    practiceLevel, setPracticeLevel,
    openLesson, openExercise, openQuiz, openAbout, closeModal, toast,
  }), [view, go, modal, menuOpen, practiceLevel, openLesson, openExercise, openQuiz, openAbout, closeModal, toast]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const context = useContext(UiContext);
  if (!context) throw new Error('useUi phải dùng bên trong <UiProvider>.');
  return context;
}
