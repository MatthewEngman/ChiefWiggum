# Ralph Wiggum Task Queue

## Instructions

1. Read `.ralph/tasks.yaml` to find the `current_task` ID
2. Find that task in the `tasks` list and implement it
3. **Write/update tests** for the new code (see Test Coverage Requirements below)
4. When complete, update the task status to `completed` in tasks.yaml
5. Update `current_task` to the next pending task ID
6. Update `.ralph/progress.md` with what was accomplished and test coverage info
7. Check if PR milestone reached (every N tasks or phase boundary)
8. If milestone: Create PR branch and PR (see PR Workflow below)
9. If not milestone: Commit with the task's `commit_message`

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

<!-- Customize these for your project after running init-ralph.js -->
See `.ralph/guardrails.md` for project-specific technology requirements.

## Backpressure (Quality Gates)

Run these commands to verify work (project-specific, see guardrails.md):

- Type checking (TypeScript, mypy, etc.)
- Linting (ESLint, pylint, etc.)
- Unit tests
- Test coverage check
- Build verification

**Test Coverage Requirements:**

- New code must have 80%+ coverage (lines, functions, statements)
- Run `node .cursor/ralph-scripts/check-coverage.js` to verify coverage
- Document any coverage gaps in progress.md if below threshold

## Test Coverage Requirements

**Every task must include appropriate tests:**

- **New API routes** → Add tests in your project's API test directory
- **New services** → Add tests in your project's service test directory
- **New components** → Add tests in your project's component test directory
- **Schema changes** → Update storage/model tests
- **Middleware** → Add middleware tests

**Coverage Goals:**

- New code: 80%+ coverage (lines, functions, statements)
- Document coverage gaps in progress.md if below threshold
- Track coverage improvements per task

## PR Workflow (Milestone Commits)

**Create a PR when:**

- Every 5-10 tasks completed (configurable in `.ralph/tasks.yaml` → `pr_milestone_interval`)
- At phase boundaries (e.g., all P0 tasks done)
- When `pr_milestone_interval` tasks have been committed since last PR

**PR Creation Process:**

1. Check if milestone reached: `node .cursor/ralph-scripts/check-milestone.js`
2. If milestone reached:
   - Create feature branch: `git checkout -b ralph/[phase]-[task-range]` (e.g., `ralph/p0-a-e`)
   - Push branch: `git push -u origin ralph/[phase]-[task-range]`
   - Create PR using script: `node .cursor/ralph-scripts/create-pr.js`
   - Update `.ralph/tasks.yaml` → `last_pr_branch` and `last_pr_number`
   - Continue on new branch for next tasks
3. PR should include:
   - Summary of all tasks in this milestone
   - Test coverage summary
   - Any breaking changes or migration notes

**Benefits:**

- Smaller, reviewable PRs instead of one huge commit
- Better code review process
- Easier to identify issues early
- Cleaner git history

## Completion Signals

- `<promise>DONE</promise>` - ALL tasks in queue are completed
- `<promise>STUCK</promise>` - Cannot make progress after 3 attempts on current task
- Normal exit - Current task completed, ready for next iteration
