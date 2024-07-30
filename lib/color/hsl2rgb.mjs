import { stripCalc } from '../utils.mjs';
import abs from '../abs/abs.mjs';
import and from '../and/and.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import gte from '../gte/gte.mjs';
// import round from '../round/round.mjs';
import rem from '../rem/rem.mjs';
import lt from '../lt/lt.mjs';
import mod from '../mod/mod.mjs';

export const hsl2rgb = (h, s, l, a = 1) => {
  h = stripCalc(h);
  s = stripCalc(s);
  l = stripCalc(l);
  a = stripCalc(a);

  const c = `(1 - ${abs(`2 * ${l} - 1`)}) * ${s}`;
  const x = `${c} * (1 - ${abs(`${mod(`${h} / 60`, 2)} - 1`)})`;
  const m = `(${l} - (${c} / 2))`;

  const rh = ifelse(
    and(gte(h, 120), lt(h, 240)),
    0,
    ifelse(lt(h, 60), c, ifelse(gte(h, 300), c, x))
  );
  const gh = ifelse(gte(h, 240), 0, ifelse(and(lt(h, 180), gte(h, 60)), c, x));
  const bh = ifelse(lt(h, 120), 0, ifelse(and(lt(h, 300), gte(h, 180)), c, x));

  // let r = `(${rh} + ${m}) * 255`;
  // let g = `(${gh} + ${m}) * 255`;
  // let b = `(${bh} + ${m}) * 255`;

  let r = `(${rh} + ${m})`;
  let g = `(${gh} + ${m})`;
  let b = `(${bh} + ${m})`;

  return [r, g, b, a];
};