import { initializeImageMagick, Magick } from '@imagemagick/magick-wasm';
import * as fs from 'fs';

export default async function setBadgeFont(fontFile: string): Promise<void> {
  await initializeImageMagick();

  Magick.addFont('BadgeFont', fs.readFileSync(fontFile));
}
