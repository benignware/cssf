const calc = require('../calc');
const { parseFn, toDecimal, toPercent } = require('../utils');

module.exports = function darken(color, weight = 0.25) {
  weight = toDecimal(weight);

  if (color.match(/(hsl|rgb)a?\(/)) {
    const [name, ...args] = parseFn(color);

    if (name.startsWith('hsl')) {
      let [h, s, l, a] = args;

      // console.log('---->', weight, l);

      s = toDecimal(s);
      l = toDecimal(l);
      l = `${l} * ${weight}`;
      // console.log('---->', weight, l);
      // l = round(l);
      // l = calc(l);

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
};
