import { rgb } from '../rgb/rgb.mjs';
import { hsl } from '../hsl/hsl.mjs';
import { parseArgs } from '../../utils/ast/parseArgs.mjs';
import { getArgs } from '../../utils/ast/getArgs.mjs';
import { parseFn } from '../../utils/ast/parseFn.mjs';
import { stripCalc } from '../../utils/calc/stripCalc.mjs';

import { toDecimal } from '../../lib/utils.mjs';
import { getColorArgs } from '../../utils/colors/getColorArgs.mjs';
/**
 * Mixes two css colors.
 * @param {string} color1 A css color value
 * @param {string} color2 Another css color value
 * @param {(number|string)} [weight=0.25] weight The amount by which colors are mixed
 * @returns {string} The resulting mixed color
 */
export function colorMix(method, ...colors) {
  let args = parseArgs([...arguments].join(', '), { subTokens: true })

  const methodIndex = args.findIndex((arg)=> arg[0].startsWith('in'));

  const toSpace = methodIndex >= 0 ? args[methodIndex].pop().split(/\s+/).pop() : '';

  args = methodIndex >= 0 ? args.slice(methodIndex + 1) : args;


  if (!toSpace) {
    throw new Error('colorMix: missing target color space');
  }

  if (toSpace !== 'rgb') {
    throw new Error('colorMix: unsupported target color space');
  }
  
  colors = args.map((arg) => arg[0]);

  const weights = args.map((arg) => typeof (arg[1]) !== 'undefined' ? arg[1] : 0.5);

  // Normalize weights if necessary
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = weights.map(weight => weight / totalWeight);

  const colorArgs = colors.map(color => {
    const [_name, ...rest] = parseFn(color);
    return [...getColorArgs(...rest)];
  });

  // Helper function to construct the calc expressions
  let colorComponents = ['r', 'g', 'b'].map((component, componentIndex) => {
    return colorArgs.map((color, colorIndex) => {
      const componentValue = stripCalc(color[componentIndex]);
      return `(${componentValue} * ${normalizedWeights[colorIndex]})`;
    }).join(' + ');
  });

  colorComponents = colorComponents.map((component) => `calc(${component})`);

  return `rgb(${colorComponents[0]}, ${colorComponents[1]}, ${colorComponents[2]})`;
}

