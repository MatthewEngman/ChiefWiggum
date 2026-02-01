# Deploying Ralph Wiggum to Any Project

This guide explains how to deploy the generic Ralph Wiggum autonomous coding
loop to any project.

---

## Prerequisites

- Node.js 18+ (for initialization scripts)
- Git
- Your project's normal development environment

---

## Step 1: Copy Ralph Files

### Option A: Copy from Template

If you have a Ralph template repository:

```bash
# Copy .ralph directory
cp -r /path/to/ralph-template/.ralph ./

# Copy scripts
mkdir -p .cursor/ralph-scripts
cp -r /path/to/ralph-template/.cursor/ralph-scripts/* ./.cursor/ralph-scripts/
```

### Option B: Manual Setup

Create the directory structure:

```bash
mkdir -p .ralph
mkdir -p .cursor/ralph-scripts
```

Copy these files:

**Required Files:**

- `.ralph/RALPH_TASK.md` - Generic task instructions
- `.ralph/PROMPT_build.md` - Generic agent instructions
- `.ralph/PRD_GUIDANCE.md` - PRD creation guidance
- `.ralph/README.md` - Workflow overview
- `.cursor/ralph-scripts/init-ralph.js` - Initialization script
- `.cursor/ralph-scripts/ralph-once.sh` - Single iteration
- `.cursor/ralph-scripts/ralph-loop.sh` - Full loop
- `.cursor/ralph-scripts/check-coverage.js` - Coverage checker
- `.cursor/ralph-scripts/check-milestone.js` - Milestone checker
- `.cursor/ralph-scripts/create-pr.js` - PR creation
- `.cursor/ralph-scripts/archive-session.js` - Session archival

---

## Step 2: Run Initialization

```bash
node .cursor/ralph-scripts/init-ralph.js
```

This script will:

1. **Detect Project Type**
   - Language (TypeScript, Python, Go, Rust, Java, etc.)
   - Framework (React, Next.js, Express, Django, etc.)
   - Package manager (npm, yarn, pnpm, pip, cargo, go, etc.)

2. **Detect Tools**
   - Testing framework (Jest, Vitest, pytest, etc.)
   - Linter (ESLint, pylint, etc.)
   - Formatter (Prettier, black, etc.)
   - Database ORM (Drizzle, Prisma, TypeORM, etc.)

