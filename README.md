# Chief Wiggum - Ralph Wiggum Autonomous Coding Loop

**A generic, reusable autonomous coding loop system that can be deployed to any
project.**

Chief Wiggum provides a complete framework for setting up the Ralph Wiggum
autonomous coding loop in any software project, regardless of language or
framework.

---

## 🚀 What is Ralph Wiggum?

Ralph Wiggum is an autonomous coding agent that works through a task queue,
implementing features one task at a time with comprehensive testing, quality
gates, and milestone-based PR creation.

### Key Features

- ✅ **Universal Compatibility** - Works with TypeScript, Python, Go, Rust,
  Java, and more
- ✅ **Auto-Detection** - Automatically detects project type and generates
  project-specific guardrails
- ✅ **Test Coverage** - Requires 80%+ test coverage for all new code
- ✅ **PR Workflow** - Creates PRs at milestones (every 5-10 tasks) for better
  code review
- ✅ **Session Management** - Archives completed sessions and prepares for next
  batch
- ✅ **PRD-Driven** - Requires atomic-level tasks from PRDs before starting

### 🆕 Chief Wiggum Enhancements

This framework extends the original Ralph Wiggum concept with:

| Enhancement | Description |
|-------------|-------------|
| **Generic Project Support** | Auto-detection and initialization for any language/framework |
| **Milestone PR Workflow** | Automatic PR creation every N tasks instead of one giant commit |
| **Test Coverage Gates** | Built-in 80% coverage enforcement with coverage checking scripts |
| **Session Archival** | Complete session history with `archive-session.js` |
| **PRD Guidance** | Structured approach to creating atomic, implementable tasks |
| **Quality Gate Scripts** | `check-coverage.js`, `check-milestone.js`, `create-pr.js` |
| **Loop Automation** | `ralph-loop.sh` and `ralph-once.sh` for autonomous execution |
| **Guardrails System** | Project-specific rules and learned patterns that persist |

## 📦 Quick Start

### 1. Copy Files to Your Project

```bash
# Copy .ralph directory
cp -r .ralph/ /path/to/your-project/

# Copy scripts
mkdir -p /path/to/your-project/.cursor/ralph-scripts
cp -r .cursor/ralph-scripts/* /path/to/your-project/.cursor/ralph-scripts/
```

### 2. Initialize for Your Project

```bash
cd /path/to/your-project
node .cursor/ralph-scripts/init-ralph.js
```

This will:

- Detect your project type (language, framework, tools)
- Generate project-specific guardrails
- Create `tasks.yaml` template
- Update commands based on your stack

### 3. Create PRD with Atomic Tasks

Before starting, create a PRD with atomic-level tasks:

```bash
# Read PRD guidance
cat .ralph/PRD_GUIDANCE.md

# Create your PRD
# Edit docs/FEATURE_PRDS.md with atomic tasks
```

### 4. Populate Tasks and Start

```bash
# Copy tasks from PRD to tasks.yaml
# Set current_task to first task ID

# Run Ralph loop
./.cursor/ralph-scripts/ralph-loop.sh
```

---

## 📚 Documentation

### Core Documentation

- **`.ralph/README.md`** - Workflow overview and quick reference
- **`.ralph/DEPLOYMENT_GUIDE.md`** - Step-by-step deployment instructions
- **`.ralph/GENERIC_RALPH_SETUP.md`** - Generic setup guide
- **`.ralph/PRD_GUIDANCE.md`** - How to create PRDs with atomic tasks

### Workflow Documents

- **`.ralph/RALPH_TASK.md`** - Task instructions for Ralph agent
- **`.ralph/PROMPT_build.md`** - Agent operating instructions
- **`.ralph/ARCHIVAL_WORKFLOW.md`** - Session archival process

### IDE Integration

- **`.ralph/IDE_INTEGRATION.md`** - Using with Cursor, Windsurf, Claude Code, Antigravity, Copilot
- **`.ralph/AUTONOMOUS_MODE.md`** - Fire-and-forget operation with auto-PRs

---

## 🛠️ Supported Project Types

The initialization script automatically detects and supports:

### Languages

- TypeScript/JavaScript
- Python
- Go
- Rust
- Java

### Frameworks

- React, Next.js, Express (Node.js)
- Django, Flask, FastAPI (Python)
- Standard library (Go, Rust)

### Tools

- Package Managers: npm, yarn, pnpm, pip, cargo, go
- Testing: Jest, Vitest, pytest, go test, cargo test
- Databases: Drizzle, Prisma, TypeORM, Sequelize, Mongoose
- Linters: ESLint, pylint, golangci-lint, cargo clippy

---

## 📋 Workflow Overview

### 1. Session Setup

```bash
# Create PRD with atomic tasks
# Populate .ralph/tasks.yaml
# Set current_task to first task
```

### 2. Run Ralph Loop

```bash
# Single iteration (testing)
./.cursor/ralph-scripts/ralph-once.sh

# Full loop (up to 20 iterations)
./.cursor/ralph-scripts/ralph-loop.sh
```

### 3. Ralph Process (Per Task)

