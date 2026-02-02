# Ralph Wiggum Task Queue

> **📌 Quick Reference Version**
>
> For the **complete instructions** including test coverage requirements and PR
> milestone workflow, see: **[.ralph/RALPH_TASK.md](.ralph/RALPH_TASK.md)**

---

## Quick Summary

1. Read `.ralph/tasks.yaml` → Find `current_task` ID
2. Implement that task fully
3. Run quality gates (see `.ralph/guardrails.md`)
4. Update task status to `completed`
5. Update `current_task` to next pending task
6. Update `.ralph/progress.md`
7. Commit with task's `commit_message`

## Completion Signals

| Signal | Meaning |
|--------|---------|
| `<promise>DONE</promise>` | All tasks completed |
| `<promise>STUCK</promise>` | Need human help after 3 attempts |
| Normal exit | Continue to next task |

---

**See [.ralph/RALPH_TASK.md](.ralph/RALPH_TASK.md) for full instructions.**
