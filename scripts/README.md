# Scripts

This folder is reserved for small deterministic project scripts.

Use scripts for repeatable automation that agents should not rewrite from memory, such as:

- PHI scrubber fixtures or evaluation helpers.
- Supabase maintenance helpers.
- Data import/export utilities.
- Local verification helpers.

Rules:

- Do not place secrets in scripts.
- Do not print raw PHI.
- Prefer deterministic code for PHI detection and text transforms.
- Document every new script with command usage and expected output.
