import { Gravity, ImageMagick } from '@imagemagick/magick-wasm';
import * as fs from 'fs';
import { describe, expect, it } from 'vitest';

import getInsetAtGravity from '../../src/utils/getInsetAtGravity';

describe('getInsetAtGravity', () => {
  it.each([
    // region ic_launcher-xxxhdpi.png
    [
      'ic_launcher-xxxhdpi.png North',
      'ic_launcher-xxxhdpi.png',
      Gravity.North,
      20,
    ],
    [
      'ic_launcher-xxxhdpi.png West',
      'ic_launcher-xxxhdpi.png',
      Gravity.West,
      19,
    ],
    [
      'ic_launcher-xxxhdpi.png East',
      'ic_launcher-xxxhdpi.png',
      Gravity.East,
      19,
    ],
    [
      'ic_launcher-xxxhdpi.png South',
      'ic_launcher-xxxhdpi.png',
      Gravity.South,
      19,
    ],
    // endregion
    // region ic_launcher_round-xxxhdpi.png
    [
      'ic_launcher_round-xxxhdpi.png North',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.North,
      7,
    ],
    [
      'ic_launcher_round-xxxhdpi.png West',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.West,
      7,
    ],
    [
      'ic_launcher_round-xxxhdpi.png East',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.East,
      7,
    ],
    [
      'ic_launcher_round-xxxhdpi.png South',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.South,
      7,
    ],
    // endregion
  ])('works as expected with %s', async (_, file, gravity, expected) => {
    let result: number | undefined = undefined;

    await ImageMagick.read(
      fs.readFileSync(`samples/input/${file}`),
      (image) => {
        result = getInsetAtGravity(image, gravity as number);
      },
    );

    expect(result).toEqual(expected);
  });
});
