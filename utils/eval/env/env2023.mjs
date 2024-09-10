import { number, rad } from '../../calc/number.mjs';
import { getColorFn } from '../../colors/getColorFn.mjs';

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
  if (num <= 0 || b <= 0 || b === 1) return 'NaN'; // Gracefully handle invalid log inputs
  return Math.log(num) / Math.log(b);
};

export const exp = x => Math.exp(number(x));

// lab, hwb, color, etc
export const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });

export const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
export const hwb = getColorFn('hwb', 'hwb', { ...hwbConversions }, { units: ['deg', '%', '%'] });

export const lab = getColorFn('lab', 'lab', { ...labConversions });

export const color = getColorFn('color',
  [ 'srgb', 'xyz' ],
  {
    ...rgbConversions,
    ...xyzConversions
  }
);