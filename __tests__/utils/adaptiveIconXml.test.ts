import { describe, expect, it } from 'vitest';

import {
  createBadgedForegroundXml,
  getBackgroundDrawable,
  getForegroundDrawable,
  getLayerItemDrawables,
  setForegroundDrawable,
} from '../../src/utils/adaptiveIconXml';

const LAUNCHER_XML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`;

describe('getForegroundDrawable', () => {
  it('returns the foreground drawable reference', () => {
    expect(getForegroundDrawable(LAUNCHER_XML)).toBe('@drawable/ic_launcher_foreground');
  });

  it('returns undefined when there is no foreground', () => {
    expect(getForegroundDrawable('<adaptive-icon />')).toBeUndefined();
  });
});

describe('getBackgroundDrawable', () => {
  it('returns the background drawable reference', () => {
    expect(getBackgroundDrawable(LAUNCHER_XML)).toBe('@drawable/ic_launcher_background');
  });
});

describe('setForegroundDrawable', () => {
  it('replaces only the foreground reference', () => {
    const updated = setForegroundDrawable(LAUNCHER_XML, '@drawable/ic_launcher_foreground_badged');

    expect(updated).toContain(
      '<foreground android:drawable="@drawable/ic_launcher_foreground_badged" />',
    );
    expect(updated).toContain('<background android:drawable="@drawable/ic_launcher_background" />');
    expect(updated).toContain('<monochrome android:drawable="@drawable/ic_launcher_foreground" />');
  });
});

describe('getLayerItemDrawables', () => {
  it('returns every layer item drawable in order', () => {
    const layerList = createBadgedForegroundXml(
      '@drawable/ic_launcher_foreground',
      '@drawable/ic_badge_overlay',
    );

    expect(getLayerItemDrawables(layerList)).toEqual([
      '@drawable/ic_launcher_foreground',
      '@drawable/ic_badge_overlay',
    ]);
  });
});
