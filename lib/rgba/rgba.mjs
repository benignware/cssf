import chroma from 'chroma-js';
import abs from '../abs/abs.mjs';
import and from '../and/and.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import lt from '../lt/lt.mjs';
import gte from '../gte/gte.mjs';
import round from '../round/round.mjs';
import rem from '../rem/rem.mjs';
import { parseFn, toDecimal, isVar } from '../utils.mjs';
import evaluate from '../eval/eval_.mjs';

const hsl2rgb = (h, s, l, a = 1) => {
  const c = `(1 - ${abs(`2 * ${l} - 1`)}) * ${s}`;
  const x = `${c} * (1 - ${abs(`${rem(`${h} / 60`, 2)} - 1`)})`;
  const m = `(${l} - (${c} / 2))`;

  const rh = ifelse(
    and(gte(h, 120), lt(h, 240)),
    0,
    ifelse(lt(h, 60), c, ifelse(gte(h, 300), c, x))
  );
  const gh = ifelse(gte(h, 240), 0, ifelse(and(lt(h, 180), gte(h, 60)), c, x));
  const bh = ifelse(lt(h, 120), 0, ifelse(and(lt(h, 300), gte(h, 180)), c, x));

  let r = `(${rh} + ${m}) * 255`;
  let g = `(${gh} + ${m}) * 255`;
  let b = `(${bh} + ${m}) * 255`;

  r = round(r);
  g = round(g);
  b = round(b);

  // r = `calc(${r})`;
  // g = `calc(${g})`;
  // b = `calc(${b})`;

  return [r, g, b, a];
};

/**
 * Creates a rgba color by given parts or convert any color to hsla.
 * @param {*} r Red channel ranging from 0 to 255 or equivalent expression or css color to be converted to rgba
 * @param {(number|string)} g Green channel ranging from 0 to 255 or equivalent expression
 * @param {(number|string)} b Blue channel ranging from 0 to 255 or equivalent expression
 * @param {(number|string)} a Alpha channel as decimal or equivalent expression
 * @returns {string} The resulting css color value
 */
function rgba(r, g, b, a = 1) {
  // console.log('CALL RGBA: ', [...arguments]);
  if (r && !b) {
    a = g;

    const color = r;

    // console.log('FROM COLOR: \n', 'input:\t', color, '\neval:\t', evaluate(color));

    if (isVar(color)) {
      return `rgba(${color}, ${a})`;
    }

    if (color.match(/(hsl|rgb)a?\(/)) {
      const [name, ...args] = parseFn(color);

      if (name.startsWith('hsl')) {
        let [h, s, l] = args;

        [r, g, b, a] = hsl2rgb(h, toDecimal(s), toDecimal(l), a || args[3]);
      } else {
        [r, g, b] = args;
        a = a || args[3];
      }
    } else {
      try {
        const chr = chroma(color);

        [r, g, b] = chr.rgb();
        a = chr.alpha();
      } catch (e) {
        return color;
      }
    }
  }

  a = typeof a !== 'undefined' ? a : 1;

  const result = `rgba(${r}, ${g}, ${b}, ${a})`;

  // console.log('RGBA RESULT:', result);

  return result;
}

export default rgba;
