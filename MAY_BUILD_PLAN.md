# Denial Fighter May Build Plan

## Project North Star

By May 31, 2026, Denial Fighter should be a usable MVP that helps a clinician or clinic operator generate a strong Medicare Advantage appeal letter from a denial notice and chart notes, while teaching the full product stack: frontend, backend, database, AI APIs, security, deployment, and early monetization.

The product should move toward monetization, but May's deeper goal is learning quickly by building a real, uncomfortable, useful thing.

## Product Principles

- Build a real workflow, not a demo prompt box.
- Use fake or de-identified data during development.
- Treat PHI/security as a product feature, not a future cleanup.
- Prefer small, working releases over large unfinished rewrites.
- Each week should end with something demoable.
- Document what was learned while building.

## Success Criteria For May

- The app runs locally and can be deployed.
- A user can enter denial text and chart notes.
- The app can de-identify likely PHI before sending text to an AI API.
- The app can generate a structured appeal result.
- The app can save and display appeal history.
- The app has a clear privacy/security story.
- The app has a landing/pricing/waitlist or payment path.
- At least 5 potential users have seen or discussed the MVP.

## Execution status (living snapshot)

Last updated: 2026-05-01.

This section summarizes what the **Denial Fighter repo** reflects today. The **Supabase productivity tracker** (`project_id` below) remains canonical for checklist completion, progress percentage, and `next_action`; update steps there and run sync after meaningful work per `docs/runbooks/progress-tracker.md`.

### Active focus

**Week 2 — PHI scrubber and appeal history** (`in_progress`): extend scrub coverage (tune false positives/negatives), deepen history UX (status edits, exports). **Shipped:** `/privacy` page + in-app links; expanded scrub patterns (fax, group ID, auth ref, labeled NPI).

### Done vs open (high level)

| Area | Status | Notes |
| --- | --- | --- |
| Sprint 0: foundation | **Mostly complete** | App runs locally with env (`DEEPSEEK_*`, Supabase); canonical workflow under `/tool`; architecture/data flow documented in `docs/architecture-data-flow.md`; fake samples in `lib/sampleAppealCases.js`. **Still verify** productivity tracker row + milestone/step seeding if not already done in Supabase. |
| Week 1: core generator | **Substantially complete** | `/tool` sections + validation + loading/errors; `/api/generate` consistent JSON + validation; `lib/ai.js` structured JSON output; `/tool/results` shows payer, denial reason, evidence fields, gaps, letter + copy/download; sample-load buttons; beta / de-ID warnings on form. Remaining Week 1 polish (optional): appeal quality checklist; richer API error mapping for provider failures. |
| Week 2: scrubber + history | **Substantially complete** | Core scrub + history UX shipped; production history access now ties to **Week 3** auth (`APPEALS_REQUIRE_LOGIN` / `ALLOW_PUBLIC_APPEAL_HISTORY`). **Open:** scrub tuning, richer detail actions/exports. |
| Week 3–4 | **In progress (starter)** | **Shipped:** magic-link sign-in (`/tool/login`, `/auth/callback`), Bearer JWT verification on `/api/generate` + `/api/appeals`, optional `user_id` persistence (`docs/002_denial_appeals_user_id.sql`), user-scoped history in production. **Open:** Stripe/pricing wiring, usage quotas, tighter RLS if clients query Postgres directly. |

### Success criteria checklist (May targets)

| Criterion | Repo today |
| --- | --- |
| App runs locally / deployable | Local: yes. Deploy: not finalized (Week 4). |
| Enter denial + chart notes | Yes (`/tool`). |
| De-ID before AI | **Partial** — deterministic scrub before LLM and storage (`lib/scrubPhiDeterministic.js`); not full Safe Harbor coverage. |
| Structured appeal result | Yes. |
| Save + display appeal history | Partially: save path exists; list view shows errors reliably; row/detail UX still Week 2 scope. |
| Privacy / security story | **Stronger MVP:** dedicated `/privacy` plus scrub-limit narrative in-app; still not HIPAA positioning. |
| Landing / pricing / waitlist | **Starter:** pricing UI + pilot mailto waitlist + canonical `/tool` CTAs; no Stripe yet (Week 3). |
| 5 potential-user conversations | Tracking outside repo. |

