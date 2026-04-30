# Lib Directory

Last reviewed: 2026-04-30

Shared application logic lives here.

## Files

- `ai.js` - DeepSeek/OpenAI-compatible client and prompt logic.
- `supabase.js` - Supabase client.
- `sampleAppealCases.js` - fake/de-identified sample cases for local demos.

## Agent Notes

- Keep provider keys server-side only.
- Do not add raw PHI to sample cases.
- Keep prompt changes aligned with `docs/agents/phi-security-rules.md`.
- Put deterministic PHI scrubber code here only if it is used by the runtime app. Otherwise use `scripts/` for helper/evaluation scripts.
