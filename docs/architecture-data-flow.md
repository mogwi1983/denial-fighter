# Denial Fighter Architecture And Data Flow

Last reviewed: 2026-04-29

## Sprint 0 Baseline

Denial Fighter is a Next.js 14 App Router app. The current product workflow is mostly client-rendered React pages that call Next.js API routes. The API routes call the AI provider and Supabase.

The immediate product goal is to make `/tool` the canonical appeal workflow before adding the PHI scrubber and appeal history polish.

## Canonical Routes

Use these as the main product routes:

| Route | File | Current role |
| --- | --- | --- |
| `/tool` | `app/tool/page.js` | Main appeal creation workflow. |
| `/tool/results` | `app/tool/results/page.js` | Displays the most recent generated appeal from `sessionStorage`. |
| `/tool/history` | `app/tool/history/page.js` | Lists saved appeals from `/api/appeals`. |
| `/landing` | `app/landing/page.js` | Marketing/pricing page. |

Routes to reconcile later:

| Route | File | Current issue |
| --- | --- | --- |
| `/` | `app/page.js` | Duplicates much of `/tool` and has its own sidebar shell. Decide whether it should redirect to `/tool` during product builds or become the public landing page later. |
| `/results` | `app/results/page.js` | Legacy results view with older styling and links back to `/`. |
| `/history` | `app/history/page.js` | Legacy history view with older styling and links back to `/`. |

Current routing decision: keep `/tool`, `/tool/results`, and `/tool/history` as the canonical app workflow. Do not delete the legacy root routes yet; document them until the Week 1 flow is stable.

## Current Data Flow

1. Browser user enters denial notice, chart notes, diagnosis, and payer in `app/tool/page.js`.
2. The client sends a `POST` request to `/api/generate` with:
   - `denialText`
   - `chartNotes`
   - `patientDiagnosis`
   - `payerName`
3. `app/api/generate/route.js` validates that denial text and chart notes exist.
4. The route calls `analyzeWithChartNotes` from `lib/ai.js`.
5. `lib/ai.js` sends the denial text and chart notes to the DeepSeek-compatible OpenAI client using `DEEPSEEK_API_KEY`.
6. The model is asked to return JSON with:
   - `payer`
   - `denialReason`
   - `evidenceNeeded`
   - `evidenceCovered`
   - `evidenceGaps`
   - `appealLetter`
7. `/api/generate` inserts the generated appeal into Supabase table `denial_appeals`.
8. `/api/generate` returns predictable product data to the browser:
   - `success`
   - `appeal`
   - `analysis`
   - `id`
   - `processingTime`
9. The client stores the response in `sessionStorage` as `lastAppeal`.
10. The client navigates to `/tool/results`.
11. `/tool/results` reads `lastAppeal` from `sessionStorage`, displays the analysis and letter, and supports copy/download.
12. `/tool/history` calls `GET /api/appeals`, which reads saved records from Supabase.

## Current Supabase Usage

`lib/supabase.js` creates one Supabase client using:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`, falling back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Current app table usage:

- `denial_appeals` stores generated appeals.
- `/api/generate` inserts records.
- `/api/appeals` lists records, reads one record by `id`, and patches status/feedback.

Progress tracker usage is separate from app appeal storage. The May project progress tracker uses:

- `projects`
- `project_milestones`
- `project_steps`
- `project_reviews`

## PHI And Security Risks In The Current Build

These are expected Sprint 0 findings, not failures. They are the exact reasons Week 2 exists.

- Raw denial text and chart notes can be pasted into the browser.
- `/api/generate` currently sends raw denial text and chart notes to the AI provider.
- `/api/generate` currently stores raw `denial_text` and `chart_notes` in Supabase.
- The app does not yet have a deterministic PHI scrubber or review step.
- `app/tool/page.js` says "HIPAA Compliant. Data is encrypted and never used for training." This should be softened before any real-user testing unless the required compliance posture is actually in place.
- `app/landing/page.js` also claims HIPAA compliance in FAQ copy. This should become a plain-English beta privacy note until BAAs, access controls, audit logs, retention policies, and provider requirements are real.
- Upload UI is currently mock behavior and does not extract document text.

## Next Implementation Steps

1. Use fake fixture cases for development and demos.
2. Keep `/tool` as the primary workflow and avoid improving legacy `/history` or `/results` unless they are being removed or redirected.
3. Add a visible beta warning before Week 1 testing: do not paste real PHI.
4. Harden `/api/generate` responses so errors always return a consistent JSON shape.
5. Build the deterministic PHI scrubber before storing or sending real clinical text.

## Learning Note

In the App Router, files under `app/**/page.js` define user-facing pages. Files under `app/api/**/route.js` define backend endpoints. A client component can call an API route with `fetch`, but API routes can safely use server-only environment variables such as `DEEPSEEK_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.
