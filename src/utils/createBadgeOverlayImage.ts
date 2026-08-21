import { IMagickImage, MagickColors, MagickImage } from '@imagemagick/magick-wasm';

import BadgeGravity from '../types/BadgeGravity';
import BadgeOptions, { scaleBadgeOptions } from '../types/BadgeOptions';
import ManualPosition from '../types/ManualPosition';
import TextOptions, { scaleTextOptions } from '../types/TextOptions';
import addShadow from './addShadow';
import createBadgeImage from './createBadgeImage';
import createImageBadgeComposite from './createImageBadgeComposite';

// A launcher scales the 108dp adaptive icon canvas so the centered 72dp area
// fills the icon slot before masking. The circle mask is the tightest of the
// standard masks, so a badge tangent to the inscribed circle of this area
// stays visible on every common launcher.
export const ADAPTIVE_VISIBLE_RATIO = 72 / 108;

/**
 * Renders the badge onto a transparent square canvas, sized and positioned
 * relative to the visible area of the adaptive icon.
 */
export default function createBadgeOverlayImage(
  size: number,
  badgeOptions: BadgeOptions,
  textOptions: TextOptions,
  badgeGravity: BadgeGravity,
  position: ManualPosition | undefined,
): IMagickImage {
  const visibleWidth = size * ADAPTIVE_VISIBLE_RATIO;

  // The default sizes are based on usage in 192px icons, anything above or
  // below that will be scaled relative to it.
  const badgeScale = visibleWidth / 192;

  const scaledBadgeOptions = scaleBadgeOptions(badgeOptions, badgeScale);
  const scaledTextOptions = scaleTextOptions(textOptions, badgeScale);

  const badge = createBadgeImage(scaledBadgeOptions, scaledTextOptions, visibleWidth, visibleWidth);
  const badgeWithShadow = addShadow(
    badge,
    scaledBadgeOptions.shadowColor,
    scaledBadgeOptions.shadowSize,
    Math.max(1, scaledBadgeOptions.shadowSize * 0.75 * badgeScale),
  );

  const canvas = MagickImage.create();
  canvas.read(MagickColors.Transparent, size, size);

  return createImageBadgeComposite(
    canvas,
    badgeWithShadow,
    badgeGravity,
    visibleWidth,
    position,
    (size - visibleWidth) / 2,
  );
}
