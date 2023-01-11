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
import drawCenteredText from './drawCenteredText';

export default function createBadgeImage({
  backgroundColor,
  shadowColor,
  text,
}: BadgeOptions): IMagickImage {
  const height = 36;
  const width = 140;
  const shadowSize = 5;

  const shadow = MagickImage.create();
  shadow.read(shadowColor, width, height);
  shadow.extent(
    new MagickGeometry(width, height + shadowSize * 2),
    Gravity.Center,
    MagickColors.Transparent
  );
  shadow.blur(shadowSize, 3);

  const background = MagickImage.create();
  background.read(backgroundColor, width, height);

  const badge = MagickImage.create();
  badge.read(MagickColors.Transparent, width, height + shadowSize * 2);

  badge.compositeGravity(
    shadow,
    Gravity.Center,
    CompositeOperator.Over,
    new Point(0)
  );

  badge.compositeGravity(
    background,
    Gravity.Center,
    CompositeOperator.Over,
    new Point(0)
  );

  drawCenteredText(badge, text);

  return badge;
}
