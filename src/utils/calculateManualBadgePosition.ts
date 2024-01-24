import { Point } from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import BadgePosition from '../types/BadgePosition';
import ManualPosition from '../types/ManualPosition';
import Rectangle from '../types/Rectangle';
import getRotatedBadgeInfo from './getRotatedBadgeInfo';

function getPointAtPosition(
  container: Rectangle,
  badge: Rectangle,
  x: number,
  y: number,
): Point {
  return new Point(
    (container.width - badge.width) * (x / 100),
    (container.height - badge.height) * (y / 100),
  );
}

function getPointOnGravityAxis(
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
  position: ManualPosition,
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
    point:
      position.y !== undefined
        ? getPointAtPosition(container, rotatedBadge, position.x, position.y)
        : getPointOnGravityAxis(container, rotatedBadge, position.x, gravity),
    rotation,
  };
}
