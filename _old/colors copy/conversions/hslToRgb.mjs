export const hslToRgb = (h, s, l) => {
  // Normalize H, S, and L
  h /= 360;
  // s /= 100;
  // l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
  const x = c * (1 - Math.abs((h * 6) % 2 - 1)); // Intermediate value
  const m = l - c / 2; // Match lightness

  // Map hue segments to RGB values
  const hueToRgb = {
    0: [c, x, 0],
    1: [x, c, 0],
    2: [0, c, x],
    3: [0, x, c],
    4: [x, 0, c],
    5: [c, 0, x]
  };

  // Compute RGB values based on hue segment
  const segment = Math.floor(h * 6);
  const [r, g, b] = hueToRgb[segment % 6] || [0, 0, 0];

  // Adjust RGB with lightness offset and return
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};
