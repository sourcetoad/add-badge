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

interface BoundingBox {
  width: number;
  height: number;
  offset: number;
}

/**
 * This draws the text starting at Y position 1, moving up until the entire
 * string is visible. Once it is fully visible we know the offset we need to
 * properly center our renders as well as the bounding box of the text.
 */
export default function getTextBoundingBox(
  options: TextOptions,
  maxWidth = 130,
  maxHeight = 30
): BoundingBox {
  const drawables: IDrawable[] = [
    new DrawableFont(options.font),
    new DrawableFontPointSize(options.fontPointSize),
    new DrawableFillColor(MagickColors.Black),
  ];
  let currentOffset = 1;
  let lastFoundHeight = 0;

  const image = MagickImage.create();

  while (currentOffset < 256) {
    image.read(MagickColors.Transparent, maxWidth, maxHeight);
    image.draw([
      ...drawables,
      new DrawableText(1, currentOffset, options.text),
    ]);
    image.trim();

    if (lastFoundHeight === image.height) {
      return {
        width: image.width,
        height: image.height,
        offset: currentOffset,
      };
    }

    lastFoundHeight = image.height;
    currentOffset++;
  }

  throw new Error('Unable to determine font bounding box');
}
