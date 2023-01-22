/**
 * When dealing with sizes as small as a badge on an icon, 1 pixel being off
 * when centering is noticeable as not centered. Due to that we round sizes
 * related to the badge to round numbers, so we can center the text
 * consistently.
 */
export default function roundToEven(value: number): number {
  return 2 * Math.round(value / 2);
}
