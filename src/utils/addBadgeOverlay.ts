import {
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
} from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions from '../types/BadgeOptions';
import TextOptions from '../types/TextOptions';
import addShadow from './addShadow';
import createBadgeImage from './createBadgeImage';
import createImageBadgeComposite from './createImageBadgeComposite';
import { HIGHEST_ANDROID_SHADOW_ALPHA } from './getInsetAtGravity';
import roundToEven from './roundToEven';

export default async function addBadgeOverlay(
  inputFile: string,
  outputFile: string,
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  badgeGravity: BadgeGravity,
): Promise<void> {
  await initializeImageMagick();

  await ImageMagick.read(fs.readFileSync(inputFile), async (image) => {
    const badgeScale = image.width / 192;
    const badge = createBadgeImage(badgeOptions, textOptions, badgeScale);
    const badgeWithShadow = addShadow(
      badge,
      badgeOptions.shadowColor,
      Math.max(1, roundToEven(4 * badgeScale)),
      Math.max(1, roundToEven(3 * badgeScale)),
    );

    const composite = createImageBadgeComposite(
      image,
      badgeWithShadow,
      badgeGravity,
      badge.width,
      HIGHEST_ANDROID_SHADOW_ALPHA,
    );

    // Strip date based metadata in an attempt at producing the same image from
    // the same input every time. This lets us test things like the samples
    // being generated in the CI.
    composite.attributeNames
      .filter((name) => /date:/i.test(name))
      .forEach((name) => composite.removeAttribute(name));

    await composite.write(
      (data) => fs.writeFileSync(outputFile, data),
      MagickFormat.Png,
    );
  });
}
