import {
  IMagickImage,
  MagickColors,
  MagickImage,
} from '@imagemagick/magick-wasm';

import BadgeOptions, { scaleBadgeOptions } from '../types/BadgeOptions';
import TextOptions, { scaleTextOptions } from '../types/TextOptions';
import drawCenteredText from './drawCenteredText';
import getTextBoundingBox from './getTextBoundingBox';
import roundToEven from './roundToEven';

export default function createBadgeImage(
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  scale: number,
): IMagickImage {
  const scaledBadgeOptions = scaleBadgeOptions(badgeOptions, scale);
  const scaledTextOptions = scaleTextOptions(textOptions, scale);

  const textBox = getTextBoundingBox(
    scaledTextOptions,
    192 * scale,
    192 * scale,
  );

  const badgeWidth = roundToEven(
    textBox.width + Math.max(1, scaledBadgeOptions.paddingX) * 2,
  );
  const badgeHeight = roundToEven(
    textBox.height + Math.max(1, scaledBadgeOptions.paddingY) * 2,
  );

  const badge = MagickImage.create();
  badge.read(badgeOptions.backgroundColor, badgeWidth, badgeHeight);

  drawCenteredText(badge, scaledTextOptions);

  return badge;
}
