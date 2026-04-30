# Backend Rules

Last reviewed: 2026-04-30

## API Routes

- Validate required request fields before calling external APIs.
- Return predictable JSON responses.
- Keep errors readable and actionable.
- Do not print secrets or raw PHI into logs.
- Normalize inputs at the API boundary.

## AI Provider

- Keep prompt logic in `lib/ai.js` unless a larger refactor is intentional.
- Do not invent clinical facts, dates, identifiers, or guidelines in prompts.
- Ask models for structured output when the UI expects structured output.
- Preserve the beta/de-identified safety posture in prompt language.

## Supabase

- Store scrubbed/de-identified text by default.
- Keep raw input storage opt-in, documented, and justified.
- Make Supabase schema changes through ordered SQL files in `docs/`.
- Name SQL files like `001_create_x_table.sql`, `002_change_rls_policy.sql`, or `003_add_foreign_key.sql`.
- Document database schema changes in `docs/` over time.
