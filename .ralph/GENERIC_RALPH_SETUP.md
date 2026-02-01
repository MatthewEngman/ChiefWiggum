# Generic Ralph Wiggum Setup - Deploy to Any Project

This document describes how to set up Ralph Wiggum autonomous coding loop in any
project.

---

## Quick Start

### 1. Copy Ralph Files

Copy these files/directories to your project:

```
.ralph/
├── RALPH_TASK.md              # Agent task instructions (generic)
├── PROMPT_build.md            # Agent operating instructions (generic)
├── PRD_GUIDANCE.md            # PRD creation guidance
├── README.md                  # Workflow overview
└── templates/
    ├── tasks.yaml.template    # Task queue template
    └── guardrails.md.template # Guardrails template

.cursor/ralph-scripts/
├── ralph-once.sh              # Single iteration script
├── ralph-loop.sh              # Full loop script
├── check-coverage.js           # Coverage checker (generic)
├── check-milestone.js         # Milestone checker
├── create-pr.js               # PR creation
├── archive-session.js         # Session archival
└── init-ralph.js              # Project initialization (NEW)
```

### 2. Run Initialization

```bash
node .cursor/ralph-scripts/init-ralph.js
```

This will:

- Detect project type (Node.js, Python, Go, Rust, etc.)
- Detect testing framework
- Detect build tools
- Generate project-specific guardrails
- Create initial `tasks.yaml` template
- Set up project-specific scripts

### 3. Customize for Your Project

- Update `.ralph/PROMPT_build.md` with project-specific commands
- Review generated `.ralph/guardrails.md`
- Create PRD with atomic tasks
- Populate `.ralph/tasks.yaml`

---

## File Structure

### Core Files (Generic)

**`.ralph/RALPH_TASK.md`** - Generic task instructions

- Works for any language/framework
- References `.ralph/tasks.yaml` (project-specific)
- References PRD (project-specific)

**`.ralph/PROMPT_build.md`** - Generic agent instructions

- Language-agnostic workflow
- Placeholders for project-specific commands
- Gets customized during initialization

**`.ralph/PRD_GUIDANCE.md`** - Generic PRD guidance

- Works for any project type
- Task breakdown patterns are universal

### Generated Files (Project-Specific)

**`.ralph/guardrails.md`** - Generated during init

- Project-specific commands
- Detected tech stack patterns
- Language-specific best practices

**`.ralph/tasks.yaml`** - Created from template

- Project-specific task structure
- Customized for detected stack

---

## Initialization Script

The `init-ralph.js` script analyzes your project and generates:

1. **Project Type Detection**
   - Language (TypeScript, Python, Go, Rust, Java, etc.)
   - Framework (React, Next.js, Express, Django, etc.)
   - Build tool (npm, yarn, pnpm, cargo, go, etc.)

2. **Testing Framework Detection**
   - Unit test framework (Jest, Vitest, pytest, etc.)
   - E2E framework (Playwright, Cypress, Selenium, etc.)
   - Coverage tool (c8, coverage.py, etc.)

3. **Guardrails Generation**
   - Quality gate commands
   - Database migration commands (if detected)
   - Build commands
   - Test commands
   - Linting/formatting commands

4. **Script Customization**
   - Updates `PROMPT_build.md` with detected commands
   - Updates `RALPH_TASK.md` with project-specific paths
   - Creates project-specific helper scripts

---

## Supported Project Types

### JavaScript/TypeScript Projects

**Detected by:**

- `package.json` presence
- `tsconfig.json` or `jsconfig.json`
- Framework files (Next.js, React, Express, etc.)

**Generated Guardrails:**

- npm/yarn/pnpm commands
- TypeScript compilation
- ESLint/Prettier
- Jest/Vitest/Mocha
- Build commands

### Python Projects

**Detected by:**

- `requirements.txt` or `pyproject.toml`
- `setup.py` or `Pipfile`

**Generated Guardrails:**

- pip/poetry commands
- pytest/unittest
- mypy/pylint
- black/flake8

### Go Projects

**Detected by:**

- `go.mod` presence
- `.go` files

**Generated Guardrails:**

- `go test`
- `go build`
- `go fmt`
- `golangci-lint`

### Rust Projects

**Detected by:**

- `Cargo.toml` presence

**Generated Guardrails:**

- `cargo test`
- `cargo build`
- `cargo fmt`
- `cargo clippy`

### Java Projects

**Detected by:**

- `pom.xml` or `build.gradle`

**Generated Guardrails:**

- Maven/Gradle commands
- JUnit tests
- Checkstyle/SpotBugs

---

## Customization Points

### 1. Quality Gates

Edit `.ralph/guardrails.md` to add project-specific quality gates:

````markdown
### Quality Gates (Run Before Every Commit)

