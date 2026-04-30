# Daily Startup Protocol

Last reviewed: 2026-04-30

Use this when the user asks any version of:

- "what do we need to work on today?"
- "what is next?"
- "where did we leave off?"
- "what should we do now?"

Do not answer from memory alone.

## 1. Check Local Project State

Run or inspect:

- `git status --short --branch`
- `MAY_BUILD_PLAN.md`
- `AGENTS.md`
- Recent changed files relevant to the active week
- Available package scripts in `package.json`

If the dev server is already running, do not restart it unless needed. If it is not running and the next task needs UI verification, start `npm run dev`.

## 2. Check Calendar Date Against The Plan

Use the current date to identify the active May sprint:

- April 29-May 3: Sprint 0, Foundation And Orientation
- May 4-May 10: Week 1, Core Appeal Generator
- May 11-May 17: Week 2, PHI Scrubber And Appeal History
- May 18-May 24: Week 3, Auth, Accounts, And Monetization Path
- May 25-May 31: Week 4, Pilot-Ready MVP

If the current date is outside May 2026, still use `MAY_BUILD_PLAN.md` as the roadmap, then infer the next unfinished milestone from Supabase progress and local repo state.

## 3. Check Supabase Progress Tracker

Parent project:

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

If direct access is unavailable, say so and use `MAY_BUILD_PLAN.md` plus local git state as fallback.

## 4. Decide The Day's Work

Pick:

- One primary outcome
- Two or three supporting tasks
- One learning objective
- One verification step
- One tracker update

Prefer unfinished tracker steps over inventing new work. Prefer the current week's milestone unless a previous milestone blocks it.

## 5. Answer Format

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

If the user asks to proceed, begin the first concrete action.
