import { ImagePool } from '@squoosh/lib';

export default async function optimizeImage(input: Uint8Array) {
  const imagePool = new ImagePool(1);

  const image = imagePool.ingestImage(input);
  const result = await image.encode({
    oxipng: {
      level: 2,
    },
  });
  await imagePool.close();

  return result.oxipng.binary;
}
