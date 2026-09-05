// Versioned subject-level boundaries. These are data, not code, so each
// awarding series can be updated without changing the scoring engine.
//
// AQA publishes grade-boundary tables on results day. The June 2026 table is
// available from AQA's Grade boundaries page. The values below are the
// AQA GCSE Mathematics (8300) subject-level boundaries for June 2026.
// Source: https://www.aqa.org.uk/exams-administration/results-days/grade-boundaries
export const gradeBoundaries = [
  {
    board: 'AQA',
    subject: 'Maths',
    tier: 'Foundation',
    year: 2026,
    series: 'June',
    maxRawScore: 240,
    rawScoreToGrade: { 5: 187, 4: 154, 3: 115, 2: 76, 1: 38 },
    source: 'AQA GCSE grade boundaries June 2026',
    sourceUrl: 'https://www.aqa.org.uk/exams-administration/results-days/grade-boundaries'
  },
  {
    board: 'AQA',
    subject: 'Maths',
    tier: 'Higher',
    year: 2026,
    series: 'June',
    maxRawScore: 240,
    rawScoreToGrade: { 9: 219, 8: 192, 7: 166, 6: 131, 5: 97, 4: 63, 3: 46 },
    source: 'AQA GCSE grade boundaries June 2026',
    sourceUrl: 'https://www.aqa.org.uk/exams-administration/results-days/grade-boundaries'
  },
  {
    board: 'Edexcel',
    subject: 'Maths',
    tier: 'Foundation',
    year: 2026,
    series: 'June',
    maxRawScore: 240,
    rawScoreToGrade: { 5: 181, 4: 151, 3: 110, 2: 69, 1: 29 },
    source: 'Pearson Edexcel GCSE grade boundaries June 2026',
    sourceUrl: 'https://qualifications.pearson.com/en/support/support-topics/results-certification/grade-boundaries.html'
  },
  {
    board: 'Edexcel',
    subject: 'Maths',
    tier: 'Higher',
    year: 2026,
    series: 'June',
    maxRawScore: 240,
    rawScoreToGrade: { 9: 208, 8: 177, 7: 146, 6: 114, 5: 82, 4: 50, 3: 34 },
    source: 'Pearson Edexcel GCSE grade boundaries June 2026',
    sourceUrl: 'https://qualifications.pearson.com/en/support/support-topics/results-certification/grade-boundaries.html'
  }
];
