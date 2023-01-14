import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';

export default async function optimizeImage(input: Uint8Array) {
  const imagePool = new ImagePool(cpus().length);

  const image = imagePool.ingestImage(input);
  const result = await image.encode({
    oxipng: {
      level: 2,
    },
  });
  await imagePool.close();

  return result.oxipng.binary;
}
