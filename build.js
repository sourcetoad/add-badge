/* eslint-disable @typescript-eslint/no-var-requires */

const { build } = require('esbuild');
const { version } = require('./package.json');

const banners = [
  '#!/usr/bin/env node',
  `process.env.APP_VERSION = ${JSON.stringify(version)};`,
];

const config = {
  bundle: true,
  minify: false,
  packages: 'external',
  platform: 'node',
  banner: {
    js: banners.join('\n'),
  },
};

build({
  ...config,
  entryPoints: ['src/commands/addBadge.ts'],
  outfile: 'bin/add-badge.js',
}).catch(() => process.exit(1));

build({
  ...config,
  entryPoints: ['src/commands/addBadges.ts'],
  outfile: 'bin/add-badges.js',
}).catch(() => process.exit(1));