```bash
npm run type-check    # Your project's type check
npm run lint          # Your project's linter
npm run test:unit     # Your project's unit tests
npm run build         # Your project's build
```
````

````

### 2. Database Migrations

If your project uses a database, add migration commands:

```markdown
### Database Migrations

After ANY changes to schema:
```bash
npm run db:push       # Your project's migration command
````

````

### 3. Testing Requirements

Customize test requirements in `.ralph/PROMPT_build.md`:

```markdown
### 5. Write/Update Tests (CRITICAL)

**Every task MUST include appropriate tests:**

- **New API routes** → Add tests in `tests/api/` or similar
- **New services** → Add tests in `tests/services/`
- **New components** → Add tests in `tests/components/`
````

---

## Example: Setting Up in a New Project

### Step 1: Copy Files

```bash
# Copy .ralph/ directory
cp -r /path/to/ralph-template/.ralph ./

# Copy scripts
cp -r /path/to/ralph-template/.cursor/ralph-scripts ./.cursor/
```

### Step 2: Initialize

```bash
node .cursor/ralph-scripts/init-ralph.js
```

**Output:**

```
🔍 Analyzing project...

Detected:
  - Language: TypeScript
  - Framework: Next.js
  - Package Manager: npm
  - Testing: Jest + Playwright
  - Database: PostgreSQL (Drizzle ORM)

✅ Generated project-specific guardrails
✅ Updated PROMPT_build.md with Next.js commands
✅ Created tasks.yaml template
✅ Created guardrails.md

📝 Next steps:
  1. Review .ralph/guardrails.md
  2. Create PRD with atomic tasks
  3. Populate .ralph/tasks.yaml
  4. Start Ralph loop: ./.cursor/ralph-scripts/ralph-loop.sh
```

### Step 3: Review Generated Files

- Check `.ralph/guardrails.md` for accuracy
- Verify commands match your project
- Add any missing project-specific patterns

### Step 4: Start Using

- Create PRD with atomic tasks
- Populate `tasks.yaml`
- Run Ralph loop

---

## Generic Templates

### tasks.yaml Template

```yaml
# Ralph Wiggum Task Queue
# Tasks are processed in order. Agent marks tasks complete and moves to next.

current_task: null

# PR Workflow Configuration
pr_milestone_interval: 5

# PR Tracking
last_pr_branch: null
last_pr_task_id: null
last_pr_phase: null
last_pr_number: null
last_pr_date: null

tasks:
  # Add your tasks here from PRD
  # See PRD_GUIDANCE.md for task structure

summary:
  total_tasks: 0
```

### guardrails.md Template

```markdown
# Guardrails & Lessons Learned

## Rules

1. ONE task per iteration
2. Write tests for every task
3. Run tests before committing
4. Check test coverage
5. Update progress after completing work

## Quality Gates

<!-- Generated during init based on detected stack -->

## Project-Specific Patterns

<!-- Generated during init based on detected stack -->
```

---

## Integration with CI/CD

Ralph workflow can integrate with any CI/CD system:

### GitHub Actions

```yaml
- name: Run Ralph Loop
  run: ./.cursor/ralph-scripts/ralph-loop.sh
```

### GitLab CI

```yaml
ralph:
  script:
    - ./.cursor/ralph-scripts/ralph-loop.sh
```

### CircleCI

```yaml
jobs:
  ralph:
    steps:
      - run: ./.cursor/ralph-scripts/ralph-loop.sh
```

---

## Best Practices

1. **Always Initialize** - Run `init-ralph.js` when setting up in new project
2. **Review Guardrails** - Verify generated guardrails match your project
3. **Customize as Needed** - Add project-specific patterns to guardrails
4. **Version Control** - Commit `.ralph/` directory (except `tasks.yaml` if
   sensitive)
5. **Document Patterns** - Add learned patterns to `guardrails.md` over time

---

## Troubleshooting

### Scripts Don't Work

- Ensure Node.js is installed (for JavaScript-based scripts)
- Check file permissions: `chmod +x .cursor/ralph-scripts/*.sh`
- Verify paths are correct for your project structure

### Wrong Commands Detected

- Manually edit `.ralph/guardrails.md`
- Update `.ralph/PROMPT_build.md` with correct commands
- Re-run init if needed: `node .cursor/ralph-scripts/init-ralph.js --force`

### Coverage Check Fails

- Ensure coverage tool is installed
- Update `check-coverage.js` for your coverage format
- Or disable coverage check if not applicable

---

## Contributing

To make Ralph work with more project types:

1. Add detection logic to `init-ralph.js`
2. Add guardrails template for new project type
3. Update documentation
4. Test with real project

---

**Ready to deploy Ralph to any project!** 🚀
