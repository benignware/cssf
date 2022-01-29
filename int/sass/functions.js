const { Color } = require('chroma-js');
const chroma = require('chroma-js');
const sass = require('sass');

const {
  hsla,
  rgba,
  hue,
  saturation,
  lightness,
  red,
  green,
  blue,
  darken,
  mix,
} = require('../../lib');

const getArgs = (...args) =>
  args.map((arg) => (String(arg) !== 'null' ? String(arg) : undefined));

const fnProxy = (fn) =>
  function (...args) {
    args = getArgs(...args);
    console.log('**** CALL FN: ', `${fn.name}(${args.join(', ')})`);

    try {
      const result = fn(...args);

      console.log('**** FN RESULT: ', result);

      if (typeof result === 'number' || !isNaN(parseFloat(result))) {
        console.log('NUMBER TYPE');
        return new sass.types.Number(result);
      }

      try {
        const color = chroma(result);

        return new sass.types.Color(...color.rgba())
      } catch (e) {
        console.log('no color');
      }

      return new sass.types.String(result);
    } catch (error) {
      console.log('ERR', error);
    }

    return sass.types.Null.NULL;
  };

const functions = {
  'f-hsla($h, $s: null, $l:null, $a: null)': fnProxy(hsla),
  'f-rgba($h, $s: null, $l:null, $a: null)': fnProxy(rgba),
  'f-hue($color)': fnProxy(hue),
  'f-saturation($color)': fnProxy(saturation),
  'f-lightness($color)': fnProxy(lightness),
  'f-red($color)': fnProxy(red),
  'f-green($color)': fnProxy(green),
  'f-blue($color)': fnProxy(blue),
  'f-darken($color, $weight: null)': fnProxy(darken),
  'f-mix($color1, $color2, $weight: null)': fnProxy(mix),
};

module.exports = functions;
