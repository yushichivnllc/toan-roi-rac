/**
 * Lớp truy cập dữ liệu bài tập.
 *
 * - `exercises.json` là bản tĩnh (200 bài, nội dung đầy đủ) do `scripts/build-exercise-data.js` sinh ra.
 * - Các endpoint `/api/*` của Express vẫn dùng được khi cần lọc/phân trang phía server.
 *
 * Toàn bộ hàm ở đây chỉ trả dữ liệu thuần, không phụ thuộc giao diện — nhờ vậy phần UI
 * có thể được thiết kế lại tự do mà không phải sửa tầng dữ liệu.
 */

const CATALOG_URL = '/exercises.json';

let catalogPromise = null;
const detailCache = new Map();

/** Tải toàn bộ catalog một lần duy nhất, các lần sau dùng lại promise. */
export function getExerciseCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(CATALOG_URL, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể tải thư viện bài tập.');
        return response.json();
      })
      .then((catalog) => {
        if (!Array.isArray(catalog)) throw new Error('Dữ liệu bài tập không hợp lệ.');
        return catalog;
      })
      .catch((error) => {
        catalogPromise = null;
        throw error;
      });
  }
  return catalogPromise;
}

export async function getExerciseById(id) {
  const numericId = Number(id);
  if (detailCache.has(numericId)) return detailCache.get(numericId);
  const catalog = await getExerciseCatalog();
  const exercise = catalog.find((item) => item.id === numericId);
  if (!exercise) throw new Error('Không tìm thấy bài tập này.');
  detailCache.set(numericId, exercise);
  return exercise;
}

export function clearExerciseCache() {
  detailCache.clear();
  catalogPromise = null;
}

/** Bản rút gọn dùng cho danh sách (không kèm lời giải để nhẹ bộ nhớ). */
export function toExerciseSummary(exercise) {
  return {
    id: exercise.id,
    title: exercise.title,
    level: exercise.level,
    levelLabel: exercise.levelLabel,
    shortLevelLabel: exercise.shortLevelLabel,
    hasSolution: Boolean(exercise.solutionMarkdown),
  };
}

/** Tìm kiếm + lọc theo mức, thuần tuý trên dữ liệu đã tải. */
export function filterExercises(catalog, { query = '', level = 0 } = {}) {
  const normalized = query.trim().toLocaleLowerCase('vi');
  return catalog
    .filter((exercise) => {
      const matchesLevel = !level || exercise.level === level;
      if (!matchesLevel) return false;
      if (!normalized) return true;
      const haystack = [
        exercise.title,
        exercise.titleMarkdown,
        exercise.promptMarkdown,
        exercise.solutionMarkdown,
      ]
        .join('\n')
        .toLocaleLowerCase('vi');
      return haystack.includes(normalized);
    })
    .map(toExerciseSummary);
}

export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    pages: Math.max(1, Math.ceil(items.length / pageSize)),
    page,
  };
}

export async function fetchHealth() {
  const response = await fetch('/api/health');
  if (!response.ok) throw new Error('Máy chủ không phản hồi.');
  return response.json();
}
