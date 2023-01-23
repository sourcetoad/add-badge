import {
  CompositeOperator,
  Gravity,
  IMagickImage,
  MagickColor,
  MagickColors,
  MagickImage,
} from '@imagemagick/magick-wasm';

export default function addShadow(
  image: IMagickImage,
  shadowColor: MagickColor,
  blurRadius: number,
  blurSigma: number,
): IMagickImage {
  const imageWithShadow = MagickImage.create();

  // Create an empty canvas
  imageWithShadow.read(
    MagickColors.Transparent,
    image.width + blurRadius * 2,
    image.height + blurRadius * 2,
  );

  // Draw the image on to the canvas temporarily
  imageWithShadow.compositeGravity(
    image,
    Gravity.Center,
    CompositeOperator.Over,
  );

  // Create a new canvas the same size using the shadow color
  const shadowOverlay = MagickImage.create();
  shadowOverlay.read(
    shadowColor,
    imageWithShadow.width,
    imageWithShadow.height,
  );

  // Replace any non-transparent pixels with the shadow color
  imageWithShadow.compositeGravity(
    shadowOverlay,
    Gravity.Center,
    CompositeOperator.In,
  );

  // Blur the shadow color
  imageWithShadow.blur(blurRadius, blurSigma);

  // Add the image on top of the shadow
  imageWithShadow.compositeGravity(
    image,
    Gravity.Center,
    CompositeOperator.Over,
  );

  return imageWithShadow;
}
