# Chief Wiggum Autonomous Mode

**Chief Wiggum runs Ralph Wiggum loops** — fire-and-forget autonomous development
with multiple PRs ready for review.

Chief Wiggum is the supervisor that orchestrates Ralph Wiggum (the autonomous
coding agent). You configure the tasks, Chief starts Ralph loops, and Ralph
implements features while creating PRs at milestones.

---

## Overview

Chief Wiggum can run fully autonomously, processing a queue of tasks and creating PRs at milestones. You kick it off and come back to find multiple PRs ready for review.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   You       │     │   Chief     │     │   GitHub    │
│   (Human)   │────▶│   Wiggum    │────▶│   (PRs)     │
│             │     │   (Agent)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │  1. Setup tasks    │                    │
     │  2. Start loop     │                    │
     │  3. Go to lunch    │                    │
     │                    │ 4. Implement       │
     │                    │    tasks           │
     │                    │ 5. Run tests       │
     │                    │ 6. Create PRs ────▶│ PR #1
     │                    │                    │ PR #2
     │                    │                    │ PR #3
     │◀───────────────────────────────────────│
     │  7. Review PRs                         │
```

---

## Prerequisites

### Required
- GitHub CLI (`gh`) installed and authenticated
- AI coding assistant (Cursor, Claude Code, Windsurf, etc.)
- Node.js 18+ (for scripts)

### Setup GitHub CLI
```bash
# Install
winget install GitHub.CLI  # Windows
brew install gh            # macOS
sudo apt install gh        # Linux

# Authenticate
gh auth login
```

---

## Quick Start

### 1. Populate Tasks

```bash
# Ensure PRD exists with atomic tasks
cat .ralph/PRD_GUIDANCE.md

# Edit tasks.yaml with your task queue
# Set current_task to first task
```

### 2. Configure PR Milestones

In `.ralph/tasks.yaml`:
```yaml
pr_milestone_interval: 5  # PR every 5 tasks
```

### 3. Start Autonomous Loop

**Option A: Terminal (Claude Code)**
```bash
# Run up to 50 iterations (leave running)
./.cursor/ralph-scripts/ralph-loop.sh 50

# Or run in background
nohup ./.cursor/ralph-scripts/ralph-loop.sh 50 > ralph.log 2>&1 &
```

**Option B: Cursor Composer**
```
Run the Ralph Wiggum loop autonomously. Read PROMPT_build.md for instructions.
Process all tasks in .ralph/tasks.yaml, create PRs at milestones, 
and continue until all tasks are done or you hit an error.
```

**Option C: Windsurf Cascade**
```
Execute .ralph/tasks.yaml fully. For each task:
1. Implement the task
2. Run quality gates
3. Update task status
4. Check for PR milestone
5. Create PR if milestone reached
6. Continue to next task
Loop until <promise>DONE</promise>
```

### 4. Come Back Later

Ralph will:
- ✅ Process tasks one at a time
- ✅ Run tests and quality gates
- ✅ Create PRs every N tasks (milestone interval)
- ✅ Stop when done or stuck

You'll find:
- Multiple PRs on GitHub ready for review
- `progress.md` with detailed notes
- Any issues logged in `errors.log`

---

## How PR Milestones Work

### Every N Tasks
```yaml
pr_milestone_interval: 5  # Create PR after every 5 completed tasks
```

When milestone is reached:
1. `check-milestone.js` detects milestone
2. Agent creates feature branch: `ralph/p0-a-e`
3. Agent pushes and creates PR via `gh` CLI
4. `tasks.yaml` updated with `last_pr_*` fields
5. Work continues on new branch

### PR Flow
```
main ─────────────────────────────────────────────▶
       │                    │
       └── ralph/p0-a-e ────┤ PR #1
                            │
                            └── ralph/p0-f-j ──── PR #2
```

---

## Monitoring (Optional)

### Check Progress
```bash
# View current status
cat .ralph/progress.md

# Watch the log (if running in background)
tail -f ralph.log
```

### Check Tasks Status
```bash
# How many tasks done?
grep "status: completed" .ralph/tasks.yaml | wc -l

# Current task?
grep "current_task" .ralph/tasks.yaml
```

### View PRs
```bash
gh pr list --author @me
```

---

## Recovery

### If Agent Gets Stuck
1. Check `.ralph/errors.log`
2. Fix the issue manually
3. Restart the loop: `./.cursor/ralph-scripts/ralph-loop.sh`

### If PR Creation Fails
```bash
# Create PR manually
node .cursor/ralph-scripts/create-pr.js
```

### Skip a Task
Edit `.ralph/tasks.yaml`:
```yaml
- id: P0-C
  status: skipped  # Change from 'pending'
```

---

## IDE-Specific Autonomous Setup

### Cursor
1. Open Composer in Agent mode
2. Paste: "Read PROMPT_build.md and run the full loop autonomously"
3. Leave running (Cursor handles continuation)

### Claude Code (Terminal)
```bash
# Single command for autonomous execution
claude --print --dangerously-skip-permissions \
  -p "$(cat .ralph/PROMPT_build.md)" \
  "Process all tasks until <promise>DONE</promise>"
```

### Windsurf
1. Open Cascade
2. Say: "Run autonomous loop from .ralph/tasks.yaml"
3. Cascade will auto-continue between tasks

### GitHub Actions (CI/CD)
```yaml
# .github/workflows/ralph.yml
name: Ralph Wiggum Autonomous

on:
  workflow_dispatch:
    inputs:
      max_iterations:
        default: '20'

jobs:
  ralph:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: |
          npm ci
          ./.cursor/ralph-scripts/ralph-loop.sh ${{ inputs.max_iterations }}
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Best Practices

### Before Starting
- [ ] PRD created with atomic tasks (1-4 hours each)
- [ ] tasks.yaml populated and ordered correctly
- [ ] `current_task` set to first task
- [ ] `pr_milestone_interval` configured (5-10 recommended)
- [ ] `gh` CLI authenticated
- [ ] All dependencies installed

### For Best Results
- **Small tasks**: Each task should be 1-4 hours of work
- **Clear criteria**: Every acceptance criterion must be testable
- **Good ordering**: Dependencies first (schema → storage → API → UI)
- **Reasonable scope**: 20-50 tasks per session

### When to Intervene
- Agent outputs `<promise>STUCK</promise>`
- Same test fails 3+ times
- Critical design decision needed

---

## Example: Full Autonomous Session

```bash
# 1. Setup
vim .ralph/tasks.yaml  # Add 25 tasks from PRD

# 2. Configure
# In tasks.yaml:
#   current_task: P0-A
#   pr_milestone_interval: 5

# 3. Start (Friday afternoon)
nohup ./.cursor/ralph-scripts/ralph-loop.sh 30 > ralph.log 2>&1 &

# 4. Go home for the weekend

# 5. Monday morning - check GitHub
gh pr list
# #1: feat(ralph): P0 tasks P0-A - P0-E
# #2: feat(ralph): P0 tasks P0-F - P0-J
# #3: feat(ralph): P1 tasks P1-A - P1-E
# #4: feat(ralph): P1 tasks P1-F - P1-J

# 6. Review and merge PRs
gh pr view 1
gh pr merge 1

# Done! 25 tasks implemented, tested, and PR'd autonomously.
```

---

## Signals

| Signal | Meaning |
|--------|---------|
| `<promise>DONE</promise>` | All tasks completed successfully |
| `<promise>STUCK</promise>` | Agent needs human intervention |
| Normal exit | Task completed, continue to next |

---

**Let Chief Wiggum work while you sleep!** 🚀
