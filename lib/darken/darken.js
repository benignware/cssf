const { parseFn, toDecimal, toPercent } = require('../utils');

/**
 * Darkens a color by given amount.
 * @param {string} color A css color value;
 * @param {(number|string)} [weight=0.25] weight Decimal amount by which the color is darkened
 * @returns {string} The resulting css color value
 */
function darken(color, weight = 0.25) {
  weight = toDecimal(weight);

  if (color.match(/(hsl|rgb)a?\(/)) {
    const [name, ...args] = parseFn(color);

    if (name.startsWith('hsl')) {
      let [h, s, l, a] = args;

      s = toDecimal(s);
      l = toDecimal(l);
      l = `${l} * ${weight}`;

      return `${name}(${h}, ${toPercent(s)}, ${toPercent(l)}${
        name === 'hsla' ? `, ${a || 1}` : ''
      })`;
    } else {
      let [r, g, b, a] = args;

      return `${name}(calc(${r} - ${r} * ${weight}), calc(${g} - ${g} * ${weight}), calc(${b} - ${b} * ${weight})${
        name === 'rgba' ? `, ${a || 1}` : ''
      })`;
    }
  }

  return '';
}

module.exports = darken;
