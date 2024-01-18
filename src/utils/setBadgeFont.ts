import { readFileSync } from 'node:fs';

import { Magick } from '@imagemagick/magick-wasm';

export const BADGE_FONT_NAME = 'BadgeFont';

export default function setBadgeFont(fontFile: string): void {
  Magick.addFont(BADGE_FONT_NAME, readFileSync(fontFile));
}
