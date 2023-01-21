import { MagickColor } from '@imagemagick/magick-wasm';
import * as fg from 'fast-glob';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import defaultOptions from '../defaultOptions';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import addBadgeOverlay from '../utils/addBadgeOverlay';
import setBadgeFont from '../utils/setBadgeFont';

interface Arguments {
  backgroundColor: string;
  badgeText: string;
  dryRun: boolean;
  fontFile: string | undefined;
  fontSize: number;
  gravity: string;
  inputGlob: string;
  paddingX: number;
  paddingY: number;
  shadowColor: string;
  textColor: string;
}

async function execute({
  backgroundColor,
  badgeText,
  dryRun,
  fontFile,
  fontSize,
  gravity,
  inputGlob,
  paddingX,
  paddingY,
  shadowColor,
  textColor,
}: Arguments) {
  if (!inputGlob || !badgeText) {
    throw new Error('Missing parameter');
  }

  const inputFiles = fg.sync(inputGlob).filter((file) => /\.png$/i.test(file));
  if (!inputFiles.length) {
    console.error(`No input PNG files found using glob "${inputGlob}"`);
    return 1;
  }

  if (!dryRun) {
    await setBadgeFont(
      fontFile ?? path.resolve(__dirname, defaultOptions.fontFile),
    );
  }

  for (const inputFile of inputFiles) {
    console.info(`${dryRun ? 'Would process' : 'Processing'} ${inputFile}`);

    if (!dryRun) {
      await addBadgeOverlay(
        inputFile,
        inputFile,
        {
          backgroundColor: new MagickColor(backgroundColor),
          paddingX,
          paddingY,
          shadowColor: new MagickColor(shadowColor),
        },
        {
          text: badgeText,
          font: 'BadgeFont',
          fontPointSize: fontSize,
          color: new MagickColor(textColor),
        },
        getBadgeGravityFromString(gravity),
      );
    }
  }

  return 0;
}

void yargs(hideBin(process.argv))
  .command<Arguments>(
    '* <input-glob> <badge-text>',
    'Add a badge to a set of images, in-place',
    (yargs) =>
      yargs
        .positional('input-glob', {
          describe: 'the glob path to search',
          type: 'string',
        })
        .positional('badge-text', {
          describe: 'badge text',
          type: 'string',
        })
        .option('font-file', {
          description: 'Text font file',
          type: 'string',
        })
        .option('font-size', {
          default: defaultOptions.fontSize,
          description: 'Text size',
          type: 'number',
        })
        .option('text-color', {
          default: defaultOptions.textColor,
          description: 'Text color',
          type: 'string',
        })
        .option('background-color', {
          default: defaultOptions.backgroundColor,
          description: 'Badge background color',
          type: 'string',
        })
        .option('padding-x', {
          default: defaultOptions.paddingX,
          description: 'Badge padding X (left and right)',
          type: 'number',
        })
        .option('padding-y', {
          default: defaultOptions.paddingY,
          description: 'Badge padding Y (top and bottom)',
          type: 'number',
        })
        .option('shadow-color', {
          default: defaultOptions.shadowColor,
          description: 'Badge shadow color',
          type: 'string',
        })
        .option('gravity', {
          default: defaultOptions.gravity,
          description: 'Badge gravity',
          type: 'string',
        })
        .option('dry-run', {
          alias: 'd',
          default: false,
          description: 'Does not perform actions',
          type: 'boolean',
        })
        .version(process.env.APP_VERSION ?? 'Unknown'),
    async (argv) => {
      try {
        const exitCode = await execute(argv);
        process.exit(exitCode);
      } catch (error) {
        console.error(
          `Caught error: ${
            error instanceof Error ? error.message : (error as string)
          }`,
        );
        process.exit(1);
      }
    },
  )
  .parse();
