import { Magick } from '@imagemagick/magick-wasm';
import * as fs from 'fs';

export const BADGE_FONT_NAME = 'BadgeFont';

export default function setBadgeFont(fontFile: string): void {
  Magick.addFont(BADGE_FONT_NAME, fs.readFileSync(fontFile));
}
