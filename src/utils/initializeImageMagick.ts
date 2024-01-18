import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { initializeImageMagick as baseInitializeImageMagick } from '@imagemagick/magick-wasm';

export default async function initializeImageMagick(): Promise<void> {
  const wasmBytes = readFileSync(
    resolve('node_modules/@imagemagick/magick-wasm/dist/magick.wasm'),
  );
  await baseInitializeImageMagick(wasmBytes);
}
