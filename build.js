import { createRequire } from 'node:module';

import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

const banners = [
  '#!/usr/bin/env node',
  `process.env.APP_VERSION = ${JSON.stringify(version)};`,
];

const config = {
  bundle: true,
  minify: false,
  format: 'cjs',
  packages: 'external',
  platform: 'node',
  banner: {
    js: banners.join('\n'),
  },
};

build({
  ...config,
  entryPoints: ['src/commands/addBadge.ts'],
  outfile: 'bin/add-badge.cjs',
}).catch(() => process.exit(1));

build({
  ...config,
  entryPoints: ['src/commands/addBadges.ts'],
  outfile: 'bin/add-badges.cjs',
}).catch(() => process.exit(1));

build({
  ...config,
  entryPoints: ['src/commands/generateSamples.ts'],
  outfile: 'bin/generate-samples.cjs',
}).catch(() => process.exit(1));
