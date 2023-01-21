import { MagickColor } from '@imagemagick/magick-wasm';

interface TextOptions {
  color: MagickColor;
  font: string;
  fontPointSize: number;
  text: string;
}

export default TextOptions;
