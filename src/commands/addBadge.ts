import { MagickColor } from '@imagemagick/magick-wasm';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import defaultOptions from '../defaultOptions';
import { getBadgeGravityFromString } from '../types/BadgeGravity';
import addBadgeOverlay from '../utils/addBadgeOverlay';
import setBadgeFont from '../utils/setBadgeFont';

async function execute(
  imageFile: string | undefined,
  badgeText: string | undefined,
  outputFile: string | undefined,
  fontFile: string | undefined,
  fontSize: number,
  textColor: string,
  backgroundColor: string,
  shadowColor: string,
  gravity: string,
  dryRun: boolean
) {
  if (!imageFile || !badgeText || !outputFile) {
    throw new Error('Missing parameter');
  }

  if (!fs.existsSync(imageFile)) {
    console.error(`Input file "${imageFile}" not found`);
    return 1;
  }

  if (fontFile && !fs.existsSync(fontFile)) {
    console.error(`Font file "${fontFile}" not found`);
    return 1;
  }

  console.info(`${dryRun ? 'Would process' : 'Processing'} ${imageFile}`);

  if (!dryRun) {
    await setBadgeFont(fontFile ?? './fonts/Roboto-Black.ttf');

    const badgeOptions = {
      text: {
        text: badgeText,
        font: 'BadgeFont',
        fontPointSize: fontSize,
        color: new MagickColor(textColor),
      },
      backgroundColor: new MagickColor(backgroundColor),
      shadowColor: new MagickColor(shadowColor),
    };

    await addBadgeOverlay(
      imageFile,
      outputFile,
      badgeOptions,
      getBadgeGravityFromString(gravity)
    );
  }

  return 0;
}

yargs(hideBin(process.argv))
  .command(
    '* <input-image> <badge-text> <output-image>',
    'Add a badge to an image',
    (yargs) =>
      yargs
        .positional('input-image', {
          describe: 'input image file',
          type: 'string',
        })
        .positional('badge-text', {
          describe: 'badge text',
          type: 'string',
        })
        .positional('output-image', {
          describe: 'output file',
          type: 'string',
        })
        .option('font-file', {
          description: 'The font file to use',
          type: 'string',
        })
        .option('font-size', {
          default: defaultOptions.fontSize,
          description: 'The font size',
          type: 'number',
        })
        .option('text-color', {
          default: defaultOptions.textColor,
          description: 'The text color',
          type: 'string',
        })
        .option('background-color', {
          default: defaultOptions.backgroundColor,
          description: 'The background color',
          type: 'string',
        })
        .option('shadow-color', {
          default: defaultOptions.shadowColor,
          description: 'The shadow color',
          type: 'string',
        })
        .option('gravity', {
          default: defaultOptions.gravity,
          description: 'Where on the icon to render the badge',
          type: 'string',
        })
        .option('dry-run', {
          alias: 'd',
          description: 'Does not perform actions',
          default: false,
          type: 'boolean',
        })
        .version(process.env.APP_VERSION ?? 'Unknown'),
    async (argv) => {
      try {
        const exitCode = await execute(
          argv.inputImage,
          argv.badgeText,
          argv.outputImage,
          argv.fontFile,
          argv.fontSize,
          argv.textColor,
          argv.backgroundColor,
          argv.shadowColor,
          argv.gravity,
          argv.dryRun
        );
        process.exit(exitCode);
      } catch (error) {
        console.error(
          `Caught error: ${error instanceof Error ? error.message : error}`
        );
        process.exit(1);
      }
    }
  )
  .parse();
