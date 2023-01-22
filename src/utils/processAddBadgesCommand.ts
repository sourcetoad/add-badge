import { initializeImageMagick, MagickColor } from '@imagemagick/magick-wasm';
import { sync as globSync } from 'fast-glob';
import { resolve } from 'path';

import defaultOptions from '../defaultOptions';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import CommonArguments from '../types/CommonArguments';
import addBadgeOverlay from './addBadgeOverlay';
import setBadgeFont, { BADGE_FONT_NAME } from './setBadgeFont';

export interface WriteBadgesArguments extends CommonArguments {
  inputGlob: string;
}

export default async function processAddBadgesCommand({
  backgroundColor,
  badgeText,
  dryRun,
  fontFile,
  fontSize,
  gravity,
  inputGlob,
  paddingX,
  paddingY,
  shadowColor,
  textColor,
}: WriteBadgesArguments) {
  if (!inputGlob || !badgeText) {
    throw new Error('Missing parameter');
  }

  const inputFiles = globSync(inputGlob).filter((file) => /\.png$/i.test(file));
  if (!inputFiles.length) {
    console.error(`No input PNG files found using glob "${inputGlob}"`);
    return 1;
  }

  if (!dryRun) {
    await initializeImageMagick();

    setBadgeFont(fontFile ?? resolve(__dirname, defaultOptions.fontFile));
  }

  for (const inputFile of inputFiles) {
    console.info(`${dryRun ? 'Would process' : 'Processing'} ${inputFile}`);

    if (!dryRun) {
      await addBadgeOverlay(
        inputFile,
        inputFile,
        {
          backgroundColor: new MagickColor(backgroundColor),
          paddingX,
          paddingY,
          shadowColor: new MagickColor(shadowColor),
        },
        {
          color: new MagickColor(textColor),
          font: BADGE_FONT_NAME,
          fontPointSize: fontSize,
          text: badgeText.replace(/\\n/g, '\n'),
        },
        getBadgeGravityFromString(gravity),
      );
    }
  }

  return 0;
}
