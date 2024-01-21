import { lstatSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

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

  await Promise.all(
    [
      {
        inputImage: join(inputRoot, 'ic_launcher-xxxhdpi.png'),
        outputImage: 'dark-transparent',
        backgroundColor: 'rgba(0,0,0,0.75)',
        badgeText: 'BETA',
        textColor: 'transparent',
      },
      {
        inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        outputImage: 'larger',
        badgeText: 'UAT',
        fontSize: 50,
      },
      {
        gravity: BadgeGravity.Northeast,
        inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        outputImage: 'position-northeast-0',
        position: '0',
      },
      {
        gravity: BadgeGravity.Northeast,
        inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        outputImage: 'position-northeast-50',
        position: '50',
      },
      {
        gravity: BadgeGravity.Northeast,
        inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        outputImage: 'position-northeast-100',
        position: '100',
      },
      {
        gravity: BadgeGravity.North,
        inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        outputImage: 'position-north-10',
        position: '10',
      },
      {
        gravity: BadgeGravity.North,
        inputImage: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        outputImage: 'position-north-10x50',
        position: '10,50',
      },
    ].map((sampleCase) =>
      processAddBadgeCommand({
        ...defaultInputs,
        ...sampleCase,
        outputImage: join(
          outputRoot,
          basename(sampleCase.inputImage).replace(
            /\.([a-z]+)$/,
            `-${sampleCase.outputImage}.$1`,
          ),
        ),
      }),
    ),
  );

  return 0;
}
