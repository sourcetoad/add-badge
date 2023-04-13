import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColors,
  MagickImage,
} from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import getCircularBadgePosition from './getCircularBadgePosition';
import getUnequalBadgePosition from './getUnequalBadgePosition';

export default function createImageBadgeComposite(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  insetWidth: number,
): IMagickImage {
  const composite = MagickImage.create();
  composite.read(MagickColors.Transparent, image.width, image.height);
  composite.composite(image, CompositeOperator.Over);

  // We need to set a background before rotating, or it may fill it with white.
  badge.backgroundColor = MagickColors.None;

  const { rotation, point } =
    getUnequalBadgePosition(composite, badge, gravity) ??
    getCircularBadgePosition(composite, badge, insetWidth / 2, gravity);

  if (rotation) {
    badge.rotate(rotation);
  }

  composite.compositeGravity(
    badge,
    Gravity.Northwest,
    CompositeOperator.Over,
    point,
  );

  return composite;
}
