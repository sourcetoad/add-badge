import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColors,
  MagickImage,
} from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import calculateCircularBadgePosition from './calculateCircularBadgePosition';
import calculateManualBadgePosition from './calculateManualBadgePosition';

export default function createImageBadgeComposite(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  insetWidth: number,
  position: number | undefined,
): IMagickImage {
  const composite = MagickImage.create();
  composite.read(MagickColors.Transparent, image.width, image.height);
  composite.composite(image, CompositeOperator.Over);

  // We need to set a background before rotating, or it may fill it with white.
  badge.backgroundColor = MagickColors.None;

  const radius = insetWidth / 2;

  const { rotation, point } =
    position === undefined
      ? calculateCircularBadgePosition(composite, badge, radius, gravity)
      : calculateManualBadgePosition(composite, badge, position, gravity);

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
