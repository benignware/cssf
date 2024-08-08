import { getColorArgs } from '../../utils/colors/getColorArgs.mjs';

const hsvToHsl = (h, s, v) => {
    const l = v - s * v / 2;
    const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return [ h, sl, l ];
}

export const hsv = (h, s, v, alpha = 1) => {
  const { from, c1, c2, c3, a: colorAlpha } = getColorArgs(h, s, v, alpha);

  if (!from) {
    let l;

    [h, s, l] = hsvToHsl(h, s, v);

    return `hsl(${h} ${s} ${l}${alpha !== 1 ? ` / ${alpha}` : ''}`;
  }
}
