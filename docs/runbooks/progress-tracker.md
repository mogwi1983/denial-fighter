# Progress Tracker Runbook

Last reviewed: 2026-04-30

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
