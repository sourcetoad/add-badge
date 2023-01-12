import { IMagickImage } from '@imagemagick/magick-wasm';

export default function removeDateMetadata(image: IMagickImage): void {
  image.attributeNames
    .filter((name) => /date:/i.test(name))
    .forEach((name) => image.removeAttribute(name));
}
