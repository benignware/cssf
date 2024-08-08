// Standard conversion matrices
const rgbToXyzD65Matrix = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

const xyzToRgbD65Matrix = [
  [ 3.2404542, -1.5371385, -0.4985314],
  [-0.9692660,  1.8760108,  0.0415560],
  [ 0.0556434, -0.2040259,  1.0572252]
];

const xyzD65ToXyzD50Matrix = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.0204830, 1.3299098]
];

const xyzD50ToXyzD65Matrix = [
  [1.0478112, 0.0228172, -0.0501209],
  [0.0295428, 0.9904844, -0.0170491],
  [-0.0092345, 0.0150436, 0.7521316]
];


// Helper function to multiply matrices
function multiplyMatrixVector(matrix, vector) {
  return matrix.map(row =>
    row.reduce((sum, value, i) => sum + value * vector[i], 0)
  );
}


// Conversion functions

function rgbToXyz(r, g, b) {
  // Normalize RGB values (assuming input is 0-255)
  const rLinear = r / 255;
  const gLinear = g / 255;
  const bLinear = b / 255;

  // Apply gamma correction
  const rCorrected = rLinear <= 0.04045 ? rLinear / 12.92 : Math.pow((rLinear + 0.055) / 1.055, 2.4);
  const gCorrected = gLinear <= 0.04045 ? gLinear / 12.92 : Math.pow((gLinear + 0.055) / 1.055, 2.4);
  const bCorrected = bLinear <= 0.04045 ? bLinear / 12.92 : Math.pow((bLinear + 0.055) / 1.055, 2.4);

  // Convert RGB to XYZ using D65 illuminant
  const xyz = multiplyMatrixVector(rgbToXyzD65Matrix, [rCorrected, gCorrected, bCorrected]);

  return xyz;
}

function xyzToRgb(x, y, z) {
  // Convert XYZ to RGB using D65 illuminant
  const [rLinear, gLinear, bLinear] = multiplyMatrixVector(xyzToRgbD65Matrix, [x, y, z]);

  // Apply gamma correction
  const r = Math.round(((rLinear <= 0.0031308) ? rLinear * 12.92 : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055) * 255);
  const g = Math.round(((gLinear <= 0.0031308) ? gLinear * 12.92 : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055) * 255);
  const b = Math.round(((bLinear <= 0.0031308) ? bLinear * 12.92 : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055) * 255);

  // Clamp to 0-255 range
  const rClamped = Math.max(0, Math.min(255, r));
  const gClamped = Math.max(0, Math.min(255, g));
  const bClamped = Math.max(0, Math.min(255, b));

  return [rClamped, gClamped, bClamped];
}

// function xyzD65ToXyzD50(x, y, z) {
//   const xyzD50 = multiplyMatrixVector(xyzD65ToXyzD50Matrix, [x, y, z]);
//   return xyzD50;
// }

// function xyzD50ToXyzD65(x, y, z) {
//   const xyzD65 = multiplyMatrixVector(xyzD50ToXyzD65Matrix, [x, y, z]);
//   return xyzD65;
// }


// export {
//   rgbToXyz,
//   xyzToRgb,
//   xyzD65ToXyzD50,
//   xyzD50ToXyzD65
// }

// Bradford transformation matrices for D65 to D50 and D50 to D65
const bradfordTransformD65ToD50 = [
  [0.40024, 0.70750, -0.08081],
  [-0.22630, 1.16532,  0.04570],
  [0.00000, 0.00000,  0.91822]
];

const bradfordTransformD50ToD65 = [
  [ 0.40024, -0.22630,  0.00000],
  [ 0.70750,  1.16532,  0.00000],
  [-0.08081,  0.04570,  0.91822]
];

function applyBradfordTransform(matrix, [X, Y, Z]) {
  return [
    matrix[0][0] * X + matrix[0][1] * Y + matrix[0][2] * Z,
    matrix[1][0] * X + matrix[1][1] * Y + matrix[1][2] * Z,
    matrix[2][0] * X + matrix[2][1] * Y + matrix[2][2] * Z
  ];
}

// Convert XYZ (D65) to XYZ (D50)
function xyzD65ToXyzD50(X, Y, Z) {
  return applyBradfordTransform(bradfordTransformD65ToD50, [X, Y, Z]);
}

// Convert XYZ (D50) to XYZ (D65)
function xyzD50ToXyzD65(X, Y, Z) {
  return applyBradfordTransform(bradfordTransformD50ToD65, [X, Y, Z]);
}

export {
  xyzD65ToXyzD50,
  xyzD50ToXyzD65
};
