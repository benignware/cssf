export function rgbToSrgb(r, g, b) {
  // Ensure Linear RGB values are in the range [0, 1]
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  // Convert Linear RGB to sRGB
  function toSrgb(c) {
      return (c <= 0.0031308) ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  let rSrgb = toSrgb(r);
  let gSrgb = toSrgb(g);
  let bSrgb = toSrgb(b);

  return { r: rSrgb, g: gSrgb, b: bSrgb };
}
