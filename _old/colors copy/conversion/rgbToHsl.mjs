import eq from '../../../lib/eq/eq.mjs';
import ifelse from '../../../lib/ifelse/ifelse.mjs';
import lt from '../../../lib/lt/lt.mjs';
import round from '../../../lib/round/round.mjs';

export const rgbToHsl = (r, g, b) => {
  const rn = `(${r})`;
  const gn = `(${g})`;
  const bn = `(${b})`;

  const max = `max(${r}, ${g}, ${b})`;
  const min = `min(${r}, ${g}, ${b})`;

  const m = `max(${max} - ${min}, 0.0000000000001)`;

  const l = `((${max} + ${min}) / 2)`;

  const s1 = `(${max} - ${min}) / (${max} + ${min})`;
  const s2 = `(${max} - ${min}) / (2.0 - ${max} - ${min})`;

  const s = ifelse(round(l), s2, s1);

  const hr = `${ifelse(lt(g, b), 6, 0)} + (${gn} - ${bn}) / (${m})`;
  const hg = `(2 + (${bn} - ${rn}) / (${m}))`;
  const hb = `(4 + (${rn} - ${gn}) / (${m}))`;

  const h = `(${ifelse(eq(rn, max), hr, ifelse(eq(gn, max), hg, hb))} * 60)`;

  return [h, s, l];
};