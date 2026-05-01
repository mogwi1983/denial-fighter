# Agent Context Pack

Last reviewed: 2026-05-01

Use this as the fast orientation file when a new AI agent enters the repo.

## Product

Denial Fighter generates Medicare Advantage appeal letters from denial notices and chart notes. The intended product workflow is:

1. User enters denial notice and chart notes.
2. App previews and applies deterministic scrubbing for likely identifiers (not full HIPAA de-ID).
3. User reviews scrubbed text and confirms it before generation.
4. Scrubbed text is sent to the AI API.
5. App returns structured appeal output.
6. User can edit, copy, export, save, and revisit the appeal.

## Current Canonical Surface

Use `/tool` as the main app workflow.

Canonical files:

- `app/README.md` - route map and App Router notes.
- `app/tool/page.js` - appeal creation workflow.
- `app/tool/results/page.js` - generated appeal result view.
- `app/tool/history/page.js` - saved appeal history list.
- `app/tool/history/[id]/page.js` - single saved appeal from `/api/appeals?id=`.
- `app/tool/README.md` - workflow-specific notes.
- `app/landing/page.js` - marketing site; pilot waitlist mailto; CTAs to `/tool`.
- `app/privacy/page.js` - beta privacy / data-handling narrative.
- `app/tool/login/page.js` - magic-link sign-in.
- `app/auth/callback/page.js` - Auth redirect handler.
- `app/api/generate/route.js` - AI generation API route.
- `app/api/appeals/route.js` - appeal persistence API route.
- `app/api/README.md` - endpoint contracts.
- `lib/ai.js` - AI provider client and prompt logic.
- `lib/scrubPhiDeterministic.js` - deterministic scrub shared by `/tool` preview and `/api/generate`.
- `lib/supabase.js` - Supabase client.
- `lib/README.md` - shared logic notes.

Legacy or parallel routes exist under `/`, `/results`, and `/history`. Do not improve these unless the task explicitly names them or asks for route reconciliation.

## Safety Invariants

- Development examples must use fake or de-identified data.
- Raw PHI must not be stored by default.
- Raw PHI must not be sent to the LLM by default once the scrubber exists.
- The first scrubber must be deterministic code, not AI detection.
- Product copy must say scripted de-identification reduces risk but does not guarantee HIPAA de-identification.

## Tracker

Parent project id:

```txt
e3ead243-c8d0-4cf3-95f5-baeaedca10e8
```

For meaningful work, mark or prepare a `project_steps` update at start and completion. See `docs/runbooks/progress-tracker.md`.

## Checks

Common commands:

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run build
npm run check
```

`npm run check` currently runs lint and production build. There is no dedicated test command yet.
