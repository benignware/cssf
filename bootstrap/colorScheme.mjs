// colorScheme.mjs

import {
  mixColors,
  hexToRgb,
  rgbToHex,
  rgbToHsl
} from './colorUtils.mjs';
import {
  adjustToShade,
  adjustToTint,
  adjustColorForContrast,
  adjustToGrayscale,
  adjustColorForComplementary,
  adjustColorForIdentity,
  adjustBackgroundColor
} from './colorFilters.mjs';

export function generateColorScheme(primaryColor) {
  const secondaryColor = adjustColorForComplementary(primaryColor);
  const backgroundColor = adjustBackgroundColor(primaryColor, 'light');
  const textColor = adjustColorForContrast(primaryColor, backgroundColor, 4.5); // Ensure enough contrast

  return {
    primary: primaryColor,
    secondary: secondaryColor,
    background: backgroundColor,
    text: textColor
  };
}

export function generateDarkColorScheme(primaryColor) {
  const secondaryColor = adjustColorForComplementary(primaryColor);
  const backgroundColor = adjustBackgroundColor(primaryColor, 'dark');
  const textColor = adjustColorForContrast(primaryColor, backgroundColor, 7); // Ensure higher contrast for dark theme

  return {
    primary: primaryColor,
    secondary: secondaryColor,
    background: backgroundColor,
    text: textColor
  };
}
