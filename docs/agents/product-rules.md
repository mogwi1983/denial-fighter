# Product Rules

Last reviewed: 2026-04-30

## Project Overview

- Project name: Denial Fighter
- Product: Medicare Advantage appeal letter generation from denial notices and chart notes.
- May goal: pilot-ready MVP while using the project as a full-stack learning sprint.
- Tech stack: Next.js 14 App Router, React, Tailwind CSS, Supabase, DeepSeek/OpenAI-compatible API client, npm.
- Main language: JavaScript.
- Primary plan: `MAY_BUILD_PLAN.md`.

## Product Direction

Denial Fighter should become a practical appeal-generation workflow, not just a prompt box.

Core product path:

1. User enters denial notice and chart notes.
2. App detects and de-identifies likely PHI.
3. User reviews scrubbed text.
4. Scrubbed text is sent to the AI API.
5. App returns structured appeal output.
6. User can edit, copy, export, save, and revisit the appeal.

## Current Product Priorities

- Keep `/tool` as the canonical workflow.
- Treat `/`, `/history`, and `/results` as legacy or parallel routes until explicitly reconciled.
- Keep product surfaces calm, clinical, and workflow-focused.
- Build the actual tool experience before polishing marketing pages.
- Favor small demoable increments over large rewrites.

## Learning Mode

This project is intentionally a learning sprint.

- Explain important concepts briefly when making changes.
- Prefer implementation steps that teach frontend, backend, database, and product judgment.
- Capture confusing areas in weekly reviews.
- Keep the work near the edge of James's comfort zone without turning the project into chaos.
