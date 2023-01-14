import {
  CompositeOperator,
  IMagickImage,
  MagickColors,
  Point,
} from '@imagemagick/magick-wasm';

import BadgeGravity, {
  getGravityFromBadgeGravity,
} from '../types/BadgeGravity';
import BadgeOptions from '../types/BadgeOptions';
import createBadgeImage from './createBadgeImage';
import getInsetPosition from './getInsetPosition';
import getRotatedBadgeWidth from './getRotatedBadgeWidth';

export default function combineBadgeAndImage(
  image: IMagickImage,
  badgeOptions: BadgeOptions,
  gravity: BadgeGravity,
  opacityCutoff: number
): void {
  const insetPosition = getInsetPosition(image, opacityCutoff);
  const rotatedBadgeWidth =
    // We need to increase the badge width so we can overlap the side by enough
    // to cover the corner including shadow
    // TODO Figure out a better way to calculate this that doesn't involve a
    //      magic percent
    1.5 * getRotatedBadgeWidth(image.width, image.height, insetPosition);

  const badge = createBadgeImage(badgeOptions, rotatedBadgeWidth);

  // badge.getPixels((pixels) => {
  //   pixels.setPixel(0, Math.round(badge.height / 2), [0, 255, 255, 255]);
  //   pixels.setPixel(
  //     badge.width - 1,
  //     Math.round(badge.height / 2),
  //     [0, 255, 255, 255]
  //   );
  // });

  const rotatedBadgeHeight = Math.round(
    rotatedBadgeWidth * (badge.height / badge.width)
  );

  badge.resize(rotatedBadgeWidth, rotatedBadgeHeight);

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

  image.compositeGravity(
    badge,
    getGravityFromBadgeGravity(gravity),
    CompositeOperator.Atop,
    // TODO Figure out a better way to calculate this that doesn't involve a
    //      magic percent
    new Point(insetPosition - Math.round(rotatedBadgeHeight * 0.75))
  );

  // image.getPixels((pixels) => {
  //   pixels.setPixel(
  //     Math.round(image.width / 2),
  //     insetPosition,
  //     [255, 0, 255, 255]
  //   );
  //   pixels.setPixel(
  //     insetPosition,
  //     Math.round(image.height / 2),
  //     [255, 0, 255, 255]
  //   );
  // });
}
