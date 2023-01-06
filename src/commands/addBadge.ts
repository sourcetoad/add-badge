#!/usr/bin/env ts-node

import { CompositeOperator } from '@imagemagick/magick-wasm';
import * as fs from 'fs';

import addImageOverlay from '../utils/addImageOverlay';

async function execute(argv: string[]) {
  const [imageFile, badgeFile, outputFile] = argv;

  if (!imageFile || !badgeFile || !outputFile) {
    console.log(
      'usage: add-badge <input-image-file> <badge-image-file> <output-file>'
    );
    return 1;
  }

  if (!fs.existsSync(imageFile)) {
    console.log(`Image file "${imageFile}" not found`);
    return 1;
  }

  if (!fs.existsSync(badgeFile)) {
    console.log(`Badge file "${badgeFile}" not found`);
    return 1;
  }

  // `Over` for overlay, `Atop` overlays while maintaining transparency.
  const compositeType = CompositeOperator.Atop;

  // Opacity must be above this to be considered not transparent. Without this
  // the inset will always be 0 on the circular icon due to the shadow.
  const opacityCutoff = 29;

  await addImageOverlay(
    badgeFile,
    imageFile,
    outputFile,
    opacityCutoff,
    compositeType
  );

  return 0;
}

execute(process.argv.slice(2)).then((exitCode) => process.exit(exitCode));
