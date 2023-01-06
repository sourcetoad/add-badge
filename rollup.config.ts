import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: 'build/commands/addBadge.js',
    output: {
      banner: '#!/usr/bin/env node',
      file: 'bin/addBadge.js',
      format: 'cjs',
      sourcemap: true,
    },
  },
]);
