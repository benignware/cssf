import { unit } from '../../calc/number.mjs';
import { getColorFn } from '../../colors/getColorFn.mjs';

import * as hslConversions from '../../colors/conversions/ref/hsl.mjs';

export const min = (...values) => {
  const u = values
    .map(value => unit(value))
    .filter(u => u && u !== '%')[0] || '';
  const v = String(Math.min(...values.map(value => parseFloat(value))));

  if (isNaN(v)) {
    return `min(${values.join(', ')})`;
  }

  return v + u;
};

export const max = (...values) => {
  // console.log('MAX', values);
  const u = values
    .map(value => unit(value))
    .filter(u => u && u !== '%')[0] || '';
  const v = String(Math.max(...values.map(value => parseFloat(value))));

  if (isNaN(v)) {
    return `max(${values.join(', ')})`;
  }

  return v + u;
};

export const clamp = (() => {
  
  const _min = min;
  const _max = max;

  return (min, value, max) => {
    // console.log('CLAMP, ', min, value, max);
    return _max(min, _min(value, max));
  };
})();

// export const rgb = getColorFn('rgb', 'rgb', {}, { legacyFormat: true });
// export const rgba = rgb;

// export const hsl = getColorFn('hsl', 'hsl', hslConversions, { units: ['deg', '%', '%'], legacyFormat: true });
// export const hsla = hsl;
