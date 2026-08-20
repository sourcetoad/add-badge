import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ImageMagick } from '@imagemagick/magick-wasm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import BadgeMarker, {
  createBadgeMarkerPacket,
  describeBadgeMarker,
  MARKER_VERSION,
  parseBadgeMarkerPacket,
} from '../../src/types/BadgeMarker';
import { readBadgeMarker, setBadgeMarker } from '../../src/utils/badgeMarker';

const MARKER: BadgeMarker = {
  gravity: 'southeast',
  text: 'ALPHA',
  version: MARKER_VERSION,
};

let fixtureRoot: string;

beforeAll(() => {
  fixtureRoot = mkdtempSync(join(tmpdir(), 'add-badge-marker-'));
});

afterAll(() => {
  rmSync(fixtureRoot, { force: true, recursive: true });
});

function writeWithMarker(source: string, marker: BadgeMarker): string {
  const target = join(fixtureRoot, source.replace(/[^a-z0-9.]/giu, '-'));

  ImageMagick.read(readFileSync(source), (image) => {
    setBadgeMarker(image, marker);
    image.write(image.format, (data) => {
      writeFileSync(target, data);
    });
  });

  return target;
}

describe('badge marker packets', () => {
  it('round trips a marker', () => {
    const parsed = parseBadgeMarkerPacket(createBadgeMarkerPacket(MARKER));

    expect(parsed).toEqual({ ...MARKER, position: undefined });
  });

  it('round trips a marker with a position and escaped text', () => {
    const marker: BadgeMarker = {
      gravity: 'northwest',
      position: '10,20@45',
      text: 'A & "B"\n<C>',
      version: MARKER_VERSION,
    };

    const parsed = parseBadgeMarkerPacket(createBadgeMarkerPacket(marker));

    expect(parsed).toEqual(marker);
  });

  it('ignores xmp from another tool', () => {
    expect(
      parseBadgeMarkerPacket(
        '<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF><rdf:Description dc:creator="Somebody" /></rdf:RDF></x:xmpmeta>',
      ),
    ).toBeUndefined();
  });

  it('describes a marker for the skip message', () => {
    expect(describeBadgeMarker({ ...MARKER, text: 'v1.2\nBETA' })).toBe(
      '"v1.2\\nBETA" (southeast)',
    );
    expect(describeBadgeMarker({ ...MARKER, position: '10,20' })).toBe('"ALPHA" (position 10,20)');
  });
});

describe('readBadgeMarker', () => {
  it.each([
    ['png', 'samples/input/ic_launcher-mdpi.png'],
    ['webp', 'samples/input/ic_launcher_foreground.webp'],
  ])('survives a %s write', (_format, source) => {
    expect(readBadgeMarker(writeWithMarker(source, MARKER))).toEqual({
      ...MARKER,
      position: undefined,
    });
  });

  it.each([
    ['png', 'samples/input/ic_launcher-mdpi.png'],
    ['webp', 'samples/input/ic_launcher_foreground.webp'],
  ])('finds no marker on an unbadged %s', (_format, source) => {
    expect(readBadgeMarker(source)).toBeUndefined();
  });

  it('treats an unreadable file as unmarked', () => {
    expect(readBadgeMarker('package.json')).toBeUndefined();
  });
});
