# Denial Fighter Architecture And Data Flow

Last reviewed: 2026-05-01

## Sprint 0 Baseline

Denial Fighter is a Next.js 14 App Router app. The current product workflow is mostly client-rendered React pages that call Next.js API routes. The API routes call the AI provider and Supabase.

The canonical workflow lives under `/tool`, including deterministic PHI-style scrubbing before model calls and scrubbed persistence.

## Canonical Routes

Use these as the main product routes:

| Route | File | Current role |
| --- | --- | --- |
| `/tool` | `app/tool/page.js` | Main appeal creation workflow with scrub preview. |
| `/tool/results` | `app/tool/results/page.js` | Displays the most recent generated appeal from `sessionStorage`. |
| `/tool/history` | `app/tool/history/page.js` | Lists saved appeals from `/api/appeals`; opens detail per row. |
| `/tool/history/[id]` | `app/tool/history/[id]/page.js` | Loads one appeal via `GET /api/appeals?id=`. |
| `/landing` | `app/landing/page.js` | Marketing/pricing page; pilot mailto waitlist; links to `/tool` and `/privacy`. |
| `/privacy` | `app/privacy/page.js` | Beta privacy and data-handling (scrub scope, AI, storage). |
| `/tool/login` | `app/tool/login/page.js` | Email magic link (Supabase Auth). |
| `/auth/callback` | `app/auth/callback/page.js` | OAuth/magic-link code exchange → session. |

Routes to reconcile later:

| Route | File | Current issue |
| --- | --- | --- |
| `/` | `app/page.js` | Duplicates much of `/tool` and has its own sidebar shell. Decide whether it should redirect to `/tool` during product builds or become the public landing page later. |
| `/results` | `app/results/page.js` | Legacy results view with older styling and links back to `/`. |
| `/history` | `app/history/page.js` | Legacy history view with older styling and links back to `/`. |

Current routing decision: keep `/tool`, `/tool/results`, and `/tool/history` as the canonical app workflow. Do not delete the legacy root routes yet; document them until the Week 1 flow is stable.

## Current Data Flow

1. Browser user enters denial notice, chart notes, diagnosis, and payer in `app/tool/page.js`.
2. The client computes a **scrub preview** using `scrubAppealInputs` from `lib/scrubPhiDeterministic.js` (same rules as the server). The user must **confirm** the scrubbed preview before submit is enabled.
3. When signed in, the browser attaches `Authorization: Bearer <access_token>` (via `fetchWithAuth`) so `/api/generate` can persist `user_id` and `/api/appeals` can scope rows.
4. The client sends a `POST` request to `/api/generate` with:
   - `denialText`
   - `chartNotes`
   - `patientDiagnosis`
   - `payerName`
5. `app/api/generate/route.js` validates raw denial text and chart notes (required, combined length cap).
6. The route runs `scrubAppealInputs` again server-side and rejects if scrubbing removes all substantive content from denial or chart notes.
7. The route calls `analyzeWithChartNotes` from `lib/ai.js` with **scrubbed** denial text and chart notes only.
8. `lib/ai.js` sends scrubbed text to the DeepSeek-compatible OpenAI client using `DEEPSEEK_API_KEY`.
9. The model is asked to return JSON with:
   - `payer`
   - `denialReason`
   - `evidenceNeeded`
   - `evidenceCovered`
   - `evidenceGaps`
   - `appealLetter`
10. `/api/generate` inserts the generated appeal into Supabase table `denial_appeals` only when persistence is enabled. Inserts use **scrubbed** `denial_text`, `chart_notes`, diagnosis, payer, and age fields — not the raw pasted blobs — and **`user_id`** when the request includes a valid Supabase JWT (requires `docs/002_denial_appeals_user_id.sql`).
11. `/api/generate` returns predictable product data to the browser:
    - `success`
    - `appeal`
    - `analysis`
    - `id`
    - `saved`
    - `processingTime`
    - `scrubSummary` (replacement counts by category)
    - `generatedFromScrubbedInput` (`true`)
12. The client stores the response in `sessionStorage` as `lastAppeal`.
13. The client navigates to `/tool/results`.
14. `/tool/results` reads `lastAppeal` from `sessionStorage`, displays scrub summary when present, shows analysis and letter, and supports copy/download.
15. `/tool/history` calls `GET /api/appeals` with optional Bearer token. **Production** requires sign-in unless `ALLOW_PUBLIC_APPEAL_HISTORY=true`; **development** allows anonymous listing unless `APPEALS_REQUIRE_LOGIN=true`. With a signed-in user, queries filter **`user_id`**.
16. `/tool/history/[id]` calls `GET /api/appeals?id=` for a single row (scrubbed inputs and stored letter), scoped the same way.

## Supabase Auth (local setup)

1. Enable the Email provider in the Supabase dashboard (magic link).
2. Add redirect URLs: site URL and `http://localhost:3005/auth/callback` (see `npm run dev` port in `package.json`).
3. Run `docs/002_denial_appeals_user_id.sql` so inserts can store `user_id`.

## Current Supabase Usage

`lib/supabase.js` creates one Supabase client using:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Current app table usage:

- `denial_appeals` stores generated appeals.
- `/api/generate` inserts records in local development by default. In production, set `SAVE_GENERATED_APPEALS=true` only when storage is intentional.
- `/api/appeals` lists and reads records using the **service role** but applies **application-level** filters: signed-in users only see their `user_id`; see `lib/appealsAccess.js`. Use `ALLOW_PUBLIC_APPEAL_HISTORY=true` only for intentional demos (lists are not user-filtered).

Progress tracker usage is separate from app appeal storage. The May project progress tracker uses:

- `projects`
- `project_milestones`
- `project_steps`
- `project_reviews`

## PHI And Security Notes In The Current Build

- Users can still paste sensitive content into the browser; the scrubber reduces common identifier patterns but **does not** guarantee HIPAA Safe Harbor or complete de-identification.
- Raw pasted text exists in the browser DOM until navigation; only scrubbed text is sent to the API for generation and stored when persistence is on.
- `/api/generate` must not log raw request bodies; avoid printing pasted clinical text to server logs.
- `app/tool/page.js` and `app/landing/page.js` use beta privacy language instead of claiming HIPAA compliance.
- Upload UI is currently mock behavior and does not extract document text.

## Next Implementation Steps

1. Use fake fixture cases for development and demos.
2. Keep `/tool` as the primary workflow and avoid improving legacy `/history` or `/results` unless they are being removed or redirected.
3. Run `docs/001_lock_down_denial_appeals_rls.sql` in Supabase before public testing.
4. Extend scrub patterns and tune false positives without logging raw clinical text.
5. Gate production appeal history behind auth instead of `ALLOW_PUBLIC_APPEAL_HISTORY` demos.

## Learning Note

In the App Router, files under `app/**/page.js` define user-facing pages. Files under `app/api/**/route.js` define backend endpoints. A client component can call an API route with `fetch`, but API routes can safely use server-only environment variables such as `DEEPSEEK_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.
