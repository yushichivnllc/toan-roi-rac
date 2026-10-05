import { useCallback, useEffect, useState } from 'react';
import { viewOrder } from '../data/overview.js';

const DEFAULT_VIEW = 'overview';

function readHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return viewOrder.includes(raw) ? raw : DEFAULT_VIEW;
}

/**
 * Điều hướng theo hash (`#/practice`) — nhẹ, không cần router ngoài,
 * vẫn cho phép chia sẻ liên kết trực tiếp tới từng màn hình.
 */
export function useHashRoute() {
  const [view, setViewState] = useState(() => (typeof window === 'undefined' ? DEFAULT_VIEW : readHash()));

  useEffect(() => {
    const onHashChange = () => setViewState(readHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setView = useCallback((next, options = {}) => {
    if (!viewOrder.includes(next)) return;
    if (readHash() !== next) window.location.hash = `/${next}`;
    else setViewState(next);
    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
  }, []);

  return [view, setView];
}
