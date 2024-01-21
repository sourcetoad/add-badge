import { resolve } from 'node:path';

import { MagickColor } from '@imagemagick/magick-wasm';
import { sync as globSync } from 'fast-glob';

import defaultOptions from '../defaultOptions';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import CommonArguments from '../types/CommonArguments';
import addBadgeOverlay from './addBadgeOverlay';
import initializeImageMagick from './initializeImageMagick';
import parseManualPosition from './parseManualPosition';
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
  position,
  shadowColor,
  textColor,
}: WriteBadgesArguments) {
  if (!inputGlob || !badgeText) {
    throw new Error('Missing parameter');
  }

  const inputFiles = globSync(inputGlob);
  if (!inputFiles.length) {
    console.error(`No input files found using glob "${inputGlob}"`);
    return 1;
  }

  if (!dryRun) {
    await initializeImageMagick();

    setBadgeFont(fontFile ?? resolve(__dirname, defaultOptions.fontFile));
  }

  for (const inputFile of inputFiles) {
    console.info(
      `${dryRun ? 'Would process' : 'Processing'} "${inputFile}" in place.`,
    );

    if (!dryRun) {
      addBadgeOverlay(
        inputFile,
        inputFile,
        {
          backgroundColor: new MagickColor(backgroundColor),
          paddingX: defaultOptions.paddingX,
          paddingY: defaultOptions.paddingY,
          shadowColor: new MagickColor(shadowColor),
          shadowSize: defaultOptions.shadowSize,
        },
        {
          color: new MagickColor(textColor),
          font: BADGE_FONT_NAME,
          fontPointSize: fontSize,
          text: badgeText.replace(/\\n/g, '\n'),
        },
        getBadgeGravityFromString(gravity),
        parseManualPosition(position),
      );
    }
  }

  return 0;
}
