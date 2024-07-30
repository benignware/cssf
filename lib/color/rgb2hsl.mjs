import eq from '../eq/eq.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import lt from '../lt/lt.mjs';
import round from '../round/round.mjs';
import { stripCalc } from '../utils.mjs';

export const rgb2hsl = (r, g, b, a = 1) => {
  const rn = `(${r})`;
  const gn = `(${g})`;
  const bn = `(${b})`;

  const max = `max(${rn}, ${gn}, ${bn})`;
  const min = `min(${rn}, ${gn}, ${bn})`;

  const maxminusmin = `max(${max} - ${min}, 0.0000000000001)`;

  const l = `((${max} + ${min}) / 2)`;

  const s1 = `(${max} - ${min}) / (${max} + ${min})`;
  const s2 = `(${max} - ${min}) / (2.0 - ${max} - ${min})`;

  const s = ifelse(round(l), s2, s1);

  const hr = `${ifelse(lt(g, b), 6, 0)} + (${gn} - ${bn}) / (${maxminusmin})`;
  const hg = `(2 + (${bn} - ${rn}) / (${maxminusmin}))`;
  const hb = `(4 + (${rn} - ${gn}) / (${maxminusmin}))`;

  const h = `(${ifelse(eq(rn, max), hr, ifelse(eq(gn, max), hg, hb))} * 60)`;

  return [h, s, l, a];
};