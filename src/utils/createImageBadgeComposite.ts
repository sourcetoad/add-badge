import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColors,
  MagickImage,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';

interface Rectangle {
  height: number;
  width: number;
}

const badgeGravityDegrees: Record<BadgeGravity, number> = {
  [BadgeGravity.Northwest]: 135,
  [BadgeGravity.Southeast]: -45,
  [BadgeGravity.Northeast]: -135,
  [BadgeGravity.Southwest]: 45,
  [BadgeGravity.North]: 180,
  [BadgeGravity.South]: 0,
};

function getRotatedBadgePosition(
  container: Rectangle,
  badge: Rectangle,
  circleRadius: number,
  gravity: BadgeGravity,
) {
  const angle = badgeGravityDegrees[gravity];
  const radianAngle = (angle * Math.PI) / 180;

  const rotatedWidth =
    badge.width * Math.abs(Math.cos(radianAngle)) +
    badge.height * Math.abs(Math.sin(radianAngle));
  const rotatedHeight =
    badge.width * Math.abs(Math.sin(radianAngle)) +
    badge.height * Math.abs(Math.cos(radianAngle));

  // Calculate the distance from the center of the container to the center of
  // the badge.
  const distance = Math.sqrt(
    Math.pow(circleRadius, 2) - Math.pow(badge.width / 2, 2),
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

  return { x, y };
}

export default function createImageBadgeComposite(
  image: IMagickImage,
  badge: IMagickImage,
  gravity: BadgeGravity,
  insetWidth: number,
): IMagickImage {
  const composite = MagickImage.create();
  composite.read(MagickColors.Transparent, image.width, image.height);
  composite.composite(image, CompositeOperator.Over);

  // We need to set a background before rotating, or it may fill it with white.
  badge.backgroundColor = MagickColors.None;

  const position = getRotatedBadgePosition(
    composite,
    badge,
    insetWidth / 2,
    gravity,
  );

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

  composite.compositeGravity(
    badge,
    Gravity.Northwest,
    CompositeOperator.Over,
    new Point(position.x, position.y),
  );

  return composite;
}
