#!/usr/bin/env node
/* eslint-disable no-console */

const { execSync } = require('child_process');
const { readdirSync, unlinkSync } = require('fs');

console.log('Removing samples...');
readdirSync('samples/output').forEach((file) =>
  unlinkSync(`samples/output/${file}`),
);

console.log('Generating samples...');
console.log(execSync(`npm run generate-samples`, { encoding: 'utf-8' }));

const currentStatus = execSync('git status --porcelain');
if (!currentStatus.length) {
  console.log('No changes detected after generating samples.');
  process.exit(0);
}

console.log('Git changes detected after generating samples.');
console.log(currentStatus.toString());
process.exit(1);
