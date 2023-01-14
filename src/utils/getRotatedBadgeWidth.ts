export default function getRotatedBadgeWidth(
  imageWidth: number,
  imageHeight: number,
  insetPosition: number,
): number {
  const topCenterPosition = {
    x: Math.round(imageWidth / 2),
    y: Math.round(insetPosition),
  };
  const leftCenterPosition = {
    x: Math.round(insetPosition),
    y: Math.round(imageHeight / 2),
  };

  return Math.round(
    Math.hypot(
      topCenterPosition.x - leftCenterPosition.x,
      topCenterPosition.y - leftCenterPosition.y,
    ),
  );
}
