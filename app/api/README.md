# API Routes

Last reviewed: 2026-04-30

This folder contains Next.js route handlers that run on the server.

## Endpoints

- `generate/route.js` - validates appeal inputs, calls `lib/ai.js`, optionally persists generated appeal data, and returns structured JSON.
- `appeals/route.js` - lists, reads, and updates saved appeals through Supabase.

## Contract Rules

- Validate inputs before calling external services.
- Return predictable JSON with `success`, `error`, and field-level details where useful.
- Do not log secrets.
- Do not log raw PHI.
- Store scrubbed/de-identified text by default once the scrubber exists.

## Verification

For API changes, run:

```bash
npm run lint
npm run build
```

Add focused API tests later when the test framework is introduced.
