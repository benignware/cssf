// Define the XYZ to RGB matrix for sRGB with D65 white point
const xyzToRgbMatrixD65 = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9683450,  1.8759317,  0.0415550],
  [0.0556434, -0.2040259,  1.0572252]
];

// Gamma correction function for sRGB
const gammaCorrect = value => {
  return value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
};

// Convert XYZ to RGB
export function xyzToRgb(x, y, z, targetWhitePoint = [95.047, 100.000, 108.883], sourceWhitePoint = [95.047, 100.000, 108.883]) {
  // Convert XYZ from target white point to source white point
  const [sourceX, sourceY, sourceZ] = sourceWhitePoint;
  const [targetX, targetY, targetZ] = targetWhitePoint;

  // Adjust XYZ for source white point to target white point
  const xyzSource = [
      x * (sourceX / targetX),
      y * (sourceY / targetY),
      z * (sourceZ / targetZ)
  ];

  // Use matrix for the source white point (D65)
  const xyzToRgbMatrix = xyzToRgbMatrixD65;

  // Convert XYZ to RGB
  const rgb = [
      xyzSource[0] * xyzToRgbMatrix[0][0] + xyzSource[1] * xyzToRgbMatrix[0][1] + xyzSource[2] * xyzToRgbMatrix[0][2],
      xyzSource[0] * xyzToRgbMatrix[1][0] + xyzSource[1] * xyzToRgbMatrix[1][1] + xyzSource[2] * xyzToRgbMatrix[1][2],
      xyzSource[0] * xyzToRgbMatrix[2][0] + xyzSource[1] * xyzToRgbMatrix[2][1] + xyzSource[2] * xyzToRgbMatrix[2][2]
  ];

  // Apply gamma correction and convert to 0-255 range
  const rgbCorrected = rgb.map(value => {
      // Ensure values are in the range [0, 1] before gamma correction
      value = Math.max(0, Math.min(1, value));
      return Math.round(gammaCorrect(value) * 255);
  });

  // Ensure RGB values are within valid range [0, 255]
  return rgbCorrected.map(value => Math.max(0, Math.min(255, value)));
}
