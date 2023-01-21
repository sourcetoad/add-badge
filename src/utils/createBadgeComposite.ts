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
import TextOptions from '../types/TextOptions';
import createBadgeImage from './createBadgeImage';
import getInsetPosition from './getInsetPosition';
import getRotatedBadgeWidth from './getRotatedBadgeWidth';

export default function createBadgeComposite(
  image: IMagickImage,
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  gravity: BadgeGravity,
  alphaCutoff: number,
): void {
  const insetPosition = getInsetPosition(image, alphaCutoff);

  // Obtain distance between the middle X and Y position at the inset to use as
  // the rotated badge width
  const rotatedBadgeWidth = getRotatedBadgeWidth(
    image.width,
    image.height,
    insetPosition,
  );

  // Increase the badge width so we overlap the side by enough to cover the
  // corner and shadow
  // TODO Figure out a way to calculate this that doesn't involve a magic number
  const updatedBadgeWidth = 1.5 * rotatedBadgeWidth;

  const badge = createBadgeImage(badgeOptions, textOptions, updatedBadgeWidth);

  // badge.getPixels((pixels) => {
  //   pixels.setPixel(0, Math.round(badge.height / 2), [0, 255, 255, 255]);
  //   pixels.setPixel(
  //     badge.width - 1,
  //     Math.round(badge.height / 2),
  //     [0, 255, 255, 255]
  //   );
  // });

  const rotatedBadgeHeight = Math.round(
    updatedBadgeWidth * (badge.height / badge.width),
  );

  badge.resize(updatedBadgeWidth, rotatedBadgeHeight);

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

  // We need to adjust the inset position we're rendering at by the badge height
  // badge height so the sides are within the inset
  // TODO Figure out a way to calculate this that doesn't involve a magic number
  const badgeInsetOffset = Math.round(rotatedBadgeHeight * 0.75);

  image.compositeGravity(
    badge,
    getGravityFromBadgeGravity(gravity),
    CompositeOperator.Atop,
    new Point(insetPosition - badgeInsetOffset),
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
