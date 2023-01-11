import {
  DrawableFillColor,
  DrawableFont,
  DrawableFontPointSize,
  DrawableText,
  IDrawable,
  MagickColors,
  MagickImage,
} from '@imagemagick/magick-wasm';

import TextOptions from '../types/TextOptions';
import getTextOffset from './getTextOffset';

type BoundingBox = {
  width: number;
  height: number;
  offset: number;
};

/**
 * This draws text with the specified options, then trims the image to obtain
 * the text size.
 */
export default function getTextBoundingBox(options: TextOptions): BoundingBox {
  const image = MagickImage.create();
  const offset = getTextOffset(options);

  const drawables: IDrawable[] = [
    new DrawableFont(options.font),
    new DrawableFontPointSize(options.fontPointSize),
    new DrawableFillColor(MagickColors.Black),
    new DrawableText(1, offset + 1, options.text),
  ];

  image.read(MagickColors.Transparent, 256, 256);
  image.draw(drawables);
  image.trim();

  return {
    width: image.width,
    height: image.height,
    offset,
  };
}
