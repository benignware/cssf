// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  // Convert hue to a value between 0 and 1
  h = h % 1 / 1;

  // Convert saturation and lightness to a value between 0 and 1
  // s = s / 100;
  // l = l / 100;

  let r, g, b;

  if (s === 0) {
    // If saturation is 0, the color is grayscale
    r = g = b = l;
  } else {
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  // Convert RGB values to a value between 0 and 1
  // r = r / 255;
  // g = g / 255;
  // b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h, s, l;

  // Calculate hue
  if (max === min) {
    h = 0; // Hue is undefined for grayscale colors
  } else if (max === r) {
    h = ((g - b) / (max - min) + 6) % 6;
  } else if (max === g) {
    h = (b - r) / (max - min) + 2;
  } else {
    h = (r - g) / (max - min) + 4;
  }

  h = h * 60; // Convert hue to degrees

  h = h / 360; // Convert hue to a value between 0 and 1

  // Calculate lightness
  l = (max + min) / 2;

  // Calculate saturation
  if (max === min) {
    s = 0; // Saturation is 0 for grayscale colors
  } else if (l <= 0.5) {
    s = (max - min) / (max + min);
  } else {
    s = (max - min) / (2 - max - min);
  }

  return [h, s, l];
}

export { hslToRgb, rgbToHsl };