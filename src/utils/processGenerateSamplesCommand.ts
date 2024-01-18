import { lstatSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import defaultOptions from '../defaultOptions';
import BadgeGravity from '../types/BadgeGravity';
import initializeImageMagick from './initializeImageMagick';
import processAddBadgeCommand, {
  WriteBadgeArguments,
} from './processAddBadgeCommand';
import setBadgeFont from './setBadgeFont';

export default async function processGenerateSamplesCommand(): Promise<number> {
  await initializeImageMagick();

  setBadgeFont(resolve(__dirname, defaultOptions.fontFile));

  const inputRoot = resolve(__dirname, '../samples/input');
  const outputRoot = resolve(__dirname, '../samples/output');

  const files = readdirSync(inputRoot).filter((file) =>
    lstatSync(join(inputRoot, file)).isFile(),
  );

  const defaultInputs: Omit<WriteBadgeArguments, 'inputImage' | 'outputImage'> =
    {
      backgroundColor: defaultOptions.backgroundColor,
      badgeText: 'ALPHA',
      fontSize: defaultOptions.fontSize,
      gravity: defaultOptions.gravity,
      shadowColor: defaultOptions.shadowColor,
      textColor: defaultOptions.textColor,
    };

  for (const file of files) {
    await processAddBadgeCommand({
      ...defaultInputs,
      inputImage: join(inputRoot, file),
      outputImage: join(outputRoot, file),
    });
  }

  for (const gravity of [
    BadgeGravity.Northwest,
    BadgeGravity.North,
    BadgeGravity.Northeast,
    BadgeGravity.Southwest,
    BadgeGravity.South,
    BadgeGravity.Southeast,
  ]) {
    if (gravity === BadgeGravity.Southeast) {
      continue;
    }

    await processAddBadgeCommand({
      ...defaultInputs,
      inputImage: join(inputRoot, 'ic_launcher-xxxhdpi.png'),
      outputImage: join(outputRoot, `ic_launcher-xxxhdpi-${gravity}.png`),
      gravity: gravity,
    });

    await processAddBadgeCommand({
      ...defaultInputs,
      inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
      outputImage: join(outputRoot, `ic_launcher_round-xxxhdpi-${gravity}.png`),
      gravity: gravity,
    });
  }

  await processAddBadgeCommand({
    ...defaultInputs,
    inputImage: join(inputRoot, 'ic_launcher-xxxhdpi.png'),
    outputImage: join(outputRoot, `ic_launcher-xxxhdpi-dark-transparent.png`),
    backgroundColor: 'rgba(0,0,0,0.75)',
    badgeText: 'BETA',
    textColor: 'transparent',
  });

  await processAddBadgeCommand({
    ...defaultInputs,
    inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
    outputImage: join(outputRoot, `ic_launcher_round-xxxhdpi-larger.png`),
    badgeText: 'UAT',
    fontSize: 50,
  });

  return 0;
}
