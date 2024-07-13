import { build } from 'esbuild';

import data from './package.json' assert { type: 'json' };

const banners = [
  '#!/usr/bin/env node',
  `process.env.APP_VERSION = ${JSON.stringify(data.version)};`,
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
