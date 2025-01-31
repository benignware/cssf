import { number, rad, unit } from '../../calc/number.mjs';
import { getColorFn } from '../../colors/getColorFn.mjs';
import { parseArgs } from '../../ast/parseArgs.mjs';
import { parseFn } from '../../ast/parseFn.mjs';
import { stripCalc } from '../../calc/stripCalc.mjs';
import { getColorArgs } from '../../colors/getColorArgs.mjs';


import * as rgbConversions from '../../colors/conversions/ref/rgb.mjs';
import * as hslConversions from '../../colors/conversions/ref/hsl.mjs';
import * as hwbConversions from '../../colors/conversions/ref/hwb.mjs';
import * as labConversions from '../../colors/conversions/ref/lab.mjs';
import * as xyzConversions from '../../colors/conversions/ref/xyz.mjs';

export * from './env2022.mjs';


export const pi = Math.PI;
export const NaN = Number.NaN;
export const infinity = Infinity;
export const e = Math.E;

export const sin = x =>  Math.sin(rad(x));
export const cos = x => Math.cos(rad(x));
export const tan = x => Math.tan(rad(x));
export const asin = x => Math.asin(rad(x));
export const acos = x => Math.acos(rad(x));
export const atan = x => Math.atan(rad(x));
export const atan2 = (y, x) => Math.atan2(number(y), number(x));

export const pow = (x, y) => {
  // console.log('pow', number(x), number(y), Math.pow(number(x), number(y)));
  return Math.pow(Math.abs(number(x)), number(y));
}

export const sqrt = x => number(x) < 0 ? 'NaN' : Math.sqrt(number(x));

export const log = (x, base = e) => {
  const num = number(x);
  const b = number(base);
  if (num <= 0 || b <= 0 || b === 1) return Number.NaN; // Gracefully handle invalid log inputs
  return Math.log(num) / Math.log(b);
};

export const exp = x => Math.exp(number(x));

// lab, hwb, color, etc
export const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });
export const rgba = rgb;

export const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
export const hsla = hsl;

export const hwb = getColorFn('hwb', 'hwb', { ...hwbConversions }, { units: ['deg', '%', '%'] });

export const lab = getColorFn('lab', 'lab', { ...labConversions });

export const color = getColorFn('color',
  [ 'srgb', 'xyz' ],
  {
    ...rgbConversions,
    ...xyzConversions
  }
);


export function colorMix(method, ...colors) {
  let args = parseArgs([...arguments].join(', '), { subTokens: true })

  const methodIndex = args.findIndex((arg)=> arg[0].startsWith('in'));
  const toSpace = methodIndex >= 0 ? args[methodIndex].pop().split(/\s+/).pop() : '';

  args = methodIndex >= 0 ? args.slice(methodIndex + 1) : args;

  if (!toSpace) {
    throw new Error('colorMix: missing target color space');
  }

  if (!toSpace.endsWith('rgb')) {
    throw new Error(`colorMix: unsupported target color space ${toSpace}`);
  }
  
  colors = args.map((arg) => arg[0]);
  let weights = args.map((arg) => typeof (arg[1]) !== 'undefined' ? arg[1] : '50%');
  weights = weights.map(w => {
    const num = number(w);

    if (isNaN(num)) {
      return w;
    }

    const u = unit(w);

    if (u === '%') {
      return num / 100;
    }

    return w;
  });

  // Normalize weights if necessary
  const totalWeight = weights.reduce((sum, weight) => `((${sum}) + (${weight}))`, 0);
  const normalizedWeights = weights.map(weight => `(${weight} / ${totalWeight})`);

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
