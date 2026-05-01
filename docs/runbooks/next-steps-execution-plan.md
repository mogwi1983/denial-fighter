# Next Steps Execution Plan (serial)

Last updated: 2026-05-01

Internal checklist aligned with **May Week 2 PHI objectives** (privacy copy + scrub limits) and early **Week 3 monetization path** (landing/waitlist hooks). Execute **in order**.

## Step 1 — Privacy and data handling page

- Add `app/privacy/page.js` with beta-safe language: what users paste, browser retention, deterministic scrub scope and limits, AI routing (scrubbed-only), Supabase persistence defaults, sessionStorage for last result, no HIPAA readiness claims.
- Export page `metadata` for title/description.

## Step 2 — Surface Privacy in the product shell

- Add a **Privacy** link in `app/tool/layout.js` (sidebar nav).
- Add **Privacy** to `app/landing/page.js` footer (and header nav next to FAQ/pricing as appropriate).

## Step 3 — Extend deterministic scrubber coverage

- Update `lib/scrubPhiDeterministic.js` with additional labeled patterns (fax numbers, group/plan identifiers, prior-authorization reference numbers, labeled NPI digits) ordered with existing pipeline.
- Keep placeholders consistent; avoid aggressive unlabeled patterns that strip clinical content.

## Step 4 — Landing: canonical app links + pilot waitlist hook

- Point primary CTAs (`Launch App`, hero **Try** button, pricing **Get Started** / free tier) to **`/tool`** instead of `/`.
- Add a short **Pilot / waitlist** section with `mailto:` using `NEXT_PUBLIC_WAITLIST_EMAIL` when set (fallback to existing contact address). No backend or PHI collection in-app.
- Document `NEXT_PUBLIC_WAITLIST_EMAIL` in `.env.example`.

## Step 5 — Plan and architecture snapshot + verify

- Refresh `MAY_BUILD_PLAN.md` execution rows (privacy story, landing/waitlist starter).
- Update `docs/architecture-data-flow.md` canonical routes + short privacy pointer.
- Run `npm run check`.

After completion: mirror completed tracker steps in the productivity Supabase project per `docs/runbooks/progress-tracker.md`.

## Completion log

- **2026-05-01:** Steps 1–5 executed in-repo (`/privacy`, nav links, scrubber extensions, landing CTAs + waitlist env, docs + `npm run check`).
