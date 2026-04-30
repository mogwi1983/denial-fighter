# Docs Directory

Last reviewed: 2026-04-30

This folder holds planning, architecture, runbooks, SQL, and agent coordination docs.

## Map

- `architecture-data-flow.md` - current routes, API flow, AI provider flow, Supabase usage, and PHI risks.
- `fake-appeal-cases.md` - fake examples for demos and development.
- `001_lock_down_denial_appeals_rls.sql` - ordered Supabase SQL.
- `agents/` - modular agent instructions.
- `runbooks/` - repeatable operating procedures.
- `checklists/` - preflight and closeout checklists.
- `adr/` - architecture decision records.

## Update Rules

- Update architecture docs when routes, payloads, persistence, or PHI movement changes.
- Add ordered SQL files for Supabase schema or policy changes.
- Add ADRs for decisions future agents are likely to question.
- Keep docs concise enough for agents to load selectively.
