import { describe, expect, it } from 'vitest';

import BadgeGravity from '../../src/types/BadgeGravity';
import calculateManualBadgePosition from '../../src/utils/calculateManualBadgePosition';

describe('calculateManualBadgePosition', () => {
  const container = { height: 100, width: 100 };
  const badge = { height: 10, width: 10 };

  it.each([
    [
      'north 0 on axis',
      {
        position: { x: 0 },
        gravity: BadgeGravity.North,
        expected: { point: { x: 45, y: 0 }, rotation: 0 },
      },
    ],
    [
      'north 50 on axis',
      {
        position: { x: 50 },
        gravity: BadgeGravity.North,
        expected: { point: { x: 45, y: 45 }, rotation: 0 },
      },
    ],
    [
      'north 100 on axis',
      {
        position: { x: 100 },
        gravity: BadgeGravity.North,
        expected: { point: { x: 45, y: 90 }, rotation: 0 },
      },
    ],
    [
      'northeast 0 on axis',
      {
        position: { x: 0 },
        gravity: BadgeGravity.Northeast,
        expected: { point: { x: 86, y: 0 }, rotation: 45 },
      },
    ],
    [
      'northeast 50 on axis',
      {
        position: { x: 50 },
        gravity: BadgeGravity.Northeast,
        expected: { point: { x: 43, y: 43 }, rotation: 45 },
      },
    ],
    [
      'northeast 100 on axis',
      {
        position: { x: 100 },
        gravity: BadgeGravity.Northeast,
        expected: { point: { x: 0, y: 86 }, rotation: 45 },
      },
    ],
    [
      'northwest 0 on axis',
      {
        position: { x: 0 },
        gravity: BadgeGravity.Northwest,
        expected: { point: { x: 0, y: 0 }, rotation: -45 },
      },
    ],
    [
      'northwest 50 on axis',
      {
        position: { x: 50 },
        gravity: BadgeGravity.Northwest,
        expected: { point: { x: 43, y: 43 }, rotation: -45 },
      },
    ],
    [
      'northwest 100 on axis',
      {
        position: { x: 100 },
        gravity: BadgeGravity.Northwest,
        expected: { point: { x: 86, y: 86 }, rotation: -45 },
      },
    ],
    [
      'south 0 on axis',
      {
        position: { x: 0 },
        gravity: BadgeGravity.South,
        expected: { point: { x: 45, y: 90 }, rotation: 0 },
      },
    ],
    [
      'south 50 on axis',
      {
        position: { x: 50 },
        gravity: BadgeGravity.South,
        expected: { point: { x: 45, y: 45 }, rotation: 0 },
      },
    ],
    [
      'south 100 on axis',
      {
        position: { x: 100 },
        gravity: BadgeGravity.South,
        expected: { point: { x: 45, y: 0 }, rotation: 0 },
      },
    ],
    [
      'southeast 0 on axis',
      {
        position: { x: 0 },
        gravity: BadgeGravity.Southeast,
        expected: { point: { x: 86, y: 86 }, rotation: -45 },
      },
    ],
    [
      'southeast 50 on axis',
      {
        position: { x: 50 },
        gravity: BadgeGravity.Southeast,
        expected: { point: { x: 43, y: 43 }, rotation: -45 },
      },
    ],
    [
      'southeast 100 on axis',
      {
        position: { x: 100 },
        gravity: BadgeGravity.Southeast,
        expected: { point: { x: 0, y: 0 }, rotation: -45 },
      },
    ],
    [
      'southwest 0 on axis',
      {
        position: { x: 0 },
        gravity: BadgeGravity.Southwest,
        expected: { point: { x: 0, y: 86 }, rotation: 45 },
      },
    ],
    [
      'southwest 50 on axis',
      {
        position: { x: 50 },
        gravity: BadgeGravity.Southwest,
        expected: { point: { x: 43, y: 43 }, rotation: 45 },
      },
    ],
    [
      'southwest 100 on axis',
      {
        position: { x: 100 },
        gravity: BadgeGravity.Southwest,
        expected: { point: { x: 86, y: 0 }, rotation: 45 },
      },
    ],
    [
      'north 0,0',
      {
        position: { x: 0, y: 0 },
        gravity: BadgeGravity.North,
        expected: { point: { x: 0, y: 0 }, rotation: 0 },
      },
    ],
    [
      'northeast 10,10',
      {
        position: { x: 10, y: 10 },
        gravity: BadgeGravity.Northeast,
        expected: { point: { x: 9, y: 9 }, rotation: 45 },
      },
    ],
    [
      'northwest 20,20',
      {
        position: { x: 20, y: 20 },
        gravity: BadgeGravity.Northwest,
        expected: { point: { x: 17, y: 17 }, rotation: -45 },
      },
    ],
    [
      'south 30,30',
      {
        position: { x: 30, y: 30 },
        gravity: BadgeGravity.South,
        expected: { point: { x: 27, y: 27 }, rotation: 0 },
      },
    ],
    [
      'southeast 40,40',
      {
        position: { x: 40, y: 40 },
        gravity: BadgeGravity.Southeast,
        expected: { point: { x: 34, y: 34 }, rotation: -45 },
      },
    ],
    [
      'southwest 60,60',
      {
        position: { x: 60, y: 60 },
        gravity: BadgeGravity.Southwest,
        expected: { point: { x: 52, y: 52 }, rotation: 45 },
      },
    ],
  ])('works for %s', (_, { position, gravity, expected }) => {
    const result = calculateManualBadgePosition(
      container,
      badge,
      position,
      gravity,
    );

    expect(result.rotation).toEqual(expected.rotation);
    expect(
      Math.round(result.point.x),
      `Expected x to be ${expected.point.x.toString()} but was ${Math.round(result.point.x).toString()}`,
    ).toEqual(expected.point.x);
    expect(
      Math.round(result.point.y),
      `Expected y to be ${expected.point.y.toString()} but was ${Math.round(result.point.y).toString()}`,
    ).toEqual(expected.point.y);
  });
});