## Progress Tracking In Supabase

The productivity tracker should be the single source of truth for project progress. This Markdown file defines the plan, but the Supabase tracker should hold the live execution state.

### Parent Project

Use the existing side-hustle project row as the parent record:

```txt
project_id: e3ead243-c8d0-4cf3-95f5-baeaedca10e8
```

Verify this ID exists in the productivity app's Supabase instance before inserting milestones or steps.

### Core Tables

`public.projects` tracks the overall project.

Important columns:

- `id`
- `name`
- `status`
- `archived`
- `progress_percentage`
- `progress_mode`
- `progress_source`
- `next_milestone`
- `next_milestone_date`
- `next_action`
- `finish_line`
- `why_now`
- `success_metric`
- `good_enough_definition`
- `linked_goal_label`
- `updated_at`
- `completed_at`
- `paused_at`

Recommended project values:

- `name`: `Denial Fighter May Build`
- `status`: `in_progress`
- `archived`: `false`
- `progress_mode`: `checklist`
- `progress_source`: `tracking`
- `finish_line`: `Pilot-ready MVP for generating de-identified Medicare Advantage appeal letters by May 31, 2026.`
- `why_now`: `Use May side-hustle sprint to learn full-stack AI product development and test monetization potential.`
- `success_metric`: `Deployed MVP, PHI scrubber, appeal history, privacy story, and at least 5 potential-user conversations.`
- `good_enough_definition`: `A user can generate, review, save, and export a de-identified appeal using fake or scrubbed data.`
- `linked_goal_label`: `May side hustle`

`public.project_milestones` tracks weekly sprint outcomes.

Allowed `status` values:

- `open`
- `in_progress`
- `completed`
- `skipped`

Suggested milestones:

| Sort | Title | Due Date | Outcome | Status (repo snapshot 2026-05-01) |
| --- | --- | --- | --- | --- |
| 10 | Sprint 0: Foundation And Orientation | 2026-05-03 | App runs locally, current architecture is understood, and fake test data exists. | Mostly complete — confirm tracker seeding in productivity Supabase if needed. |
| 20 | Week 1: Core Appeal Generator | 2026-05-10 | Reliable appeal-generation flow with structured output and copy action. | Substantially complete — optional polish remains. |
| 30 | Week 2: PHI Scrubber And Appeal History | 2026-05-17 | Script-based de-identifier, review flow, saved appeals, and usable history. | **In progress** — scrubber + preview + scrubbed persistence shipped; remaining Week 2 items in execution notes above. |
| 40 | Week 3: Auth, Accounts, And Monetization Path | 2026-05-24 | Account-aware app with protected appeal history and a pricing or waitlist path. | Not started. |
| 50 | Week 4: Pilot-Ready MVP | 2026-05-31 | Deployed MVP with privacy page, export flow, demo script, and outreach list. | Not started. |

`public.project_steps` tracks checklist items that feed progress percentage.

For this project, the headline progress percentage should come from active checklist steps, not the five weekly milestones. Milestones are phase groupings; steps are the actual progress units. For example, if 8 of 56 active steps are complete, the project should show 14% complete.

Allowed `step_type` values:

- `task`
- `calendar_block`
- `research`
- `decision`
- `deliverable`
- `practice`

Allowed `status` values:

- `open`
- `in_progress`
- `completed`
- `skipped`

Suggested conventions:

- `owner`: `james`
- `source_type`: `manual`
- `show_on_dashboard`: `true` for the current week's highest-value steps
- `milestone_id`: set when the task belongs to a weekly milestone
- `sort_order`: use gaps of 10 so tasks can be inserted later

`public.project_reviews` stores optional weekly review notes.

Allowed `decision` values:

- `continue`
- `pause`
- `complete`
- `archive`
- `replan`

### Progress Sync Rule

Progress percentage is derived by app logic, not by a database trigger. After updating `project_steps` or `project_milestones`, run:

```txt
GET /api/projects/sync-progress
```

