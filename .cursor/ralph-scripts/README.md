# Ralph Wiggum Helper Scripts

Scripts for the Ralph Wiggum autonomous coding loop.

## Scripts

### init-ralph.js

Initializes Ralph Wiggum in a new project.

```bash
node .cursor/ralph-scripts/init-ralph.js
```

**What it does:**
- Detects project type (language, framework, tools)
- Generates `.ralph/guardrails.md` with project-specific commands
- Creates `.ralph/tasks.yaml` template if not exists

---

### ralph-loop.sh

Runs the Ralph Wiggum loop continuously.

```bash
./.cursor/ralph-scripts/ralph-loop.sh [max_iterations]
```

**Arguments:**
- `max_iterations` - Optional, defaults to 20

---

### ralph-once.sh

Runs a single Ralph Wiggum iteration.

```bash
./.cursor/ralph-scripts/ralph-once.sh
```

---

### check-coverage.js

Verifies test coverage for new code.

```bash
node .cursor/ralph-scripts/check-coverage.js
```

**Returns:** Exit code 0 if coverage ≥ 80%, non-zero otherwise.

---

### check-milestone.js

Checks if a PR milestone has been reached.

```bash
node .cursor/ralph-scripts/check-milestone.js
```

**Returns:** Exit code 0 if milestone reached.

---

### create-pr.js

Creates a GitHub PR for completed milestone tasks.

```bash
node .cursor/ralph-scripts/create-pr.js
```

**Requires:** `gh` CLI installed and authenticated.

---

### archive-session.js

Archives completed session artifacts.

```bash
node .cursor/ralph-scripts/archive-session.js
```

**What it does:**
- Moves session files to `.ralph/archive/session-<timestamp>/`
- Creates fresh `tasks.yaml` and `progress.md` templates
- Generates `SESSION_SUMMARY.json` with metadata