1. Reads current task from `tasks.yaml`
2. Implements task according to PRD
3. Writes/updates tests (80%+ coverage required)
4. Runs quality gates (type-check, lint, test, build)
5. Checks coverage threshold
6. Updates progress and commits
7. Checks for PR milestone
8. Creates PR if milestone reached

### 4. Session Completion

```bash
# Archive completed session
node .cursor/ralph-scripts/archive-session.js

# Creates fresh structure for next session
# Archives tasks.yaml, progress, and logs
```

---

## 🎯 Key Concepts

### Atomic Tasks

Tasks should be:

- ✅ Completable in one iteration (1-4 hours)
- ✅ Have clear, testable acceptance criteria
- ✅ Have single responsibility
- ✅ Minimal dependencies

### PRD Requirements

Before starting a session:

- ✅ Create PRD with atomic-level tasks
- ✅ Break features into 5-10 tasks each
- ✅ Order tasks by dependencies (schema → storage → API → UI)
- ✅ Include test requirements in each task

### Quality Gates

Every task must pass:

- ✅ Type checking (if applicable)
- ✅ Linting
- ✅ Unit tests
- ✅ Test coverage (80%+ for new code)
- ✅ Production build

### PR Workflow

PRs created at milestones:

- Every 5-10 tasks (configurable)
- At phase boundaries
- Feature branches: `ralph/[phase]-[task-range]`

---

## 📁 Project Structure

```
.ralph/
├── RALPH_TASK.md              # Agent task instructions
├── PROMPT_build.md            # Agent operating instructions
├── PRD_GUIDANCE.md            # PRD creation guidance
├── README.md                  # Workflow overview
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
├── GENERIC_RALPH_SETUP.md     # Generic setup guide
├── guardrails.md              # Generated (project-specific)
├── tasks.yaml                 # Task queue (project-specific)
└── progress.md                # Session progress

.cursor/ralph-scripts/
├── init-ralph.js              # Project initialization (KEY)
├── ralph-once.sh              # Single iteration
├── ralph-loop.sh              # Full loop
├── check-coverage.js           # Coverage checker
├── check-milestone.js          # Milestone checker
├── create-pr.js               # PR creation
└── archive-session.js         # Session archival
```

---

## 🔧 Helper Scripts

### Initialization

```bash
node .cursor/ralph-scripts/init-ralph.js
```

Detects project and generates guardrails.

### Coverage Check

```bash
npm run test:coverage
node .cursor/ralph-scripts/check-coverage.js
```

Verifies 80%+ coverage for new code.

### Milestone Check

```bash
node .cursor/ralph-scripts/check-milestone.js
```

Checks if PR milestone reached.

### PR Creation

```bash
node .cursor/ralph-scripts/create-pr.js
```

Creates PR for milestone tasks.

### Session Archival

```bash
node .cursor/ralph-scripts/archive-session.js
```

Archives completed session and creates fresh structure.

---

## 💡 Example: Setting Up in a New Project

### Python Django Project

```bash
# 1. Copy files
cp -r .ralph/ /path/to/django-project/
cp -r .cursor/ralph-scripts/ /path/to/django-project/.cursor/

# 2. Initialize
cd /path/to/django-project
node .cursor/ralph-scripts/init-ralph.js

# Output:
# Detected:
#   - Language: Python
#   - Framework: Django
#   - Testing: pytest
#   - Database: Django ORM
#
# ✅ Generated guardrails with:
#   - pytest tests/
#   - mypy .
#   - black .
#   - python manage.py migrate

# 3. Create PRD and populate tasks.yaml
# 4. Start Ralph loop
```

### Go Project

```bash
# Same process, generates:
#   - go test ./...
#   - go fmt ./...
#   - go build
#   - golangci-lint run
```

---

## 🎓 Best Practices

1. **Always Create PRD First** - Atomic tasks are essential
2. **Review Generated Guardrails** - Verify commands are correct
3. **Start Small** - Break large features into 5-10 atomic tasks
4. **Test Everything** - 80%+ coverage required for new code
5. **Create PRs at Milestones** - Better code review process
6. **Archive Sessions** - Clean start for next batch

---

## 🤝 Contributing

To add support for more project types:

1. Add detection logic to `init-ralph.js`
2. Add guardrails template for new project type
3. Update documentation
4. Test with real project

---

## 📖 Learn More

- **Setup Guide**: `.ralph/DEPLOYMENT_GUIDE.md`
- **PRD Guidance**: `.ralph/PRD_GUIDANCE.md`
- **Workflow**: `.ralph/README.md`
- **Generic Setup**: `.ralph/GENERIC_RALPH_SETUP.md`

---

## 🚦 Status

✅ **Ready for Production Use**

- Universal compatibility
- Auto-detection working
- Comprehensive documentation
- Tested with TypeScript, Python, Go projects

---

## 📝 License

This is a template/reference implementation. Use freely in your projects.

---

## 🙏 Acknowledgments

Ralph Wiggum autonomous coding loop - bringing autonomous development to any
project.

---

**Ready to deploy Ralph to your project?** Start with
`.ralph/DEPLOYMENT_GUIDE.md` 🚀
