#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');

const sampleImages = [
  {
    input: 'samples/input/ic_launcher-mdpi.png',
    output: 'samples/output/ic_launcher-mdpi.png',
  },
  {
    input: 'samples/input/ic_launcher-xxxhdpi.png',
    output: 'samples/output/ic_launcher-xxxhdpi.png',
  },
  {
    input: 'samples/input/ic_launcher_round-mdpi.png',
    output: 'samples/output/ic_launcher_round-mdpi.png',
  },
  {
    input: 'samples/input/ic_launcher_round-xxxhdpi.png',
    output: 'samples/output/ic_launcher_round-xxxhdpi.png',
  },
  {
    input: 'samples/input/icon-87.png',
    output: 'samples/output/icon-87.png',
  },
  {
    input: 'samples/input/icon-1024.png',
    output: 'samples/output/icon-1024.png',
  },

  // Gravity
  {
    input: 'samples/input/ic_launcher-xxxhdpi.png',
    output: 'samples/output/ic_launcher-xxxhdpi-ne.png',
    optionOverrides: ['--gravity=northeast'],
  },
  {
    input: 'samples/input/ic_launcher_round-xxxhdpi.png',
    output: 'samples/output/ic_launcher_round-xxxhdpi-ne.png',
    optionOverrides: ['--gravity=northeast'],
  },
  {
    input: 'samples/input/ic_launcher-xxxhdpi.png',
    output: 'samples/output/ic_launcher-xxxhdpi-nw.png',
    optionOverrides: ['--gravity=northwest'],
  },
  {
    input: 'samples/input/ic_launcher_round-xxxhdpi.png',
    output: 'samples/output/ic_launcher_round-xxxhdpi-nw.png',
    optionOverrides: ['--gravity=northwest'],
  },
  {
    input: 'samples/input/ic_launcher-xxxhdpi.png',
    output: 'samples/output/ic_launcher-xxxhdpi-sw.png',
    optionOverrides: ['--gravity=southwest'],
  },
  {
    input: 'samples/input/ic_launcher_round-xxxhdpi.png',
    output: 'samples/output/ic_launcher_round-xxxhdpi-sw.png',
    optionOverrides: ['--gravity=southwest'],
  },
];

const [sampleText = 'ALPHA'] = process.argv.slice(2);

sampleImages.forEach(({ input, output, optionOverrides = [] }) => {
  const opts = optionOverrides.map((value) => `"${value}"`).join(' ');
  const command = `node bin/add-badge.js "${input}" "${sampleText}" "${output}" ${opts}`;

  console.log(`Running '${command.trim()}'`);
  const result = execSync(command, { encoding: 'utf-8' });
  console.log(result);
});
