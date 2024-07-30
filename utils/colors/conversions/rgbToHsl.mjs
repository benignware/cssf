export const rgbToHsl = (r, g, b) => {
  // Normalize RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  // Find max and min values of RGB
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate Lightness
  let l = (max + min) / 2;

  // Calculate Saturation
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  // Calculate Hue
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = (g - b) / delta + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else if (max === b) {
      h = (r - g) / delta + 4;
    }
    h /= 6;
  }

  // Convert H, S, and L to expected ranges
  h *= 360;
  s *= 100;
  l *= 100;

  return [h, s, l];
};
