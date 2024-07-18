const { parseFn, toDecimal, toPercent } = require('../utils');

/**
 * Lightens a color by given amount.
 * @param {string} color A css color value;
 * @param {(number|string)} [weight=0.25] weight Decimal amount by which the color is darkened
 * @returns {string} The resulting css color value
 */
function lighten(color, weight = 0.25) {
  weight = toDecimal(weight);

  if (color.match(/(hsl|rgb)a?\(/)) {
    const [name, ...args] = parseFn(color);

    if (name.startsWith('hsl')) {
      let [h, s, l, a = 1] = args;

      s = toDecimal(s);
      l = toDecimal(l);
      l = `${l} + ${weight}`;

      const res = `${name}(${h}, ${toPercent(s)}, ${toPercent(l)}${
        name === 'hsla' ? `, ${a}` : ''
      })`;

      return res;
    } else {
      let [r, g, b, a] = args;

      const xr = `clamp(0, ${r} + 255 * ${weight}, 255)`;
      const xg = `clamp(0, ${g} + 255 * ${weight}, 255)`;
      const xb = `clamp(0, ${b} + 255 * ${weight}, 255)`;

      return `${name}(${xr}, ${xb}, ${xg}${
        name === 'rgba' ? `, ${a || 1}` : ''
      })`;
    }
  }

  return '';
}

module.exports = lighten;
