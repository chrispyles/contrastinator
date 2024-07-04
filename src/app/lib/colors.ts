import Color from 'color';

/** Factor used to round contrast values to 3 decimal places. */
const CONTRAST_ROUNDING_FACTOR = Math.pow(10, 3);

const BLACK = new Color('#000');
const WHITE = new Color('#FFF');

export function decodeColors(s: string): Color[] {
  return s.split('-').map((h) => new Color(`#${h}`));
}

export function encodeColors(cs: Color[]): string {
  return cs.map((c) => c.hex().slice(1)).join('-');
}

export function contrast(c1: Color, c2: Color): number {
  if (c1.hex() === c2.hex()) return 1;
  return (
    Math.round(c1.contrast(c2) * CONTRAST_ROUNDING_FACTOR) /
    CONTRAST_ROUNDING_FACTOR
  );
}

export function textColor(c: Color): string {
  const bc = BLACK.contrast(c);
  const wc = WHITE.contrast(c);
  return wc > bc ? WHITE.hex() : BLACK.hex();
}
