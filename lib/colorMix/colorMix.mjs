import rgba from '../rgba/rgba.mjs';
import hsla from '../hsla/hsla.mjs';
import evaluate from '../eval/eval_.mjs';
import { parseArgs, parseFn, toDecimal, stripCalc } from '../utils.mjs';

/**
 * Mixes two css colors.
 * @param {string} color1 A css color value
 * @param {string} color2 Another css color value
 * @param {(number|string)} [weight=0.25] weight The amount by which colors are mixed
 * @returns {string} The resulting mixed color
 */
function colorMix(method, color1, color2, weight = '50%') {
  const args = parseArgs([...arguments].join(', '), { subTokens: true })
  const methodIndex = args.findIndex((arg)=> arg[0].startsWith('in'));
  
  method = methodIndex > -1 ? args[methodIndex][1] : '';
  
  const colorWeights = args.slice(methodIndex + 1);

  let w1, w2;

  [[color1, w1 = ''], [color2, w2 = '']] = colorWeights;

  weight = w1 || w2 || weight;
  weight = `(1 - ${toDecimal(weight)})`;

  const format = color1.match(/hsl/) ? hsla : rgba;
  // console.log('method: ', method);
  // console.log('c1: ', color1, ' w1: ', w1);
  // console.log('c2: ', color2, ' w2: ', w2);
  // console.log('weight: ', weight);

  const [args1, args2] = [color1, color2]
    .map((color) => format(color))
    .map((color) => {
      const fn = parseFn(color)
        
      return fn
        .slice(1)
        .map((arg) => toDecimal(arg))
        .map((arg) => stripCalc(arg))
    });
  
  const resultArgs = [0, 0, 0, 0].map((_, index) =>
    `calc(((${args2[index]} - ${args1[index]}) * ${weight}) + ${args1[index]})`
  );

  const result = format(...resultArgs);

  return result;
}

export default colorMix;
