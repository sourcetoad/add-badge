import { IMagickImage } from '@imagemagick/magick-wasm';

export default function getInsetPosition(
  image: IMagickImage,
  opacityCutoff: number
) {
  const centerLineY = image.height / 2;
  let insetPosition = 0;

  image.getPixels((pixels) => {
    for (let x = 0; x < Math.floor(image.width / 3); x++) {
      const pixel = pixels.getPixel(x, centerLineY);
      if (pixel[3] >= opacityCutoff) {
        insetPosition = x;
        break;
      }
    }
  });

  return insetPosition;
}
