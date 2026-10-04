const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { extractExercises, levelForExercise } = require('../lib/exercises');

const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');

test('parses all 200 exercise prompts from the study guide', () => {
  const exercises = extractExercises(readme);
  assert.equal(exercises.length, 200);
  assert.equal(exercises[0].id, 1);
  assert.equal(exercises.at(-1).id, 200);
  assert.match(exercises[0].title, /Σ = \{a, b, c\}/);
  assert.match(exercises[0].title, /ε/);
  assert.doesNotMatch(exercises[0].title, /`/);
});

test('assigns each exercise to the five README difficulty bands', () => {
  assert.equal(levelForExercise(1).id, 1);
  assert.equal(levelForExercise(40).id, 1);
  assert.equal(levelForExercise(41).id, 2);
  assert.equal(levelForExercise(125).id, 3);
  assert.equal(levelForExercise(126).id, 4);
  assert.equal(levelForExercise(200).id, 5);
});

test('keeps the exercise prompt and worked solution separate for exercise details', () => {
  const exercises = extractExercises(readme);
  const exercise = exercises.find(({ id }) => id === 41);
  assert.match(exercise.title, /Viết dẫn xuất đầy đủ/);
  assert.match(exercise.solutionMarkdown, /I ⊢ aIb/);
  assert.doesNotMatch(exercise.solutionMarkdown, /Cho G =/);

  const finalExercise = exercises.find(({ id }) => id === 200);
  assert.doesNotMatch(finalExercise.solutionMarkdown, /PHỤ LỤC A/);
});
