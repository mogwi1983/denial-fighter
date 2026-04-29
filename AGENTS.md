# Denial Fighter Agent Instructions

## Project Overview

- **Project name:** Denial Fighter
- **What it does:** Generates Medicare Advantage appeal letters from denial notices and chart notes.
- **May goal:** Build a pilot-ready MVP while using the project as a fast full-stack learning sprint.
- **Tech stack:** Next.js 14 App Router, React, Tailwind CSS, Supabase, DeepSeek/OpenAI-compatible API client, npm.
- **Main language:** JavaScript.
- **Primary plan:** `MAY_BUILD_PLAN.md`

## Product Direction

Denial Fighter should become a practical appeal-generation workflow, not just a prompt box.

Core product path:

1. User enters denial notice and chart notes.
2. App detects and de-identifies likely PHI.
3. User reviews scrubbed text.
4. Scrubbed text is sent to the AI API.
5. App returns structured appeal output.
6. User can edit, copy, export, save, and revisit the appeal.

## PHI And Security Rules

- Treat denial notices and chart notes as potentially containing PHI.
- Use fake or de-identified data during development.
- Do not store raw PHI by default.
- Do not send raw PHI to an LLM by default.
- Build the first de-identifier as deterministic code using scripts/regex, not AI.
- Clearly show users what was scrubbed before submission.
- Preserve clinical meaning where possible while replacing identifiers with placeholders.
- Use placeholders such as `[PATIENT_NAME]`, `[DOB]`, `[DATE]`, `[PHONE]`, `[EMAIL]`, `[ADDRESS]`, `[MRN]`, `[MEMBER_ID]`, `[CLAIM_ID]`, and `[SSN]`.
- Be explicit that scripted de-identification reduces risk but does not guarantee HIPAA de-identification.
- Do not claim the product is HIPAA-ready unless BAAs, access controls, audit logs, retention policies, and provider requirements are actually in place.

## Project Structure

- `app/` - Next.js App Router pages, layouts, and API routes.
- `app/api/generate/route.js` - appeal generation API.
- `app/api/appeals/route.js` - appeal persistence API.
- `app/tool/` - main product workflow pages.
- `app/history/` and `app/results/` - legacy or parallel history/results pages that should be reconciled carefully.
- `lib/ai.js` - AI API client and prompt logic.
- `lib/supabase.js` - Supabase client.
- `MAY_BUILD_PLAN.md` - week-by-week build, learning, security, and monetization plan.

## Key Commands

- **Install dependencies:** `npm install`
- **Run dev server:** `npm run dev`
- **Build for production:** `npm run build`

There is no confirmed test command yet. If tests are added, document the command here and in the README.

## Environment Variables

Expected local variables:

