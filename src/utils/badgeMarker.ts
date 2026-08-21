import { readFileSync } from 'node:fs';

import { IMagickImage, ImageMagick } from '@imagemagick/magick-wasm';

import BadgeMarker, { createBadgeMarkerPacket, parseBadgeMarkerPacket } from '../types/BadgeMarker';

const XMP_PROFILE_NAME = 'xmp';

export function setBadgeMarker(image: IMagickImage, marker: BadgeMarker): void {
  // Any XMP already on the image is replaced. Icons carrying meaningful XMP is
  // unlikely, and the marker has to be readable for the skip check to work.
  image.setProfile(XMP_PROFILE_NAME, new TextEncoder().encode(createBadgeMarkerPacket(marker)));
}

export function readBadgeMarker(file: string): BadgeMarker | undefined {
  let marker: BadgeMarker | undefined;

  try {
    ImageMagick.read(readFileSync(file), (image) => {
      const profile = image.getProfile(XMP_PROFILE_NAME);
      if (profile) {
        marker = parseBadgeMarkerPacket(new TextDecoder().decode(profile.data));
      }
    });
  } catch {
    // An unreadable file is left alone so the failure surfaces where the work
    // happens instead of during the marker check.
    return undefined;
  }

  return marker;
}
