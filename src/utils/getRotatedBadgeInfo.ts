import BadgeGravity from '../types/BadgeGravity';
import Rectangle from '../types/Rectangle';

const badgeGravityAngles: Record<BadgeGravity, number> = {
  [BadgeGravity.Northwest]: 135,
  [BadgeGravity.Southeast]: -45,
  [BadgeGravity.Northeast]: -135,
  [BadgeGravity.Southwest]: 45,
  [BadgeGravity.North]: 180,
  [BadgeGravity.South]: 0,
};

const badgeRotationDegrees: Record<BadgeGravity, number> = {
  [BadgeGravity.Northwest]: -45,
  [BadgeGravity.Southeast]: -45,
  [BadgeGravity.Northeast]: 45,
  [BadgeGravity.Southwest]: 45,
  [BadgeGravity.North]: 0,
  [BadgeGravity.South]: 0,
};

export default function getRotatedBadgeInfo(
  badge: Rectangle,
  gravity: BadgeGravity,
) {
  const angle = badgeGravityAngles[gravity];
  const radianAngle = (angle * Math.PI) / 180;

  const rotatedWidth =
    badge.width * Math.abs(Math.cos(radianAngle)) +
    badge.height * Math.abs(Math.sin(radianAngle));
  const rotatedHeight =
    badge.width * Math.abs(Math.sin(radianAngle)) +
    badge.height * Math.abs(Math.cos(radianAngle));

  return {
    angle,
    rotation: badgeRotationDegrees[gravity],
    rotatedHeight,
    rotatedWidth,
  };
}
