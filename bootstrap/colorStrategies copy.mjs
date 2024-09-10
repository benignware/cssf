// colorStrategies.mjs

import { hexToHSL, hslToHex, getLightness } from "./colorUtils.mjs";

export function adjustToGrayscale(color) {
  const hsl = hexToHSL(color);
  hsl.s = 0; // remove saturation
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function adjustColorForComplementary(color) {
  const hsl = hexToHSL(color);
  hsl.h = (hsl.h + 0.5) % 1; // shift hue by 180 degrees
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function adjustColorForIdentity(color, theme) {
  const hsl = hexToHSL(color);
  const adjustment = theme === 'light' ? 0.2 : -0.2; // Adjust the tone based on theme
  hsl.l = Math.max(0, Math.min(1, hsl.l + adjustment));
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function generateBorderColor(backgroundColor, textColor, MAX_BACKGROUND_LIGHTNESS, MIN_BACKGROUND_LIGHTNESS) {
  const textLuminance = getLightness(textColor);
  const borderColorLuminance = Math.max(Math.min(textLuminance + 0.3, MAX_BACKGROUND_LIGHTNESS), MIN_BACKGROUND_LIGHTNESS);
  const hsl = hexToHSL(textColor);
  return hslToHex(hsl.h, hsl.s, borderColorLuminance);
}

export function generateFunctionalColor(type, primaryColor, MIN_BACKGROUND_LIGHTNESS, MAX_BACKGROUND_LIGHTNESS) {
  const hslPrimary = hexToHSL(primaryColor);
  const primaryLightness = hslPrimary.l;

  const functionalColorAttributes = {
    'success': { h: 120 / 360, s: 0.5, l: primaryLightness * 1.1 },
    'warning': { h: 45 / 360, s: 0.8, l: primaryLightness * 1.2 },
    'error': { h: 0 / 360, s: 0.8, l: primaryLightness * 0.9 },
    'info': { h: 200 / 360, s: 0.6, l: primaryLightness * 1.0 }
  };

  const colorAttrs = functionalColorAttributes[type] || { h: 0, s: 0, l: 0.5 };
  const adjustedLightness = Math.max(MIN_BACKGROUND_LIGHTNESS, Math.min(MAX_BACKGROUND_LIGHTNESS, colorAttrs.l));
  return hslToHex(colorAttrs.h, colorAttrs.s, adjustedLightness);
}
