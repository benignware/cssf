const calc = require('../calc');
const rgba = require('../rgba');
const hsla = require('../hsla');
const { parseFn, toDecimal, stripCalc } = require('../utils');

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

module.exports = mix;
