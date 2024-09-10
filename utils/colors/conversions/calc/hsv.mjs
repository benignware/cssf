import { hslToRgb, rgbToHsl } from './hsl.mjs';


import { eq } from '../../../../fn/eq/eq.mjs';
import { ifelse } from '../../../../fn/ifelse/ifelse.mjs';
import { or } from '../../../../fn/or/or.mjs';

// export const hsvToHsl = (h, s, v) => {
//     const l = `(${v} - ${s} * ${v} / 2)`;
//     const si = `(${v} - ${l}) / min(${l}, 1 - l)`;
//     const c = or(eq(l, 0), eq(l, 1));

//     const sl = ifelse(c, 0, si);
  
//     return [ h, sl, l ];
// }

// export const hslToHsv = (h, s, l) => {
//     const v = `(${l} + ${s} * ${l})`;
//     const si = `(${v} - ${l}) / ${v}`;
//     const c = or(eq(v, 0), eq(v, 1));

//     const sv = ifelse(c, 0, si);

//     return [ h, sv, v ];
// }



export const hsvToHsl = (h, s, v) => {
 
  const l = `(2 - (${s})) * (${v}) / 2`;

  const d = `min(${l}, 1 - ${l})`;
  const cd = eq(d, 0);
  const c1 = eq(l, 0);
  const c2 = eq(l, 1);
  
  const c = or(c1, c2);

  const sl = ifelse(
    cd,
    0,
    ifelse(
      c,
      0,
      `(${v} - ${l}) / ${d}`
    ),
  );

  return [h, sl, l];
}

export const hslToHsv = (h, s, l) => {
  const delta = `(1 - max(2 * (${l}) - 1, 0))`;
  const v = `(${l} + ${s} * ${delta} / 2) * 1`; // For some reason, we need to multiply by 1 to get the correct value
  const c = eq(v, 0);
  const ss = `2 * (1 - ${l} / ${v})`;
  const sve = ifelse(c, 0, ss);

  return [h, sve, v];
}

// HSV to HSL
// export const hsvToHsl = (h, s, v) => {
//   const l = (2 - s) * v / 2;
//   const sHsl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

//   return [h, sHsl, l];
// }

// // HSL to HSV
// export const hslToHsv = (h, s, l) => {
//   const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
//   const sHsv = v === 0 ? 0 : 2 * (1 - l / v);

//   return [h, sHsv, v];
// }

// // HSV to RGB using HSL to RGB
// export const hsvToRgb = (h, s, v) => {
//   // Convert HSV to HSL
//   const [hHsl, sHsl, lHsl] = hsvToHsl(h, s, v);

//   // Convert HSL to RGB
//   return hslToRgb(hHsl, sHsl, lHsl);
// };

// // RGB to HSV using RGB to HSL
// export const rgbToHsv = (r, g, b) => {
//   // Convert RGB to HSL
//   const [hHsl, sHsl, lHsl] = rgbToHsl(r, g, b);

//   // Convert HSL to HSV
//   return hslToHsv(hHsl, sHsl, lHsl);
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

// export const hsvToHwb = (h, s, v) => {
//   // const l = (2 - s) * v / 2;
//   const l = `(2 - ${s}) * ${v} / 2`;
//   const c1 = eq(v, 0);
//   const c2 = or(eq(l, 0), eq(l, 1));

//   // const sHwb = ifelse(
//   //   c2,
//   //   0,
//   //   ifelse(
//   //     c1,
//   //     0,
//   //     `2 * (1 - ${l} / ${v})`
//   //   )
//   // );

//   const sHwb = ifelse(
//     c2,
//     0,
//     `2 * (1 - ${l} / ${v})`
//   );

//   return [h, sHwb, l];

//   const sHsl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

//   return [h, sHsl, l];
// };

// export const hwbToHsv = (h, w, b) => {
//   const v = 1 - b;
//   const s = 1 - w / v;

//   return [h, s, v];
// }