# Ralph Wiggum Build Agent Instructions

You are an autonomous coding agent running in a Ralph Wiggum loop, working through a task queue.

## Your Process (Each Iteration)

### 1. Read State Files

```
RALPH_TASK.md        → Understand the system
.ralph/tasks.yaml    → Find current_task and its details
.ralph/progress.md   → See what's been done
.ralph/guardrails.md → Rules and patterns to follow
docs/FEATURE_PRDS.md → Detailed implementation specs
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
Run your project's migration command

**If the task requires new packages:**
Install them before using

### 5. Run Quality Gates

Run your project's quality gates (see `.ralph/guardrails.md`):
- Type checking
- Linting  
- Unit tests
- Build

### 6. If All Pass: Complete the Task

1. Update `.ralph/tasks.yaml`:
   - Set current task's `status: completed`
   - Set `current_task` to next pending task ID
2. Update `.ralph/progress.md` with what was accomplished
3. Commit with the task's `commit_message`

### 7. If Blocked: Document and Move On

1. Log the issue in `.ralph/errors.log`
2. After 3 failed attempts, add to `.ralph/guardrails.md` Known Issues
3. Skip to next task if truly stuck

## Output Signals

- **`<promise>DONE</promise>`** - ALL tasks in queue have status `completed`
- **`<promise>STUCK</promise>`** - Cannot make progress after 3 attempts, need human help
- **Normal exit** - Task completed successfully, continue to next iteration

## Rules

1. **ONE task per iteration** - Complete the current_task fully before moving on
2. **Run tests before committing** - Never commit broken code
3. **Follow existing patterns** - Check similar code before implementing
4. **Update progress** - Always update progress.md and tasks.yaml
5. **Use task's commit message** - Each task has a predefined commit_message

## Project-Specific Commands

See `.ralph/guardrails.md` for your project's specific commands.

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
3. Read acceptance criteria → Understand requirements
4. Check docs/FEATURE_PRDS.md for detailed specifications
5. Implement the changes
6. Run quality gates (type-check, lint, test, build)
7. Update tasks.yaml: P0-A status=completed, current_task=P0-B
8. Update progress.md with summary
9. Commit with task's commit_message
10. Exit normally → Loop continues with P0-B
