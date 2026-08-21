// We store in XMP since it survives in both PNG (in an iTXt chunk) and
// WebP (in an "XMP " chunk). Attributes and comments are dropped by
// the WebP coder.
const MARKER_NAMESPACE = 'https://sourcetoad.com/ns/add-badge/1.0/';

export const MARKER_VERSION = '1';

interface BadgeMarker {
  gravity: string;
  position?: string;
  text: string;
  version: string;
}

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/\n/gu, '&#10;');
}

function unescapeXmlAttribute(value: string): string {
  return value
    .replace(/&#10;/gu, '\n')
    .replace(/&quot;/gu, '"')
    .replace(/&gt;/gu, '>')
    .replace(/&lt;/gu, '<')
    .replace(/&amp;/gu, '&');
}

function getMarkerAttribute(packet: string, name: string): string | undefined {
  const match = new RegExp(`addBadge:${name}="([^"]*)"`, 'u').exec(packet);

  return match ? unescapeXmlAttribute(match[1]) : undefined;
}

export function createBadgeMarkerPacket(marker: BadgeMarker): string {
  const attributes = [
    `addBadge:version="${escapeXmlAttribute(marker.version)}"`,
    `addBadge:text="${escapeXmlAttribute(marker.text)}"`,
    `addBadge:gravity="${escapeXmlAttribute(marker.gravity)}"`,
    ...(marker.position === undefined
      ? []
      : [`addBadge:position="${escapeXmlAttribute(marker.position)}"`]),
  ].join(' ');

  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:addBadge="${MARKER_NAMESPACE}" ${attributes} /></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
}

export function parseBadgeMarkerPacket(packet: string): BadgeMarker | undefined {
  if (!packet.includes(MARKER_NAMESPACE)) {
    return undefined;
  }

  const version = getMarkerAttribute(packet, 'version');
  const text = getMarkerAttribute(packet, 'text');
  const gravity = getMarkerAttribute(packet, 'gravity');
  if (version === undefined || text === undefined || gravity === undefined) {
    return undefined;
  }

  return { gravity, position: getMarkerAttribute(packet, 'position'), text, version };
}

export function describeBadgeMarker(marker: BadgeMarker): string {
  const placement = marker.position === undefined ? marker.gravity : `position ${marker.position}`;

  return `"${marker.text.replace(/\n/gu, '\\n')}" (${placement})`;
}

export default BadgeMarker;
