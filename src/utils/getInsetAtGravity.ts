import {
  Gravity,
  IMagickImage,
  VirtualPixelMethod,
} from '@imagemagick/magick-wasm';

const PIXEL_ALPHA_INDEX = 3;
export const HIGHEST_ANDROID_SHADOW_ALPHA = 52;

export default function getInsetAtGravity(
  image: IMagickImage,
  gravity: Gravity,
  alphaCutoff: number,
  axisOffset?: number,
): number {
  // Change the virtual pixel method to transparent before checking the pixels.
  // Without this some older images are reporting areas that are opaque as
  // semi-transparent and causing the wrong inset to be detected.
  const previousMethod = image.virtualPixelMethod;
  image.virtualPixelMethod = VirtualPixelMethod.Transparent;

  let insetPosition = 0;
  const centerPointX = Math.floor(image.width / 2);
  const centerPointY = Math.floor(image.height / 2);

  image.getPixels((pixels) => {
    switch (gravity) {
      case Gravity.Northwest:
        for (let x = 0, y = 0; x < centerPointX && y < centerPointY; x++, y++) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = Math.round(Math.hypot(x, y));
            break;
          }
        }
        break;

      case Gravity.North:
        for (let y = 0; y < centerPointY; y++) {
          const pixel = pixels.getPixel(centerPointX + (axisOffset ?? 0), y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = y;
            break;
          }
        }
        break;

      case Gravity.Northeast:
        for (
          let x = image.width - 1, y = 0;
          x > centerPointX && y < centerPointY;
          x--, y++
        ) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = Math.round(Math.hypot(image.width - 1 - x, y));
            break;
          }
        }
        break;

      case Gravity.West:
        for (let x = image.width - 1; x > centerPointX; x--) {
          const pixel = pixels.getPixel(x, centerPointY + (axisOffset ?? 0));
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = image.width - 1 - x;
            break;
          }
        }
        break;

      case Gravity.East:
        for (let x = 0; x < centerPointX; x++) {
          const pixel = pixels.getPixel(x, centerPointY + (axisOffset ?? 0));
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = x;
            break;
          }
        }
        break;

      case Gravity.Southwest:
        for (
          let x = 0, y = image.height - 1;
          x < centerPointX && y > centerPointY;
          x++, y--
        ) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = Math.round(Math.hypot(x, image.height - 1 - y));
            break;
          }
        }
        break;

      case Gravity.South:
        for (let y = image.height - 1; y > centerPointY; y--) {
          const pixel = pixels.getPixel(centerPointX + (axisOffset ?? 0), y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = image.height - 1 - y;
            break;
          }
        }
        break;

      case Gravity.Southeast:
        for (
          let x = image.width - 1, y = image.height - 1;
          x > centerPointX && y > centerPointY;
          x--, y--
        ) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            insetPosition = Math.round(
              Math.hypot(image.width - 1 - x, image.height - 1 - y),
            );
            break;
          }
        }
        break;
    }
  });

  image.virtualPixelMethod = previousMethod;

  return insetPosition;
}
