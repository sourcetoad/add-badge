import { MagickColor } from '@imagemagick/magick-wasm';
import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import defaultOptions from '../defaultOptions';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import CommonArguments from '../types/CommonArguments';
import addBadgeOverlay from '../utils/addBadgeOverlay';
import setBadgeFont from '../utils/setBadgeFont';

interface Arguments extends CommonArguments {
  inputImage: string;
  outputImage: string;
}

async function execute({
  backgroundColor,
  badgeText,
  dryRun,
  fontFile,
  fontSize,
  gravity,
  inputImage,
  outputImage,
  paddingX,
  paddingY,
  shadowColor,
  textColor,
}: Arguments) {
  if (!inputImage || !badgeText || !outputImage) {
    console.log(inputImage, badgeText, outputImage);
    throw new Error('Missing parameter');
  }

  if (!fs.existsSync(inputImage)) {
    console.error(`Input file "${inputImage}" not found`);
    return 1;
  }

  if (fontFile && !fs.existsSync(fontFile)) {
    console.error(`Font file "${fontFile}" not found`);
    return 1;
  }

  console.info(`${dryRun ? 'Would process' : 'Processing'} ${inputImage}`);

  if (!dryRun) {
    await setBadgeFont(
      fontFile ?? path.resolve(__dirname, defaultOptions.fontFile),
    );

    await addBadgeOverlay(
      inputImage,
      outputImage,
      {
        backgroundColor: new MagickColor(backgroundColor),
        paddingX,
        paddingY,
        shadowColor: new MagickColor(shadowColor),
      },
      {
        color: new MagickColor(textColor),
        font: 'BadgeFont',
        fontPointSize: fontSize,
        text: badgeText.replace(/\\n/g, '\n'),
      },
      getBadgeGravityFromString(gravity),
    );
  }

  return 0;
}

void yargs(hideBin(process.argv))
  .command<Arguments>(
    '* <input-image> <output-image> <badge-text>',
    'Add a badge to an image',
    (yargs) =>
      yargs
        .positional('input-image', {
          describe: 'input image file',
          type: 'string',
        })
        .positional('output-image', {
          describe: 'output file',
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
