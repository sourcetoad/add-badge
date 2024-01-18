import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { initializeImageMagick } from '@imagemagick/magick-wasm';

global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);
global.require = createRequire(import.meta.url);

const wasmBytes = readFileSync(
  resolve('node_modules/@imagemagick/magick-wasm/dist/magick.wasm'),
);
await initializeImageMagick(wasmBytes);
