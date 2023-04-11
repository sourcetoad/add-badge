import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColor,
  MagickColors,
  MagickImage,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import getInsetAtGravity from './getInsetAtGravity';

interface Rectangle {
  width: number;
  height: number;
}

interface Circle {
  centerX: number;
  centerY: number;
  radius: number;
}

function getRectanglePosition(
  container: Rectangle,
  circle: Circle,
  rectangle: Rectangle,
  gravity: BadgeGravity,
): { x: number; y: number } {
  let angle = 0;
  // Todo: Improve to handle 0 and 180 degree situations.
  switch (gravity) {
    case BadgeGravity.Northwest:
      angle = 135;
      break;
    case BadgeGravity.Southeast:
      angle = -45;
      break;
    case BadgeGravity.Northeast:
      angle = -135;
      break;
    case BadgeGravity.Southwest:
      angle = 45;
      break;
    case BadgeGravity.North:
      angle = 180;
      break;
    case BadgeGravity.South:
      angle = 0;
      break;
  }

  const radianAngle = (angle * Math.PI) / 180;

  const rotatedWidth =
    rectangle.width * Math.abs(Math.cos(radianAngle)) +
    rectangle.height * Math.abs(Math.sin(radianAngle));
  const rotatedHeight =
    rectangle.width * Math.abs(Math.sin(radianAngle)) +
    rectangle.height * Math.abs(Math.cos(radianAngle));

  // rectangleLowerDistanceFromCircleCenter
  const d = Math.sqrt(
    Math.pow(circle.radius, 2) - Math.pow(rectangle.width / 2, 2),
  );

  const trigAngle = ((angle - 90) * Math.PI) / 180;

  const x =
    container.width / 2 -
    (d - rectangle.height / 2) * Math.cos(trigAngle) +
    -rotatedWidth / 2;

  const y =
    container.height / 2 +
    (-d + rectangle.height / 2) * Math.sin(trigAngle) +
    -rotatedHeight / 2;

  return { x, y };
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
  badge.backgroundColor = new MagickColor(255, 0, 0, 50);

  const eastInset = getInsetAtGravity(composite, Gravity.East);

  const offset = getRectanglePosition(
    { width: composite.width, height: composite.height },
    {
      centerX: composite.width / 2,
      centerY: composite.height / 2,
      radius: (composite.width - eastInset * 2) / 2,
    },
    { width: badge.width, height: badge.height },
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
    new Point(offset.x, offset.y),
  );

  return composite;
}
