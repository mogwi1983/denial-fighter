# Agent Change Checklist

Last reviewed: 2026-04-30

## Before Editing

- Read `AGENTS.md`.
- Run `git status --short --branch`.
- Read every file you plan to edit.
- Confirm whether the work touches PHI, API prompts, persistence, auth, or Supabase schema.
- Mark or prepare the Supabase tracker step as `in_progress`.

## While Editing

- Keep the change scoped to the user's request.
- Avoid unrelated refactors.
- Use fake or de-identified examples only.
- Add comments for non-obvious PHI, security, data-flow, or agent handoff logic.
- Update docs if routes, env vars, schema, commands, or workflows change.

## Before Final Response

- Run the most relevant check.
- Inspect `git status --short`.
- Mark completed tracker steps and run sync when available.
- Report changed files, verification, tracker state, and the next action.
