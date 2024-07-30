/**
 * Converts XYZ color space to RGB color space.
 *
 * @param {number} X - The X value in the XYZ color space.
 * @param {number} Y - The Y value in the XYZ color space.
 * @param {number} Z - The Z value in the XYZ color space.
 * @returns {number[]} - An array with the RGB values: [R, G, B].
 */
export function xyzToRgb(X, Y, Z) {
  // Normalize XYZ values
  const Xn = X / 100;
  const Yn = Y / 100;
  const Zn = Z / 100;

  // Transformation matrix from XYZ to linear RGB
  const R = Xn *  3.2404542 + Yn * -1.5371385 + Zn * -0.4985314;
  const G = Xn * -0.9692660 + Yn *  1.8760108 + Zn *  0.0415560;
  const B = Xn *  0.0556434 + Yn * -0.2040259 + Zn *  1.0572252;

  // Apply gamma correction (linear RGB to sRGB)
  const gammaCorrect = value => value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

  // Convert to [0, 255] range and clamp values
  const r = Math.min(255, Math.max(0, Math.round(gammaCorrect(R) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(gammaCorrect(G) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(gammaCorrect(B) * 255)));

  return [r, g, b];
}
