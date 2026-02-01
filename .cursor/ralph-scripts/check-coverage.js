#!/usr/bin/env node
/**
 * Check test coverage for recently modified files
 * Used by Ralph Wiggum workflow to ensure new code has adequate test coverage
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const COVERAGE_THRESHOLD = 80; // 80% coverage required for new code
const COVERAGE_FILE = 'coverage/coverage-summary.json';

function getCoverageSummary() {
  if (!existsSync(COVERAGE_FILE)) {
    console.error('❌ Coverage file not found. Run "npm run test:coverage" first.');
    process.exit(1);
  }

  try {
    const data = readFileSync(COVERAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to read coverage file:', error.message);
    process.exit(1);
  }
}

function getModifiedFiles() {
  try {
    // Get files modified in last commit
    const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
    return output
      .split('\n')
      .filter(line => line.trim())
      .filter(file => 
        file.endsWith('.ts') || 
        file.endsWith('.tsx') || 
        file.endsWith('.js') || 
        file.endsWith('.jsx')
      )
      .filter(file => !file.includes('.test.') && !file.includes('__tests__'));
  } catch (error) {
    console.warn('⚠️  Could not get modified files from git:', error.message);
    return [];
  }
}

function checkFileCoverage(coverage, filePath) {
  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Try to find the file in coverage data
  const fileCoverage = coverage[normalizedPath] || coverage[`./${normalizedPath}`];
  
  if (!fileCoverage) {
    return { found: false, coverage: null };
  }

  return {
    found: true,
    coverage: {
      lines: fileCoverage.lines?.pct ?? 0,
      functions: fileCoverage.functions?.pct ?? 0,
      branches: fileCoverage.branches?.pct ?? 0,
      statements: fileCoverage.statements?.pct ?? 0,
    },
  };
}

function main() {
  console.log('📊 Checking test coverage for modified files...\n');

  const coverage = getCoverageSummary();
  const modifiedFiles = getModifiedFiles();

  if (modifiedFiles.length === 0) {
    console.log('✅ No source files modified in last commit.');
    process.exit(0);
  }

  const results = [];
  let hasLowCoverage = false;

  for (const file of modifiedFiles) {
    const result = checkFileCoverage(coverage, file);
    
    if (!result.found) {
      console.log(`⚠️  ${file} - No coverage data found (may be new file or not tested)`);
      results.push({ file, status: 'no-data' });
      continue;
    }

    const { lines, functions, statements } = result.coverage;
    const minCoverage = Math.min(lines, functions, statements);
    
    if (minCoverage < COVERAGE_THRESHOLD) {
      console.log(`❌ ${file}`);
      console.log(`   Lines: ${lines.toFixed(1)}% | Functions: ${functions.toFixed(1)}% | Statements: ${statements.toFixed(1)}%`);
      console.log(`   ⚠️  Below ${COVERAGE_THRESHOLD}% threshold`);
      hasLowCoverage = true;
      results.push({ file, status: 'low', coverage: result.coverage });
    } else {
      console.log(`✅ ${file} - ${minCoverage.toFixed(1)}% coverage`);
      results.push({ file, status: 'ok', coverage: result.coverage });
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (hasLowCoverage) {
    console.log(`\n⚠️  Some files have coverage below ${COVERAGE_THRESHOLD}% threshold.`);
    console.log('   Consider adding more tests or document why in progress.md\n');
    process.exit(1);
  } else {
    console.log(`\n✅ All modified files meet ${COVERAGE_THRESHOLD}% coverage threshold.\n`);
    process.exit(0);
  }
}

main();
