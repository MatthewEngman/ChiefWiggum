# PRD (Product Requirements Document) Guidance for Ralph Wiggum

**Purpose:** Create atomic-level tasks from PRDs for use in `.ralph/tasks.yaml`

---

## Why PRDs Are Required

Before starting a new Ralph Wiggum session, you **must** create or update a PRD
with atomic-level tasks. This ensures:

1. **Clear Requirements** - Each task has well-defined acceptance criteria
2. **Proper Sequencing** - Tasks are ordered logically (schema → storage → API →
   UI)
3. **Atomic Tasks** - Each task is small enough to complete in one iteration
4. **Testability** - Each task includes test requirements
5. **Traceability** - Can track which PRD features map to which tasks

---

## PRD Structure

### Location

PRDs should be in `docs/FEATURE_PRDS.md` or separate files in `docs/features/`.

### Required Sections

#### 1. Feature Overview

```markdown
## Feature Name

### Overview

Brief description of the feature and its purpose.

### Goals

- Primary goal 1
- Primary goal 2

### Success Metrics

- Metric 1: Target value
- Metric 2: Target value
```

#### 2. Atomic Tasks

Each feature should be broken down into atomic tasks following this structure:

```markdown
#### Task-ID: Task Name

**Description:** What to implement (1-2 sentences)

**Implementation:**

1. Step 1
2. Step 2
3. Step 3

**Acceptance Criteria:**

- [ ] Criterion 1 (must be testable)
- [ ] Criterion 2
- [ ] Criterion 3

**Files to Create:**

- `path/to/new-file.ts`

**Files to Modify:**

- `path/to/existing-file.ts`

**Dependencies:**

- Requires Task-ID-X to be completed first
- Requires npm package: package-name

**Test Requirements:**

- Unit tests for new service
- Integration tests for API routes
- Component tests for UI
- E2E tests for user flow
```

---

## Task Breakdown Patterns

### Pattern 1: Database Feature

**Typical Sequence:**

1. **Schema Task** - Add database tables/fields
2. **Storage Task** - Implement storage layer methods
3. **API Task** - Create API routes
4. **UI Task** - Build user interface
5. **Integration Task** - Connect everything

**Example:**

```yaml
- id: P0-A
  name: Create Subscription Database Schema
  description: Add database tables for subscription management
  acceptance_criteria:
    - Subscriptions table created with all fields
    - UsageRecords table created for metering
    - Zod schemas for all tables
  files_to_modify:
    - shared/schema.ts
  post_commands:
    - npm run db:push
```

### Pattern 2: Service Feature

**Typical Sequence:**

1. **Service Task** - Create service with core logic
2. **Integration Task** - Integrate with existing systems
3. **API Task** - Expose via API (if needed)
4. **UI Task** - Build interface (if needed)

**Example:**

```yaml
- id: P1-4-B
  name: Create Cost Calculation Service
  description: Implement service for calculating costs based on token usage
  acceptance_criteria:
    - Pricing defined for all supported models
    - Cost calculation accurate to cents
    - Unknown models return 0 cost with warning
  files_to_create:
    - server/services/costCalculator.ts
```

### Pattern 3: UI Feature

**Typical Sequence:**

1. **Component Task** - Create reusable components
2. **Page Task** - Build page using components
3. **Integration Task** - Connect to API
4. **Navigation Task** - Add routes and navigation

**Example:**

```yaml
- id: P0-G
  name: Create Pricing Page UI
  description: Build the public pricing page
  acceptance_criteria:
    - All tiers displayed with accurate pricing
    - Monthly/yearly toggle works
    - CTAs link to checkout or contact
    - Mobile responsive design
  files_to_create:
    - client/src/pages/Pricing.tsx
  files_to_modify:
    - client/src/App.tsx
```

---

## Task Naming Conventions

### Phase Prefixes

- **P0-** = Revenue/Monetization (highest priority)
- **P1-** = Core Features
- **P2-** = Quality Improvements
- **P3-** = Expansion/Experiments

