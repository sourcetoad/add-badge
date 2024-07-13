#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readdirSync, unlinkSync } from 'node:fs';

console.info('Removing samples...');
readdirSync('samples/output').forEach((file) =>
  unlinkSync(`samples/output/${file}`),
);

console.info('Generating samples...');
console.info(execSync(`npm run generate-samples`, { encoding: 'utf-8' }));

const currentStatus = execSync('git status --porcelain');
if (!currentStatus.length) {
  console.info('No changes detected after generating samples.');
  process.exit(0);
}

console.error('Git changes detected after generating samples.');
console.info(currentStatus.toString());
process.exit(1);
