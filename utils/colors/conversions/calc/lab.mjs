// import { ifelse } from '../../../../fn/ifelse/ifelse.mjs';
import { ifelse } from '../../../../fn/ifelse/ifelse.mjs';
import { cbrt } from '../../../../fn/cbrt/cbrt.mjs';
import { gt } from '../../../../fn/gt/gt.mjs';

// lab.mjs
// Constants for D65 white point
const D65_X = 0.95047;
const D65_Y = 1.00000;
const D65_Z = 1.08883;

// LAB to XYZ Conversion
export const labToXyz = (L, a, b) => {
  const fInv = (t) => {
    const t3 = `pow(${t}, 3)`;

    return ifelse(gt(t3, 0.008856), t3, `(${t} - 16 / 116) / 7.787`);
  };

  const Y = fInv(`(${L} + 16) / 116`);
  const X = fInv(`(${L} + 16) / 116 + ${a} / 500`);
  const Z = fInv(`(${L} + 16) / 116 - ${b} / 200`);

  return [
    `(${X} * ${D65_X})`, // D65 Reference White X
    `(${Y} * ${D65_Y})`, // D65 Reference White Y
    `(${Z} * ${D65_Z})`  // D65 Reference White Z
  ];
};

// XYZ to LAB Conversion
export const xyzToLab = (X, Y, Z) => {
  X = `(${X} / ${D65_X})`;
  Y = `(${Y} / ${D65_Y})`;
  Z = `(${Z} / ${D65_Z})`;

  const f = (t) => 
    ifelse(gt(t, 0.008856), cbrt(t), `(${t} * 7.787) + (16 / 116)`);

  return [
    `116 * ${f(Y)} - 16`,
    `500 * (${f(X)} - ${f(Y)})`,
    `200 * (${f(Y)} - ${f(Z)})`
  ];
};

