import { ifelse } from "../../../../fn/ifelse/ifelse.mjs";
import { abs } from "../../../../fn/abs/abs.mjs";
import { round } from "../../../../fn/round/round.mjs";
import { mod } from "../../../../fn/mod/mod.mjs";
import { gte } from "../../../../fn/gte/gte.mjs";
import { lt } from "../../../../fn/lt/lt.mjs";
import { and } from "../../../../fn/and/and.mjs";
import { eq } from "../../../../fn/eq/eq.mjs";

export const hslToRgb = (h, s, l) => {
  const C = `(1 - ${abs(`2 * ${l} - 1`)}) * ${s}`;
  
  let X = `${C} * (1 - ${abs(
    `mod(${h} / 60, 2) - 1`
  )})`;

  // X = `${C} * (1 - ${abs(
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

  // let h = mod(`((${hRaw}) * 60) + 360`, 360);

  let h = `mod((${hRaw}) * 60 + 360, 360)`;

  // h = round(h);
  // h = `clamp(${h}, 0, 360)`;
  l = `clamp(${l}, 0, 1)`;
  s = `clamp(${s}, 0, 1)`;

  return [ h, s, l ];
};

// export const hslToHwb = (h, s, v) => {
//   // Convert HSL to HWB
//   const W = `max(0, ${v} - ${s})`;
//   const B = `1 - ${v}`;

//   return [ h, W, B ];
// };

// export const hwbToHsv = (h, W, B) => {
//   // Convert HWB to HSL
//   const v = `1 - ${B}`;
//   const s = `1 - ${W} / ${v}`;

//   return [ h, s, v ];
// }

// export const hsvToHwb = (h, s, v) => {
//   // Convert HSV to HSL
//   const l = `(2 - ${s}) * ${v} / 2`;
//   // const S = `(${v} === 0) ? 0 : 2 * (1 - ${l} / ${v})`;

//   const c = eq(v, 0);
//   const S = ifelse(c, 0, `2 * (1 - ${l} / ${v})`);

//   return [ h, S, l ];
// }