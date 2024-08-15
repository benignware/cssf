import ifelse from '../../../../lib/ifelse/ifelse.mjs';
import abs from '../../../../lib/abs/abs.mjs';
import gte from '../../../../lib/gte/gte.mjs';
import lt from '../../../../lib/lt/lt.mjs';
import and from '../../../../lib/and/and.mjs';
import eq from '../../../../lib/eq/eq.mjs';
import mod from '../../../../lib/mod/mod.mjs';
import round from '../../../../lib/round/round.mjs';

export const hslToRgb = (h, s, l) => {
  const C = `(1 - ${abs(`2 * ${l} - 1`)}) * ${s}`;
  const X = `${C} * (1 - ${abs(
    `mod(${h} / 60, 2) - 1`
  )})`;

  // const X = `${C} * (1 - ${abs(
  //   mod(`(${h} / 60)`, 2) - 1
  // )})`;

  const m = `(${l} - (${C} / 2))`;

  const rh = ifelse(and(gte(h, 120), lt(h, 240)), 0, ifelse(lt(h, 60), C, ifelse(gte(h, 300), C, X)));
  const gh = ifelse(gte(h, 240), 0, ifelse(and(lt(h, 180), gte(h, 60)), C, X));
  const bh = ifelse(lt(h, 120), 0, ifelse(and(lt(h, 300), gte(h, 180)), C, X));

  let r = `((${rh} + ${m}) * 255)`;
  let g = `((${gh} + ${m}) * 255)`;
  let b = `((${bh} + ${m}) * 255)`;

  // r = `clamp(${r}, 0, 255)`;
  // g = `clamp(${g}, 0, 255)`;
  // b = `clamp(${b}, 0, 255)`;

  r = round(r);
  g = round(g);
  b = round(b);

  return [ r, g, b ];
};

export const rgbToHsl = (r, g, b) => {
  r = `clamp(${r}, 0, 255)`;
  g = `clamp(${g}, 0, 255)`;
  b = `clamp(${b}, 0, 255)`;

  // Normalize RGB values to [0, 1]
  const rn = `(${r} / 255)`;
  const gn = `(${g} / 255)`;
  const bn = `(${b} / 255)`;

  // Calculate max and min
  const max = `max(${rn}, ${gn}, ${bn})`;
  const min = `min(${rn}, ${gn}, ${bn})`;

  // Calculate Chroma
  const C = `(${max} - ${min})`;

  // Calculate Lightness
  let l = `((${max} + ${min}) / 2)`;

  // Define a small epsilon to avoid division by zero
  const epsilon = 1e-20;
  // const epsilon = 1.1368683772161603e-13;

  // Calculate s1 and s2 with clamped denominators
  const s1 = `${C} / max(${max} + ${min}, ${epsilon})`;
  const s2 = `${C} / max(2 - ${max} - ${min}, ${epsilon})`;

  // Calculate Saturation
  let s = ifelse(lt(l, 0.5), s1, s2);

  // Calculate Hue
  const h1 = ifelse(eq(rn, max), `(${gn} - ${bn}) / ${C}`, 0);
  const h2 = ifelse(eq(gn, max), `(${bn} - ${rn}) / ${C} + 2`, 0);
  const h3 = ifelse(eq(bn, max), `(${rn} - ${gn}) / ${C} + 4`, 0);

  const hRaw = ifelse(eq(C, 0), 0, ifelse(eq(rn, max), h1, ifelse(eq(gn, max), h2, h3)));
  // const h = `calc(${mod(`(${hRaw} * 60)`, 360)})`;
  // const h = `mod(${hRaw} * 60, 360)`;
  // let h = `mod(((${hRaw} * 60) + 360), 360)`;
  // let h = mod(`((${hRaw} * 60) + 360)`, 360);
  let h = mod(`((${hRaw}) * 60) + 360`, 360);

  h = `mod((${hRaw}) * 60 + 360, 360)`;

  // h = round(h);
  // h = `clamp(${h}, 0, 360)`;
  l = `clamp(${l}, 0, 1)`;
  s = `clamp(${s}, 0, 1)`;

  return [ h, s, l ];
};