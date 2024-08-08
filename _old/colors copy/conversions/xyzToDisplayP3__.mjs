export function xyzToDisplayP3(x, y, z) {
  console.log('Converting XYZ to Display-P3', x, y, z);
  // Normalize XYZ to D65 illuminant
  const X = x / 95.047; // Reference white for D65
  const Y = y / 100.000;
  const Z = z / 108.883;

  console.log('Normalized XYZ', X, Y, Z);

  // Display-P3 transformation matrix
  const r = X * 1.6799188 + Y * (-0.2540434) + Z * (-0.0027040);
  const g = X * (-0.5171170) + Y * 1.2560133 + Z * 0.2152001;
  const b = X * 0.0366218 + Y * (-0.0122517) + Z * 0.7302051;

  console.log('Display-P3', r, g, b);

  // Apply gamma correction for Display-P3
  const displayP3 = [r, g, b].map(value => {
    if (value <= 0.0031308) {
      return 12.92 * value;
    } else {
      return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    }
  });

  console.log('Gamma corrected Display-P3', displayP3);

  // Ensure values are clamped between 0 and 1, then convert to [0, 255] range
  const result = displayP3.map(value => Math.round(Math.max(0, Math.min(1, value)) * 255));

  console.log('Clamped Display-P3', result);

  return result;
}