import { Gravity, ImageMagick } from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions, { scaleBadgeOptions } from '../types/BadgeOptions';
import TextOptions, { scaleTextOptions } from '../types/TextOptions';
import addShadow from './addShadow';
import createBadgeImage from './createBadgeImage';
import createImageBadgeComposite from './createImageBadgeComposite';
import getInsetAtGravity from './getInsetAtGravity';

export default function addBadgeOverlay(
  inputFile: string,
  outputFile: string,
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  badgeGravity: BadgeGravity,
): void {
  ImageMagick.read(fs.readFileSync(inputFile), (image) => {
    const insetWidth =
      image.width -
      getInsetAtGravity(image, Gravity.East) -
      getInsetAtGravity(image, Gravity.West);

    // The default sizes are based on usage in 192px icons, anything above or
    // below that will be scaled relative to it.
    const badgeScale = insetWidth / 192;

    const scaledBadgeOptions = scaleBadgeOptions(badgeOptions, badgeScale);
    const scaledTextOptions = scaleTextOptions(textOptions, badgeScale);

    const badge = createBadgeImage(
      scaledBadgeOptions,
      scaledTextOptions,
      insetWidth,
      insetWidth,
    );
    const badgeWithShadow = addShadow(
      badge,
      scaledBadgeOptions.shadowColor,
      scaledBadgeOptions.shadowSize,
      Math.max(1, scaledBadgeOptions.shadowSize * 0.75 * badgeScale),
    );

    const composite = createImageBadgeComposite(
      image,
      badgeWithShadow,
      badgeGravity,
      insetWidth,
      badge.width,
    );

    composite.quality = 80;

    // Strip date based metadata in an attempt at producing the same image from
    // the same input every time. This lets us test things like the samples
    // being generated in the CI.
    composite.attributeNames
      .filter((name) => /date:/i.test(name))
      .forEach((name) => composite.removeAttribute(name));

    composite.write((data) => fs.writeFileSync(outputFile, data), image.format);
  });
}
