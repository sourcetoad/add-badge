import { MagickColor } from '@imagemagick/magick-wasm';

import TextOptions from './TextOptions';

interface BadgeOptions {
  backgroundColor: MagickColor;
  shadowColor: MagickColor;
  text: TextOptions;
}

export default BadgeOptions;
