import ifelse from "../../../lib/ifelse/ifelse.mjs";
import lt from "../../../lib/lt/lt.mjs";
import and from "../../../lib/and/and.mjs";
import gte from "../../../lib/gte/gte.mjs";
/**
 * Convert HWB (Hue, Whiteness, Blackness) to RGB (Red, Green, Blue).
 * @param {number} h - Hue (0 to 360 degrees)
 * @param {number} w - Whiteness (0 to 1)
 * @param {number} b - Blackness (0 to 1)
 * @returns {Array} - RGB array with red, green, and blue values in range [0, 255]
 */
export function hwbToRgb(h, W, B) {
  // Normalize hue to be within [0, 360]
  h = `mod(${h}, 360)`;

  // Calculate Chroma (C)
  const C = `(1 - ${W} - ${B})`;

  // Calculate X
  const X = `${C} * (1 - abs(mod(${h} / 60, 2) - 1))`;

  // Calculate RGB values based on hue sector
  let r = 0, g = 0, b = 0;

  const rh = ifelse(and(gte(h, 120), lt(h, 240)), 0, ifelse(lt(h, 60), C, ifelse(gte(h, 300), C, X)));
  const gh = ifelse(gte(h, 240), 0, ifelse(and(lt(h, 180), gte(h, 60)), C, X));
  const bh = ifelse(lt(h, 120), 0, ifelse(and(lt(h, 300), gte(h, 180)), C, X));

  // Adjust RGB by adding Whiteness (W) and ensure they are within [0, 1]
  const rw = `${rh} + ${W}`;
  const gw = `${gh} + ${W}`;
  const bw = `${bh} + ${W}`;

  // Ensure RGB values are within [0, 1]
  r = `max(0, min(1, ${rw}))`;
  g = `max(0, min(1, ${gw}))`;
  b = `max(0, min(1, ${bw}))`;

  // Scale RGB values to [0, 255]
  r = `${r} * 255`;
  g = `${g} * 255`;
  b = `${b} * 255`;

  // Round RGB values
  r = `round(${r})`;
  g = `round(${g})`;
  b = `round(${b})`;

  return [r, g, b];
}