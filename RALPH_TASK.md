# Ralph Wiggum Task Queue

## Instructions

1. Read `.ralph/tasks.yaml` to find the `current_task` ID
2. Find that task in the `tasks` list and implement it
3. When complete, update the task status to `completed` in tasks.yaml
4. Update `current_task` to the next pending task ID
5. Update `.ralph/progress.md` with what was accomplished
6. Commit with the task's `commit_message`

## Current Task Reference

See `.ralph/tasks.yaml` for the current task details including:

- `id` - Task identifier (e.g., P0-A)
- `name` - Task name
- `description` - What to implement
- `acceptance_criteria` - Checkboxes that must all pass
- `files_to_modify` / `files_to_create` - Where to make changes
- `commit_message` - Git commit message to use

## Full PRD Reference

For detailed implementation instructions, see `docs/FEATURE_PRDS.md`

## Technical Requirements

See `.ralph/guardrails.md` for project-specific requirements.

## Backpressure (Quality Gates)

Run your project's quality gates to verify work:

- Type check (if applicable)
- Lint
- Unit tests
- Build

## Completion Signals

- `<promise>DONE</promise>` - ALL tasks in queue are completed
- `<promise>STUCK</promise>` - Cannot make progress after 3 attempts on current task
- Normal exit - Current task completed, ready for next iteration
