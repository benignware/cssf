// Gamma correction function for sRGB
const gammaCorrect = value => {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
};

// RGB to XYZ matrix for sRGB with D65 white point
const rgbToXyzMatrixD65 = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

// Convert RGB to XYZ using specific white points
export function rgbToXyz(r, g, b, targetWhitePoint = [95.047, 100.000, 108.883], sourceWhitePoint = [95.047, 100.000, 108.883]) {
  // Normalize RGB values to range 0-1
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;

  // Apply gamma correction
  r = gammaCorrect(r);
  g = gammaCorrect(g);
  b = gammaCorrect(b);

  // Use matrix for the source white point (defaulting to sRGB/D65)
  const rgbToXyzMatrix = rgbToXyzMatrixD65;

  // Convert RGB to XYZ in source white point
  const xyzSource = [
      r * rgbToXyzMatrix[0][0] + g * rgbToXyzMatrix[0][1] + b * rgbToXyzMatrix[0][2],
      r * rgbToXyzMatrix[1][0] + g * rgbToXyzMatrix[1][1] + b * rgbToXyzMatrix[1][2],
      r * rgbToXyzMatrix[2][0] + g * rgbToXyzMatrix[2][1] + b * rgbToXyzMatrix[2][2]
  ];

  // Convert XYZ from source white point to target white point
  const [sourceX, sourceY, sourceZ] = sourceWhitePoint;
  const [targetX, targetY, targetZ] = targetWhitePoint;

  const xyzTarget = [
      xyzSource[0] * (targetX / sourceX),
      xyzSource[1] * (targetY / sourceY),
      xyzSource[2] * (targetZ / sourceZ)
  ];

  return xyzTarget;
}

// Example usage
const [r, g, b] = [255, 0, 0];  // Red color in RGB
const targetWhitePoint = [96.422, 100.000, 82.521];  // D50 white point
const sourceWhitePoint = [95.047, 100.000, 108.883];  // D65 white point
const xyz = rgbToXyz(r, g, b, targetWhitePoint, sourceWhitePoint);
console.log(`XYZ: ${xyz}`);
