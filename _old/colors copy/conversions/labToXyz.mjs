/**
 * Converts Lab color space to XYZ color space.
 *
 * @param {number} L - The L value in the Lab color space.
 * @param {number} a - The a value in the Lab color space.
 * @param {number} b - The b value in the Lab color space.
 * @returns {number[]} - An array with the XYZ values: [X, Y, Z].
 */
export const labToXyz = (L, a, b) => {
  // Inverse of the f function
  const fInv = (t) => t > 0.2068966 ? Math.pow(t, 3) : (t - 16 / 116) / 7.787;

  // Convert Lab to normalized XYZ values
  const Y = (L + 16) / 116;
  const X = a / 500 + Y;
  const Z = Y - b / 200;

  const Xn = fInv(X) * 95.047; // Reference white X
  const Yn = fInv(Y) * 100;    // Reference white Y
  const Zn = fInv(Z) * 108.883; // Reference white Z

  return [Xn, Yn, Zn];
}
