import ManualPosition from '../types/ManualPosition';

export default function parseManualPosition(
  position: string | undefined,
): ManualPosition | undefined {
  if (!position) {
    return undefined;
  }

  const [x, y] = position.split(',');

  const manualPosition: ManualPosition = {
    x: parseInt(x.trim(), 10),
    y: y ? parseInt(y.trim(), 10) : undefined,
  };

  if (
    isNaN(manualPosition.x) ||
    (manualPosition.y !== undefined && isNaN(manualPosition.y))
  ) {
    throw new Error(`Invalid position "${position}"`);
  }

  return manualPosition;
}
