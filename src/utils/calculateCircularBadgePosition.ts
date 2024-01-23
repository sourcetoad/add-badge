import { Point } from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import BadgePosition from '../types/BadgePosition';
import Rectangle from '../types/Rectangle';
import getRotatedBadgeInfo from './getRotatedBadgeInfo';

/**
 * Returns the position and rotation of the badge assuming the badge is circular
 * with equal insets.
 */
export default function calculateCircularBadgePosition(
  container: Rectangle,
  badge: Rectangle,
  circleRadius: number,
  gravity: BadgeGravity,
): BadgePosition {
  const { angle, rotation, rotatedWidth, rotatedHeight } = getRotatedBadgeInfo(
    badge,
    gravity,
  );

  // Calculate the distance from the center of the container to the bottom-center of
  // the badge.
  const distance = Math.sqrt(
    Math.max(0, Math.pow(circleRadius, 2) - Math.pow(badge.width / 2, 2)),
  );

  const trigAngle = ((angle - 90) * Math.PI) / 180;

  const x =
    container.width / 2 -
    (distance - badge.height / 2) * Math.cos(trigAngle) +
    -rotatedWidth / 2;

  const y =
    container.height / 2 +
    (-distance + badge.height / 2) * Math.sin(trigAngle) +
    -rotatedHeight / 2;

  return {
    point: new Point(x, y),
    rotation,
  };
}
