import calc from '../calc/index.mjs';
import rgba from '../rgba/index.mjs';
import hsla from '../hsla/index.mjs';
import { parseFn, toDecimal, stripCalc } from '../utils.mjs';

/**
 * Mixes two css colors.
 * @param {string} color1 A css color value
 * @param {string} color2 Another css color value
 * @param {(number|string)} [weight=0.25] weight The amount by which colors are mixed
 * @returns {string} The resulting mixed color
 */
function mix(color1, color2, weight = 0.5) {
  weight = `(1 - ${toDecimal(weight)})`;

  const format = color1.match(/hsl/) ? hsla : rgba;
  const [args1, args2] = [color1, color2]
    .map((color) => format(color))
    .map((color) =>
      parseFn(color)
        .slice(1)
        .map((arg) => toDecimal(arg))
        .map((arg) => stripCalc(arg))
    );
  const args = [0, 0, 0, 0].map((_, index) =>
    calc(`((${args2[index]} - ${args1[index]}) * ${weight}) + ${args1[index]}`)
  );
  const result = format(...args);

  return result;
}

export default mix;
