import { MagickColor } from '@imagemagick/magick-wasm';

import roundToEven from '../utils/roundToEven';

interface TextOptions {
  color: MagickColor;
  font: string;
  fontPointSize: number;
  text: string;
}

export function scaleTextOptions(
  options: TextOptions,
  scale: number,
): TextOptions {
  return {
    ...options,
    fontPointSize: roundToEven(options.fontPointSize * scale),
  };
}

export default TextOptions;
