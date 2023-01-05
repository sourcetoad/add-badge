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

async function execute(argv: string[]): Promise<number> {
  const [imageFile, badgeFile, outputFile] = argv;

  if (!imageFile || !badgeFile || !outputFile) {
    console.log(
      'usage: add-badge <input-image-file> <badge-image-file> <output-file>'
    );
    return 1;
  }

  if (!fs.existsSync(imageFile)) {
    console.log(`Image file "${imageFile}" not found`);
    return 1;
  }

  if (!fs.existsSync(badgeFile)) {
    console.log(`Badge file "${badgeFile}" not found`);
    return 1;
  }

  // `Over` for overlay, `Atop` overlays while maintaining transparency.
  const compositeType = CompositeOperator.Atop;

  // Opacity must be above this to be considered not transparent. Without this
  // the inset will always be 0 on the circular icon due to the shadow.
  const opacityCutoff = 29;

  await initializeImageMagick();

  ImageMagick.read(fs.readFileSync(badgeFile), async (badge) => {
    ImageMagick.read(fs.readFileSync(imageFile), async (image) => {
      image.getPixels((pixels) => {
        const centerLineY = image.height / 2;
        let insetPosition = 0;

        for (let x = 0; x < Math.floor(image.width / 3); x++) {
          const pixel = pixels.getPixel(x, centerLineY);
          if (pixel[3] >= opacityCutoff) {
            insetPosition = x;
            break;
          }
        }

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
  });

  return 0;
}

execute(process.argv.slice(2)).then((exitCode) => process.exit(exitCode));
