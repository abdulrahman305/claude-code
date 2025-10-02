/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');

function compareTestResults(expectedFilePath, actualFilePath) {
  const expected = JSON.parse(fs.readFileSync(expectedFilePath, 'utf8'));
  const actual = JSON.parse(fs.readFileSync(actualFilePath, 'utf8'));

  // Basic comparison for now, can be extended for more detailed diffing
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log('Test results match.');
    return true;
  } else {
    console.error('Test results do NOT match.');
    console.error('Expected:', expected);
    console.error('Actual:', actual);
    return false;
  }
}

// Example usage:
// const expected = path.join(__dirname, 'expected-results.json');
// const actual = path.join(__dirname, 'actual-results.json');
// compareTestResults(expected, actual);


import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

function runCommand(command, options = {}) {
  console.log(`Executing: ${command}`);
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      ...options,
    });
    return { success: true, output: output.trim(), error: null };
  } catch (error) {
    return {
      success: false,
      output: error.stdout?.trim(),
      error: error.stderr?.trim() || error.message,
    };
  }
}

function getGitCurrentBranch() {
  const { output, success } = runCommand('git rev-parse --abbrev-ref HEAD');
  if (!success) {
    throw new Error(`Failed to get current branch: ${output}`);
  }
  return output;
}

function gitCheckout(target) {
  const { success, error } = runCommand(`git checkout ${target}`);
  if (!success) {
    throw new Error(`Failed to checkout ${target}: ${error}`);
  }
}

function cleanWorkingDirectory() {
  console.log(
    'Cleaning working directory (git reset --hard HEAD && git clean -fdx)...',
  );
  const { success, error } = runCommand(
    'git reset --hard HEAD && git clean -fdx',
  );
  if (!success) {
    throw new Error(`Failed to clean working directory: ${error}`);
  }
}

function runTests(workspace) {
  console.log(`Running tests for ${workspace}...`);
  const startTime = process.hrtime.bigint();
  const { success, output, error } = runCommand(
    `npm test --workspace ${workspace}`,
  );
  const endTime = process.hrtime.bigint();
  const durationMs = Number(endTime - startTime) / 1_000_000; // Convert nanoseconds to milliseconds
  return { success, output, error, durationMs };
}

async function compareTestResults(
  targets,
  testWorkspace = '@google/gemini-cli-core',
) {
  const originalBranch = getGitCurrentBranch();
  console.log(`Original branch: ${originalBranch}`);

  const results = [];

  for (const target of targets) {
    console.log(`
--- Processing ${target} ---`);
    try {
      gitCheckout(target);
      cleanWorkingDirectory();
      const testResult = runTests(testWorkspace);
      results.push({ target, testResult });
    } catch (e) {
      console.error(`Error processing ${target}: ${e.message}`);
      results.push({
        target,
        testResult: {
          success: false,
          output: null,
          error: e.message,
          durationMs: 0,
        },
      });
    }
  }

  console.log(`
--- Returning to original branch ---`);
  gitCheckout(originalBranch);

  console.log(`
--- Test Comparison Summary ---`);
  for (const result of results) {
    const status = result.testResult.success ? 'PASSED' : 'FAILED';
    console.log(`
Target: ${result.target}`);
    console.log(`Status: ${status}`);
    console.log(`Duration: ${result.testResult.durationMs.toFixed(2)} ms`);
    if (!result.testResult.success) {
      console.log(`Error: ${result.testResult.error}`);
      console.log(`Output:
${result.testResult.output}`);
    } else {
      console.log(`Output:
${result.testResult.output}`);
    }
  }
}

// Example Usage:
// node scripts/compare-test-results.js main feature-branch commit-sha
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    'Usage: node scripts/compare-test-results.js <branch/commit1> [branch/commit2 ...]',
  );
  process.exit(1);
}

compareTestResults(args);
