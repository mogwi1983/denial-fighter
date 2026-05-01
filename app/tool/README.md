# Tool Workflow

Last reviewed: 2026-05-01

`app/tool/` is the canonical product workflow for Denial Fighter.

## Pages

- `page.js` - appeal input form, scrub preview, explicit scrub confirmation before generate, sample cases, validation, and `/api/generate` submission.
- `results/page.js` - displays the most recent generated appeal from browser session state.
- `history/page.js` - lists saved appeals from `/api/appeals`; rows open the detail view.
- `history/[id]/page.js` - loads one saved appeal via `GET /api/appeals?id=` (scrubbed inputs + stored letter).
- `login/page.js` - Supabase magic-link sign-in.
- `layout.js` - shared tool shell/navigation.

## Workflow

1. User enters fake or de-identified denial text and chart notes.
2. Client validates required fields and shows a scrub preview; user must confirm scrubbed text before generate.
3. Client calls `POST /api/generate`.
4. API returns structured appeal data.
5. Client stores the latest result in `sessionStorage`.
6. User lands on `/tool/results`.

## Agent Notes

- Do not wire upload behavior without a real parser and PHI review plan.
- Keep privacy warnings visible; scrubbing reduces risk but is not complete de-identification.
- Preserve clear empty, loading, success, error, and saved states.
