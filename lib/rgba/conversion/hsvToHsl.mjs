// hslToHsv.mjs
export function hslToHsv(h, s, l) {
  let sOut, vOut;

  if (s === 0) {
    sOut = 0;
    vOut = l;
  } else {
    sOut = 2 * (1 - l / 1) * s;
    vOut = l + sOut * Math.min(l, 1 - l);
  }

  return {
    h: h,
    s: sOut,
    v: vOut
  };
}
