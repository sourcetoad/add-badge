import { Point } from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import BadgePosition from '../types/BadgePosition';
import Rectangle from '../types/Rectangle';
import getRotatedBadgeInfo from './getRotatedBadgeInfo';

function determinePointOnGravityAxis(
  container: Rectangle,
  badge: Rectangle,
  position: number,
  gravity: BadgeGravity,
): Point {
  switch (gravity) {
    case BadgeGravity.North:
      return new Point(
        (container.width - badge.width) / 2,
        (container.height - badge.height) * (position / 100),
      );
    case BadgeGravity.Northeast:
      return new Point(
        (container.width - badge.width) * (1 - position / 100),
        (container.height - badge.height) * (position / 100),
      );
    case BadgeGravity.Northwest:
      return new Point(
        (container.width - badge.width) * (position / 100),
        (container.height - badge.height) * (position / 100),
      );
    case BadgeGravity.South:
      return new Point(
        (container.width - badge.width) / 2,
        (container.height - badge.height) * (1 - position / 100),
      );
    case BadgeGravity.Southeast:
      return new Point(
        (container.width - badge.width) * (1 - position / 100),
        (container.height - badge.height) * (1 - position / 100),
      );
    case BadgeGravity.Southwest:
      return new Point(
        (container.width - badge.width) * (position / 100),
        (container.height - badge.height) * (1 - position / 100),
      );
  }
}

export default function calculateManualBadgePosition(
  container: Rectangle,
  badge: Rectangle,
  position: number,
  gravity: BadgeGravity,
): BadgePosition {
  const { rotation, rotatedWidth, rotatedHeight } = getRotatedBadgeInfo(
    badge,
    gravity,
  );

  const rotatedBadge: Rectangle = {
    width: rotatedWidth,
    height: rotatedHeight,
  };

  return {
    point: determinePointOnGravityAxis(
      container,
      rotatedBadge,
      position,
      gravity,
    ),
    rotation,
  };
}
