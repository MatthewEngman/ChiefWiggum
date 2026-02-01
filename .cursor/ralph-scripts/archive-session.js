#!/usr/bin/env node
/**
 * Archive Ralph Wiggum session artifacts after completion
 * Moves session files to archive directory with timestamp
 */

import { readFileSync, existsSync, mkdirSync, renameSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const RALPH_DIR = '.ralph';
const ARCHIVE_DIR = '.ralph/archive';
const TASKS_FILE = join(RALPH_DIR, 'tasks.yaml');

function getSessionInfo() {
  if (!existsSync(TASKS_FILE)) {
    console.error('❌ tasks.yaml not found');
    process.exit(1);
  }

  try {
    const content = readFileSync(TASKS_FILE, 'utf8');
    const tasks = content.match(/status:\s+completed/g) || [];
    const completedCount = tasks.length;
    
    // Get current branch name
    let branchName = 'unknown';
    try {
      branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      // Not in git repo or no branch
    }

    return {
      completedCount,
      branchName,
      timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
    };
  } catch (error) {
    console.error('❌ Failed to read tasks.yaml:', error.message);
    process.exit(1);
  }
}

function shouldArchive() {
  // Check if all tasks are completed
  const content = readFileSync(TASKS_FILE, 'utf8');
  const currentTask = content.match(/current_task:\s*(.+)/)?.[1]?.trim();
  
  if (currentTask && currentTask !== 'null') {
    return false; // Still has active task
  }

  // Check if all tasks are completed
  const tasks = content.match(/status:\s+(completed|pending|skipped)/g) || [];
  const completed = tasks.filter(s => s.includes('completed')).length;
  const total = tasks.length;

  return completed === total;
}

function archiveFiles(sessionInfo) {
  const archiveName = `session-${sessionInfo.timestamp}`;
  const sessionArchiveDir = join(ARCHIVE_DIR, archiveName);

  // Create archive directory
  if (!existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
  mkdirSync(sessionArchiveDir, { recursive: true });

  // Files to archive (tasks.yaml will be archived and reset, guardrails.md stays)
  const filesToArchive = [
    'tasks.yaml',  // Archive completed tasks.yaml
    'progress.md',
    'COMPLETION_SUMMARY.md',
    'DOCUMENTATION_UPDATE_SUMMARY.md',
    'WEBSITE_DOCS_UPDATE_SUMMARY.md',
    'NEXT_STEPS_COMPLETED.md',
    'errors.log',
    'activity.log',
  ];

  // Keep analysis documents in .ralph/ for reference (don't archive)
  // These are useful for planning next steps:
  // - TESTING_GAPS_ANALYSIS.md
  // - BRANCH_STRATEGY.md
  // - ARCHIVAL_WORKFLOW.md
  // - README.md
  
  // Optional: Archive session-specific docs if they exist
  const optionalFiles = [
    'RALPH_IMPROVEMENTS.md',
    'SETUP_COMPLETE.md',
  ];

  console.log(`📦 Archiving session to ${sessionArchiveDir}...\n`);

  let archivedCount = 0;
  for (const file of filesToArchive) {
    const sourcePath = join(RALPH_DIR, file);
    if (existsSync(sourcePath)) {
      const destPath = join(sessionArchiveDir, file);
      renameSync(sourcePath, destPath);
      console.log(`  ✅ Archived: ${file}`);
      archivedCount++;
    }
  }

  // Archive optional files if they exist
  for (const file of optionalFiles) {
    const sourcePath = join(RALPH_DIR, file);
    if (existsSync(sourcePath)) {
      const destPath = join(sessionArchiveDir, file);
      renameSync(sourcePath, destPath);
      console.log(`  ✅ Archived: ${file}`);
      archivedCount++;
    }
  }

  // Create session summary
  const summary = {
    sessionId: archiveName,
    branch: sessionInfo.branchName,
    completedTasks: sessionInfo.completedCount,
    archivedAt: new Date().toISOString(),
    archivedFiles: archivedCount,
  };

  writeFileSync(
    join(sessionArchiveDir, 'SESSION_SUMMARY.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log(`\n✅ Archived ${archivedCount} files`);
  console.log(`📁 Archive location: ${sessionArchiveDir}\n`);

  return sessionArchiveDir;
}

function createCleanStructure() {
  console.log('🧹 Creating clean structure for next session...\n');

  // Create fresh tasks.yaml template
  const freshTasksYaml = `# Ralph Wiggum Task Queue
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
  #     - npm install package-name
  #   post_commands:
  #     - npm run db:push
  #   env_vars_required:
  #     - ENV_VAR_NAME
  #   commit_message: 'feat(scope): task description'

# Summary Statistics (auto-updated)
summary:
  total_tasks: 0
`;

  writeFileSync(join(RALPH_DIR, 'tasks.yaml'), freshTasksYaml);
  console.log('  ✅ Created fresh tasks.yaml template');

  // Create fresh progress.md
  const freshProgress = `# Progress Log

## Task Queue Status

- **Total Tasks:** 0
- **Completed:** 0
- **Remaining:** 0
- **Current Task:** null

## Completed Tasks

<!-- Tasks will be logged here as they are completed -->

## Session History

### Session Started: ${new Date().toISOString()}

- Starting new Ralph Wiggum session
`;

  writeFileSync(join(RALPH_DIR, 'progress.md'), freshProgress);
  console.log('  ✅ Created fresh progress.md');

  // Create fresh errors.log
  writeFileSync(join(RALPH_DIR, 'errors.log'), '');
  console.log('  ✅ Created fresh errors.log');

  // Create fresh activity.log
  writeFileSync(join(RALPH_DIR, 'activity.log'), '');
  console.log('  ✅ Created fresh activity.log');

  console.log('\n✅ Clean structure ready for next session');
  console.log('📝 Next step: Update tasks.yaml with new tasks from PRD\n');
}

function main() {
  console.log('🗄️  Ralph Wiggum Session Archival\n');
  console.log('='.repeat(60) + '\n');

  // Check if session is complete
  if (!shouldArchive()) {
    console.log('⚠️  Session not complete. Cannot archive.');
    console.log('   Complete all tasks before archiving.\n');
    process.exit(1);
  }

  // Get session info
  const sessionInfo = getSessionInfo();
  console.log(`Session Info:`);
  console.log(`  Branch: ${sessionInfo.branchName}`);
  console.log(`  Completed Tasks: ${sessionInfo.completedCount}`);
  console.log(`  Timestamp: ${sessionInfo.timestamp}\n`);

  // Confirm archiving
  console.log('This will:');
  console.log('  1. Archive session artifacts (including tasks.yaml) to .ralph/archive/');
  console.log('  2. Create fresh tasks.yaml template for next session');
  console.log('  3. Create clean structure for next session');
  console.log('  4. Keep guardrails.md in place (updated over time)\n');

  // Archive files
  const archiveDir = archiveFiles(sessionInfo);

  // Create clean structure
  createCleanStructure();

  console.log('='.repeat(60));
  console.log('✅ Session archived successfully!');
  console.log(`📁 Archive: ${archiveDir}`);
  console.log('🚀 Ready for next Ralph Wiggum session\n');
}

main();
