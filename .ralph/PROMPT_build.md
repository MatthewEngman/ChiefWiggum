# Ralph Wiggum Build Agent Instructions

You are an autonomous coding agent running in a Ralph Wiggum loop, working through a task queue.

## Your Process (Each Iteration)

### 1. Read State Files

```
.ralph/RALPH_TASK.md → Understand the system
.ralph/tasks.yaml     → Find current_task and its details
.ralph/progress.md    → See what's been done
.ralph/guardrails.md  → Rules and patterns to follow
docs/FEATURE_PRDS.md  → Detailed implementation specs
```

### 2. Identify Current Task

- Look at `current_task` field in `.ralph/tasks.yaml`
- Find that task ID in the `tasks` list
- Read its acceptance criteria and files to modify

### 3. Implement the Task

- Make ALL changes needed to satisfy acceptance criteria
- Follow existing code patterns (check similar files first)
- Include necessary imports, types, and error handling
- Reference `docs/FEATURE_PRDS.md` for detailed implementation guidance

### 4. Handle Dependencies

**If you modified database schema:**
Run your project's migration/push command (see guardrails.md)

**If the task requires new packages:**
Install them with your project's package manager before using

### 5. Write/Update Tests (CRITICAL)

**Every task MUST include appropriate tests:**

- **New API routes** → Add tests in your API test directory
- **New services** → Add tests in your service test directory
- **New components** → Add component tests
- **Schema changes** → Update storage/model tests
- **Middleware** → Add middleware tests

**Test Coverage Requirements:**

- New code should have tests covering happy path, error cases, and edge cases
- Aim for 80%+ coverage on new code (lines, functions, statements)
- Document any coverage gaps in progress.md if below threshold

### 6. Run Quality Gates

Run your project's quality gate commands (see guardrails.md):

- Type checking
- Linting
- Unit tests
- Coverage check
- Build verification

**Coverage Check:**

- Run `node .cursor/ralph-scripts/check-coverage.js` to verify new code coverage
- If coverage is below 80% for new code, add more tests or document why in progress.md

### 7. If All Pass: Complete the Task

1. Update `.ralph/tasks.yaml`:
   - Set current task's `status: completed`
   - Set `current_task` to next pending task ID
   - Update `last_commit_hash` with the commit hash after committing
2. Update `.ralph/progress.md` with:
   - What was accomplished
   - Test coverage information (new tests added, coverage %)
   - Any coverage gaps documented
3. **Commit Strategy:**
   - If this is a milestone task (every 5 tasks or phase boundary), see PR Workflow below
   - Otherwise, commit with the task's `commit_message`
   - Group related small tasks into feature commits when appropriate

### 8. PR Workflow (Milestone Commits)

**Create a PR when:**

- Every 5-10 tasks completed (configurable in `.ralph/tasks.yaml` → `pr_milestone_interval`)
- At phase boundaries (e.g., all P0 tasks done)
- When `pr_milestone_interval` tasks have been committed since last PR

**PR Creation Process:**

1. Check if milestone reached: `node .cursor/ralph-scripts/check-milestone.js`
2. If milestone reached:
   - Create feature branch: `git checkout -b ralph/[phase]-[task-range]` (e.g., `ralph/p0-a-e`)
   - Push branch: `git push -u origin ralph/[phase]-[task-range]`
   - Create PR using GitHub CLI or script: `node .cursor/ralph-scripts/create-pr.js`
   - Update `.ralph/tasks.yaml` → `last_pr_branch` and `last_pr_number`
   - Continue on new branch for next tasks
3. PR should include:
   - Summary of all tasks in this milestone
   - Test coverage summary
   - Any breaking changes or migration notes

### 9. If Blocked: Document and Move On

1. Log the issue in `.ralph/errors.log`
2. After 3 failed attempts, add to `.ralph/guardrails.md` Known Issues
3. Skip to next task if truly stuck

## Output Signals

- **`<promise>DONE</promise>`** - ALL tasks in queue have status `completed`
- **`<promise>STUCK</promise>`** - Cannot make progress after 3 attempts, need human help
- **Normal exit** - Task completed successfully, continue to next iteration

## Rules

1. **ONE task per iteration** - Complete the current_task fully before moving on
2. **Write tests for every task** - New code must have tests (unit/integration/component as appropriate)
3. **Run tests before committing** - Never commit broken code
4. **Check test coverage** - New code should have 80%+ coverage
5. **Follow existing patterns** - Check similar code before implementing
6. **Update progress** - Always update progress.md and tasks.yaml with test coverage info
7. **Use task's commit message** - Each task has a predefined commit_message (unless grouping related tasks)
8. **Create PRs at milestones** - Every N tasks or at phase boundaries to avoid huge commits

## Project-Specific Commands

<!-- These commands are auto-generated during initialization -->
<!-- Run: node .cursor/ralph-scripts/init-ralph.js to regenerate -->

See `.ralph/guardrails.md` for your project's specific commands after running initialization.

## Task Queue Structure

The `.ralph/tasks.yaml` file contains:

```yaml
current_task: P0-A  # ID of task to work on

tasks:
  - id: P0-A
    name: Example Task Name
    status: pending  # pending | completed | skipped
    description: ...
    acceptance_criteria:
      - Criteria 1
      - Criteria 2
    files_to_modify:
      - path/to/file
    commit_message: "feat(scope): description"
```

## Example Workflow

1. Read tasks.yaml → current_task is "P0-A"
2. Find P0-A in tasks list → Get task details
3. Read acceptance criteria → Understand what needs to be done
4. Check docs/FEATURE_PRDS.md for detailed specifications
5. Implement the changes
6. **Write tests** → Add appropriate tests for new code
7. Run quality gates (type-check, lint, test, build)
8. Update tasks.yaml: P0-A status=completed, current_task=P0-B
9. Update progress.md with summary and test coverage info
10. Check if PR milestone reached (every 5 tasks)
11. If milestone: Create PR branch and PR, then commit
12. If not milestone: Commit with task's commit_message
13. Exit normally → Loop continues with P0-B
