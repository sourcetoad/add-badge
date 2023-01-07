import { CompositeOperator } from '@imagemagick/magick-wasm';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import addImageOverlay from '../utils/addImageOverlay';
import { getCompositeOperator } from '../utils/getCompositeOperator';

async function execute(
  imageFile: string | undefined,
  badgeFile: string | undefined,
  outputFile: string | undefined,
  compositeOperator: CompositeOperator,
  opacityThreshold: number,
  dryRun: boolean
) {
  if (!imageFile || !badgeFile || !outputFile) {
    throw new Error('Missing parameter');
  }

  if (!fs.existsSync(imageFile)) {
    console.error(`Input file "${imageFile}" not found`);
    return 1;
  }

  if (!fs.existsSync(badgeFile)) {
    console.error(`Badge file "${badgeFile}" not found`);
    return 1;
  }

  console.info(`${dryRun ? 'Would process' : 'Processing'} ${imageFile}`);

  if (!dryRun) {
    await addImageOverlay(
      badgeFile,
      imageFile,
      outputFile,
      opacityThreshold,
      compositeOperator
    );
  }

  return 0;
}

yargs(hideBin(process.argv))
  .command(
    '* <input-image> <badge-image> <output-image>',
    'Add a badge to an image',
    (yargs) =>
      yargs
        .positional('input-image', {
          describe: 'input image file',
          type: 'string',
        })
        .positional('badge-image', {
          describe: 'badge image file',
          type: 'string',
        })
        .positional('output-image', {
          describe: 'output file',
          type: 'string',
        }),
    async (argv) => {
      try {
        const exitCode = await execute(
          argv.inputImage,
          argv.badgeImage,
          argv.outputImage,
          getCompositeOperator(argv.compositeType),
          parseInt(`${argv.opacityThreshold}`, 10),
          Boolean(argv.dryRun)
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
  .version(process.env.APP_VERSION ?? 'Unknown')
  .option('composite-type', {
    alias: 'c',
    type: 'string',
    description: 'Change the composite type, recommended: Atop or Over',
    default: CompositeOperator[CompositeOperator.Atop],
  })
  .option('opacity-threshold', {
    alias: 'o',
    type: 'number',
    description: 'The opacity level required for the inset comparison',
    default: 29,
  })
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: 'Does not perform actions',
  })
  .parse();
