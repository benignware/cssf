import { getColorFn } from '../../utils/colors/getColorFn.mjs';

import * as hsvCalcConversions from '../../utils/colors/conversions/calc/hsv.mjs';

export const hsv = getColorFn('hsv', 'hsv', hsvCalcConversions, {
  identifiers: ['h', 's', 'v'],
  input: {
    colorSpace: 'hsl',
    funcName: 'hsl',
    identifiers: ['h', 's', 'l'],
    units: ['deg', '%', '%']
  },
  output: {
    colorSpace: 'hsl',
    units: ['deg', '%', '%']
  },
  units: ['deg', '%', '%']
});