- `DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never hardcode secrets. Never print secret values into logs or chat. If checking `.env.local`, mask values.

## Code Style

- Read existing code before modifying it.
- Prefer existing patterns over new abstractions.
- Keep changes small and focused.
- Use clear names for variables, functions, components, and routes.
- Add comments only where logic is not obvious.
- Handle errors clearly in API routes and UI states.
- Keep the UI responsive and usable on mobile and desktop.
- Do not rewrite working code just to clean it up.
- Do not delete or overwrite user changes without explicit permission.

## Frontend Rules

- Build the actual tool experience first, not a marketing-only landing page.
- Use clear form states: empty, loading, success, error, saved.
- Make generated appeal results easy to scan, copy, edit, and export.
- Avoid UI text that explains obvious mechanics.
- Keep product surfaces calm, clinical, and workflow-focused.
- Do not let text overflow buttons, cards, or panels.

## Backend Rules

- Validate required request fields before calling external APIs.
- Return predictable JSON responses.
- Store scrubbed/de-identified text by default.
- Keep raw input storage opt-in, documented, and justified.
- Make Supabase schema changes through ordered SQL files in `docs/`.
- Name SQL files like `001_create_x_table.sql`, `002_change_rls_policy.sql`, or `003_add_foreign_key.sql`.
- The database schema should be documented in `docs/` over time.

## Supabase Progress Tracking Rules

The productivity tracker is the live source of truth for project progress. Keep `MAY_BUILD_PLAN.md` as the planning document, but update the tracker as work progresses.

### Parent Project

Use this side-hustle project ID, after verifying it exists in the productivity app Supabase instance:

```txt
e3ead243-c8d0-4cf3-95f5-baeaedca10e8
```

For this project, use `progress_mode = 'checklist'`. The headline progress percentage should mean completed active steps divided by total active steps. Weekly milestones should group the work, but should not drive the headline percentage.

### Tables To Update

Use `public.projects` for the parent project row.

Important columns:

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

Use `public.project_milestones` for weekly sprint milestones.

Allowed `status` values:

- `open`
- `in_progress`
- `completed`
- `skipped`

Use `public.project_steps` for task/checklist progress.

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

Suggested defaults:

- `owner`: `james`
- `source_type`: `manual`
- `show_on_dashboard`: `true` for the current week's most important tasks

Use `public.project_reviews` for weekly review notes.

Allowed `decision` values:

- `continue`
- `pause`
- `complete`
- `archive`
- `replan`

### Required Progress Update Habit

Progress tracking is mandatory for meaningful project work. Do not treat it as optional housekeeping.

When beginning a meaningful task:

1. Find or create the relevant `project_steps` row.
2. Set `status = 'in_progress'`.
3. Set `next_action` on the parent `projects` row when useful.
4. Run the sync endpoint if available.

When completing a meaningful task:

1. Mark the relevant `project_steps` row `completed`.
2. Set `completed_at`.
3. Update the related milestone if the milestone is now complete.
4. Add a `project_reviews` row for weekly summaries or major replans.
5. Run the sync endpoint.

When making partial progress but not finishing a step:

1. Keep the relevant `project_steps.status = 'in_progress'`.
2. Update `projects.next_action` to the next concrete action.
3. Mention the incomplete work in the final response.

When blocked:

1. Keep or set the step to `in_progress` unless the work is intentionally abandoned.
2. Add the blocker to `projects.next_action` or a `project_reviews.notes` entry.
3. Tell the user exactly what is needed to unblock the task.

If direct Supabase access is unavailable:

1. Do not silently skip progress tracking.
2. Tell the user the tracker could not be updated.
3. Provide the exact milestone/step/status changes that should be applied.
4. If useful, create an ordered SQL file in `docs/` for the user or another agent to run.

Progress percentage is calculated by app logic, not a database trigger. After updating `project_steps` or `project_milestones`, run:

```txt
GET /api/projects/sync-progress
```

If using automation with a cron secret, use the configured POST flow instead.

The sync endpoint writes:

- `projects.progress_percentage`
- `projects.progress_source = 'tracking'`
- `projects.next_milestone`
- `projects.next_milestone_date`
- `projects.next_action`

Relevant productivity-app files:

- `docs/008_projects_tracking.sql`
- `app/api/projects/sync-progress/route.ts`
- `lib/projectTracking.ts`
- `app/api/projects/route.ts`

If direct Supabase access is not available, prepare ordered SQL files in `docs/` or clearly list the rows/updates for the user to apply.

## Daily Startup Protocol

When the user asks any version of "what do we need to work on today?", "what is next?", "where did we leave off?", or "what should we do now?", do not answer from memory alone. Use this startup protocol.

### 1. Check The Local Project State

Run or inspect:

- `git status --short --branch`
- `MAY_BUILD_PLAN.md`
- `AGENTS.md`
- Recent changed files relevant to the active week
- Available package scripts in `package.json`

If the dev server is already running, do not restart it unless needed. If it is not running and the next task needs UI verification, start `npm run dev`.

### 2. Check The Calendar Date Against The Plan

Use the current date to identify the active May sprint:

- April 29-May 3: Sprint 0, Foundation And Orientation
- May 4-May 10: Week 1, Core Appeal Generator
- May 11-May 17: Week 2, PHI Scrubber And Appeal History
- May 18-May 24: Week 3, Auth, Accounts, And Monetization Path
- May 25-May 31: Week 4, Pilot-Ready MVP

If the current date is outside May 2026, still use `MAY_BUILD_PLAN.md` as the project roadmap, then infer the next unfinished milestone from Supabase progress and local repo state.

### 3. Check Supabase Progress Tracker

The tracker is the live source of truth. Look up the parent project:

```txt
e3ead243-c8d0-4cf3-95f5-baeaedca10e8
```

Check:

- Current project status and `progress_percentage`
- `next_milestone`
- `next_milestone_date`
- `next_action`
- Open or `in_progress` rows in `project_milestones`
- Open or `in_progress` rows in `project_steps`
- Most recent `project_reviews` row

If direct Supabase/tool access is unavailable, say that clearly and use `MAY_BUILD_PLAN.md` plus local git state as the fallback.

### 4. Decide The Day's Work

Pick a small, concrete set of work for today:

- One primary outcome
- Two or three supporting tasks
- One learning objective
- One verification step
- One tracker update that should happen before or after the work

Prefer unfinished tracker steps over inventing new work. Prefer the current week's milestone unless a previous milestone blocks it.

### 5. Answer In This Format

Use this structure when answering the daily startup question:

```md
Today we should focus on: [one-sentence outcome]

Why this is next:
- [date/week reason]
- [tracker reason]
- [repo/codebase reason]

Today's working set:
1. [task]
2. [task]
3. [task]

Learning target:
- [specific concept to learn today]

Tracker update:
- [what should be marked in progress/completed in Supabase]

I can start by [first concrete action].
```

If the user asks to proceed, begin the first concrete action. Do not stay in planning mode unless the user explicitly asks to only plan.

### 6. Update Progress As Work Happens

Before starting meaningful implementation, mark or prepare the relevant `project_steps` row as `in_progress`. This applies when editing code, changing docs, updating Supabase schema/data, implementing features, running a planned verification pass, or completing a planned research/deliverable step.

After completing meaningful implementation:

- Mark completed steps as `completed`.
- Set `completed_at`.
- Update milestone status if appropriate.
- Run `/api/projects/sync-progress` if available.
- Confirm the new `progress_percentage`, `next_milestone`, and `next_action` if the tracker was updated.
- Summarize what changed and what the next action should be.

At the end of a work session, the final response should include a brief tracker note:

- Which step was moved to `in_progress`
- Which step was moved to `completed`
- Whether sync ran
- The next action now shown in the tracker

## Git And Change Safety

- Do not commit, push, deploy, or force-push without explicit permission.
- Do not revert files you did not change.
- If the worktree is dirty, inspect relevant files before editing.
- Keep unrelated changes out of the task.
- Summarize changed files at the end of the work.

## Verification

- For code changes, run the most relevant check available.
- For broad app changes, prefer `npm run build` when time allows.
- For local UI changes, restart or verify `npm run dev` on port `3005`.
- If a command cannot be run, say why and describe the remaining risk.

## Learning Mode

This project is intentionally a learning sprint. When making changes:

- Explain the important concept briefly.
- Prefer implementation steps that teach frontend, backend, database, and product judgment.
- Capture confusing areas in the weekly review.
- Keep the user near the edge of their comfort zone without turning the project into chaos.
