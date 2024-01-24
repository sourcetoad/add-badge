enum BadgeGravity {
  Northwest = 'northwest',
  North = 'north',
  Northeast = 'northeast',
  Southwest = 'southwest',
  South = 'south',
  Southeast = 'southeast',
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
