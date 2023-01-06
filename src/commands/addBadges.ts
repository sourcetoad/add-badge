#!/usr/bin/env ts-node

import { CompositeOperator } from '@imagemagick/magick-wasm';
import * as fg from 'fast-glob';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import addImageOverlay from '../utils/addImageOverlay';
import { getCompositeOperator } from '../utils/getCompositeOperator';

async function execute(
  inputGlob: string | undefined,
  badgeFile: string | undefined,
  compositeOperator: CompositeOperator,
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
        compositeOperator
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
        }),
    (argv) => {
      execute(
        argv.inputGlob,
        argv.badgeImage,
        getCompositeOperator(argv.compositeOperator),
        parseInt(`${argv.opacityThreshold}`, 10),
        Boolean(argv.dryRun)
      )
        .then((exitCode) => process.exit(exitCode))
        .catch((err) => {
          console.error(`Caught error: ${err}`);
          process.exit(1);
        });
    }
  )
  .version('1.0')
  .option('composite-operator', {
    alias: 'c',
    type: 'string',
    description: 'Change the composite operator, recommended: Atop or Over',
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
