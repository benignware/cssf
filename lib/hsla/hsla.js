const chroma = require('chroma-js');

const eq = require('../eq');
const ifelse = require('../ifelse');
const lt = require('../lt');
const round = require('../round');
const { parseFn, toPercent, toDecimal } = require('../utils');

const rgb2hsl = (r, g, b, a = 1) => {
  const rn = `(${r} / 255)`;
  const gn = `(${g} / 255)`;
  const bn = `(${b} / 255)`;

  const max = `max(${rn}, ${gn}, ${bn})`;
  const min = `min(${rn}, ${gn}, ${bn})`;

  const maxminusmin = `max(${max} - ${min}, 0.0000000000001)`;

  const l = `((${max} + ${min}) / 2)`;

  const s1 = `(${max} - ${min}) / (${max} + ${min})`;
  const s2 = `(${max} - ${min}) / (2.0 - ${max} - ${min})`;

  const s = ifelse(round(l), s2, s1);

  const hr = `${ifelse(lt(g, b), 6, 0)} + (${gn} - ${bn}) / (${maxminusmin})`;
  const hg = `(2 + (${bn} - ${rn}) / (${maxminusmin}))`;
  const hb = `(4 + (${rn} - ${gn}) / (${maxminusmin}))`;

  const h = `(${ifelse(eq(rn, max), hr, ifelse(eq(gn, max), hg, hb))} * 60)`;

  return [h, s, l, a];
};

/**
 * Creates an hsla color by given parts or convert any color to hsla.
 * @param {(number|string)} h Hue value ranging from 0 to 360 or equivalent expression or css color to be converted to hsla
 * @param {(number|string)} s Saturation value as percent or equivalent expression
 * @param {(number|string)} l Lightness value as percent or equivalent expression
 * @param {(number|string)} a Alpha channel as decimal or equivalent expression
 * @returns {string} The resulting css color value
 */
function hsla(h, s, l, a) {
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

module.exports = hsla;
