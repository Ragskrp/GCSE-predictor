import { questionBank } from '../src/data/questionBank.js';
import { gradeBoundaries } from '../src/data/gradeBoundaries.js';
import {
  DIAGNOSTIC_LENGTH,
  START_DIFFICULTY,
  calculateWeightedScore,
  confidenceBand,
  findBoundarySet,
  gradeFromRawMark,
  nextDifficulty,
  projectRawMark,
  selectNextQuestion,
  validateQuestionBank
} from '../src/engine/predictor.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Self-check failed: ${message}`);
};

const validation = validateQuestionBank(questionBank);
assert(validation.valid, validation.errors.join('; '));
assert(DIAGNOSTIC_LENGTH === 18, 'diagnostic length should be 18');
assert(nextDifficulty(2, true) === 3, 'correct answers should increase difficulty');
assert(nextDifficulty(1, false) === 1, 'difficulty should clamp at 1');
assert(nextDifficulty(5, true) === 5, 'difficulty should clamp at 5');

const first = selectNextQuestion(questionBank, new Set(), START_DIFFICULTY);
assert(first, 'should select an initial question');
const second = selectNextQuestion(questionBank, new Set([first.id]), START_DIFFICULTY);
assert(second && second.id !== first.id, 'should not repeat a question');

const boundary = findBoundarySet(gradeBoundaries, { board: 'AQA', subject: 'Maths', tier: 'Higher' }, 2026, 'June');
assert(boundary, 'AQA Maths Higher June 2026 boundary set should exist');
assert(projectRawMark(1, boundary) === 240, '100% should project to max mark');
assert(gradeFromRawMark(219, boundary) === 9, '219 should map to grade 9');
assert(gradeFromRawMark(166, boundary) === 7, '166 should map to grade 7');

const score = calculateWeightedScore([
  { difficulty: 1 },
  { difficulty: 3 },
  { difficulty: 5 }
], [true, false, true]);
assert(score === 6 / 9, 'weighted score calculation should be deterministic');
assert(confidenceBand(score, 18) === 'High', 'high completion with strong separation should be high confidence');

console.log('GCSE Predictor self-check passed.');
