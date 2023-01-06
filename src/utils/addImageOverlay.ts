import {
  CompositeOperator,
  Gravity,
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
  MagickGeometry,
  Point,
} from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import getInsetPosition from './getInsetPosition';

export default async function addImageOverlay(
  badgeFile: string,
  inputFile: string,
  outputFile: string,
  opacityCutoff: number,
  compositeType: CompositeOperator
): Promise<void> {
  await initializeImageMagick();

  ImageMagick.read(fs.readFileSync(badgeFile), async (badge) => {
    ImageMagick.read(fs.readFileSync(inputFile), async (image) => {
      const insetPosition = getInsetPosition(image, opacityCutoff);

      badge.resize(
        new MagickGeometry(
          image.width - insetPosition * 2,
          image.height - insetPosition * 2
        )
      );

      image.compositeGravity(
        badge,
        Gravity.Southeast,
        compositeType,
        new Point(insetPosition)
      );

      image.write(
        (data) => fs.writeFileSync(outputFile, data),
        MagickFormat.Png
      );
    });
  });
}
