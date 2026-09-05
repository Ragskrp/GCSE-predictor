# GCSE Predictor

Mobile-first React/Vite PWA prototype for the GCSE Grade Predictor roadmap.

## Phase 1 currently implemented

- AQA / Edexcel board selector
- Maths / Combined Science selector
- Foundation / Higher selector
- 18-question adaptive diagnostic
- Deterministic multiple-choice marking
- Difficulty staircase, clamped to levels 1–5
- No-repeat question selection using explicit question IDs
- Difficulty-weighted diagnostic score
- Versioned grade-boundary data model
- June 2026 Maths boundary records for AQA and Edexcel
- Boundary-driven projected exam mark and estimated grade
- Confidence band that considers diagnostic completion
- Weak-topic aggregation by `specPoint`
- Share-card UI and Web Share / copy-link hooks
- Installable PWA manifest

## Content status

The repository contains **seed questions for AQA Maths Higher only**. These are product-development content, not a production GCSE assessment. They use placeholder `specPoint` values ending in `-SEED` and must be teacher-reviewed and mapped to the locked official taxonomy before student-facing release.

The UI exposes other board/subject/tier choices, but the Start button remains gated until there is enough content and a matching versioned boundary set.

## Grade boundaries

The predictor now reads boundaries as versioned data instead of hard-coding grade thresholds in the scoring function. June 2026 subject-level Maths boundaries have been added for AQA and Edexcel.

AQA publishes its grade-boundary tables on results days. Pearson publishes Edexcel grade boundaries separately. The app keeps `year` and `series` in every record so a future series can be added without rewriting the engine.

Important: a short diagnostic is **not equivalent to a full GCSE exam**. The current engine projects the diagnostic's weighted performance onto the selected boundary set as a transparent calibration aid. It must be empirically calibrated against completed exam-style assessments before the product is marketed as a reliable predictor.

## Next milestones

1. Replace seed questions with teacher-reviewed, original questions mapped to official specification points.
2. Complete the taxonomy for AQA and Edexcel Maths and Combined Science.
3. Add validated boundary records for each supported qualification and series.
4. Calibrate the diagnostic-to-grade projection using a held-out validation dataset.
5. Add automated unit/integration tests for question selection, scoring, boundaries and content validation.
6. Move diagnostic sessions/content to Firebase once the local model is stable.
7. Build the referral/deep-link flow and production share-card renderer.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.
