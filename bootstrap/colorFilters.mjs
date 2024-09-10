import {
  hexToHSL,
  hslToHex,
  rgbToHsl,
  hslToRgb,
  getContrastRatio,
  getLuminance,
  hexToRgb,
} from './colorUtils.mjs';

export const MIN_BACKGROUND_LIGHTNESS = 0.2; // Minimum lightness for dark theme background
export const MAX_BACKGROUND_LIGHTNESS = 0.9; // Maximum lightness for light theme background

export function adjustToShade(color, amount = 0.15) {
  const hsl = hexToHSL(color);
  hsl.l = Math.max(0, hsl.l - amount); // Darken the lightness
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function adjustToTint(color, amount = 0.05) {
  const hsl = hexToHSL(color);
  hsl.l = Math.min(1, hsl.l + amount); // Lighten the lightness
  return hslToHex(hsl.h, hsl.s, hsl.l);
}



// export function adjustColorForContrast(baseColor, contrastColor, targetRatio) {
//   let adjustedColor = baseColor;
//   let ratio = getContrastRatio(baseColor, contrastColor);

//   while (ratio < targetRatio) {
//     adjustedColor = adjustToTint(adjustedColor, 0.05); // Example: lighten the color
//     ratio = getContrastRatio(adjustedColor, contrastColor);
//   }

//   return adjustedColor;
// }


// export function adjustColorForContrast(baseColor, lightReferenceColor = '#FFFFFF', darkReferenceColor = '#000000') {
//   console.log('ADJUST COLOR FOR CONTRAST', baseColor);
//   // Define reference colors

//   // Determine which reference color to use
//   const baseLuminance = getLuminance(baseColor);
//   const lightLuminance = getLuminance(lightReferenceColor);
//   const darkLuminance = getLuminance(darkReferenceColor);

//   // Choose the reference color based on the base color's luminance
//   const contrastColor = baseLuminance > 0.5 ? darkReferenceColor : lightReferenceColor;

//   return contrastColor;
// }
export function adjustColorForContrast(baseColor, possibleColors = ['#ffffff', '#000000'], targetRatio = 4.5) {
  // Helper function to find the best contrast color from the list
  const getBestContrastColor = (baseColor, possibleColors, targetRatio) => {
    let bestColor = baseColor;
    let highestRatio = 0;
    
    possibleColors.forEach(color => {
      const currentRatio = getContrastRatio(color, baseColor);
      
      // Check if this color meets the target ratio
      if (currentRatio >= targetRatio && currentRatio > highestRatio) {
        highestRatio = currentRatio;
        bestColor = color;
      }
    });
    
    return bestColor;
  };

  // Determine luminance of the base color
  const baseLuminance = getLuminance(baseColor);

  // Include the adjusted base color in the list of possible colors
  const allColors = [baseColor, ...possibleColors];
  
  // Find the best contrast color from the list
  return getBestContrastColor(baseColor, allColors, targetRatio);
}

// import {
//   hexToHSL,
//   hslToHex,
//   rgbToHsl,
//   hslToRgb,
//   getContrastRatio,
//   hexToRgb,
// } from './colorUtils.mjs';

// import { adjustToShade, adjustToTint, MIN_BACKGROUND_LIGHTNESS, MAX_BACKGROUND_LIGHTNESS } from './colorUtils.mjs';

// export function adjustColorForContrast(baseColor, lightReferenceColor = '#FFFFFF', darkReferenceColor = '#000000') {
//   console.log('ADJUST COLOR FOR CONTRAST', baseColor);

//   // Convert colors to HSL to access lightness
//   const baseHsl = hexToHSL(baseColor);
//   const lightHsl = hexToHSL(lightReferenceColor);
//   const darkHsl = hexToHSL(darkReferenceColor);

//   // Get contrast ratios with both reference colors
//   const contrastWithLight = getContrastRatio(baseColor, lightReferenceColor);
//   const contrastWithDark = getContrastRatio(baseColor, darkReferenceColor);

//   let adjustedColor = baseColor;

//   // Determine the better contrast color and adjust accordingly
//   if (contrastWithLight > contrastWithDark) {
//     // Light reference color provides better contrast
//     if (baseHsl.l > MAX_BACKGROUND_LIGHTNESS) {
//       adjustedColor = adjustToShade(baseColor, baseHsl.l - MAX_BACKGROUND_LIGHTNESS);
//     }
//   } else {
//     // Dark reference color provides better contrast
//     if (baseHsl.l < MIN_BACKGROUND_LIGHTNESS) {
//       adjustedColor = adjustToTint(baseColor, MIN_BACKGROUND_LIGHTNESS - baseHsl.l);
//     }
//   }

//   return adjustedColor;
// }



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

export function adjustBackgroundColorForLightTheme(primaryColor) {
  const hsl = hexToHSL(primaryColor);
  hsl.l = MAX_BACKGROUND_LIGHTNESS;
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function adjustBackgroundColorForDarkTheme(primaryColor) {
  const hsl = hexToHSL(primaryColor);
  hsl.l = MIN_BACKGROUND_LIGHTNESS;
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

// Helper function to adjust color by hue
function adjustColorByHue(color, targetHue) {
  const hsl = hexToHSL(color);
  hsl.h = targetHue / 360; // Adjust hue
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

// Adjust color to reddish
export function adjustColorToReddish(color) {
  console.log('red', color);
  return adjustColorByHue(color, 0); // Adjust to red hue
}

// Adjust color to greenish
export function adjustColorToGreenish(color) {
  console.log('green', color);
  return adjustColorByHue(color, 120); // Adjust to green hue
}

// Adjust color to orangish
export function adjustColorToOrangish(color) {
  console.log('orange', color);
  return adjustColorByHue(color, 30); // Adjust to orange hue
}

// Adjust color to bluish
export function adjustColorToBluish(color) {
  console.log('blue', color);
  return adjustColorByHue(color, 240); // Adjust to blue hue
}

export function adjustColorByLightness(color, amount) {
  const hsl = hexToHSL(color);
  hsl.l = Math.max(0, Math.min(1, hsl.l + amount)); // Ensure lightness stays within 0 to 1 range
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

// Function to adjust color lightness within specified bounds
export function adjustColorToLightnessBound(color, targetLightness, minLightness = 0, maxLightness = 1) {
  console.log('adjustColorToLightnessBound', color, targetLightness, minLightness, maxLightness);
  const hsl = hexToHSL(color);
  // Calculate the amount to adjust lightness
  if (hsl.l < minLightness) {
    hsl.l = minLightness;
  } else if (hsl.l > maxLightness) {
    hsl.l = maxLightness;
  } else {
    // If within bounds, adjust towards the target lightness
    hsl.l = Math.max(minLightness, Math.min(maxLightness, targetLightness));
  }
  return hslToHex(hsl.h, hsl.s, hsl.l);
}


