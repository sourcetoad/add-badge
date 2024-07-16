import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { initializeImageMagick } from '@imagemagick/magick-wasm';

global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);
global.require = createRequire(import.meta.url);

const wasmBytes = readFileSync(
  require.resolve('@imagemagick/magick-wasm/magick.wasm'),
);
await initializeImageMagick(wasmBytes);
