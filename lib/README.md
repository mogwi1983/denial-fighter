# Lib Directory

Last reviewed: 2026-05-01

Shared application logic lives here.

## Files

- `ai.js` - DeepSeek/OpenAI-compatible client and prompt logic.
- `supabase.js` - Supabase client.
- `sampleAppealCases.js` - fake/de-identified sample cases for local demos.
- `scrubPhiDeterministic.js` - regex-based scrubbing shared by `/tool` preview and `/api/generate` before LLM calls and persistence.
- `supabaseBrowser.js` - anon-key browser client for Supabase Auth sessions.
- `serverSupabaseAuth.js` - verifies `Authorization: Bearer` JWT on API routes.
- `apiFetch.js` - browser `fetch` wrapper that attaches the Supabase access token when present.
- `appealsAccess.js` - rules for whether `/api/appeals` requires a signed-in user.

## Agent Notes

- Keep provider keys server-side only.
- Do not add raw PHI to sample cases.
- Keep prompt changes aligned with `docs/agents/phi-security-rules.md`.
- Put deterministic PHI scrubber code here only if it is used by the runtime app. Otherwise use `scripts/` for helper/evaluation scripts.
