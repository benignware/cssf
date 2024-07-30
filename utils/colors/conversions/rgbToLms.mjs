/**
 * Converts RGB color space to LMS color space.
 *
 * @param {number} r - The red component of the color, in the range [0, 255].
 * @param {number} g - The green component of the color, in the range [0, 255].
 * @param {number} b - The blue component of the color, in the range [0, 255].
 * @returns {number[]} - An array with the LMS values: [L, M, S].
 */
export const rgbToLms = (r, g, b) => {
  // Normalize RGB values to [0, 1]
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // RGB to LMS conversion matrix
  const matrix = [
    [0.4002, 0.7075, -0.0808],
    [-0.2263, 1.1653, 0.0457],
    [0.0000, 0.0000, 0.9182]
  ];

  // Convert RGB to LMS
  const L = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const M = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const S = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

  return [L, M, S];
}
