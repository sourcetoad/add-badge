#!/usr/bin/env node

const { execSync } = require('child_process');

['ic_launcher-xxxhdpi.png', 'ic_launcher_round-xxxhdpi.png'].forEach(
  (image) => {
    console.log(
      execSync(
        `node bin/add-badge.js "samples/input/${image}" "samples/output/${image}" "ALPHA"`,
        { encoding: 'utf-8' }
      )
    );
  }
);
