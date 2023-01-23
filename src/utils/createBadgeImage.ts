import { IMagickImage, MagickImage } from '@imagemagick/magick-wasm';

import BadgeOptions from '../types/BadgeOptions';
import TextOptions from '../types/TextOptions';
import drawCenteredText from './drawCenteredText';
import getTextBoundingBox from './getTextBoundingBox';
import roundToEven from './roundToEven';

export default function createBadgeImage(
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  maxWidth: number,
  maxHeight: number,
): IMagickImage {
  const textBox = getTextBoundingBox(textOptions, maxWidth, maxHeight);

  const badgeWidth = roundToEven(
    textBox.width + Math.max(1, badgeOptions.paddingX) * 2,
  );
  const badgeHeight = roundToEven(
    textBox.height + Math.max(1, badgeOptions.paddingY) * 2,
  );

  const badge = MagickImage.create();
  badge.read(badgeOptions.backgroundColor, badgeWidth, badgeHeight);

  drawCenteredText(badge, textOptions);

  return badge;
}
