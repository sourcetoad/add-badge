import { initializeImageMagick, Magick } from '@imagemagick/magick-wasm';
import * as fs from 'fs';

export const BADGE_FONT_NAME = 'BadgeFont';

export default async function setBadgeFont(fontFile: string): Promise<void> {
  await initializeImageMagick();

  Magick.addFont(BADGE_FONT_NAME, fs.readFileSync(fontFile));
}
