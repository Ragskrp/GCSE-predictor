export const DIAGNOSTIC_LENGTH = 18;
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;
export const START_DIFFICULTY = 2;

export function filterQuestions(questionBank, { board, subject, tier }, { includeSeed = true } = {}) {
  return questionBank.filter(q =>
    q.board === board &&
    q.subject === subject &&
    q.tier === tier &&
    (includeSeed || q.status === 'production')
  );
}

export function nextDifficulty(currentDifficulty, correct) {
  const delta = correct ? 1 : -1;
  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty + delta));
}

export function selectNextQuestion(pool, usedIds, targetDifficulty) {
  const candidates = pool.filter(q => !usedIds.has(q.id));
  if (!candidates.length) return null;
  return candidates.slice().sort((a, b) => {
    const distance = Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty);
    if (distance !== 0) return distance;
    return String(a.id).localeCompare(String(b.id));
  })[0];
}

export function calculateWeightedScore(questions, answers) {
  const attempted = questions.slice(0, answers.length);
  const max = attempted.reduce((sum, q) => sum + q.difficulty, 0);
  const earned = attempted.reduce((sum, q, i) => sum + (answers[i] === true ? q.difficulty : 0), 0);
  return max ? earned / max : 0;
}

export function findBoundarySet(boundaries, { board, subject, tier }, year, series) {
  return boundaries.find(b =>
    b.board === board && b.subject === subject && b.tier === tier &&
    b.year === year && b.series === series
  ) || null;
}

/**
 * Converts diagnostic performance into a provisional exam-mark projection.
 * This is a calibration layer, not an assertion that 18 diagnostic questions
 * are equivalent to a full GCSE paper.
 */
export function projectRawMark(weightedScore, boundarySet) {
  if (!boundarySet) return null;
  return Math.round(Math.max(0, Math.min(1, weightedScore)) * boundarySet.maxRawScore);
}

export function gradeFromRawMark(rawMark, boundarySet) {
  if (!boundarySet || rawMark === null || rawMark === undefined) return null;
  const entries = Object.entries(boundarySet.rawScoreToGrade)
    .map(([grade, mark]) => [Number(grade), Number(mark)])
    .sort((a, b) => b[1] - a[1]);
  for (const [grade, mark] of entries) {
    if (rawMark >= mark) return grade;
  }
  return Math.min(...entries.map(([grade]) => grade));
}

export function confidenceBand(weightedScore, answeredCount) {
  if (answeredCount < 6) return 'Early';
  const certainty = Math.abs(weightedScore - 0.5);
  if (answeredCount >= 15 && certainty >= 0.25) return 'High';
  if (answeredCount >= 10 && certainty >= 0.12) return 'Medium';
  return 'Building';
}

export function findWeakTopics(questions, answers, limit = 3) {
  const misses = new Map();
  questions.slice(0, answers.length).forEach((q, i) => {
    if (answers[i] === false) {
      const key = q.specPoint || q.topic || 'Unmapped';
      misses.set(key, (misses.get(key) || 0) + 1);
    }
  });
  return [...misses.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([specPoint, count]) => ({ specPoint, misses: count }));
}

export function validateQuestionBank(questionBank) {
  const ids = new Set();
  const errors = [];
  for (const q of questionBank) {
    if (!q.id || ids.has(q.id)) errors.push(`Duplicate/missing question id: ${q.id || '(missing)'}`);
    ids.add(q.id);
    if (!q.board || !q.subject || !q.tier || !q.specPoint || !q.topic) errors.push(`Incomplete metadata: ${q.id}`);
    if (!Number.isInteger(q.difficulty) || q.difficulty < MIN_DIFFICULTY || q.difficulty > MAX_DIFFICULTY) errors.push(`Invalid difficulty: ${q.id}`);
    if (!Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`Invalid options/answer: ${q.id}`);
  }
  return { valid: errors.length === 0, errors };
}
