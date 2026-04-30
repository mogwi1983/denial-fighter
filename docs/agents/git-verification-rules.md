# Git And Verification Rules

Last reviewed: 2026-04-30

## Git Safety

- Do not commit, push, deploy, or force-push without explicit permission.
- Do not revert files you did not change unless explicitly requested.
- If the worktree is dirty, inspect relevant files before editing.
- Keep unrelated changes out of the task unless the user asks to include all outstanding changes.
- Summarize changed files at the end of the work.

## Verification

- For code changes, run the most relevant check available.
- For broad app changes, prefer `npm run build` when time allows.
- For local UI changes, verify `npm run dev` on port `3005`.
- If a command cannot be run, say why and describe the remaining risk.

## Current Commands

```bash
npm run lint
npm run format:check
npm run build
npm run check
```

There is no dedicated test command yet.