If using automation with a cron secret, use the configured POST flow instead.

That sync endpoint recalculates and writes:

- `projects.progress_percentage`
- `projects.progress_source = 'tracking'`
- `projects.next_milestone`
- `projects.next_milestone_date`
- `projects.next_action`

### Tracker Source Files

The relevant productivity-app source files are:

- `docs/008_projects_tracking.sql`
- `app/api/projects/sync-progress/route.ts`
- `lib/projectTracking.ts`
- `app/api/projects/route.ts`

### Update Habit

At the start of each week, create or mark the active milestone as `in_progress`.

During the week, update steps as work moves from `open` to `in_progress` to `completed`.

On Friday or Sunday, create a `project_reviews` row with:

- What shipped
- What was learned
- What was hard
- What changed in the plan
- Decision: usually `continue`, sometimes `replan`

Then run the progress sync endpoint.

## Sprint 0: Foundation And Orientation

**Dates:** April 29-May 3

### Milestone

Understand the existing codebase, get the app running reliably, and define the first version of the product.

### Build Objectives

- Verify local development setup.
- Map the current app routes and data flow.
- Document required environment variables.
- Confirm how the AI API and Supabase are currently used.
- Create fake denial/chart-note examples for testing.
- Identify duplicated or stale pages, especially under `/app`, `/app/tool`, `/history`, and `/results`.
- Add this May plan to the repo.
- Verify the tracker project row exists in the productivity app.
- Seed the five May milestones into `public.project_milestones`.
- Seed the first week's highest-value tasks into `public.project_steps`.

### Learning Objectives

- Understand the Next.js App Router structure.
- Learn the difference between client components, server components, and API routes.
- Understand `.env.local`, `.env.example`, and runtime environment variables.
- Learn how to inspect an unfamiliar codebase without getting lost.
- Understand how the productivity tracker calculates project progress from milestones and steps.

### Deliverables

- App runs locally with `npm run dev`.
- `npm run build` passes.
- A simple architecture note exists in the README or a separate docs file.
- Fake test cases exist for development.
- Supabase tracker has the project milestones and first active steps.

### Stretch Goals

- Add a basic project board.
- Add a short demo script for explaining the current app.

## Week 1: Core Appeal Generator

**Dates:** May 4-May 10

### Milestone

Make the appeal generation flow reliable, understandable, and useful with fake or de-identified input.

### Build Objectives

- Improve the main `/tool` page.
- Add clear form sections for denial notice and chart notes.
- Add client-side validation for required fields.
- Add loading, success, and error states.
- Improve `/api/generate` error handling.
- Return consistent JSON from the API.
- Improve the AI prompt for structured appeal output.
- Display payer, denial reason, evidence needed, evidence covered, evidence gaps, and appeal letter.
- Add copy-to-clipboard for the generated appeal.

### Learning Objectives

- React form state.
- Next.js API route request/response patterns.
- JSON validation and defensive backend programming.
- Prompt engineering for structured outputs.
- UX design for long-running AI tasks.

### PHI And Security Objectives

- Add a visible warning that users should not paste real PHI during beta testing.
- Decide where PHI could enter the system.
- Write a first-pass data flow diagram in plain English:
  - Browser input
  - API route
  - AI provider
  - Database
  - Browser output

### Deliverables

- User can paste fake denial and chart notes.
- App generates a structured result.
- User can copy the appeal letter.
- Errors are readable and actionable.

### Stretch Goals

- Add sample denial buttons for quick testing.
- Add a generated appeal quality checklist.

## Week 2: PHI Scrubber And Appeal History

**Dates:** May 11-May 17

### Milestone

Add the first version of the non-AI de-identifier and make appeal history feel like a real product feature.

### Build Objectives

- Build a deterministic PHI scrubber using scripts/regex, not AI.
- Detect and replace likely identifiers with placeholders.
- Cover common identifiers:
  - Patient names when explicitly labeled
  - Dates of birth
  - Phone numbers
  - Email addresses
  - Street addresses where detectable
  - SSNs
  - MRNs
  - Member IDs
  - Claim numbers
  - Policy numbers
  - URLs
  - IP addresses
