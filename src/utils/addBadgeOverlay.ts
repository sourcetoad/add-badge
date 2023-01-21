import {
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
} from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions from '../types/BadgeOptions';
import TextOptions from '../types/TextOptions';
import createBadgeComposite from './createBadgeComposite';
import { HIGHEST_ANDROID_SHADOW_ALPHA } from './getInsetAtGravity';

export default async function addBadgeOverlay(
  inputFile: string,
  outputFile: string,
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  badgeGravity: BadgeGravity,
): Promise<void> {
  await initializeImageMagick();

  await ImageMagick.read(fs.readFileSync(inputFile), async (image) => {
    createBadgeComposite(
      image,
      badgeOptions,
      textOptions,
      badgeGravity,
      HIGHEST_ANDROID_SHADOW_ALPHA,
    );

    // Strip date based metadata in an attempt at producing the same image from
    // the same input every time. This lets us test things like the samples
    // being generated in the CI.
    image.attributeNames
      .filter((name) => /date:/i.test(name))
      .forEach((name) => image.removeAttribute(name));

    await image.write(
      (data) => fs.writeFileSync(outputFile, data),
      MagickFormat.Png,
    );
  });
}
