export const DIAGNOSTIC_LENGTH = 18;
export const START_DIFFICULTY = 2;

export function filterQuestions(questionBank, { board, subject, tier }) {
  return questionBank.filter(q => q.board === board && q.subject === subject && q.tier === tier);
}

/** Simple v1 staircase: correct -> harder, incorrect -> easier, clamped to 1..5. */
export function nextDifficulty(currentDifficulty, correct) {
  return Math.max(1, Math.min(5, currentDifficulty + (correct ? 1 : -1)));
}

/** Select the nearest unused question to the current difficulty. */
export function selectNextQuestion(pool, usedIds, targetDifficulty) {
  const candidates = pool.filter(q => !usedIds.has(q.id));
  if (!candidates.length) return null;
  return candidates
    .slice()
    .sort((a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty))[0];
}

/** Difficulty-weighted raw score, intentionally deterministic and explainable. */
export function calculateWeightedScore(questions, answers) {
  const max = questions.reduce((sum, q) => sum + q.difficulty, 0);
  const earned = questions.reduce((sum, q, i) => sum + (answers[i] === true ? q.difficulty : 0), 0);
  return max ? earned / max : 0;
}

export function estimateGrade(weightedScore) {
  if (weightedScore >= 0.90) return 9;
  if (weightedScore >= 0.80) return 8;
  if (weightedScore >= 0.70) return 7;
  if (weightedScore >= 0.60) return 6;
  if (weightedScore >= 0.50) return 5;
  if (weightedScore >= 0.40) return 4;
  if (weightedScore >= 0.30) return 3;
  if (weightedScore >= 0.20) return 2;
  return 1;
}

export function confidenceBand(weightedScore) {
  if (weightedScore >= 0.80 || weightedScore <= 0.20) return 'High';
  if (weightedScore >= 0.55 || weightedScore <= 0.45) return 'Medium';
  return 'Building';
}

export function findWeakTopics(questions, answers, limit = 3) {
  const misses = new Map();
  questions.forEach((q, i) => {
    if (answers[i] === false) misses.set(q.specPoint, (misses.get(q.specPoint) || 0) + 1);
  });
  return [...misses.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([specPoint, misses]) => ({ specPoint, misses }));
}
