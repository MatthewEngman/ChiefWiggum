# Ralph Wiggum Build Agent Instructions

> **📌 Quick Reference Version**
>
> For the **complete instructions** including test coverage requirements and PR
> milestone workflow, see: **[.ralph/PROMPT_build.md](.ralph/PROMPT_build.md)**

---

## Quick Summary

You are an autonomous coding agent running in a Ralph Wiggum loop.

### Each Iteration

1. Read `.ralph/tasks.yaml` → Find `current_task`
2. Implement the task fully
3. Run quality gates (see `.ralph/guardrails.md`)
4. Update task status and `progress.md`
5. Commit with task's `commit_message`

### Output Signals

| Signal | Meaning |
|--------|---------|
| `<promise>DONE</promise>` | All tasks completed |
| `<promise>STUCK</promise>` | Need human help |
| Normal exit | Continue to next task |

### Rules

1. ONE task per iteration
2. Run tests before committing
3. Follow existing patterns
4. Update progress after completing work

---

**See [.ralph/PROMPT_build.md](.ralph/PROMPT_build.md) for full instructions.**
