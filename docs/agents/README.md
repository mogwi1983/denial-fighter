# AI Agent Operating Guide

Last reviewed: 2026-04-30

Denial Fighter is expected to be created and maintained mostly by AI agents, with James acting as product owner and reviewer. This directory gives Codex, Claude Code, Cursor, Gemini CLI, and future agents a shared operating model.

## Source Of Truth Order

When instructions conflict, use this order:

1. User's latest direct request in the current conversation.
2. `AGENTS.md` at the repo root.
3. `MAY_BUILD_PLAN.md` for roadmap, weekly scope, and product intent.
4. `docs/architecture-data-flow.md` for current app routes and data flow.
5. This `docs/agents/` directory for collaboration habits and handoffs.
6. Nearby code comments and existing implementation patterns.

## Agent Workflow

Before meaningful work:

1. Read `AGENTS.md`.
2. Check `git status --short --branch`.
3. Read the files you plan to edit before changing them.
4. Check or prepare the Supabase tracker update described in `AGENTS.md`.
5. Identify the smallest deliverable that advances the current sprint.

During work:

1. Keep changes focused and reversible.
2. Prefer existing patterns over new frameworks.
3. Leave comments only when future agents would otherwise miss product, PHI, or data-flow intent.
4. Keep raw PHI out of examples, logs, tests, prompts, and database seed data.
5. Update docs when behavior, routes, env vars, schema, or workflow expectations change.

Before handing off:

1. Run the most relevant check, usually `npm run build` or the narrower script documented in `package.json`.
2. Update the tracker or document the exact tracker update that could not be applied.
3. Summarize changed files, verification, tracker state, and next action.

## Collaboration Rules

- Do not overwrite another agent's or user's uncommitted changes.
- Do not commit, push, deploy, or force-push without explicit permission.
- Do not introduce real patient data.
- Do not claim HIPAA readiness unless the required BAAs, controls, audit logs, retention policy, and provider requirements are actually complete.
- When a file exists only to point another agent tool at `AGENTS.md`, keep it short and avoid duplicating the full instruction set.

## Agent-Friendly Documentation Map

- `docs/agents/context-pack.md` - quick repo orientation for a fresh agent.
- `docs/agents/product-rules.md` - product direction and learning-mode rules.
- `docs/agents/phi-security-rules.md` - PHI, de-identification, and safety rules.
- `docs/agents/frontend-rules.md` - frontend and App Router expectations.
- `docs/agents/backend-rules.md` - API, AI provider, and Supabase expectations.
- `docs/agents/daily-startup-protocol.md` - required workflow for "what's next" questions.
- `docs/agents/git-verification-rules.md` - git safety and verification rules.
- `docs/agents/handoff-template.md` - copyable end-of-session handoff format.
- `docs/checklists/agent-change-checklist.md` - preflight and closeout checklist.
- `docs/runbooks/local-development.md` - local setup and verification commands.
- `docs/runbooks/progress-tracker.md` - how to update the Supabase tracker.
- `docs/adr/` - architectural decision records.
