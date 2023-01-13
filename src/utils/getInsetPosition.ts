import { IMagickImage } from '@imagemagick/magick-wasm';

const PIXEL_ALPHA_INDEX = 3;

export default function getInsetPosition(
  image: IMagickImage,
  alphaCutoff: number
) {
  // If we make it to the center of the image we can cancel out since the inset
  // is expected to be equal on both sides
  const maxLineX = Math.floor(image.width / 2) - 1;
  const centerLineY = image.height / 2;
  let insetPosition = 0;

  image.getPixels((pixels) => {
    for (let x = 0; x < maxLineX; x++) {
      const pixel = pixels.getPixel(x, centerLineY);
      if (pixel[PIXEL_ALPHA_INDEX] >= alphaCutoff) {
        insetPosition = x;
        break;
      }
    }
  });

  return insetPosition;
}
