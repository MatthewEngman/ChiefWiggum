#!/usr/bin/env node
/**
 * Initialize Ralph Wiggum for a project
 * Detects project type and generates project-specific guardrails
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const RALPH_DIR = '.ralph';
const SCRIPTS_DIR = '.cursor/ralph-scripts';

// Project detection
function detectProjectType() {
  const project = {
    language: null,
    framework: null,
    packageManager: null,
    testing: {
      unit: null,
      e2e: null,
      coverage: null,
    },
    database: null,
    buildTool: null,
    linter: null,
    formatter: null,
  };

  // Detect language and framework
  if (existsSync('package.json')) {
    project.packageManager = detectPackageManager();
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // Detect language
    if (existsSync('tsconfig.json') || existsSync('jsconfig.json')) {
      project.language = 'TypeScript';
    } else {
      project.language = 'JavaScript';
    }

    // Detect framework
    if (pkg.dependencies?.['next'] || pkg.devDependencies?.['next']) {
      project.framework = 'Next.js';
    } else if (pkg.dependencies?.['react'] || pkg.devDependencies?.['react']) {
      project.framework = 'React';
    } else if (pkg.dependencies?.['express'] || pkg.devDependencies?.['express']) {
      project.framework = 'Express';
    } else if (pkg.dependencies?.['vue'] || pkg.devDependencies?.['vue']) {
      project.framework = 'Vue';
    } else if (pkg.dependencies?.['angular'] || pkg.devDependencies?.['angular']) {
      project.framework = 'Angular';
    }

    // Detect testing
    if (pkg.devDependencies?.['vitest'] || pkg.dependencies?.['vitest']) {
      project.testing.unit = 'Vitest';
    } else if (pkg.devDependencies?.['jest'] || pkg.dependencies?.['jest']) {
      project.testing.unit = 'Jest';
    } else if (pkg.devDependencies?.['mocha'] || pkg.dependencies?.['mocha']) {
      project.testing.unit = 'Mocha';
    }

    if (pkg.devDependencies?.['@playwright/test'] || pkg.dependencies?.['@playwright/test']) {
      project.testing.e2e = 'Playwright';
    } else if (pkg.devDependencies?.['cypress'] || pkg.dependencies?.['cypress']) {
      project.testing.e2e = 'Cypress';
    }

    if (pkg.devDependencies?.['@vitest/coverage-v8'] || pkg.devDependencies?.['c8']) {
      project.testing.coverage = 'Vitest Coverage';
    } else if (pkg.devDependencies?.['nyc']) {
      project.testing.coverage = 'NYC';
    }

    // Detect database
    if (pkg.dependencies?.['drizzle-orm'] || pkg.devDependencies?.['drizzle-orm']) {
      project.database = 'Drizzle ORM';
    } else if (pkg.dependencies?.['prisma'] || pkg.devDependencies?.['prisma']) {
      project.database = 'Prisma';
    } else if (pkg.dependencies?.['typeorm'] || pkg.devDependencies?.['typeorm']) {
      project.database = 'TypeORM';
    } else if (pkg.dependencies?.['sequelize'] || pkg.devDependencies?.['sequelize']) {
      project.database = 'Sequelize';
    } else if (pkg.dependencies?.['mongoose'] || pkg.devDependencies?.['mongoose']) {
      project.database = 'Mongoose';
    } else if (pkg.dependencies?.['pg'] || pkg.dependencies?.['mysql2']) {
      project.database = 'Raw SQL';
    }

    // Detect linter
    if (pkg.devDependencies?.['eslint'] || pkg.dependencies?.['eslint']) {
      project.linter = 'ESLint';
    }

    // Detect formatter
    if (pkg.devDependencies?.['prettier'] || pkg.dependencies?.['prettier']) {
      project.formatter = 'Prettier';
    }

    // Detect build tool
    if (pkg.devDependencies?.['vite'] || pkg.dependencies?.['vite']) {
      project.buildTool = 'Vite';
    } else if (pkg.devDependencies?.['webpack'] || pkg.dependencies?.['webpack']) {
      project.buildTool = 'Webpack';
    } else if (pkg.scripts?.build) {
      project.buildTool = 'Custom Build';
    }
  } else if (existsSync('requirements.txt') || existsSync('pyproject.toml')) {
    project.language = 'Python';
    if (existsSync('pyproject.toml')) {
      const pyproject = readFileSync('pyproject.toml', 'utf8');
      if (pyproject.includes('django')) {
        project.framework = 'Django';
      } else if (pyproject.includes('flask')) {
        project.framework = 'Flask';
      } else if (pyproject.includes('fastapi')) {
        project.framework = 'FastAPI';
      }
    }
    if (existsSync('pytest.ini') || existsSync('setup.cfg')) {
      project.testing.unit = 'pytest';
    }
    project.packageManager = 'pip';
  } else if (existsSync('go.mod')) {
    project.language = 'Go';
    project.packageManager = 'go';
    project.testing.unit = 'go test';
  } else if (existsSync('Cargo.toml')) {
    project.language = 'Rust';
    project.packageManager = 'cargo';
    project.testing.unit = 'cargo test';
  } else if (existsSync('pom.xml') || existsSync('build.gradle')) {
    project.language = 'Java';
    if (existsSync('pom.xml')) {
      project.packageManager = 'Maven';
    } else {
      project.packageManager = 'Gradle';
    }
    project.testing.unit = 'JUnit';
  }

  return project;
}

function detectPackageManager() {
  if (existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (existsSync('yarn.lock')) return 'yarn';
  if (existsSync('package-lock.json')) return 'npm';
  return 'npm'; // default
}

function generateGuardrails(project) {
  const pm = project.packageManager || 'npm';
  const pmCmd = pm === 'yarn' ? 'yarn' : pm === 'pnpm' ? 'pnpm' : 'npm';

  let guardrails = `# Guardrails & Lessons Learned

## Rules

1. ONE task per iteration - pick the most important incomplete item
2. **Write tests for every task** - New code must have appropriate tests (unit/integration/component)
3. **Check test coverage** - New code should have 80%+ coverage, document gaps if below
4. Run tests before committing - never commit broken code
5. If tests fail 3 times in a row, document the issue and move on
6. Always update progress.md after completing work (include test coverage info)
7. Commit with descriptive messages: "feat:", "fix:", "refactor:", "test:"
8. **Create PRs at milestones** - Every 5-10 tasks or at phase boundaries to avoid huge commits

## Critical CLI Commands

`;

  // Quality Gates
  guardrails += `### Quality Gates (Run Before Every Commit)

\`\`\`bash
`;

  if (project.language === 'TypeScript') {
    guardrails += `${pmCmd} run type-check    # TypeScript compilation\n`;
  }

  if (project.linter) {
    if (project.linter === 'ESLint') {
      guardrails += `${pmCmd} run lint          # ESLint checks\n`;
    }
  }

  if (project.testing.unit) {
    if (project.testing.unit === 'Vitest' || project.testing.unit === 'Jest') {
      guardrails += `${pmCmd} run test:unit     # Unit tests\n`;
    } else if (project.testing.unit === 'pytest') {
      guardrails += `pytest tests/            # Python unit tests\n`;
    } else if (project.testing.unit === 'go test') {
      guardrails += `go test ./...            # Go unit tests\n`;
    } else if (project.testing.unit === 'cargo test') {
      guardrails += `cargo test               # Rust unit tests\n`;
    }
  }

  if (project.buildTool) {
    guardrails += `${pmCmd} run build         # Production build\n`;
  }

  guardrails += `\`\`\`

**Test Coverage Requirements:**
- New code must have 80%+ coverage (lines, functions, statements)
- Run coverage check after tests to verify
- Document any coverage gaps in progress.md if below threshold
`;

  // Database Migrations
  if (project.database) {
    guardrails += `\n### Database Migrations\n\n`;
    if (project.database === 'Drizzle ORM') {
      guardrails += `After ANY changes to schema:\n\n\`\`\`bash\n${pmCmd} run db:push          # Push schema changes to database (dev)\n${pmCmd} run migrate:prod     # Production (uses --force flag)\n\`\`\`\n\n**Note:** This project uses Drizzle's "push" mode - no migration files needed.\n`;
    } else if (project.database === 'Prisma') {
      guardrails += `After ANY changes to schema:\n\n\`\`\`bash\n${pmCmd} run prisma migrate dev    # Create and apply migration\n${pmCmd} run prisma migrate deploy  # Production\n\`\`\`\n`;
    } else if (project.database === 'TypeORM') {
      guardrails += `After ANY changes to schema:\n\n\`\`\`bash\n${pmCmd} run typeorm migration:generate\n${pmCmd} run typeorm migration:run\n\`\`\`\n`;
    }
  }

  // Installing Dependencies
  guardrails += `\n### Installing New Dependencies\n\n`;
  if (pm === 'npm' || pm === 'yarn' || pm === 'pnpm') {
    guardrails += `When a task requires new packages:\n\n\`\`\`bash\n${pmCmd} add <package-name>           # Production dependency\n${pmCmd} add -D <package-name>        # Dev dependency\n\`\`\`\n`;
  } else if (pm === 'pip') {
    guardrails += `When a task requires new packages:\n\n\`\`\`bash\npip install <package-name>           # Production dependency\npip install -D <package-name>        # Dev dependency\n\`\`\`\n`;
  } else if (pm === 'go') {
    guardrails += `When a task requires new packages:\n\n\`\`\`bash\ngo get <package-name>\n\`\`\`\n`;
  } else if (pm === 'cargo') {
    guardrails += `When a task requires new packages:\n\n\`\`\`bash\ncargo add <package-name>\n\`\`\`\n`;
  }

  // Project-Specific Patterns
  guardrails += `\n## Learned Patterns\n\n<!-- Agent will add patterns it discovers here -->\n\n## Known Issues\n\n<!-- Document recurring problems here -->\n\n## File Patterns to Follow\n\n`;

  if (project.framework === 'Next.js') {
    guardrails += `### Next.js Patterns\n\n- Use Server Components by default\n- Minimize 'use client' directives\n- Use App Router conventions\n- API routes in \`app/api/\` or \`pages/api/\`\n\n`;
  } else if (project.framework === 'React') {
    guardrails += `### React Patterns\n\n- Use functional components\n- Follow hooks rules\n- Use React Query for data fetching\n- Component tests in \`**/*.test.tsx\`\n\n`;
  } else if (project.framework === 'Express') {
    guardrails += `### Express Patterns\n\n- Use asyncHandler for async routes\n- Middleware for authentication\n- Error handling middleware\n- Route tests in \`**/*.test.ts\`\n\n`;
  }

  if (project.database) {
    guardrails += `### Database Patterns\n\n- Use ORM/query builder for all queries\n- Validate inputs with Zod or similar\n- Use transactions for multi-step operations\n- Add indexes for common queries\n\n`;
  }

  return guardrails;
}

