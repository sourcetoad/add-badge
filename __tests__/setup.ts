import { initializeImageMagick } from '@imagemagick/magick-wasm';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

await initializeImageMagick();
