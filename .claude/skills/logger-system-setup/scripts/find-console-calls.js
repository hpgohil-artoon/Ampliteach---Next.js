#!/usr/bin/env node

/**
 * Helper script to find console.log, console.warn, console.error calls
 * that should be replaced with the logger system.
 *
 * Usage: node find-console-calls.js [path]
 * Example: node find-console-calls.js src/
 */

const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2] || 'src';
const results = [];

function searchDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    // Skip node_modules, .git, dist, build
    if (['node_modules', '.git', 'dist', 'build', '.next'].includes(file.name)) {
      continue;
    }

    if (file.isDirectory()) {
      searchDirectory(fullPath);
    } else if (file.isFile() && /\.(ts|tsx|js|jsx)$/.test(file.name)) {
      searchFile(fullPath);
    }
  }
}

function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/(console\.(log|warn|error))\s*\(/);
      if (match) {
        results.push({
          file: filePath,
          line: index + 1,
          method: match[1],
          code: line.trim(),
        });
      }
    });
  } catch (err) {
    // Skip files that can't be read
  }
}

console.log(`\n🔍 Searching for console calls in ${targetPath}...\n`);

searchDirectory(targetPath);

if (results.length === 0) {
  console.log('✅ No console calls found. Your code is clean!\n');
} else {
  console.log(`Found ${results.length} console call(s) to replace:\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.file}:${result.line}`);
    console.log(`   ${result.method} — ${result.code}`);
    console.log();
  });

  console.log('\n💡 Next steps:');
  console.log('1. Import logger: import { logger } from "@/core/logging"');
  console.log('2. Replace console.log() → logger.info() or logger.success()');
  console.log('3. Replace console.warn() → logger.warn()');
  console.log('4. Replace console.error() → logger.error()');
  console.log('5. Add a namespace (module/class name) as the first argument\n');
}
