# Tool Workflow

Last reviewed: 2026-04-30

`app/tool/` is the canonical product workflow for Denial Fighter.

## Pages

- `page.js` - appeal input form, sample cases, client-side validation, and `/api/generate` submission.
- `results/page.js` - displays the most recent generated appeal from browser session state.
- `history/page.js` - displays saved appeal records from `/api/appeals`.
- `layout.js` - shared tool shell/navigation.

## Workflow

1. User enters fake or de-identified denial text and chart notes.
2. Client validates required fields.
3. Client calls `POST /api/generate`.
4. API returns structured appeal data.
5. Client stores the latest result in `sessionStorage`.
6. User lands on `/tool/results`.

## Agent Notes

- Do not wire upload behavior without a real parser and PHI review plan.
- Keep privacy warnings visible until the scrubber and review flow exist.
- Preserve clear empty, loading, success, error, and saved states.
