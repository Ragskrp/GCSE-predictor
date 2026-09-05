# GCSE Predictor

Mobile-first React/Vite PWA prototype for the GCSE Grade Predictor roadmap.

## Phase 1 currently implemented

- AQA / Edexcel board selector
- Maths / Combined Science selector
- Foundation / Higher selector
- 18-question diagnostic shell
- Deterministic multiple-choice marking
- Difficulty staircase (correct -> harder, incorrect -> easier)
- Difficulty-weighted score
- Estimated grade and confidence band
- Weak-topic aggregation by `specPoint`
- Share-card UI and Web Share / copy-link hooks
- Installable PWA manifest

## Current content boundary

The repository currently contains **seed content for AQA Maths Higher only**. The other board/subject/tier combinations are intentionally blocked until their questions have been created, checked and mapped.

The current grade thresholds are a development scaffold, not official board grade boundaries. Before launch, populate `src/data/gradeBoundaries.js` with verified, versioned AQA/Edexcel boundary records and replace the provisional grade mapping in `src/engine/predictor.js` with boundary-driven scoring.

Likewise, the `specPoint` values ending in `-SEED` are placeholders. They must be replaced with the locked official taxonomy before student-facing release.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.
