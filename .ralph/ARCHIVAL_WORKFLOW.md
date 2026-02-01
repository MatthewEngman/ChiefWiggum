# Ralph Wiggum Session Archival Workflow

**Purpose:** Clean up session artifacts after completion and prepare for next
session

---

## When to Archive

Archive a session when:

- ✅ All tasks in `tasks.yaml` are completed (`current_task: null`)
- ✅ All work has been committed
- ✅ PRs have been created (if using PR workflow)
- ✅ Ready to start a new batch of features

---

## What Gets Archived

### Archived Files (moved to `.ralph/archive/session-<timestamp>/`)

- `tasks.yaml` - Completed task queue (archived, fresh template created)
- `progress.md` - Session progress log
- `COMPLETION_SUMMARY.md` - Completion summary
- `DOCUMENTATION_UPDATE_SUMMARY.md` - Documentation changes
- `WEBSITE_DOCS_UPDATE_SUMMARY.md` - Website doc updates
- `NEXT_STEPS_COMPLETED.md` - Next steps tracking
- `errors.log` - Error log
- `activity.log` - Activity log
- `RALPH_IMPROVEMENTS.md` - Workflow improvements (if exists)
- `SETUP_COMPLETE.md` - Setup verification (if exists)

### Kept Files (remain in `.ralph/`)

- `guardrails.md` - Rules and patterns (updated over time)
- `PRD_GUIDANCE.md` - PRD creation guidance (reference)
- `README.md` - Workflow overview (reference)
- `RALPH_TASK.md` - Agent task instructions (reference)
- `PROMPT_build.md` - Agent operating instructions (reference)

### New Files Created

- Fresh `tasks.yaml` - Template ready for new session tasks
- Fresh `progress.md` - Empty progress log for next session
- Fresh `errors.log` - Empty error log
- Fresh `activity.log` - Empty activity log

### New Files Created

- Fresh `progress.md` - Empty progress log for next session
- Fresh `errors.log` - Empty error log
- Fresh `activity.log` - Empty activity log

---

## How to Archive

### Automatic Archival

```bash
node .cursor/ralph-scripts/archive-session.js
```

**What it does:**

1. Checks if session is complete (all tasks done)
2. Creates archive directory with timestamp
3. Moves session artifacts to archive
4. Creates clean structure for next session
5. Creates `SESSION_SUMMARY.json` with session metadata

### Manual Archival

If you prefer manual control:

```bash
# Create archive directory
mkdir -p .ralph/archive/session-$(date +%Y%m%d-%H%M%S)

# Move files (adjust timestamp)
mv .ralph/progress.md .ralph/archive/session-20260131-120000/
mv .ralph/COMPLETION_SUMMARY.md .ralph/archive/session-20260131-120000/
# ... etc

# Create fresh files
echo "# Progress Log" > .ralph/progress.md
echo "" > .ralph/errors.log
echo "" > .ralph/activity.log
```

---

## Archive Structure

```
.ralph/
├── tasks.yaml              # Task queue (kept, reset for next session)
├── guardrails.md           # Rules (kept, updated over time)
├── progress.md             # Fresh progress log
├── errors.log              # Fresh error log
├── activity.log            # Fresh activity log
└── archive/                # Archived sessions
    ├── session-20260131-120000/
    │   ├── SESSION_SUMMARY.json
    │   ├── progress.md
    │   ├── COMPLETION_SUMMARY.md
    │   ├── errors.log
    │   └── ...
    └── session-20260215-140000/
        └── ...
```

---

## Session Summary

Each archived session includes `SESSION_SUMMARY.json`:

```json
{
  "sessionId": "session-20260131-120000",
  "branch": "feat/ralph-all-features",
  "completedTasks": 55,
  "archivedAt": "2026-01-31T12:00:00.000Z",
  "archivedFiles": 8
}
```

---

## Benefits

1. **Clean workspace** - Fresh start for next session
2. **Historical record** - All sessions archived with metadata
3. **Easy reference** - Can review past sessions
4. **Reduced clutter** - Only active files in `.ralph/`
5. **Better organization** - Clear separation of sessions

---

## Integration with PR Workflow

If using PR workflow:

1. **Before archiving:**
   - Ensure all PRs are created
   - All commits are on feature branches
   - Main branch is clean

2. **Archive session:**
   - Run archival script
   - Session artifacts saved

3. **Next session:**
   - Start fresh with new tasks
   - Clean progress tracking
   - Updated guardrails from previous session

---

## Git Integration

The archival script:

- ✅ Reads current branch name for session summary
- ✅ Does NOT commit changes (you commit manually)
- ✅ Does NOT modify git history
- ✅ Preserves all session data in archive

**Recommended workflow:**

```bash
# 1. Complete all tasks
# 2. Create PRs (if using PR workflow)
# 3. Archive session
node .cursor/ralph-scripts/archive-session.js

# 4. Commit archival (optional)
git add .ralph/
git commit -m "chore(ralph): archive completed session"

# 5. Start next session
# Update tasks.yaml with new tasks
# Begin Ralph loop
```

---

## Cleanup Old Archives

To remove old archives (optional):

```bash
# Remove archives older than 90 days
find .ralph/archive -type d -mtime +90 -exec rm -rf {} \;
```

Or keep all archives for historical reference (recommended).

---

## Next Steps After Archival

1. **Review archived session:**
   - Check `SESSION_SUMMARY.json` in archive
   - Review `COMPLETION_SUMMARY.md` in archive

2. **Create PRD for next session:**
   - **CRITICAL:** Create or update `docs/FEATURE_PRDS.md` with atomic-level
     tasks
   - See `PRD_GUIDANCE.md` for task breakdown patterns
   - Ensure all tasks are atomic (can complete in one iteration)

3. **Populate tasks.yaml:**
   - Copy tasks from PRD into fresh `tasks.yaml` template
   - Set `current_task` to first task ID
   - Verify task order follows dependencies
   - Configure `pr_milestone_interval`

4. **Plan next session:**
   - Review and update `guardrails.md` with lessons learned
   - Ensure all dependencies are installed
   - Start fresh Ralph loop

---

**Ready to start your next session!**

