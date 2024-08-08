import ifelse from '../../../lib/ifelse/ifelse.mjs';
import lt from '../../../lib/lt/lt.mjs';
import abs from '../../../lib/abs/abs.mjs';
import mod from '../../../lib/mod/mod.mjs';
import gte from '../../../lib/gte/gte.mjs';
import and from '../../../lib/and/and.mjs';

export const hslToRgb = (h, s, l) => {
  const C = `(1 - ${abs(`2 * ${l} - 1`)}) * ${s}`;
  const X = `${C} * (1 - ${abs(`${mod(`${h} / 60`, 2)} - 1`)})`;
  const m = `(${l} - (${C} / 2))`;

  const rh = ifelse(and(gte(h, 120), lt(h, 240)), 0, ifelse(lt(h, 60), C, ifelse(gte(h, 300), C, X)));
  const gh = ifelse(gte(h, 240), 0, ifelse(and(lt(h, 180), gte(h, 60)), C, X));
  const bh = ifelse(lt(h, 120), 0, ifelse(and(lt(h, 300), gte(h, 180)), C, X));

  const r = `(${rh} + ${m}) * 255`;
  const g = `(${gh} + ${m}) * 255`;
  const b = `(${bh} + ${m}) * 255`;

  return [ r, g, b ];
};