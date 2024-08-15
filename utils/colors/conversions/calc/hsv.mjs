import { eq } from '../../../../fn/eq';
import { ifelse } from '../../../../fn/ifelse';
import { or } from '../../../../fn/or';

export const hsvToHsl = (h, s, v) => {
    const l = `(${v} - ${s} * ${v} / 2)`;
    const si = `(${v} - ${l}) / min(${l}, 1 - l)`;
    const c = or(eq(l, 0), eq(l, 1));

    const sl = ifelse(c, 0, si);
  
    return [ h, sl, l ];
}

export const hslToHsv = (h, s, l) => {
    const v = `(${l} + ${s} * ${l})`;
    const si = `(${v} - ${l}) / ${v}`;
    const c = or(eq(v, 0), eq(v, 1));

    const sv = ifelse(c, 0, si);

    return [ h, sv, v ];
}