import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  CompositeOperator,
  ImageMagick,
  MagickFormat,
  MagickGeometry,
} from '@imagemagick/magick-wasm';

import {
  getBackgroundDrawable,
  getForegroundDrawable,
  getLayerItemDrawables,
} from './adaptiveIconXml';
import { BADGED_FOREGROUND_NAME, OVERLAY_DRAWABLE_NAME } from './processAddAdaptiveBadgeCommand';
import rasterizeVectorDrawable, { rasterizeSvg } from './rasterizeVectorDrawable';

// A launcher scales the 108dp adaptive icon canvas so the centered 72dp area
// fills the icon slot, then applies its mask (previewed here as a circle).
const VISIBLE_RATIO = 72 / 108;

function resolveDrawableXmlFile(resDirectory: string, reference: string | undefined): string {
  if (!reference?.startsWith('@drawable/')) {
    throw new Error(`Unsupported drawable reference "${reference ?? 'none'}" in preview`);
  }

  return join(resDirectory, 'drawable', `${reference.slice('@drawable/'.length)}.xml`);
}

/**
 * Renders a launcher-style preview of the res directory's adaptive icon:
 * background, foreground, and badge overlay composited, cropped to the
 * visible area, and masked to a circle.
 */
export default async function createAdaptivePreviewImage(
  resDirectory: string,
  size: number,
): Promise<Uint8Array> {
  const launcherXml = readFileSync(
    join(resDirectory, 'mipmap-anydpi-v26', 'ic_launcher.xml'),
    'utf-8',
  );

  const foreground = getForegroundDrawable(launcherXml);
  const layers =
    foreground === `@drawable/${BADGED_FOREGROUND_NAME}`
      ? getLayerItemDrawables(
          readFileSync(join(resDirectory, 'drawable', `${BADGED_FOREGROUND_NAME}.xml`), 'utf-8'),
        )
      : [foreground];

  const layerImages: Uint8Array[] = [
    await rasterizeVectorDrawable(
      resolveDrawableXmlFile(resDirectory, getBackgroundDrawable(launcherXml)),
      size,
    ),
  ];

  for (const layer of layers) {
    layerImages.push(
      layer === `@drawable/${OVERLAY_DRAWABLE_NAME}`
        ? readFileSync(join(resDirectory, 'drawable-xxxhdpi', `${OVERLAY_DRAWABLE_NAME}.png`))
        : await rasterizeVectorDrawable(resolveDrawableXmlFile(resDirectory, layer), size),
    );
  }

  const visibleSize = Math.round(size * VISIBLE_RATIO);
  const visibleOffset = Math.round((size - visibleSize) / 2);

  const mask = await rasterizeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${visibleSize.toString()} ${visibleSize.toString()}"><circle cx="${(visibleSize / 2).toString()}" cy="${(visibleSize / 2).toString()}" r="${(visibleSize / 2).toString()}" fill="#ffffff"/></svg>`,
    visibleSize,
  );

  let preview: Uint8Array | undefined;

  ImageMagick.read(layerImages[0], (composite) => {
    for (const layerImage of layerImages.slice(1)) {
      ImageMagick.read(layerImage, (layer) => {
        composite.composite(layer, CompositeOperator.Over);
      });
    }

    composite.crop(new MagickGeometry(visibleOffset, visibleOffset, visibleSize, visibleSize));
    composite.resetPage();

    ImageMagick.read(mask, (maskImage) => {
      composite.composite(maskImage, CompositeOperator.DstIn);
    });

    composite.quality = 80;

    // Strip date based metadata in an attempt at producing the same image
    // from the same input every time.
    composite.attributeNames
      .filter((name) => /date:/iu.test(name))
      .forEach((name) => {
        composite.removeAttribute(name);
      });

    composite.write(MagickFormat.Png, (data) => {
      // Copy the bytes out, the callback data is a view into wasm memory.
      preview = data.slice();
    });
  });

  if (!preview) {
    throw new Error('Failed to render adaptive icon preview');
  }

  return preview;
}
