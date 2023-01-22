import { Gravity, ImageMagick } from '@imagemagick/magick-wasm';
import * as fs from 'fs';
import { describe, expect, it } from 'vitest';

import getInsetAtGravity from '../../src/utils/getInsetAtGravity';

describe('getInsetAtGravity', () => {
  it.each([
    // region ic_launcher-xxxhdpi.png
    [
      'ic_launcher-xxxhdpi.png Northwest',
      'ic_launcher-xxxhdpi.png',
      Gravity.Northwest,
      33,
    ],
    [
      'ic_launcher-xxxhdpi.png North',
      'ic_launcher-xxxhdpi.png',
      Gravity.North,
      20,
    ],
    [
      'ic_launcher-xxxhdpi.png Northeast',
      'ic_launcher-xxxhdpi.png',
      Gravity.Northeast,
      33,
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
      'ic_launcher-xxxhdpi.png Southwest',
      'ic_launcher-xxxhdpi.png',
      Gravity.Southwest,
      33,
    ],
    [
      'ic_launcher-xxxhdpi.png South',
      'ic_launcher-xxxhdpi.png',
      Gravity.South,
      19,
    ],
    [
      'ic_launcher-xxxhdpi.png Southeast',
      'ic_launcher-xxxhdpi.png',
      Gravity.Southeast,
      33,
    ],
    // endregion
    // region ic_launcher_round-xxxhdpi.png
    [
      'ic_launcher_round-xxxhdpi.png Northwest',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.Northwest,
      47,
    ],
    [
      'ic_launcher_round-xxxhdpi.png North',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.North,
      7,
    ],
    [
      'ic_launcher_round-xxxhdpi.png Northeast',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.Northeast,
      47,
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
      'ic_launcher_round-xxxhdpi.png Southwest',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.Southwest,
      47,
    ],
    [
      'ic_launcher_round-xxxhdpi.png South',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.South,
      7,
    ],
    [
      'ic_launcher_round-xxxhdpi.png Southeast',
      'ic_launcher_round-xxxhdpi.png',
      Gravity.Southeast,
      47,
    ],
    // endregion
  ])('works as expected with %s', async (_, file, gravity, expected) => {
    let result: number | undefined = undefined;

    await ImageMagick.read(
      fs.readFileSync(`samples/input/${file}`),
      (image) => {
        result = getInsetAtGravity(image, gravity);
      },
    );

    expect(result).toEqual(expected);
  });
});
