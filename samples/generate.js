#!/usr/bin/env node

const { execSync } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { resolve, join } = require('path');

const inputPath = resolve(__dirname, 'input');
const outputPath = resolve(__dirname, 'output');

readdirSync(inputPath)
  .filter((file) => lstatSync(join(inputPath, file)).isFile())
  .forEach((file) => {
    const input = join(inputPath, file);
    const output = join(outputPath, file);
    console.log(
      execSync(`node bin/add-badge.js "${input}" "${output}" "ALPHA"`, {
        encoding: 'utf-8',
      }).trimEnd()
    );
  });
