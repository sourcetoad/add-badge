import { MagickColor } from '@imagemagick/magick-wasm';

type TextOptions = {
  text: string;
  font: string;
  fontPointSize: number;
  color: MagickColor;
};

export default TextOptions;
