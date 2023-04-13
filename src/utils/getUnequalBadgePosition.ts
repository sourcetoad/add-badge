import { Gravity, IMagickImage, Point } from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import BadgePosition from '../types/BadgePosition';
import getInsetAtGravity from './getInsetAtGravity';
import getRotatedBadgeInfo from './getRotatedBadgeInfo';

function isEqualWithinThreshold(
  insetX: number,
  insetY: number,
  threshold = 15,
): boolean {
  const percentageDifference = Math.abs(((insetY - insetX) * 100) / insetX);

  return percentageDifference <= threshold;
}

/**
 * Returns the position and rotation of the badge if the image is found to have
 * non-equal insets.
 *
 * Only supports northeast, northwest, southeast, and southwest.
 */
export default function getUnequalBadgePosition(
  container: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
): BadgePosition | undefined {
  if (gravity === BadgeGravity.North || gravity === BadgeGravity.South) {
    return undefined;
  }

  const xInset = getInsetAtGravity(
    container,
    [BadgeGravity.Northwest, BadgeGravity.Southwest].includes(gravity)
      ? Gravity.West
      : Gravity.East,
  );
  const yInset = getInsetAtGravity(
    container,
    [BadgeGravity.Northwest, BadgeGravity.Northeast].includes(gravity)
      ? Gravity.North
      : Gravity.South,
  );
  if (isEqualWithinThreshold(xInset, yInset)) {
    return undefined;
  }

  const { rotation, rotatedWidth, rotatedHeight } = getRotatedBadgeInfo(
    badge,
    gravity,
  );

  switch (gravity) {
    case BadgeGravity.Northwest:
      return {
        point: new Point(xInset, yInset),
        rotation,
      };
    case BadgeGravity.Northeast:
      return {
        point: new Point(container.width - xInset - rotatedWidth, yInset),
        rotation,
      };
    case BadgeGravity.Southwest:
      return {
        point: new Point(xInset, container.height - yInset - rotatedHeight),
        rotation,
      };
    case BadgeGravity.Southeast:
      return {
        point: new Point(
          container.width - xInset - rotatedWidth,
          container.height - yInset - rotatedHeight,
        ),
        rotation,
      };
  }

  return undefined;
}