### Task IDs

- Use sequential letters: P0-A, P0-B, P0-C, etc.
- Group by feature: P1-2-A through P1-2-I (all team features)
- Use sub-phases for large features: P1-4-A (cost tracking), P1-2-A (teams)

### Commit Messages

Follow conventional commits:

- `feat(scope): description` - New feature
- `fix(scope): description` - Bug fix
- `test(scope): description` - Test addition
- `docs(scope): description` - Documentation
- `refactor(scope): description` - Code refactoring

---

## Atomic Task Criteria

A task is "atomic" if it:

1. **Can be completed in one iteration** (typically 1-4 hours)
2. **Has clear acceptance criteria** (all testable)
3. **Has a single responsibility** (one thing, done well)
4. **Can be tested independently** (unit/integration tests)
5. **Has minimal dependencies** (or dependencies are clearly stated)

### Good Atomic Tasks ✅

- "Create Subscription Database Schema" - Single responsibility, clear criteria
- "Add Usage Tracking Middleware" - Focused feature, testable
- "Create Pricing Page UI" - Complete page, can be tested

### Bad Atomic Tasks ❌

- "Implement Billing System" - Too large, needs breakdown
- "Add Tests" - Too vague, no clear criteria
- "Fix Everything" - Not specific, no acceptance criteria

---

## Converting PRD to tasks.yaml

### Step 1: Read PRD

Read `docs/FEATURE_PRDS.md` or feature-specific PRD.

### Step 2: Extract Tasks

For each atomic task in the PRD:

1. Assign a task ID (e.g., P0-A)
2. Copy task name
3. Copy description
4. Convert acceptance criteria to YAML list
5. List files to create/modify
6. Add any pre/post commands
7. Generate commit message

### Step 3: Order Tasks

Ensure tasks are ordered by dependencies:

- Schema changes before storage
- Storage before API
- API before UI
- Core features before integrations

### Step 4: Add to tasks.yaml

Copy tasks into `.ralph/tasks.yaml` following the template structure.

### Step 5: Set current_task

Set `current_task: P0-A` (or first task ID) to start.

---

## Example: Full Feature Breakdown

### Feature: Subscription Management

**PRD Tasks:**

1. P0-A: Create Subscription Database Schema
2. P0-B: Define Tier Limits Configuration
3. P0-C: Add Subscription Storage Methods
4. P0-D: Create Usage Tracking Middleware
5. P0-E: Integrate Stripe for Payment Processing
6. P0-F: Create Billing API Routes
7. P0-G: Create Pricing Page UI
8. P0-H: Create Subscription Management UI
9. P0-I: Add Upgrade Prompts Throughout App

**Dependencies:**

- P0-A → P0-C (schema before storage)
- P0-C → P0-F (storage before API)
- P0-E → P0-F (Stripe before API routes)
- P0-F → P0-G, P0-H (API before UI)

---

## Checklist Before Starting Session

- [ ] PRD created/updated with atomic tasks
- [ ] All tasks have clear acceptance criteria
- [ ] Tasks ordered by dependencies
- [ ] tasks.yaml populated with all tasks
- [ ] current_task set to first task
- [ ] PR milestone interval configured
- [ ] All required files referenced correctly

---

## Resources

- **PRD Template:** See `docs/FEATURE_PRDS.md` for examples
- **Task Template:** See `.ralph/tasks.yaml` (after archival)
- **Workflow:** See `.ralph/README.md`
- **Agent Instructions:** See `.ralph/PROMPT_build.md`

---

## Tips

1. **Start Small** - Break large features into 5-10 atomic tasks
2. **Be Specific** - Vague tasks lead to confusion
3. **Test Early** - Include test requirements in each task
4. **Document Dependencies** - Make task order clear
5. **Review Before Starting** - Ensure all tasks are atomic and clear

---

**Remember:** Good PRDs with atomic tasks = Successful Ralph sessions! 🚀
