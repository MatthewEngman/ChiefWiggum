#!/usr/bin/env node
/**
 * Check if PR milestone has been reached
 * Used by Ralph Wiggum workflow to determine when to create a PR
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import yaml from 'js-yaml';

const TASKS_FILE = '.ralph/tasks.yaml';

function loadTasks() {
  if (!existsSync(TASKS_FILE)) {
    console.error('❌ Tasks file not found:', TASKS_FILE);
    process.exit(1);
  }

  try {
    const content = readFileSync(TASKS_FILE, 'utf8');
    return yaml.load(content);
  } catch (error) {
    console.error('❌ Failed to parse tasks file:', error.message);
    process.exit(1);
  }
}

function getCommitsSinceLastPR() {
  try {
    // Get number of commits since last PR branch (if exists)
    const tasks = loadTasks();
    const lastPRBranch = tasks.last_pr_branch;
    
    if (!lastPRBranch) {
      // No PR created yet, count all commits on current branch
      const output = execSync('git rev-list --count HEAD', { encoding: 'utf8' });
      return parseInt(output.trim(), 10);
    }

    // Count commits since last PR branch
    try {
      const output = execSync(`git rev-list --count ${lastPRBranch}..HEAD`, { encoding: 'utf8' });
      return parseInt(output.trim(), 10);
    } catch (error) {
      // Branch might not exist, count all commits
      const output = execSync('git rev-list --count HEAD', { encoding: 'utf8' });
      return parseInt(output.trim(), 10);
    }
  } catch (error) {
    console.warn('⚠️  Could not count commits:', error.message);
    return 0;
  }
}

function getCompletedTasksSinceLastPR(tasks) {
  const lastPRTask = tasks.last_pr_task_id || null;
  const allTasks = tasks.tasks || [];
  
  if (!lastPRTask) {
    // Count all completed tasks
    return allTasks.filter(t => t.status === 'completed').length;
  }

  // Find last PR task index
  const lastPRIndex = allTasks.findIndex(t => t.id === lastPRTask);
  if (lastPRIndex === -1) {
    return allTasks.filter(t => t.status === 'completed').length;
  }

  // Count completed tasks after last PR
  return allTasks
    .slice(lastPRIndex + 1)
    .filter(t => t.status === 'completed').length;
}

function checkPhaseBoundary(tasks) {
  const allTasks = tasks.tasks || [];
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  
  // Check if we completed a phase (all tasks in a phase are done)
  const phases = {
    'P0': allTasks.filter(t => t.id?.startsWith('P0-')),
    'P1': allTasks.filter(t => t.id?.startsWith('P1-')),
    'P2': allTasks.filter(t => t.id?.startsWith('P2-')),
    'P3': allTasks.filter(t => t.id?.startsWith('P3-')),
  };

  for (const [phase, phaseTasks] of Object.entries(phases)) {
    if (phaseTasks.length === 0) continue;
    
    const allPhaseCompleted = phaseTasks.every(t => 
      completedTasks.some(ct => ct.id === t.id)
    );
    
    if (allPhaseCompleted) {
      const lastPRPhase = tasks.last_pr_phase;
      if (lastPRPhase !== phase) {
        return { isBoundary: true, phase };
      }
    }
  }

  return { isBoundary: false, phase: null };
}

function main() {
  const tasks = loadTasks();
  const milestoneInterval = tasks.pr_milestone_interval || 5;
  const commitsSincePR = getCommitsSinceLastPR();
  const tasksSincePR = getCompletedTasksSinceLastPR(tasks);
  const phaseCheck = checkPhaseBoundary(tasks);

  console.log('🔍 Checking PR milestone status...\n');
  console.log(`   Milestone interval: ${milestoneInterval} tasks`);
  console.log(`   Commits since last PR: ${commitsSincePR}`);
  console.log(`   Completed tasks since last PR: ${tasksSincePR}`);
  
  if (phaseCheck.isBoundary) {
    console.log(`   ✅ Phase boundary reached: ${phaseCheck.phase} completed`);
  }

  const milestoneReached = 
    tasksSincePR >= milestoneInterval || 
    phaseCheck.isBoundary;

  if (milestoneReached) {
    console.log('\n✅ PR milestone reached!');
    console.log('   Run: node .cursor/ralph-scripts/create-pr.js\n');
    process.exit(0); // Exit 0 = milestone reached
  } else {
    console.log(`\n⏳ Milestone not reached (${tasksSincePR}/${milestoneInterval} tasks)`);
    console.log('   Continue with next task...\n');
    process.exit(1); // Exit 1 = not reached
  }
}

main();
