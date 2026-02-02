# Ralph Wiggum Autonomous Coding Loop

This directory contains the state and artifacts for the Ralph Wiggum autonomous
coding loop workflow.

## Current Session

- **Tasks:** See `tasks.yaml` for current task queue
- **Progress:** See `progress.md` for session progress
- **Rules:** See `guardrails.md` for coding rules and patterns

## Archived Sessions

Completed sessions are archived to `.ralph/archive/session-<timestamp>/`

## Key Documents

### Workflow Documents

- **`RALPH_TASK.md`** - Task instructions for Ralph agent
- **`PROMPT_build.md`** - Agent operating instructions
- **`guardrails.md`** - Coding rules and learned patterns
- **`tasks.yaml`** - Task queue with current task and status
- **`PRD_GUIDANCE.md`** - How to create PRDs with atomic tasks

### Session Artifacts

- **`ARCHIVAL_WORKFLOW.md`** - How to archive sessions after completion

### Helper Scripts

Located in `.cursor/ralph-scripts/`:

- **`check-coverage.js`** - Verify test coverage for new code
- **`check-milestone.js`** - Check if PR milestone reached
- **`create-pr.js`** - Create PR for milestone tasks
- **`archive-session.js`** - Archive completed session artifacts

## Workflow

1. **Create PRD:** Write PRD with atomic-level tasks (see `PRD_GUIDANCE.md`)
2. **Populate tasks.yaml:** Copy tasks from PRD into `tasks.yaml`
3. **Start Session:** Set `current_task` to first task ID
4. **Run Ralph Loop:** Execute `.cursor/ralph-scripts/ralph-loop.sh`
5. **Complete Tasks:** Ralph implements tasks, writes tests, creates PRs
6. **Archive Session:** Run `node .cursor/ralph-scripts/archive-session.js` when
   done
7. **Implement Tests:** Use `BRANCH_STRATEGY.md` to add tests to feature
   branches
8. **Merge to Main:** Merge tested feature branches incrementally

## Next Steps After Session Completion

1. **Review Testing Gaps:** See `TESTING_GAPS_ANALYSIS.md`
2. **Plan Branch Strategy:** See `BRANCH_STRATEGY.md`
3. **Archive Session:** Run archival script
4. **Create Feature Branches:** Implement tests per feature group
5. **Create PRs:** Merge tested features to main

---

## Before Starting a New Session

**CRITICAL:** Before populating `tasks.yaml` with new tasks:

1. **Create/Update PRD** - Write `docs/FEATURE_PRDS.md` with atomic-level tasks
2. **Review PRD Guidance** - See `PRD_GUIDANCE.md` for task breakdown patterns
3. **Extract Tasks** - Copy tasks from PRD to `tasks.yaml`
4. **Verify Atomic** - Ensure each task can be completed in one iteration
5. **Set Dependencies** - Order tasks by dependencies (schema → storage → API →
   UI)

**See `PRD_GUIDANCE.md` for detailed instructions on creating atomic tasks.**
