// hslToHsv.mjs
export function hslToHsv(h, s, l) {
  // Normalize hue to be within [0, 1)
  h = ((h % 1) + 1) % 1;
  
  // Lightness adjustment
  const lmin = Math.max(l, 0.000001); // Avoid division by zero
  
  // Lightness doubled
  l *= 2;
  
  // Adjust saturation
  s *= (l <= 1) ? l : 2 - l;
  const smin = s * (lmin <= 1 ? lmin : 2 - lmin);
  
  // Calculate value (v)
  const v = (l + s) / 2;
  
  // Calculate saturation for HSV
  const sv = v === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

  return { h, s: sv, v };
}
