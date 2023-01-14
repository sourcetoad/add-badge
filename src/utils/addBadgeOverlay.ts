import {
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
} from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions from '../types/BadgeOptions';
import combineBadgeAndImage from './combineBadgeAndImage';
import removeDateMetadata from './removeDateMetadata';

export default async function addBadgeOverlay(
  inputFile: string,
  outputFile: string,
  badgeOptions: BadgeOptions,
  badgeGravity: BadgeGravity,
): Promise<void> {
  await initializeImageMagick();

  await ImageMagick.read(fs.readFileSync(inputFile), async (image) => {
    combineBadgeAndImage(image, badgeOptions, badgeGravity, 29);

    // Strip date based metadata in an attempt at producing the same image from
    // the same input every time. This lets us test things like the samples
    // being generated in the CI.
    removeDateMetadata(image);

    await image.write(
      (data) => fs.writeFileSync(outputFile, data),
      MagickFormat.Png,
    );
  });
}