3. **Generate Files**
   - `.ralph/guardrails.md` - Project-specific guardrails
   - `.ralph/tasks.yaml` - Task queue template (if doesn't exist)
   - Updates `.ralph/PROMPT_build.md` with project-specific commands

---

## Step 3: Review Generated Files

### Check guardrails.md

```bash
cat .ralph/guardrails.md
```

Verify:

- ✅ Quality gate commands match your project
- ✅ Database migration commands are correct (if applicable)
- ✅ Test commands are correct
- ✅ Build commands are correct

### Update if Needed

If commands are incorrect, manually edit `.ralph/guardrails.md`:

````markdown
### Quality Gates (Run Before Every Commit)

```bash
# Your actual commands here
npm run type-check
npm run lint
npm run test
npm run build
```
````

````

---

## Step 4: Customize for Your Project

### Update Test Requirements

Edit `.ralph/PROMPT_build.md` to match your test structure:

```markdown
### 5. Write/Update Tests (CRITICAL)

**Every task MUST include appropriate tests:**

- **New API routes** → Add tests in `tests/api/` or `__tests__/api.test.ts`
- **New services** → Add tests in `tests/services/` or `__tests__/services/`
- **New components** → Add tests in `tests/components/` or `**/*.test.tsx`
````

### Update File Patterns

Edit `.ralph/guardrails.md` to add your project's patterns:

```markdown
## File Patterns to Follow

### API Routes

- Use asyncHandler wrapper
- Validate inputs with Zod
- Return proper status codes

### Components

- Use functional components
- Follow your project's component structure
```

---

## Step 5: Create PRD

Before starting a session, create a PRD with atomic tasks:

1. **Read PRD Guidance**

   ```bash
   cat .ralph/PRD_GUIDANCE.md
   ```

2. **Create PRD**
   - Write `docs/FEATURE_PRDS.md` with atomic-level tasks
   - Break features into 5-10 tasks each
   - Each task should be completable in one iteration

3. **Extract Tasks**
   - Copy tasks from PRD into `.ralph/tasks.yaml`
   - Set `current_task` to first task ID
   - Verify task order follows dependencies

---

## Step 6: Start Using Ralph

### Single Iteration (Testing)

```bash
./.cursor/ralph-scripts/ralph-once.sh
```

### Full Loop

```bash
./.cursor/ralph-scripts/ralph-loop.sh
```

Or with custom iteration limit:

```bash
./.cursor/ralph-scripts/ralph-loop.sh 10  # Run up to 10 iterations
```

---

## Project-Specific Customizations

### Python Projects

**Additional Setup:**

```bash
# Install js-yaml for scripts
pip install pyyaml

# Or use Node.js for scripts (recommended)
# Scripts work with Node.js regardless of project language
```

**Guardrails Example:**

````markdown
### Quality Gates

```bash
mypy .                    # Type checking
pylint src/               # Linting
pytest tests/             # Unit tests
pytest --cov              # Coverage
```
````

````

### Go Projects

**Guardrails Example:**
```markdown
### Quality Gates

```bash
go vet ./...              # Static analysis
go fmt ./...              # Formatting
go test ./...             # Unit tests
go test -cover ./...      # Coverage
go build                  # Build
````

````

### Rust Projects

**Guardrails Example:**
```markdown
### Quality Gates

```bash
cargo fmt                 # Formatting
cargo clippy              # Linting
cargo test                # Unit tests
cargo tarpaulin           # Coverage
cargo build               # Build
````

````

---

## Troubleshooting

### Scripts Don't Run

**Issue:** `Permission denied` when running `.sh` scripts

**Solution:**
```bash
chmod +x .cursor/ralph-scripts/*.sh
````

### Wrong Commands Detected

**Issue:** Initialization detected wrong commands

**Solution:**

1. Manually edit `.ralph/guardrails.md`
2. Or re-run init: `node .cursor/ralph-scripts/init-ralph.js --force` (if
   implemented)

### Coverage Check Fails

**Issue:** `check-coverage.js` doesn't work with your coverage format

**Solution:**

1. Update `check-coverage.js` to parse your coverage format
2. Or disable coverage check in workflow
3. Or create project-specific coverage checker

### No Project Detected

**Issue:** Initialization says "Unknown" for everything

**Solution:**

1. Ensure you're in project root
2. Check that project files exist (package.json, requirements.txt, etc.)
3. Manually create `.ralph/guardrails.md` with your commands

---

## Integration Examples

### GitHub Actions

```yaml
name: Ralph Wiggum

on:
  workflow_dispatch:

jobs:
  ralph:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Run Ralph Loop
        run: ./.cursor/ralph-scripts/ralph-loop.sh 10
```

### GitLab CI

```yaml
ralph:
  image: node:20
  script:
    - ./.cursor/ralph-scripts/ralph-loop.sh 10
  only:
    - schedules
```

---

## Best Practices

1. **Always Initialize** - Run `init-ralph.js` when setting up
2. **Review Guardrails** - Verify generated commands are correct
3. **Customize as Needed** - Add project-specific patterns
4. **Version Control** - Commit `.ralph/` directory (except sensitive
   `tasks.yaml`)
5. **Document Patterns** - Add learned patterns to `guardrails.md`

---

## Next Steps

1. ✅ Files copied
2. ✅ Initialization run
3. ✅ Guardrails reviewed
4. ✅ PRD created
5. ✅ Tasks populated
6. ✅ Start Ralph loop!

---

**Ready to use Ralph in your project!** 🚀

For questions, see `.ralph/README.md` or `.ralph/PRD_GUIDANCE.md`.
