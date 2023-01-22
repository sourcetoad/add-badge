import {
  Gravity,
  IMagickImage,
  Point,
  VirtualPixelMethod,
} from '../../../magick-wasm';
import {
  HIGHEST_ANDROID_SHADOW_ALPHA,
  PIXEL_ALPHA_INDEX,
} from './getInsetAtGravity';

export function getCornerPosition(
  image: IMagickImage,
  gravity:
    | Gravity.Northwest
    | Gravity.Northeast
    | Gravity.Southwest
    | Gravity.Southeast,
  alphaCutoff: number = HIGHEST_ANDROID_SHADOW_ALPHA,
): Point {
  // Change the virtual pixel method to transparent before checking the pixels.
  // Without this some older images are reporting areas that are opaque as
  // semi-transparent and causing the wrong inset to be detected.
  const previousMethod = image.virtualPixelMethod;
  image.virtualPixelMethod = VirtualPixelMethod.Transparent;

  const centerPointX = Math.floor(image.width / 2);
  const centerPointY = Math.floor(image.height / 2);
  let point = new Point(0, 0);

  image.getPixels((pixels) => {
    switch (gravity) {
      case Gravity.Northwest:
        for (let x = 0, y = 0; x < centerPointX && y < centerPointY; x++, y++) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            point = new Point(x, y);
            break;
          }
        }
        break;

      case Gravity.Northeast:
        point = new Point(image.width - 1, 0);
        for (
          let x = image.width - 1, y = 0;
          x > centerPointX && y < centerPointY;
          x--, y++
        ) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            point = new Point(x, y);
            break;
          }
        }
        break;

      case Gravity.Southwest:
        point = new Point(0, image.height - 1);
        for (
          let x = 0, y = image.height - 1;
          x < centerPointX && y > centerPointY;
          x++, y--
        ) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            point = new Point(x, y);
            break;
          }
        }
        break;

      case Gravity.Southeast:
        point = new Point(image.width - 1, image.height - 1);
        for (
          let x = image.width - 1, y = image.height - 1;
          x > centerPointX && y > centerPointY;
          x--, y--
        ) {
          const pixel = pixels.getPixel(x, y);
          if (pixel[PIXEL_ALPHA_INDEX] > alphaCutoff) {
            point = new Point(x, y);
            break;
          }
        }
        break;
    }
  });

  image.virtualPixelMethod = previousMethod;

  return point;
}
