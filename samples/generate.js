#!/usr/bin/env node

const { execSync } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { resolve, join } = require('path');

const inputPath = resolve(__dirname, 'input');
const outputPath = resolve(__dirname, 'output');

function createBadge(inputFile, outputFile, badgeText, badgeOptions) {
  const input = join(inputPath, inputFile);
  const output = join(outputPath, outputFile);
  console.log(
    execSync(
      `node bin/add-badge.js "${input}" "${output}" "${badgeText}" ${badgeOptions}`,
      {
        encoding: 'utf-8',
      },
    ).trimEnd(),
  );
}

readdirSync(inputPath)
  .filter((file) => lstatSync(join(inputPath, file)).isFile())
  .forEach((file) => createBadge(file, file, 'ALPHA'));

for (const gravity of [
  'northwest',
  'north',
  'northeast',
  'southwest',
  'south',
  'southeast',
]) {
  createBadge(
    'ic_launcher-xxxhdpi.png',
    `ic_launcher-xxxhdpi-${gravity}.png`,
    'ALPHA',
    `--gravity ${gravity}`,
  );
  createBadge(
    'ic_launcher_round-xxxhdpi.png',
    `ic_launcher_round-xxxhdpi-${gravity}.png`,
    'ALPHA',
    `--gravity ${gravity}`,
  );
}

createBadge(
  'ic_launcher-xxxhdpi.png',
  'ic_launcher-xxxhdpi-dark-transparent.png',
  'BETA',
  '--background-color "rgba(0,0,0,0.75)" --text-color transparent',
);

createBadge(
  'ic_launcher_round-xxxhdpi.png',
  'ic_launcher_round-xxxhdpi-larger.png',
  'UAT',
  '--font-size 40 --padding-x 4 --padding-y 2',
);
