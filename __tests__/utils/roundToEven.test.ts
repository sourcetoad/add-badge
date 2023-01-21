import { describe, expect, it } from 'vitest';

import roundToEven from '../../src/utils/roundToEven';

describe('roundToEven', () => {
  it.each([
    [0.9, 0],
    [1, 2],
    [2, 2],
    [2.8, 2],
    [3, 4],
  ])('rounds as expected', (input, expected) => {
    const result = roundToEven(input);

    expect(result).toEqual(expected);
  });
});
