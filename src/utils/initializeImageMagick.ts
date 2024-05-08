import { readFileSync } from 'node:fs';

import { initializeImageMagick as baseInitializeImageMagick } from '@imagemagick/magick-wasm';

export default async function initializeImageMagick(): Promise<void> {
  const wasmBytes = readFileSync(
    require.resolve('@imagemagick/magick-wasm/magick.wasm'),
  );
  await baseInitializeImageMagick(wasmBytes);
}
