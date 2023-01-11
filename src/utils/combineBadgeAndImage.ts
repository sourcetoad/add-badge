import {
  CompositeOperator,
  IMagickImage,
  MagickColors,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeGravity, {
  getGravityFromBadgeGravity,
} from '../types/BadgeGravity';
import getInsetPosition from './getInsetPosition';

export default function combineBadgeAndImage(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  opacityCutoff: number
): void {
  const insetPosition = getInsetPosition(image, opacityCutoff);

  const topCenterPosition = {
    x: Math.round(image.width / 2),
    y: Math.round(insetPosition),
  };
  const leftCenterPosition = {
    x: Math.round(insetPosition),
    y: Math.round(image.height / 2),
  };

  const updatedBadgeWidth =
    // TODO Figure out a better way to calculate this that doesn't involve a
    //      magic percent
    1.2 *
    Math.round(
      Math.hypot(
        topCenterPosition.x - leftCenterPosition.x,
        topCenterPosition.y - leftCenterPosition.y
      )
    );

  const updatedBadgeHeight = Math.round(
    updatedBadgeWidth * (badge.height / badge.width)
  );

  badge.resize(updatedBadgeWidth, updatedBadgeHeight);

  badge.backgroundColor = MagickColors.None;

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

  image.compositeGravity(
    badge,
    getGravityFromBadgeGravity(gravity),
    CompositeOperator.Atop,
    // TODO Figure out a better way to calculate this that doesn't involve a
    //      magic percent
    new Point(insetPosition - updatedBadgeHeight * 0.65)
  );
}
