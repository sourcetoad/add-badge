import { IMagickImage, MagickColors, MagickImage } from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions, { scaleBadgeOptions } from '../types/BadgeOptions';
import ManualPosition from '../types/ManualPosition';
import TextOptions, { scaleTextOptions } from '../types/TextOptions';
import addShadow from './addShadow';
import createBadgeImage from './createBadgeImage';
import createImageBadgeComposite from './createImageBadgeComposite';

// An adaptive icon foreground is a 108dp canvas of which only a centered
// 66dp circle is guaranteed to be visible under every launcher mask.
const SAFE_ZONE_RATIO = 66 / 108;

/**
 * Renders the badge onto a transparent square canvas, positioned within the
 * adaptive icon safe zone.
 */
export default function createBadgeOverlayImage(
  size: number,
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  badgeGravity: BadgeGravity,
  position: ManualPosition | undefined,
): IMagickImage {
  const safeZoneWidth = size * SAFE_ZONE_RATIO;

  // The default sizes are based on usage in 192px icons, anything above or
  // below that will be scaled relative to it.
  const badgeScale = safeZoneWidth / 192;

  const scaledBadgeOptions = scaleBadgeOptions(badgeOptions, badgeScale);
  const scaledTextOptions = scaleTextOptions(textOptions, badgeScale);

  const badge = createBadgeImage(
    scaledBadgeOptions,
    scaledTextOptions,
    safeZoneWidth,
    safeZoneWidth,
  );
  const badgeWithShadow = addShadow(
    badge,
    scaledBadgeOptions.shadowColor,
    scaledBadgeOptions.shadowSize,
    Math.max(1, scaledBadgeOptions.shadowSize * 0.75 * badgeScale),
  );

  const canvas = MagickImage.create();
  canvas.read(MagickColors.Transparent, size, size);

  return createImageBadgeComposite(canvas, badgeWithShadow, badgeGravity, safeZoneWidth, position);
}
