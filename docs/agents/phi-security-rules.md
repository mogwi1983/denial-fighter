# PHI And Security Rules

Last reviewed: 2026-04-30

Treat denial notices and chart notes as potentially containing PHI.

## Required Rules

- Use fake or de-identified data during development.
- Do not store raw PHI by default.
- Do not send raw PHI to an LLM by default.
- Build the first de-identifier as deterministic code using scripts/regex, not AI.
- Clearly show users what was scrubbed before submission.
- Preserve clinical meaning where possible while replacing identifiers with placeholders.
- Be explicit that scripted de-identification reduces risk but does not guarantee HIPAA de-identification.
- Do not claim the product is HIPAA-ready unless BAAs, access controls, audit logs, retention policies, and provider requirements are actually in place.

## Placeholder Vocabulary

Use placeholders such as:

- `[PATIENT_NAME]`
- `[DOB]`
- `[DATE]`
- `[PHONE]`
- `[EMAIL]`
- `[ADDRESS]`
- `[MRN]`
- `[MEMBER_ID]`
- `[CLAIM_ID]`
- `[SSN]`

## Documentation Expectations

- Update `docs/architecture-data-flow.md` when PHI movement changes.
- Document raw input storage as opt-in, justified, and visible.
- Add SQL changes as ordered files in `docs/`.
- Use fake fixtures only.
