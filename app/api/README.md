# API Routes

Last reviewed: 2026-05-01

This folder contains Next.js route handlers that run on the server.

## Endpoints

- `generate/route.js` - validates appeal inputs, applies `lib/scrubPhiDeterministic.js`, calls `lib/ai.js` with scrubbed text only, optionally persists **scrubbed** appeal inputs with the generated letter (plus **`user_id`** when `Authorization: Bearer` carries a valid Supabase JWT), and returns structured JSON including `scrubSummary`.
- `appeals/route.js` - lists, reads, and updates saved appeals through Supabase; **production** requires sign-in unless `ALLOW_PUBLIC_APPEAL_HISTORY=true`; signed-in requests filter by **`user_id`** (see `lib/appealsAccess.js`).

## Contract Rules

- Validate inputs before calling external services.
- Return predictable JSON with `success`, `error`, and field-level details where useful.
- Do not log secrets.
- Do not log raw PHI.
- Store scrubbed/de-identified text by default; raw pasted blobs are not persisted on new inserts.

## Verification

For API changes, run:

```bash
npm run lint
npm run build
```

Add focused API tests later when the test framework is introduced.
