#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');

['ic_launcher-xxxhdpi.png', 'ic_launcher_round-xxxhdpi.png'].forEach(
  (image) => {
    console.log(
      execSync(
        `node bin/add-badge.js "samples/input/${image}" ALPHA "samples/output/${image}"`,
        { encoding: 'utf-8' }
      )
    );
  }
);