function generateTasksYamlTemplate(project) {
  return `# Ralph Wiggum Task Queue
# Tasks are processed in order. Agent marks tasks complete and moves to next.
# Priority: P0 (Revenue) → P1 (Core Features) → P2 (Quality) → P3 (Expansion)

# IMPORTANT: Before starting a new session:
# 1. Create or update docs/FEATURE_PRDS.md with atomic-level tasks
# 2. Copy tasks from PRD into this file following the structure below
# 3. Set current_task to the first task ID
# 4. See .ralph/README.md for PRD guidance

current_task: null

# PR Workflow Configuration
pr_milestone_interval: 5  # Create PR every N tasks (or at phase boundaries)

# PR Tracking (updated by create-pr.js)
last_pr_branch: null
last_pr_task_id: null
last_pr_phase: null
last_pr_number: null
last_pr_date: null

tasks:
  # ============================================================================
  # PHASE 0: [FEATURE NAME] (TOP PRIORITY)
  # ============================================================================

  # Example task structure:
  # - id: P0-A
  #   name: Task Name
  #   status: pending  # pending | completed | skipped
  #   description: What to implement
  #   acceptance_criteria:
  #     - Criterion 1
  #     - Criterion 2
  #   files_to_modify:
  #     - path/to/file.ts
  #   files_to_create:
  #     - path/to/new-file.ts
  #   pre_commands:
  #     - ${project.packageManager === 'npm' ? 'npm install' : project.packageManager === 'yarn' ? 'yarn add' : project.packageManager === 'pnpm' ? 'pnpm add' : 'install'} package-name
  #   post_commands:
  #     - ${project.database === 'Drizzle ORM' ? 'npm run db:push' : project.database === 'Prisma' ? 'npm run prisma migrate dev' : '# Add migration command'}
  #   env_vars_required:
  #     - ENV_VAR_NAME
  #   commit_message: 'feat(scope): task description'

# Summary Statistics (auto-updated)
summary:
  total_tasks: 0
`;
}

