import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: 'build/commands/addBadge.js',
    output: {
      banner: '#!/usr/bin/env node',
      file: 'bin/add-badge.js',
      format: 'cjs',
      sourcemap: true,
    },
  },
  {
    input: 'build/commands/addBadges.js',
    output: {
      banner: '#!/usr/bin/env node',
      file: 'bin/add-badges.js',
      format: 'cjs',
      sourcemap: true,
    },
  },
]);
