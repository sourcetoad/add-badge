import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { MagickColor, MagickFormat } from '@imagemagick/magick-wasm';

import defaultOptions from '../defaultOptions';
import AddBadgeArguments from '../types/AddBadgeArguments';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import {
  createBadgedForegroundXml,
  getForegroundDrawable,
  getLayerItemDrawables,
  setForegroundDrawable,
} from './adaptiveIconXml';
import createBadgeOverlayImage from './createBadgeOverlayImage';
import initializeImageMagick from './initializeImageMagick';
import parseManualPosition from './parseManualPosition';
import setBadgeFont, { BADGE_FONT_NAME } from './setBadgeFont';

export const OVERLAY_DRAWABLE_NAME = 'ic_badge_overlay';
export const BADGED_FOREGROUND_NAME = 'ic_launcher_foreground_badged';

const LAUNCHER_FILES = ['ic_launcher.xml', 'ic_launcher_round.xml'];

// The adaptive icon foreground canvas is 108dp, rendered per density bucket.
const DENSITY_SIZES: Record<string, number> = {
  hdpi: 162,
  mdpi: 108,
  xhdpi: 216,
  xxhdpi: 324,
  xxxhdpi: 432,
};

function getOriginalForeground(resDirectory: string, launcherXml: string): string | undefined {
  const foreground = getForegroundDrawable(launcherXml);
  if (foreground !== `@drawable/${BADGED_FOREGROUND_NAME}`) {
    return foreground;
  }

  // Already badged, recover the original foreground from the layer list so
  // re-running does not stack badges.
  const layerListFile = join(resDirectory, 'drawable', `${BADGED_FOREGROUND_NAME}.xml`);
  if (!existsSync(layerListFile)) {
    return undefined;
  }

  return getLayerItemDrawables(readFileSync(layerListFile, 'utf-8'))[0];
}

export default async function processAddAdaptiveBadgeCommand({
  backgroundColor,
  dryRun,
  fontFile,
  fontSize,
  gravity,
  input,
  position,
  shadowColor,
  text,
  textColor,
}: AddBadgeArguments) {
  if (!input || !text) {
    throw new Error('Missing parameter');
  }

  const launcherFiles = LAUNCHER_FILES.map((file) => join(input, 'mipmap-anydpi-v26', file)).filter(
    existsSync,
  );
  if (!launcherFiles.length) {
    console.error(`No adaptive icons found in "${join(input, 'mipmap-anydpi-v26')}"`);
    return 1;
  }

  if (fontFile && !existsSync(fontFile)) {
    console.error(`Font file "${fontFile}" not found`);
    return 1;
  }

  const foregrounds = new Set<string>();
  for (const launcherFile of launcherFiles) {
    const launcherForeground = getOriginalForeground(input, readFileSync(launcherFile, 'utf-8'));
    if (launcherForeground === undefined) {
      console.error(
        `Unable to determine the foreground drawable in "${launcherFile}", expected <foreground android:drawable="..." /> (inline child drawables are not supported)`,
      );
      return 1;
    }

    foregrounds.add(launcherForeground);
  }

  const [foreground] = foregrounds;
  if (foregrounds.size !== 1 || foreground === undefined) {
    console.error(
      `Expected each launcher file to reference the same foreground drawable, found: ${[...foregrounds].join(', ')}`,
    );
    return 1;
  }

  if (dryRun) {
    console.info(`Would process "${input}" with foreground "${foreground}".`);
    return 0;
  }

  console.info(`Processing "${input}" with foreground "${foreground}".`);

  await initializeImageMagick();

  setBadgeFont(fontFile ?? resolve(__dirname, defaultOptions.fontFile));

  for (const [density, size] of Object.entries(DENSITY_SIZES)) {
    const overlay = createBadgeOverlayImage(
      size,
      {
        backgroundColor: new MagickColor(backgroundColor),
        paddingX: defaultOptions.paddingX,
        paddingY: defaultOptions.paddingY,
        shadowColor: new MagickColor(shadowColor),
        shadowSize: defaultOptions.shadowSize,
      },
      {
        color: new MagickColor(textColor),
        font: BADGE_FONT_NAME,
        fontPointSize: fontSize,
        text: text.replace(/\\n/gu, '\n'),
      },
      getBadgeGravityFromString(gravity),
      parseManualPosition(position),
    );

    overlay.quality = 80;

    // Strip date based metadata in an attempt at producing the same image
    // from the same input every time.
    overlay.attributeNames
      .filter((name) => /date:/iu.test(name))
      .forEach((name) => {
        overlay.removeAttribute(name);
      });

    const overlayDirectory = join(input, `drawable-${density}`);
    mkdirSync(overlayDirectory, { recursive: true });

    overlay.write(MagickFormat.Png, (data) => {
      writeFileSync(join(overlayDirectory, `${OVERLAY_DRAWABLE_NAME}.png`), data);
    });
  }

  writeFileSync(
    join(input, 'drawable', `${BADGED_FOREGROUND_NAME}.xml`),
    createBadgedForegroundXml(foreground, `@drawable/${OVERLAY_DRAWABLE_NAME}`),
  );

  for (const launcherFile of launcherFiles) {
    writeFileSync(
      launcherFile,
      setForegroundDrawable(
        readFileSync(launcherFile, 'utf-8'),
        `@drawable/${BADGED_FOREGROUND_NAME}`,
      ),
    );
  }

  return 0;
}
