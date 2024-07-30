
export function normalizeXYZ(x, y, z) {
  const Xn = 95.047;
  const Yn = 100.000;
  const Zn = 108.883;

  const normalizedX = x / Xn;
  const normalizedY = y / Yn;
  const normalizedZ = z / Zn;

  return [normalizedX, normalizedY, normalizedZ];
}


// Convert XYZ to RGB (normalized)
export function xyzToRgb(x, y, z) {
  const matrix = [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9692660, 1.8760108, 0.0415560],
    [0.0556434, -0.2040259, 1.0572252]
  ];

  const r = (matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z) / 100;
  const g = (matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z) / 100;
  const b = (matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z) / 100;

  return [r, g, b];
}

// Convert RGB to XYZ (normalized)
export function rgbToXyz(r, g, b) {
  const matrix = [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
  ];

  const x = (matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b) / 100;
  const y = (matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b) / 100;
  const z = (matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b) / 100;

  return [x, y, z];
}

// Convert XYZ to LMS (normalized)
export function xyzToLms(x, y, z) {
  const matrix = [
    [0.38971, 0.68898, -0.07868],
    [-0.22981, 1.18340, 0.04641],
    [0.00000, 0.00000, 1.00000]
  ];

  const l = (matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z) / 100;
  const m = (matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z) / 100;
  const s = (matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z) / 100;

  return [l, m, s];
}

// Convert LMS to XYZ (normalized)
export function lmsToXyz(l, m, s) {
  const matrix = [
    [1.910197, -1.112124, 0.201908],
    [0.370950, 0.629054, 0.000000],
    [0.000000, 0.000000, 1.000000]
  ];

  const x = (matrix[0][0] * l + matrix[0][1] * m + matrix[0][2] * s) / 100;
  const y = (matrix[1][0] * l + matrix[1][1] * m + matrix[1][2] * s) / 100;
  const z = (matrix[2][0] * l + matrix[2][1] * m + matrix[2][2] * s) / 100;

  return [x, y, z];
}
