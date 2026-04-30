# Denial Fighter Agent Instructions

This repo is intentionally managed by multiple AI agents with James providing product oversight. Keep this file small: it is the boot index that points agents to the right local context only when needed.

## Always-On Rules

- Treat denial notices and chart notes as potential PHI.
- Use fake or de-identified data during development.
- Do not store raw PHI by default.
- Do not send raw PHI to an LLM by default.
- Do not claim HIPAA readiness unless BAAs, access controls, audit logs, retention policies, and provider requirements are actually in place.
- Do not overwrite or revert user/agent changes you did not make unless the user explicitly asks.
- Do not commit, push, deploy, or force-push without explicit permission.
- For meaningful work, update or prepare the Supabase progress tracker step.
- Prefer existing code patterns over new abstractions.
- Keep changes small, focused, and verified.

## Source Of Truth Order

1. User's latest direct request.
2. This `AGENTS.md` file.
3. `MAY_BUILD_PLAN.md`.
4. `docs/architecture-data-flow.md`.
5. Task-specific docs linked below.
6. Nearby code comments and existing implementation patterns.

## Agent Entry Points

- Codex: read this file directly.
- Claude Code: `CLAUDE.md` points here.
- Gemini CLI: `GEMINI.md` points here.
- Cursor: `.cursor/rules/denial-fighter.mdc` points here.

## Read Only What You Need

- Quick orientation: `docs/agents/context-pack.md`
- Product rules: `docs/agents/product-rules.md`
- PHI and security: `docs/agents/phi-security-rules.md`
- Frontend work: `docs/agents/frontend-rules.md`
- Backend/API work: `docs/agents/backend-rules.md`
- Daily startup questions: `docs/agents/daily-startup-protocol.md`
- Git and verification: `docs/agents/git-verification-rules.md`
- Progress tracker: `docs/runbooks/progress-tracker.md`
- Handoff format: `docs/agents/handoff-template.md`
- Change checklist: `docs/checklists/agent-change-checklist.md`

## Project Map

- `app/` - Next.js App Router pages, layouts, and API routes. See `app/README.md`.
- `app/api/` - backend endpoints. See `app/api/README.md`.
- `app/tool/` - canonical appeal workflow. See `app/tool/README.md`.
- `lib/` - shared app logic. See `lib/README.md`.
- `docs/` - project, agent, runbook, checklist, ADR, and SQL docs. See `docs/README.md`.
- `scripts/` - deterministic helper scripts.
- `tests/` - future test structure and fake fixtures. See `tests/README.md`.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run build
npm run check
```

There is no dedicated test command yet. If tests are added, document the command in `package.json`, `README.md`, and the nearest relevant folder README.

## Environment Variables

Expected local variables:

- `DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never hardcode secrets. Never print secret values into logs or chat. If checking `.env.local`, mask values.
