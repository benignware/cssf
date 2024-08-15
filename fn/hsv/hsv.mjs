import { getColorFn } from '../../utils/colors/getColorFn.mjs';
import { eq } from '../eq/eq.mjs';
import { ifelse } from '../ifelse/ifelse.mjs';
import { or } from '../or/or.mjs';

import { getEval, ENV_2022 } from '../../utils/eval/getEval.mjs';

const e = getEval(ENV_2022);

const hsvCalcConversions = {
  hsvToHsl: (h, s, v) => {
    // console.log('!!!!!! CALC HSV TO HSL', h, s, v);
    const l = `(2 - ${s}) * ${v} / 2`;
    const sl = `(${v} - ${l}) / min(${l}, 1 - ${l})`;
    const c1 = eq(l, 0);
    const c2 = eq(l, 1);
    const c = or(c1, c2);
    const sHsl = ifelse(c, 0, sl);

    return [h, sHsl, l];
  },

  hslToHsv: (h, s, l) => {
    // console.log('!!!!!! CALC HSL TO HSV', h, s, l);
    const delta = `(1 - max(2 * (${l}) - 1, 0))`;
    const v = `(${l} + ${s} * ${delta} / 2) * 1`; // For some reason, we need to multiply by 1 to get the correct value
    const c = eq(v, 0);
    const ss = `2 * (1 - ${l} / ${v})`;
    const sve = ifelse(c, 0, ss);

    return [h, sve, v];
  }
};

export const hsv = getColorFn('hsv', 'hsv', { ...hsvCalcConversions }, {
  output: {
    colorSpace: 'hsl',
    format: ([h, s, l]) => {
      return `hsl(${h} ${s} ${l})`;
    },
    units: ['deg', '%', '%']
  },
  units: ['deg', '%', '%']
});