function updatePromptBuild(project) {
  const promptPath = join(RALPH_DIR, 'PROMPT_build.md');
  if (!existsSync(promptPath)) {
    console.warn('⚠️  PROMPT_build.md not found, skipping update');
    return;
  }

  let content = readFileSync(promptPath, 'utf8');
  const pm = project.packageManager || 'npm';
  const pmCmd = pm === 'yarn' ? 'yarn' : pm === 'pnpm' ? 'pnpm' : 'npm';

  // Update quality gates section
  const qualityGatesPattern = /### 6\. Run Quality Gates[\s\S]*?```/;
  let qualityGates = `### 6. Run Quality Gates

\`\`\`bash
`;

  if (project.language === 'TypeScript') {
    qualityGates += `${pmCmd} run type-check        # TypeScript must pass\n`;
  }

  if (project.linter === 'ESLint') {
    qualityGates += `${pmCmd} run lint              # No errors\n`;
  }

  if (project.testing.unit) {
    if (project.testing.unit === 'Vitest' || project.testing.unit === 'Jest') {
      qualityGates += `${pmCmd} run test:unit         # Tests must pass\n`;
      qualityGates += `${pmCmd} run test:coverage     # Check coverage (new/modified files)\n`;
    } else if (project.testing.unit === 'pytest') {
      qualityGates += `pytest tests/                # Tests must pass\n`;
      qualityGates += `pytest --cov                 # Check coverage\n`;
    } else if (project.testing.unit === 'go test') {
      qualityGates += `go test ./...                 # Tests must pass\n`;
      qualityGates += `go test -cover ./...         # Check coverage\n`;
    } else if (project.testing.unit === 'cargo test') {
      qualityGates += `cargo test                    # Tests must pass\n`;
      qualityGates += `cargo tarpaulin               # Check coverage\n`;
    }
  }

  if (project.buildTool) {
    qualityGates += `${pmCmd} run build             # Must succeed\n`;
  }

  qualityGates += `\`\`\``;

  content = content.replace(qualityGatesPattern, qualityGates + '\n```');

  writeFileSync(promptPath, content, 'utf8');
}

