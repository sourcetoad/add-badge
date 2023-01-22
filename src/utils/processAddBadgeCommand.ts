import { initializeImageMagick, MagickColor } from '@imagemagick/magick-wasm';
import { existsSync } from 'fs';
import { resolve } from 'path';

import defaultOptions from '../defaultOptions';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import CommonArguments from '../types/CommonArguments';
import addBadgeOverlay from './addBadgeOverlay';
import setBadgeFont, { BADGE_FONT_NAME } from './setBadgeFont';

export interface WriteBadgeArguments extends CommonArguments {
  inputImage: string;
  outputImage: string;
}

export default async function processAddBadgeCommand({
  backgroundColor,
  badgeText,
  dryRun,
  fontFile,
  fontSize,
  gravity,
  inputImage,
  outputImage,
  shadowColor,
  textColor,
}: WriteBadgeArguments) {
  if (!inputImage || !badgeText || !outputImage) {
    console.log(inputImage, badgeText, outputImage);
    throw new Error('Missing parameter');
  }

  if (!existsSync(inputImage)) {
    console.error(`Input file "${inputImage}" not found`);
    return 1;
  }

  if (fontFile && !existsSync(fontFile)) {
    console.error(`Font file "${fontFile}" not found`);
    return 1;
  }

  console.info(`${dryRun ? 'Would process' : 'Processing'} ${inputImage}`);

  if (!dryRun) {
    await initializeImageMagick();

    setBadgeFont(fontFile ?? resolve(__dirname, defaultOptions.fontFile));

    await addBadgeOverlay(
      inputImage,
      outputImage,
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
    );
  }

  return 0;
}
