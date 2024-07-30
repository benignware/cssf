import chroma from 'chroma-js';
import { parseFn, toPercent, toDecimal } from '../utils.mjs';


/**
 * Creates an hsla color by given parts or convert any color to hsla.
 * @param {(number|string)} h Hue value ranging from 0 to 360 or equivalent expression or css color to be converted to hsla
 * @param {(number|string)} s Saturation value as percent or equivalent expression
 * @param {(number|string)} l Lightness value as percent or equivalent expression
 * @param {(number|string)} a Alpha channel as decimal or equivalent expression
 * @returns {string} The resulting css color value
 */
function hsla(h, s, l, a = 1) {
  if (h && !l) {
    a = s;

    const color = h;

    if (color.match(/(hsl|rgb)a?\(/)) {
      let [name, ...args] = parseFn(color);

      if (name.startsWith('rgb')) {
        let [r, g, b] = args;

        [h, s, l, a] = rgb2hsl(r, g, b, a || args[3]);
      } else {
        [h, s, l] = args;
        a = a || args[3];

        s = toDecimal(s);
        l = toDecimal(l);
      }
    } else {
      try {
        const chr = chroma(color);

        [h, s, l] = chr
          .hsl()
          .slice(0, 3)
          .map((v) => (v = isNaN(v) ? 0 : v))
          .map((v, i) => (i === 1 || i === 2 ? `${Math.round(v * 100)}%` : v));

        a = chr.alpha();
      } catch (e) {
        return color;
      }
    }
  }

  a = typeof a !== 'undefined' ? a : 1;

  return `hsla(${h}, ${toPercent(s)}, ${toPercent(l)}, ${a})`;
}

export default hsla;
