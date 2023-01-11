import {
  ImageMagick,
  initializeImageMagick,
  MagickColors,
  MagickFormat,
} from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions from '../types/BadgeOptions';
import combineBadgeAndImage from './combineBadgeAndImage';
import createBadgeImage from './createBadgeImage';

export default async function addBadgeOverlay(
  inputFile: string,
  outputFile: string,
  options: BadgeOptions,
  gravity: BadgeGravity
): Promise<void> {
  await initializeImageMagick();

  ImageMagick.read(fs.readFileSync(inputFile), async (image) => {
    combineBadgeAndImage(image, createBadgeImage(options), gravity, 29);

    image.backgroundColor = MagickColors.Transparent;

    image.write((data) => fs.writeFileSync(outputFile, data), MagickFormat.Png);
  });
}