- Add a review screen or preview panel showing scrubbed text.
- Send scrubbed text to the AI API by default.
- Save appeal results to Supabase.
- Improve `/tool/history`.
- Improve `/tool/results`.
- Add appeal metadata: payer, denial reason, created date, status.

### Learning Objectives

- Regex and text parsing.
- Data modeling in Supabase/Postgres.
- CRUD API design.
- State passing between pages.
- Designing safety-oriented user flows.

### PHI And Security Objectives

- Store scrubbed input by default.
- Avoid storing raw denial/chart text unless explicitly needed.
- Add a clear privacy note explaining what the scrubber does and does not guarantee.
- Document the limits of scripted de-identification.

### Deliverables

- User can de-identify text before generation.
- User can review what will be sent to the AI.
- User can save and revisit previous appeal results.
- History page shows useful metadata.

### Stretch Goals

- Add a "show detected identifiers" UI.
- Add a confidence or count summary, such as "12 possible identifiers removed."
- Add unit tests for the scrubber.

## Week 3: Auth, Accounts, And Monetization Path

**Dates:** May 18-May 24

### Milestone

Move from a single-user tool toward a real SaaS product shape.

### Build Objectives

- Add Supabase Auth.
- Protect appeal history by user.
- Add user IDs to appeal records.
- Add row-level security policies in Supabase.
- Add account-aware navigation.
- Add usage tracking:
  - Appeals generated this month
  - Appeals saved
  - Free quota remaining
- Build or improve the landing page.
- Add a pricing or pilot page.
- Add waitlist/contact capture.

### Learning Objectives

- Authentication and sessions.
- Authorization and row-level security.
- SaaS usage limits.
- Product positioning.
- Basic conversion-oriented frontend design.

### PHI And Security Objectives

- Make sure one user cannot access another user's appeals.
- Add a simple security checklist.
- Decide whether production should use:
  - De-identified-only mode
  - HIPAA-ready mode with BAAs
  - Both, as separate product tiers or environments
- Research BAA requirements for database and AI providers.

### Monetization Objectives

- Choose the first pricing hypothesis.
- Suggested starting point:
  - Free: 5 appeals/month
  - Solo: $29/month
  - Clinic: $79/month
- Decide whether May MVP uses Stripe or manual pilot onboarding.

### Deliverables

- User can sign in.
- User sees only their own saved appeals.
- Landing page clearly explains the product.
- Waitlist or payment-intent path exists.

### Stretch Goals

- Add Stripe Checkout in test mode.
- Add a simple admin view for usage and signups.

## Week 4: Pilot-Ready MVP

**Dates:** May 25-May 31

### Milestone

Polish, deploy, and get real feedback from potential users.

### Build Objectives

- Deploy the app to a production or staging environment.
- Add production environment variables.
- Add basic logging.
- Add friendly error boundaries where useful.
- Add rate limits or simple usage caps.
- Improve appeal export:
  - Copy
  - Print
  - Download as `.txt`
  - Stretch: `.docx`
- Add edit mode for the generated appeal letter.
- Add onboarding examples using fake data.
- Polish mobile and desktop UI.
- Evaluate whether the pilot workflow should stay web-first or add a Chrome extension/side-panel companion that can reduce window switching for users working inside payer portals or EHRs.

### Learning Objectives

- Deployment and production configuration.
- Debugging production issues.
- Product QA.
- User feedback interviews.
- Deciding what not to build yet.

### PHI And Security Objectives

- Publish a plain-English privacy/security page.
- Clearly state:
  - Whether raw PHI is stored
  - Whether data is sent to an AI provider
  - Whether the AI provider trains on submitted data
  - Whether the current version is HIPAA-ready
  - How deletion works
- Create a HIPAA-readiness backlog for post-May.

### Monetization Objectives

- Prepare a short pitch.
- Identify 20 possible users or buyers.
- Ask for at least 5 feedback conversations.
- Offer a pilot, waitlist, or discounted early-access plan.

### Deliverables

- Deployed MVP.
- Demo script.
- Privacy/security page.
- Outreach list.
- Feedback notes from real conversations.

