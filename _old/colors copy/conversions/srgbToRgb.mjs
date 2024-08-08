export function srgbToRgb(r, g, b) {
  // Ensure sRGB values are in the range [0, 1]
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  // Convert sRGB to Linear RGB
  function toLinear(c) {
      return (c <= 0.04045) ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  let rLinear = toLinear(r);
  let gLinear = toLinear(g);
  let bLinear = toLinear(b);

  return { r: rLinear, g: gLinear, b: bLinear };
}
