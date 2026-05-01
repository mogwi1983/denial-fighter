# Progress Tracker Runbook

Last reviewed: 2026-05-01

The productivity tracker is the live source of truth for Denial Fighter progress.

Parent project id:

```txt
e3ead243-c8d0-4cf3-95f5-baeaedca10e8
```

## Start A Meaningful Task

1. Find or create the relevant `public.project_steps` row.
2. Set `status = 'in_progress'`.
3. Set `projects.next_action` to the next concrete action when useful.
4. Run `/api/projects/sync-progress` if the productivity app endpoint is available.

## Complete A Meaningful Task

1. Set the step `status = 'completed'`.
2. Set `completed_at`.
3. Update related milestone status if the milestone is now complete.
4. Add a `project_reviews` row for weekly summaries or major replans.
5. Run `/api/projects/sync-progress`.

## If Direct Access Fails

Do not silently skip the tracker. In the final response, include:

- Step title.
- Intended status.
- Intended `completed_at` value, if complete.
- Intended `projects.next_action`.
- Whether sync still needs to run.

## Minimal Step Fields

Use only fields that exist in the tracker schema:

- `project_id`
- `title`
- `status`
- `step_type`
- `owner`
- `source_type`
- `show_on_dashboard`
- `sort_order`
- `completed_at`

Do not assume a `notes` column exists on `project_steps`.

## Denial Fighter — mirror after milestone work (manual)

Use parent project id `e3ead243-c8d0-4cf3-95f5-baeaedca10e8`. After shipping scrubber work (2026-05-01 snapshot):

1. Ensure milestone **Week 2: PHI Scrubber And Appeal History** is `in_progress` (Week 1 can remain `completed` or `substantially complete` per your convention).
2. Mark completed `project_steps` that match shipped work, for example:
   - Deterministic PHI scrubber module in repo (`scrubPhiDeterministic.js`).
   - Scrub preview on canonical `/tool` workflow.
   - `/api/generate` sends scrubbed text to the LLM and persists scrubbed denial/chart fields.
   - `/tool/history` shows real errors instead of mock rows on failure.
3. Set or refresh `projects.next_action` to the next Week 2 gap (e.g. optional confirm-before-send, expanded scrub patterns, history detail view).
4. Run `GET /api/projects/sync-progress` on the **productivity** app when that endpoint is available.
