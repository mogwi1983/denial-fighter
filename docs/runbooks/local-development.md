# Local Development Runbook

Last reviewed: 2026-04-30

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The dev server is configured for port `3005`.

```txt
http://localhost:3005
```

Never print secrets from `.env.local`. If checking the file, show only variable names or masked values.

## Core Commands

```bash
npm run dev
npm run lint
npm run format:check
npm run build
npm run check
```

`npm run check` currently runs lint and production build. There is no dedicated test command yet.

## Manual Smoke Test

1. Open `/tool`.
2. Use fake denial notice and fake chart notes.
3. Generate an appeal.
4. Confirm the result page shows structured analysis and appeal text.
5. Confirm copy/download actions still work if they were touched.
6. Confirm no real PHI was used.

## Debugging Notes

- API generation failures usually involve `DEEPSEEK_API_KEY`, the AI provider response shape, or JSON parsing in `lib/ai.js`.
- Supabase failures usually involve missing env vars, table schema drift, or public-demo persistence flags.
- Legacy routes under `/results` and `/history` may not match the canonical `/tool/*` workflow.
