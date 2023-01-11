import {
  DrawableFillColor,
  DrawableFont,
  DrawableFontPointSize,
  DrawableText,
  IDrawable,
  IMagickImage,
} from '@imagemagick/magick-wasm';

import TextOptions from '../types/TextOptions';
import getTextBoundingBox from './getTextBoundingBox';

export default function drawCenteredText(
  image: IMagickImage,
  options: TextOptions
): void {
  const boundingBox = getTextBoundingBox(options);

  const textOffsetX = Math.round((image.width - boundingBox.width) / 2);
  const textOffsetY = Math.round((image.height - boundingBox.height) / 2);

  const drawables: IDrawable[] = [
    new DrawableFont(options.font),
    new DrawableFontPointSize(options.fontPointSize),
    new DrawableFillColor(options.color),
    new DrawableText(
      textOffsetX,
      textOffsetY + boundingBox.offset,
      options.text
    ),
  ];

  image.draw(drawables);
}