# ADR 0001: Agent-Managed Project Structure

Date: 2026-04-30

## Status

Accepted

## Context

Denial Fighter will be created and maintained primarily by AI agents while James provides oversight. Multiple tools may work in the repo, including Codex, Claude Code, Cursor, and Gemini CLI. Without a shared operating model, agents can duplicate discovery work, overwrite each other's changes, or miss PHI and tracker rules.

## Decision

Create a small documentation spine for agent coordination:

- Root `AGENTS.md` remains the canonical instruction file.
- `CLAUDE.md` and `GEMINI.md` point to `AGENTS.md` instead of duplicating rules.
- `.cursor/rules/` points Cursor to the same canonical instructions.
- `docs/agents/` stores context and handoff guidance.
- `docs/runbooks/` stores repeatable operating procedures.
- `docs/checklists/` stores closeout and review checklists.
- `docs/adr/` stores decisions that future agents should not rediscover.

## Consequences

- Future agents have a predictable onboarding path.
- Project decisions become easier to audit.
- Documentation must be updated when app behavior, route ownership, tracker rules, or safety constraints change.
- The repo should avoid excessive process documents; add a new doc only when it prevents repeated mistakes or preserves important context.
