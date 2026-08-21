import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColors,
  MagickImage,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import ManualPosition from '../types/ManualPosition';
import calculateCircularBadgePosition from './calculateCircularBadgePosition';
import calculateManualBadgePosition from './calculateManualBadgePosition';

export default function createImageBadgeComposite(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  insetWidth: number,
  position: ManualPosition | undefined,
  manualPositionInset = 0,
): IMagickImage {
  const composite = MagickImage.create();
  composite.read(MagickColors.Transparent, image.width, image.height);
  composite.composite(image, CompositeOperator.Over);

  // We need to set a background before rotating, or it may fill it with white.
  badge.backgroundColor = MagickColors.None;

  const radius = insetWidth / 2;

  // Manual positions map onto the container inset by manualPositionInset on
  // every side, so percentages cover only the visible area of the image.
  const { rotation, point } =
    position === undefined
      ? calculateCircularBadgePosition(composite, badge, radius, gravity)
      : calculateManualBadgePosition(
          {
            height: composite.height - manualPositionInset * 2,
            width: composite.width - manualPositionInset * 2,
          },
          badge,
          position,
          gravity,
        );

  if (rotation) {
    badge.rotate(rotation);
  }

  composite.compositeGravity(
    badge,
    Gravity.Northwest,
    CompositeOperator.Over,
    position === undefined || !manualPositionInset
      ? point
      : new Point(point.x + manualPositionInset, point.y + manualPositionInset),
  );

  return composite;
}
