const fs = require('node:fs');
const path = require('node:path');
const { extractExercises } = require('../lib/exercises');

const root = path.join(__dirname, '..');
const readmePath = path.join(root, 'README.md');
const outputPath = path.join(root, 'public', 'exercises.json');
const readme = fs.readFileSync(readmePath, 'utf8');
const exercises = extractExercises(readme).map(({ searchableText: _searchableText, ...exercise }) => exercise);

fs.writeFileSync(outputPath, `${JSON.stringify(exercises)}\n`);
console.log(`Đã tạo ${path.relative(root, outputPath)} với ${exercises.length} bài tập.`);
