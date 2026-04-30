# Tests Directory

Last reviewed: 2026-04-30

There is no dedicated test framework yet.

## Current Structure

- `fixtures/` - fake or de-identified examples for future tests and manual QA.

## Future Test Direction

Good first tests:

- Deterministic PHI scrubber unit tests.
- API request validation tests.
- Result rendering tests for generated appeal output.
- End-to-end happy path once Playwright is added.

## Data Rule

Never commit real patient data, denial notices, chart notes, member IDs, names, dates of birth, phone numbers, addresses, MRNs, claim IDs, SSNs, or other PHI.