function main() {
  console.log('🔍 Initializing Ralph Wiggum for this project...\n');
  console.log('='.repeat(60) + '\n');

  // Ensure directories exist
  if (!existsSync(RALPH_DIR)) {
    mkdirSync(RALPH_DIR, { recursive: true });
  }

  // Detect project
  console.log('📊 Detecting project type...\n');
  const project = detectProjectType();

  console.log('Detected:');
  console.log(`  - Language: ${project.language || 'Unknown'}`);
  console.log(`  - Framework: ${project.framework || 'None'}`);
  console.log(`  - Package Manager: ${project.packageManager || 'Unknown'}`);
  console.log(`  - Testing: ${project.testing.unit || 'Unknown'} (unit), ${project.testing.e2e || 'None'} (e2e)`);
  console.log(`  - Database: ${project.database || 'None'}`);
  console.log(`  - Build Tool: ${project.buildTool || 'None'}`);
  console.log(`  - Linter: ${project.linter || 'None'}`);
  console.log(`  - Formatter: ${project.formatter || 'None'}\n`);

  // Generate guardrails
  console.log('📝 Generating project-specific guardrails...\n');
  const guardrails = generateGuardrails(project);
  writeFileSync(join(RALPH_DIR, 'guardrails.md'), guardrails, 'utf8');
  console.log('  ✅ Created .ralph/guardrails.md');

  // Generate tasks.yaml template
  if (!existsSync(join(RALPH_DIR, 'tasks.yaml'))) {
    const tasksTemplate = generateTasksYamlTemplate(project);
    writeFileSync(join(RALPH_DIR, 'tasks.yaml'), tasksTemplate, 'utf8');
    console.log('  ✅ Created .ralph/tasks.yaml template');
  } else {
    console.log('  ⚠️  tasks.yaml already exists, skipping template creation');
  }

  // Update PROMPT_build.md
  updatePromptBuild(project);
  console.log('  ✅ Updated .ralph/PROMPT_build.md with project-specific commands');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Ralph initialization complete!\n');
  console.log('📝 Next steps:');
  console.log('  1. Review .ralph/guardrails.md');
  console.log('  2. Create PRD with atomic tasks (see .ralph/PRD_GUIDANCE.md)');
  console.log('  3. Populate .ralph/tasks.yaml with tasks from PRD');
  console.log('  4. Start Ralph loop: ./.cursor/ralph-scripts/ralph-loop.sh\n');
}

main();
