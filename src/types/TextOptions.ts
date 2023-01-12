import { MagickColor } from '@imagemagick/magick-wasm';

interface TextOptions {
  text: string;
  font: string;
  fontPointSize: number;
  color: MagickColor;
}

export default TextOptions;
