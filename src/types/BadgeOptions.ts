import { MagickColor } from '@imagemagick/magick-wasm';

import roundToEven from '../utils/roundToEven';

interface BadgeOptions {
  backgroundColor: MagickColor;
  paddingX: number;
  paddingY: number;
  shadowColor: MagickColor;
  shadowSize: number;
}

export function scaleBadgeOptions(
  options: BadgeOptions,
  scale: number,
): BadgeOptions {
  return {
    ...options,
    paddingX: roundToEven(options.paddingX * scale),
    paddingY: roundToEven(options.paddingY * scale),
    shadowSize: Math.max(1, options.shadowSize * scale),
  };
}

export default BadgeOptions;
