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

function getCornerOffset(
  insetWidth: number,
  finalBadgeWidth: number,
  finalBadgeHeight: number,
): number {
  // TODO Figure out a better way to calculate this that doesn't rely on magic
  //      numbers.
  return Math.round(insetWidth / 2 - finalBadgeWidth + finalBadgeHeight * 0.2);
}

function isEqualWithinThreshold(
  insetX: number,
  insetY: number,
  threshold = 15,
): boolean {
  return Math.abs(((insetY - insetX) * 100) / insetX) <= threshold;
}

export default function createImageBadgeComposite(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  insetWidth: number,
  badgeWidth: number,
): IMagickImage {
  const composite = MagickImage.create();
  composite.read(MagickColors.Transparent, image.width, image.height);
  composite.composite(image, CompositeOperator.Over);

  // We need to set a background before rotating, or it may fill it with white.
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

  const edgeScale = 1.1;
  const offset = new Point(0, 0);

  switch (gravity) {
    case BadgeGravity.Northwest:
    case BadgeGravity.Northeast: {
      const xInset = getInsetAtGravity(
        composite,
        gravity === BadgeGravity.Northwest ? Gravity.West : Gravity.East,
      );
      const yInset = getInsetAtGravity(composite, Gravity.North);

      if (isEqualWithinThreshold(xInset, yInset)) {
        const cornerOffset = getInsetAtGravity(
          composite,
          Gravity.North,
          getCornerOffset(insetWidth, badge.width, badge.height),
        );
        offset.x = cornerOffset;
        offset.y = cornerOffset;
      } else {
        offset.x = xInset;
        offset.y = yInset;
      }
      break;
    }

    case BadgeGravity.North:
      offset.x = 0;
      offset.y = Math.round(
        edgeScale *
          getInsetAtGravity(
            composite,
            Gravity.North,
            Math.round(badgeWidth / 2),
          ),
      );
      break;

    case BadgeGravity.Southwest:
    case BadgeGravity.Southeast: {
      const xInset = getInsetAtGravity(
        composite,
        gravity === BadgeGravity.Southwest ? Gravity.West : Gravity.East,
      );
      const yInset = getInsetAtGravity(composite, Gravity.South);

      if (isEqualWithinThreshold(xInset, yInset)) {
        const cornerOffset = getInsetAtGravity(
          composite,
          Gravity.South,
          getCornerOffset(insetWidth, badge.width, badge.height),
        );
        offset.x = cornerOffset;
        offset.y = cornerOffset;
      } else {
        offset.x = xInset;
        offset.y = yInset;
      }
      break;
    }

    case BadgeGravity.South:
      offset.x = 0;
      offset.y = Math.round(
        edgeScale *
          getInsetAtGravity(
            composite,
            Gravity.South,
            Math.round(badgeWidth / 2),
          ),
      );
      break;
  }

  composite.compositeGravity(
    badge,
    getGravityFromBadgeGravity(gravity),
    CompositeOperator.Atop,
    offset,
  );

  return composite;
}
