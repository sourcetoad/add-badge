import { Gravity } from '@imagemagick/magick-wasm';

enum BadgeGravity {
  Northwest = 'northwest',
  North = 'north',
  Northeast = 'northeast',
  Southwest = 'southwest',
  South = 'south',
  Southeast = 'southeast',
}

export function getGravityFromBadgeGravity(
  badgeGravity: BadgeGravity,
): Gravity {
  switch (badgeGravity) {
    case BadgeGravity.Northwest:
      return Gravity.Northwest;
    case BadgeGravity.North:
      return Gravity.North;
    case BadgeGravity.Northeast:
      return Gravity.Northeast;
    case BadgeGravity.Southwest:
      return Gravity.Southwest;
    case BadgeGravity.South:
      return Gravity.South;
    case BadgeGravity.Southeast:
      return Gravity.Southeast;
  }
}

export function getBadgeGravityFromString(input: string): BadgeGravity {
  switch (input.toLowerCase()) {
    case 'northwest':
      return BadgeGravity.Northwest;
    case 'north':
      return BadgeGravity.North;
    case 'northeast':
      return BadgeGravity.Northeast;
    case 'southwest':
      return BadgeGravity.Southwest;
    case 'south':
      return BadgeGravity.South;
    case 'southeast':
      return BadgeGravity.Southeast;
  }

  throw new Error(`Unknown gravity ${input}`);
}

export default BadgeGravity;
