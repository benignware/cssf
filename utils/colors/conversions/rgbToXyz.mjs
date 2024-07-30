/**
 * Converts RGB color space to XYZ color space.
 *
 * @param {number} R - The R value in the RGB color space (0-255).
 * @param {number} G - The G value in the RGB color space (0-255).
 * @param {number} B - The B value in the RGB color space (0-255).
 * @returns {number[]} - An array with the XYZ values: [X, Y, Z].
 */
export function rgbToXyz(R, G, B) {
  // Normalize RGB values to the range [0, 1]
  const r = R / 255;
  const g = G / 255;
  const b = B / 255;

  // Reverse gamma correction (sRGB to linear RGB)
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Transformation matrix from linear RGB to XYZ
  const X = linearR * 0.4124564 + linearG * 0.3575761 + linearB * 0.1804375;
  const Y = linearR * 0.2126729 + linearG * 0.7151522 + linearB * 0.0721750;
  const Z = linearR * 0.0193339 + linearG * 0.1191920 + linearB * 0.9503041;

  // Return XYZ values (scaled by 100)
  return [X * 100, Y * 100, Z * 100];
}
