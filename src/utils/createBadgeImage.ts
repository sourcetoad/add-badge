import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColors,
  MagickGeometry,
  MagickImage,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeOptions from '../types/BadgeOptions';
import TextOptions from '../types/TextOptions';
import drawCenteredText from './drawCenteredText';

export default function createBadgeImage(
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  expectedWidth: number,
): IMagickImage {
  const baseHeight = 30;
  const baseWidth = 130;
  const baseShadowSize = 3;
  const baseRatio = baseHeight / baseWidth;

  // Scale the sizes up to the expected badge size if larger
  const width = Math.max(baseWidth, expectedWidth);
  const height = Math.round(width * baseRatio);
  const scale = width / baseWidth;
  const shadowSize = Math.floor(baseShadowSize * scale);
  const fontPointSize = Math.floor(textOptions.fontPointSize * scale);

  const heightWithShadow = height + shadowSize * 2;

  // Create the shadow canvas filled with the shadow color
  const shadow = MagickImage.create();
  shadow.backgroundColor = MagickColors.None;
  shadow.read(badgeOptions.shadowColor, width, height);

  // Expand the canvas by the shadow size and blur by the shadow amount
  shadow.extent(
    new MagickGeometry(width, heightWithShadow),
    Gravity.Center,
    MagickColors.Transparent,
  );
  shadow.blur(shadowSize, shadowSize);

  // Create the background canvas filled with the background color
  const background = MagickImage.create();
  background.backgroundColor = MagickColors.None;
  background.read(badgeOptions.backgroundColor, width, height);

  // Create the badge canvas
  const badge = MagickImage.create();
  badge.backgroundColor = MagickColors.None;
  badge.read(MagickColors.Transparent, width, heightWithShadow);

  // Add the shadow layer to the middle
  badge.compositeGravity(
    shadow,
    Gravity.Center,
    CompositeOperator.Over,
    new Point(0),
  );

  // Add the background layer to the middle
  badge.compositeGravity(
    background,
    Gravity.Center,
    CompositeOperator.Over,
    new Point(0),
  );

  // Draw the text in the center
  drawCenteredText(badge, {
    ...textOptions,
    fontPointSize,
  });

  return badge;
}
