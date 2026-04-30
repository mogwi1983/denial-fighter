# Frontend Rules

Last reviewed: 2026-04-30

## Product UI

- Build the actual tool experience first, not a marketing-only landing page.
- Use clear form states: empty, loading, success, error, saved.
- Make generated appeal results easy to scan, copy, edit, and export.
- Avoid UI text that explains obvious mechanics.
- Keep product surfaces calm, clinical, and workflow-focused.
- Do not let text overflow buttons, cards, or panels.

## App Router

- `app/**/page.js` files are user-facing pages.
- `app/**/layout.js` files define shared route shells.
- Client components must start with `'use client'`.
- Keep `/tool`, `/tool/results`, and `/tool/history` as the canonical product workflow unless the task explicitly changes routing.

## Design Bias

- Prefer dense, organized workflow UI over marketing-style composition inside the tool.
- Use responsive layouts that work on mobile and desktop.
- Keep controls predictable and accessible.
- Add comments only where they explain non-obvious product, state, or PHI behavior.
