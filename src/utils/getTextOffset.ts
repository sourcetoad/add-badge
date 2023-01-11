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

/**
 * This draws the text starting at Y position 1, moving up until the entire
 * string is visible. Once it is visible we know the offset we need to properly
 * center our renders.
 */
export default function getTextOffset(options: TextOptions): number {
  const drawables: IDrawable[] = [
    new DrawableFont(options.font),
    new DrawableFontPointSize(options.fontPointSize),
    new DrawableFillColor(MagickColors.Black),
  ];
  let currentOffset = 1;
  let lastFoundHeight = 0;

  const image = MagickImage.create();

  while (currentOffset < 256) {
    image.read(MagickColors.Transparent, 256, 256);
    image.draw([
      ...drawables,
      new DrawableText(1, currentOffset, options.text),
    ]);
    image.trim();

    if (lastFoundHeight === image.height) {
      return currentOffset - 1;
    }

    lastFoundHeight = image.height;
    currentOffset++;
  }

  throw new Error('Unable to determine font height offset');
}