### Stretch Goals

- Record a short product demo video.
- Add Stripe live-mode readiness checklist.
- Add customer intake form.
- Write a Chrome extension feasibility note covering likely entry points, PHI risk, permissions, and whether the first extension should only open/import into the web app instead of reading page content directly.

## Browser Extension / Embedded Workflow Track

A Chrome extension could become a strong distribution and workflow advantage because clinicians and clinic operators may already be working inside an EHR, clearinghouse, payer portal, or inbox when they encounter a denial.

Treat this as a post-core workflow path, not the first MVP surface. The web app should remain the source of truth until the de-identification flow, appeal generation, saved history, and privacy story are reliable. Then validate the extension concept with pilot users:

- Would a side-panel or browser action reduce enough friction to matter?
- Should the extension simply open Denial Fighter with copied text, or should it read selected page text?
- What permissions would be required, and how can the app avoid broad page access?
- How does de-identification happen before any selected portal/EHR text is sent to the AI API?
- Does this need a HIPAA-ready tier and BAAs before it can be offered beyond fake/de-identified beta use?

## PHI And Compliance Track

This project should not process real PHI in production until the infrastructure and vendor agreements support it.

### Near-Term Position

During May, Denial Fighter should be treated as a de-identified beta tool. Users should use fake or de-identified data.

### Later HIPAA-Ready Requirements

- Business Associate Agreement with the database provider.
- Business Associate Agreement with the AI provider.
- HIPAA-eligible AI endpoint or zero-retention configuration where required.
- Strong authentication.
- Row-level security.
- Audit logs.
- Encryption in transit and at rest.
- Data retention and deletion policy.
- Access controls for support/admin users.
- Incident response plan.
- Privacy and security documentation.

### De-Identifier Requirements

The first de-identifier should be deterministic and script-based. It should not use AI for detection in the initial pass.

Expected behavior:

- Replace likely identifiers with placeholders.
- Preserve clinical meaning where possible.
- Show users what was changed.
- Allow users to manually review before submission.
- Keep raw text out of storage by default.

Example placeholders:

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

### Important Limitation

A scripted scrubber reduces risk but does not guarantee HIPAA de-identification. Free text can contain unusual details that identify a patient even after obvious identifiers are removed. The product should explain this clearly and give users a chance to review scrubbed text before submission.

## Weekly Operating Rhythm

### Monday

- Choose the week's milestone.
- Pick 3-5 must-ship tasks.
- Write down the learning goals.
- Mark the active milestone and priority steps in Supabase.

### Tuesday-Thursday

- Build the highest-risk parts first.
- Keep changes small and testable.
- Update notes as new questions appear.
- Keep step statuses current in `public.project_steps`.

### Friday

- Run the app locally.
- Fix obvious bugs.
- Write a weekly learning recap.
- Record what still feels confusing.
- Add a `project_reviews` entry.
- Run `/api/projects/sync-progress`.

### Weekend

- Polish the demo.
- Try the app with fake examples.
- Do user research or outreach.
- Decide what to cut from the next week.

## Learning Log Template

Use this at the end of each week.

```md
## Week Of YYYY-MM-DD

### What Shipped

- 

### What I Learned

- 

### What Was Hard

- 

### What Still Feels Fuzzy

- 

### Product Questions

- 

### Next Week's Focus

- 
```

## Backlog

### Core Product

- Improve AI prompt quality.
- Add generated appeal editor.
- Add export to `.docx`.
- Add payer-specific appeal templates.
- Add status tracking for submitted appeals.
- Add outcome tracking.
- Add search/filter in history.

### Security And Privacy

- Build PHI scrubber.
- Add PHI review screen.
- Add privacy/security page.
- Add audit logging.
- Add data deletion.
- Add retention settings.
- Add admin access controls.

### Monetization

- Add waitlist capture.
- Add pricing page.
- Add usage limits.
- Add Stripe Checkout.
- Add subscription status.
- Add pilot onboarding flow.

### Learning And Quality

- Add unit tests for de-identifier.
- Add API route tests.
- Add sample fixtures.
- Add deployment checklist.
- Add architecture documentation.
