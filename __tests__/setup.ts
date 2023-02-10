import { initializeImageMagick } from '@imagemagick/magick-wasm';
import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);
global.require = createRequire(import.meta.url);

await initializeImageMagick();
