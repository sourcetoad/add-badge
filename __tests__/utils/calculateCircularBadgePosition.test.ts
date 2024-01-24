import { describe, expect, it } from 'vitest';

import BadgeGravity from '../../src/types/BadgeGravity';
import calculateCircularBadgePosition from '../../src/utils/calculateCircularBadgePosition';

describe('calculateManualBadgePosition', () => {
  const container = { height: 100, width: 100 };
  const badge = { height: 10, width: 10 };
  const circleRadius = 30;

  it.each([
    [
      'north',
      {
        gravity: BadgeGravity.North,
        expected: { point: { x: 45, y: 20 }, rotation: 0 },
      },
    ],
    [
      'northeast',
      {
        gravity: BadgeGravity.Northeast,
        expected: { point: { x: 60, y: 26 }, rotation: 45 },
      },
    ],
    [
      'northwest',
      {
        gravity: BadgeGravity.Northwest,
        expected: { point: { x: 26, y: 26 }, rotation: -45 },
      },
    ],
    [
      'south',
      {
        gravity: BadgeGravity.South,
        expected: { point: { x: 45, y: 70 }, rotation: 0 },
      },
    ],
    [
      'southeast',
      {
        gravity: BadgeGravity.Southeast,
        expected: { point: { x: 60, y: 60 }, rotation: -45 },
      },
    ],
    [
      'southwest',
      {
        gravity: BadgeGravity.Southwest,
        expected: { point: { x: 26, y: 60 }, rotation: 45 },
      },
    ],
  ])('works for %s', (_, { gravity, expected }) => {
    const result = calculateCircularBadgePosition(
      container,
      badge,
      circleRadius,
      gravity,
    );

    expect(result.rotation).toEqual(expected.rotation);
    expect(
      Math.round(result.point.x),
      `Expected x to be ${expected.point.x} but was ${Math.round(result.point.x)}`,
    ).toEqual(expected.point.x);
    expect(
      Math.round(result.point.y),
      `Expected y to be ${expected.point.y} but was ${Math.round(result.point.y)}`,
    ).toEqual(expected.point.y);
  });
});
