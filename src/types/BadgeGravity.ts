import { Gravity } from '@imagemagick/magick-wasm';

enum BadgeGravity {
  Northwest = Gravity.Northwest,
  Northeast = Gravity.Northeast,
  Southwest = Gravity.Southwest,
  Southeast = Gravity.Southeast,
}

export function getGravityFromBadgeGravity(
  badgeGravity: BadgeGravity
): Gravity {
  switch (badgeGravity) {
    case BadgeGravity.Northwest:
      return Gravity.Northwest;
    case BadgeGravity.Northeast:
      return Gravity.Northeast;
    case BadgeGravity.Southwest:
      return Gravity.Southwest;
    case BadgeGravity.Southeast:
      return Gravity.Southeast;
  }

  throw new Error(`Unknown gravity ${badgeGravity}`);
}

export function getBadgeGravityFromString(input: string): BadgeGravity {
  switch (input.toLowerCase()) {
    case 'northwest':
      return BadgeGravity.Northwest;
    case 'northeast':
      return BadgeGravity.Northeast;
    case 'southwest':
      return BadgeGravity.Southwest;
    case 'southeast':
      return BadgeGravity.Southeast;
  }

  throw new Error(`Unknown gravity ${input}`);
}

export default BadgeGravity;
