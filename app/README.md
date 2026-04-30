# App Directory

Last reviewed: 2026-04-30

This folder uses the Next.js App Router. Files named `page.js` define routes. Files named `layout.js` define route shells.

## Route Map

Canonical product workflow:

- `/tool` - main appeal creation workflow.
- `/tool/results` - generated appeal result view.
- `/tool/history` - saved appeal history.

Other routes:

- `/` - root app surface; currently overlaps with the appeal tool.
- `/landing` - marketing/pricing surface.
- `/history` - legacy history route.
- `/results` - legacy results route.
- `/summerschool` - separate summer-school route added outside the core appeal workflow.

## Agent Notes

- Prefer `/tool` for product workflow changes.
- Do not delete or redirect legacy routes unless the task explicitly calls for reconciliation.
- Keep PHI warnings visible anywhere users can paste clinical text.
- Update `docs/architecture-data-flow.md` when route ownership or data flow changes.
