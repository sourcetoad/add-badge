import { cpSync, lstatSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import defaultOptions from '../defaultOptions';
import AddBadgeArguments from '../types/AddBadgeArguments';
import BadgeGravity from '../types/BadgeGravity';
import createAdaptivePreviewImage from './createAdaptivePreviewImage';
import initializeImageMagick from './initializeImageMagick';
import processAddBadgeCommand from './processAddBadgeCommand';
import setBadgeFont from './setBadgeFont';

export default async function processGenerateSamplesCommand(): Promise<number> {
  await initializeImageMagick();

  setBadgeFont(resolve(__dirname, defaultOptions.fontFile));

  const inputRoot = resolve(__dirname, '../samples/input');
  const outputRoot = resolve(__dirname, '../samples/output');

  const files = readdirSync(inputRoot).filter((file) => lstatSync(join(inputRoot, file)).isFile());

  const defaultInputs: Omit<AddBadgeArguments, 'input' | 'output'> = {
    backgroundColor: defaultOptions.backgroundColor,
    text: 'ALPHA',
    fontSize: defaultOptions.fontSize,
    gravity: defaultOptions.gravity,
    shadowColor: defaultOptions.shadowColor,
    textColor: defaultOptions.textColor,
  };

  for (const file of files) {
    await processAddBadgeCommand({
      ...defaultInputs,
      input: join(inputRoot, file),
      output: join(outputRoot, file),
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
      input: join(inputRoot, 'ic_launcher-xxxhdpi.png'),
      output: join(outputRoot, `ic_launcher-xxxhdpi-${gravity}.png`),
      gravity: gravity,
    });

    await processAddBadgeCommand({
      ...defaultInputs,
      input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
      output: join(outputRoot, `ic_launcher_round-xxxhdpi-${gravity}.png`),
      gravity: gravity,
    });
  }

  await Promise.all(
    [
      {
        input: join(inputRoot, 'ic_launcher-xxxhdpi.png'),
        output: 'dark-transparent',
        backgroundColor: 'rgba(0,0,0,0.75)',
        text: 'BETA',
        textColor: 'transparent',
      },
      {
        input: join(inputRoot, 'ic_launcher-xxxhdpi.png'),
        output: 'shadow',
        shadowColor: 'hsl(78,100%,37%)',
        textColor: 'transparent',
      },
      {
        input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        output: 'larger',
        text: 'UAT',
        fontSize: 50,
      },
      {
        gravity: BadgeGravity.Northeast,
        input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        output: 'position-northeast-0',
        position: '0',
      },
      {
        gravity: BadgeGravity.Northeast,
        input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        output: 'position-northeast-50',
        position: '50',
      },
      {
        gravity: BadgeGravity.Northeast,
        input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        output: 'position-northeast-100',
        position: '100',
      },
      {
        gravity: BadgeGravity.North,
        input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        output: 'position-north-10',
        position: '10',
      },
      {
        gravity: BadgeGravity.North,
        input: join(inputRoot, 'ic_launcher_round-xxxhdpi.png'),
        output: 'position-north-10x50',
        position: '10,50',
      },
    ].map((sampleCase) =>
      processAddBadgeCommand({
        ...defaultInputs,
        ...sampleCase,
        output: join(
          outputRoot,
          basename(sampleCase.input).replace(/\.([a-z]+)$/u, `-${sampleCase.output}.$1`),
        ),
      }),
    ),
  );

  const adaptiveOutput = join(outputRoot, 'android-res');
  cpSync(join(inputRoot, 'android-res'), adaptiveOutput, { recursive: true });

  await processAddBadgeCommand({
    ...defaultInputs,
    input: adaptiveOutput,
    mode: 'android-adaptive',
  });

  writeFileSync(
    join(outputRoot, 'android-adaptive-preview.png'),
    await createAdaptivePreviewImage(adaptiveOutput, 432),
  );

  const adaptivePositionOutput = join(outputRoot, 'android-res-position');
  cpSync(join(inputRoot, 'android-res'), adaptivePositionOutput, { recursive: true });

  await processAddBadgeCommand({
    ...defaultInputs,
    gravity: BadgeGravity.Northeast,
    input: adaptivePositionOutput,
    mode: 'android-adaptive',
    position: '50',
  });

  writeFileSync(
    join(outputRoot, 'android-adaptive-preview-position.png'),
    await createAdaptivePreviewImage(adaptivePositionOutput, 432),
  );

  return 0;
}
