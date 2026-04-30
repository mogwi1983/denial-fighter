# Test Fixtures

Use this folder for fake or de-identified examples that support tests and manual QA.

Rules:

- Never commit real denial notices, chart notes, member IDs, names, dates of birth, phone numbers, addresses, MRNs, claim IDs, SSNs, or other PHI.
- Prefer obviously fake names and identifiers.
- Keep fixture cases small enough for agents to understand quickly.
- When adding scrubber tests later, include both the raw fake input and the expected scrubbed output.
