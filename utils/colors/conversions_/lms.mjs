// implement a function to convert from lms to rgb. Input and output should be in their typical ranges, except percentages which should be normalized to be 0 < x < 1. 

export function lmsToRgb(l, m, s) {
  // Convert LMS to RGB
  let r = 0.0809 * l + -0.1305 * m + 0.1167 * s;
  let g = -0.0102 * l + 0.0540 * m + -0.1136 * s;
  let b = -0.0004 * l + -0.0041 * m + 0.6935 * s;

  // Clamp RGB values to be between 0 and 1
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  // Return RGB values as an array
  return [r, g, b];
}

export function rgbToLms(r, g, b) {

  // Convert RGB to LMS
  let l = 0.31399022 * r + 0.63951294 * g + 0.04649755 * b;
  let m = 0.15537241 * r + 0.75789446 * g + 0.08670142 * b;
  let s = 0.01775239 * r + 0.10944209 * g + 0.87256922 * b;

  // Clamp LMS values to be between 0 and 1
  l = Math.max(0, Math.min(1, l));
  m = Math.max(0, Math.min(1, m));
  s = Math.max(0, Math.min(1, s));

  // Return LMS values as an array
  return [l, m, s];
}