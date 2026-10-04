const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { LEVELS, extractExercises } = require('./lib/exercises');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const README_PATH = path.join(ROOT, 'README.md');

const readme = fs.readFileSync(README_PATH, 'utf8');
const exercises = extractExercises(readme);
const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

app.disable('x-powered-by');
app.use('/vendor/gsap', express.static(path.join(ROOT, 'node_modules', 'gsap', 'dist'), {
  fallthrough: false,
  maxAge: '1d',
}));
app.use(express.static(PUBLIC_DIR, { etag: true, maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, app: 'Rời Rạc', exerciseCount: exercises.length });
});

app.get('/api/levels', (_request, response) => {
  response.json({ levels: LEVELS, total: exercises.length });
});

app.get('/api/exercises', (request, response) => {
  const query = String(request.query.q || '').trim().toLocaleLowerCase('vi');
  const selectedLevel = Number(request.query.level) || 0;
  const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);
  const limit = Math.min(30, Math.max(1, Number.parseInt(request.query.limit, 10) || 10));

  const filtered = exercises.filter((exercise) => {
    const matchesLevel = !selectedLevel || exercise.level === selectedLevel;
    const matchesQuery = !query || exercise.searchableText.includes(query);
    return matchesLevel && matchesQuery;
  });
  const start = (page - 1) * limit;
  const results = filtered.slice(start, start + limit).map((exercise) => ({
    id: exercise.id,
    title: exercise.title,
    level: exercise.level,
    levelLabel: exercise.levelLabel,
    shortLevelLabel: exercise.shortLevelLabel,
    hasSolution: Boolean(exercise.solutionMarkdown),
  }));

  response.json({
    results,
    total: filtered.length,
    page,
    limit,
    pages: Math.ceil(filtered.length / limit),
  });
});

app.get('/api/exercises/:id', (request, response) => {
  const id = Number.parseInt(request.params.id, 10);
  const exercise = exerciseById.get(id);
  if (!exercise) {
    return response.status(404).json({ error: 'Không tìm thấy bài tập này.' });
  }

  return response.json({
    id: exercise.id,
    title: exercise.title,
    titleMarkdown: exercise.titleMarkdown,
    level: exercise.level,
    levelLabel: exercise.levelLabel,
    shortLevelLabel: exercise.shortLevelLabel,
    promptMarkdown: exercise.promptMarkdown,
    solutionMarkdown: exercise.solutionMarkdown,
    hasSolution: Boolean(exercise.solutionMarkdown),
  });
});

app.get('*', (_request, response, next) => {
  if (_request.path.startsWith('/api/')) return next();
  response.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.use((error, _request, response, _next) => {
  console.error(error);
  if (response.headersSent) return;
  response.status(error.status || 500).json({ error: 'Máy chủ gặp sự cố. Vui lòng thử lại.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rời Rạc đang chạy tại http://0.0.0.0:${PORT}`);
  console.log(`Đã nạp ${exercises.length} bài tập từ README.md`);
});
