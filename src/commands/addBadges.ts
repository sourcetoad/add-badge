import { CompositeOperator } from '@imagemagick/magick-wasm';
import * as fg from 'fast-glob';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import addImageOverlay from '../utils/addImageOverlay';

async function execute(
  inputGlob: string | undefined,
  badgeFile: string | undefined,
  opacityThreshold: number,
  dryRun: boolean
) {
  if (!inputGlob || !badgeFile) {
    throw new Error('Missing parameter');
  }

  if (!fs.existsSync(badgeFile)) {
    console.error(`Badge file "${badgeFile}" not found`);
    return 1;
  }

  const inputFiles = fg.sync(inputGlob).filter((file) => /\.png$/i.test(file));
  if (!inputFiles.length) {
    console.error(`No input PNG files found using glob "${inputGlob}"`);
    return 1;
  }

  for (const inputFile of inputFiles) {
    console.info(`${dryRun ? 'Would process' : 'Processing'} ${inputFile}`);

    if (!dryRun) {
      await addImageOverlay(
        badgeFile,
        inputFile,
        inputFile,
        opacityThreshold,
        CompositeOperator.Atop
      );
    }
  }

  return 0;
}

yargs(hideBin(process.argv))
  .command(
    '* <input-glob> <badge-image>',
    'Add a badge to a set of images, in-place',
    (yargs) =>
      yargs
        .positional('input-glob', {
          describe: 'the glob path to search',
          type: 'string',
        })
        .positional('badge-image', {
          describe: 'badge image file',
          type: 'string',
        })
        .option('opacity-threshold', {
          alias: 'o',
          default: 29,
          description: 'The opacity level required for the inset comparison',
          type: 'number',
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
        const exitCode = await execute(
          argv.inputGlob,
          argv.badgeImage,
          argv.opacityThreshold,
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
