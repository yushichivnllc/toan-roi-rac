/**
 * Trạng thái tiến độ học tập — lưu cục bộ trên thiết bị.
 *
 * Giữ nguyên khoá lưu trữ `roi-rac-study-studio-v1` như bản vanilla để người dùng
 * đang học không mất tiến độ khi chuyển sang giao diện mới.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { days } from '../data/days.js';
import { quizBank } from '../data/quizBank.js';

export const STORAGE_KEY = 'roi-rac-study-studio-v1';
export const TOTAL_EXERCISES = 200;

const ProgressContext = createContext(null);

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function defaultState() {
  return {
    solvedExercises: [], // [{ id, title, level, levelLabel }]
    completedDays: [],
    quizHistory: [], // [{ date, score, total, timestamp }]
    activity: {}, // { 'YYYY-MM-DD': số hoạt động }
    challengeDate: '',
    challengeAnswer: null,
    challengeCorrect: false,
  };
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return defaultState();
    return {
      ...defaultState(),
      ...saved,
      solvedExercises: Array.isArray(saved.solvedExercises) ? saved.solvedExercises : [],
      completedDays: Array.isArray(saved.completedDays) ? saved.completedDays : [],
      quizHistory: Array.isArray(saved.quizHistory) ? saved.quizHistory : [],
      activity: saved.activity && typeof saved.activity === 'object' ? saved.activity : {},
    };
  } catch {
    return defaultState();
  }
}

function withActivity(state, amount = 1) {
  const key = todayKey();
  const next = Math.min(999, (Number(state.activity[key]) || 0) + amount);
  return { ...state.activity, [key]: next };
}

function reducer(state, action) {
  switch (action.type) {
    case 'toggle-solved': {
      const { exercise } = action;
      const exists = state.solvedExercises.some((item) => item.id === exercise.id);
      const solvedExercises = exists
        ? state.solvedExercises.filter((item) => item.id !== exercise.id)
        : [...state.solvedExercises, {
            id: exercise.id,
            title: exercise.title,
            level: exercise.level,
            levelLabel: exercise.levelLabel,
          }].sort((a, b) => a.id - b.id);
      return { ...state, solvedExercises, activity: exists ? state.activity : withActivity(state) };
    }
    case 'toggle-day': {
      const id = Number(action.dayId);
      const exists = state.completedDays.includes(id);
      const completedDays = exists
        ? state.completedDays.filter((value) => value !== id)
        : [...state.completedDays, id].sort((a, b) => a - b);
      return { ...state, completedDays, activity: exists ? state.activity : withActivity(state) };
    }
    case 'answer-challenge': {
      const question = quizBank[0];
      return {
        ...state,
        challengeDate: todayKey(),
        challengeAnswer: Number(action.answer),
        challengeCorrect: Number(action.answer) === question.answer,
        activity: withActivity(state),
      };
    }
    case 'record-quiz': {
      const quizHistory = [...state.quizHistory, action.entry].slice(-40);
      return { ...state, quizHistory, activity: withActivity(state) };
    }
    case 'reset':
      return defaultState();
    default:
      return state;
  }
}

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Chế độ riêng tư có thể chặn localStorage — bỏ qua. */
    }
  }, [state]);

  const value = useMemo(() => {
    const solvedCount = state.solvedExercises.length;
    const percent = Math.round((solvedCount / TOTAL_EXERCISES) * 100);
    const nextDay = days.find((day) => !state.completedDays.includes(day.id)) || days[days.length - 1];
    const isSolved = (id) => state.solvedExercises.some((item) => item.id === Number(id));

    return {
      state,
      dispatch,
      solvedCount,
      solvedPercent: percent,
      nextDay,
      isSolved,
      toggleSolved: (exercise) => dispatch({ type: 'toggle-solved', exercise }),
      toggleDay: (dayId) => dispatch({ type: 'toggle-day', dayId }),
      answerChallenge: (answer) => dispatch({ type: 'answer-challenge', answer }),
      recordQuiz: (entry) => dispatch({ type: 'record-quiz', entry }),
      reset: () => dispatch({ type: 'reset' }),
      todayKey,
    };
  }, [state]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress phải được dùng bên trong <ProgressProvider>.');
  return context;
}

/** Toast dùng chung: thông báo ngắn, tự biến mất. */
export function useToast() {
  return useCallback((message) => {
    window.dispatchEvent(new CustomEvent('roi-rac:toast', { detail: { message } }));
  }, []);
}
