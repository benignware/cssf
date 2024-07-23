import rgba from '../rgba/rgba.mjs';
import lte from '../lte/lte.mjs';
import pow from '../pow/pow.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import { parseFn, stripCalc } from '../utils.mjs';
import { add, multiply, divide } from '../eval/coreEnv.mjs';

function sRGBtoLin(colorChannel) {
  colorChannel = stripCalc(colorChannel);

  const d = divide(colorChannel, 255);
  const l = lte(colorChannel, 0.04045 * 255);
  const a = divide(add(d, 0.055), 1.055);

  const r = ifelse(l, divide(d, 12.92), pow(a, 2.4, 3));

  return r;
}

/**
 * Computes luminance of a color.
 * Rather expensive, so try to avoid.
 * @param {string} color A css color value
 * @returns {string} A css expression representing luminance of given color
 */
function luminance(color) {
  const [r, g, b] = parseFn(rgba(color)).slice(1);

  const rl = sRGBtoLin(r);
  const gl = sRGBtoLin(g);
  const bl = sRGBtoLin(b);

  const rx = multiply(0.2126, rl);
  const gx = multiply(0.7152, gl);
  const bx = multiply(0.0722, bl);

  const Y = add(add(rx, gx), bx);

  return Y;
}

export default luminance;


// import rgba from '../rgba/rgba.mjs';
// import lte from '../lte/lte.mjs';
// import pow from '../pow/pow.mjs';
// import ifelse from '../ifelse/ifelse.mjs';
// import { parseFn, stripCalc } from '../utils.mjs';

// function sRGBtoLin(colorChannel) {
//   colorChannel = stripCalc(colorChannel);

//   const d = `${colorChannel} / 255`;
//   const l = lte(colorChannel, 0.04045 * 255);
//   const a = `(${d} + 0.055) / 1.055`;

//   const r = ifelse(l, `${d} / 12.92`, pow(a, 2.4, 3));

//   return r;
// }

// /**
//  * Computes luminance of a color.
//  * Rather expensive, so try to avoid.
//  * @param {string} color A css color value
//  * @returns {string} A css expression representing luminance of given color
//  */
// function luminance(color) {
//   const [r, g, b] = parseFn(rgba(color)).slice(1);

//   const rl = sRGBtoLin(r);
//   const gl = sRGBtoLin(g);
//   const bl = sRGBtoLin(b);

//   const rx = `0.2126 * ${rl}`;
//   const gx = `0.7152 * ${gl}`;
//   const bx = `0.0722 * ${bl}`;

//   const Y = `(${rx} + ${gx} + ${bx})`;

//   return Y;
// }

// export default luminance;
