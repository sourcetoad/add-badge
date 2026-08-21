const FOREGROUND_PATTERN = /<foreground\s+android:drawable="([^"]+)"\s*\/>/u;
const BACKGROUND_PATTERN = /<background\s+android:drawable="([^"]+)"\s*\/>/u;
const LAYER_ITEM_PATTERN = /<item\s+android:drawable="([^"]+)"\s*\/>/gu;

export function getForegroundDrawable(launcherXml: string): string | undefined {
  return FOREGROUND_PATTERN.exec(launcherXml)?.[1];
}

export function getBackgroundDrawable(launcherXml: string): string | undefined {
  return BACKGROUND_PATTERN.exec(launcherXml)?.[1];
}

export function setForegroundDrawable(launcherXml: string, drawable: string): string {
  return launcherXml.replace(FOREGROUND_PATTERN, `<foreground android:drawable="${drawable}" />`);
}

export function getLayerItemDrawables(layerListXml: string): string[] {
  return [...layerListXml.matchAll(LAYER_ITEM_PATTERN)].map((match) => match[1]);
}

export function createBadgedForegroundXml(
  foregroundDrawable: string,
  overlayDrawable: string,
): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="${foregroundDrawable}" />
    <item android:drawable="${overlayDrawable}" />
</layer-list>
`;
}
