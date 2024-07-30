import { rgbToHsl, hslToRgb } from "./hsl.mjs";

function hsvToHsl(h, s, v) {
  const l = v - v * s / 2;
  const saturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

  return [h, saturation, l];
}

function hslToHsv(h, s, l) {
  const v = l + s * Math.min(l, 1 - l);
  const saturation = v === 0 ? 0 : 2 * (1 - l / v);

  return [h, saturation, v];
}

function hsvToRgb(h, s, v) {
  return hslToRgb(...hsvToHsl(h, s, v));
}

function rgbToHsv(r, g, b) {
  return hslToHsv(...rgbToHsl(r, g, b));
}

export { hsvToHsl, hslToHsv, hsvToRgb, rgbToHsv };