#!/usr/bin/env node

const { execSync } = require('child_process');

console.log(execSync(`npm run generate-samples`, { encoding: 'utf-8' }));

const currentStatus = execSync('git status --porcelain');
if (!currentStatus.length) {
  process.exit(0);
}

console.log('Git changes detected after generating samples.');
console.log(currentStatus.toString());
process.exit(1);
