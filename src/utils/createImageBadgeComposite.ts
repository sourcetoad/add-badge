import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColors,
  MagickImage,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeGravity, {
  getGravityFromBadgeGravity,
} from '../types/BadgeGravity';
import getInsetAtGravity from './getInsetAtGravity';

export default function createImageBadgeComposite(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  badgeWidth: number,
): IMagickImage {
  const composite = MagickImage.create();
  composite.read(MagickColors.Transparent, image.width, image.height);
  composite.composite(image, CompositeOperator.Over);

  // We need to set a background before rotating, or it may fill it with white.
  badge.backgroundColor = MagickColors.None;
  // badge.backgroundColor = new MagickColor(255, 0, 0, 50);

  switch (gravity) {
    case BadgeGravity.Northwest:
    case BadgeGravity.Southeast:
      badge.rotate(-45);
      break;
    case BadgeGravity.Northeast:
    case BadgeGravity.Southwest:
      badge.rotate(45);
      break;
  }

  let offsetX = 0;
  let offsetY = 0;

  switch (gravity) {
    case BadgeGravity.Northwest:
      offsetX = getInsetAtGravity(composite, Gravity.West);
      offsetY = getInsetAtGravity(composite, Gravity.North);
      break;
    case BadgeGravity.North:
      offsetX = 0;
      offsetY = Math.round(
        getInsetAtGravity(composite, Gravity.North, Math.round(badgeWidth / 2)),
      );
      break;
    case BadgeGravity.Northeast:
      offsetX = getInsetAtGravity(composite, Gravity.East);
      offsetY = getInsetAtGravity(composite, Gravity.North);
      break;

    case BadgeGravity.Southwest:
      offsetX = getInsetAtGravity(composite, Gravity.West);
      offsetY = getInsetAtGravity(composite, Gravity.South);
      break;
    case BadgeGravity.South:
      offsetX = 0;
      offsetY = getInsetAtGravity(
        composite,
        Gravity.South,
        Math.round(badgeWidth / 2),
      );
      break;
    case BadgeGravity.Southeast:
      offsetX = getInsetAtGravity(composite, Gravity.East);
      offsetY = getInsetAtGravity(composite, Gravity.South);
      break;
  }

  composite.compositeGravity(
    badge,
    getGravityFromBadgeGravity(gravity),
    CompositeOperator.Atop,
    new Point(offsetX, offsetY),
  );

  return composite;
}
