import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { MagickColor } from '@imagemagick/magick-wasm';
import { sync as globSync } from 'fast-glob';

import defaultOptions from '../defaultOptions';
import AddBadgeArguments from '../types/AddBadgeArguments';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import addBadgeOverlay from './addBadgeOverlay';
import initializeImageMagick from './initializeImageMagick';
import parseManualPosition from './parseManualPosition';
import processAddAdaptiveBadgeCommand from './processAddAdaptiveBadgeCommand';
import setBadgeFont, { BADGE_FONT_NAME } from './setBadgeFont';

export default async function processAddBadgeCommand(args: AddBadgeArguments) {
  const {
    backgroundColor,
    dryRun,
    fontFile,
    fontSize,
    gravity,
    input,
    mode,
    output,
    position,
    shadowColor,
    text,
    textColor,
  } = args;

  if (!input || !text) {
    throw new Error('Missing parameter');
  }

  if (mode === 'android-adaptive') {
    if (output !== undefined) {
      console.error('Option --output is not supported in android-adaptive mode');
      return 1;
    }

    return processAddAdaptiveBadgeCommand(args);
  }

  // A literal path is used as-is so paths that are not valid globs (such as
  // ones with Windows separators) keep working.
  const inputFiles = existsSync(input) ? [input] : globSync(input);
  if (!inputFiles.length) {
    console.error(`No input files found using "${input}"`);
    return 1;
  }

  if (output !== undefined && inputFiles.length > 1) {
    console.error(
      `Option --output requires the input to match a single file, "${input}" matched ${inputFiles.length.toString()}`,
    );
    return 1;
  }

  if (fontFile && !existsSync(fontFile)) {
    console.error(`Font file "${fontFile}" not found`);
    return 1;
  }

  if (!dryRun) {
    await initializeImageMagick();

    setBadgeFont(fontFile ?? resolve(__dirname, defaultOptions.fontFile));
  }

  for (const inputFile of inputFiles) {
    const outputFile = output ?? inputFile;

    console.info(
      `${dryRun ? 'Would process' : 'Processing'} ${
        outputFile === inputFile ? `"${inputFile}" in place` : `"${inputFile}" to "${outputFile}"`
      }.`,
    );

    if (!dryRun) {
      addBadgeOverlay(
        inputFile,
        outputFile,
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
    }
  }

  return 0;
}
