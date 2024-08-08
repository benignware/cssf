// Reference white values
const WHITE_D65 = [0.95047, 1.00000, 1.08883];
const WHITE_D50 = [0.96422, 1.00000, 0.82521];

// LAB transformation constants
const LAB_THRESHOLD = Math.pow(6 / 29, 3);
const LAB_TRANSFORM_COEFF = 3 * Math.pow(6 / 29, 2);
const LAB_TRANSFORM_OFFSET = 4 / 29;

// Transformation matrices
const RGB_TO_XYZ_MATRIX = {
  srgb: [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
  ],
  'srgb-linear': [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
  ],
  'display-p3': [
    [0.450000, 0.316000, 0.034000],
    [0.222000, 0.716000, 0.072000],
    [0.000000, 0.017000, 0.927000]
  ],
  'a98-rgb': [
    [0.4305747, 0.3415504, 0.1783258],
    [0.2225045, 0.7168884, 0.0606178],
    [0.0204864, 0.1295504, 0.9392157]
  ],
  'prophoto-rgb': [
    [0.400000, 0.340000, 0.180000],
    [0.150000, 0.460000, 0.390000],
    [0.000000, 0.050000, 0.950000]
  ],
  'rec2020': [
    [0.636958, 0.144617, 0.168881],
    [0.262700, 0.677998, 0.059302],
    [0.000000, 0.028072, 1.060985]
  ]
};

const XYZ_TO_RGB_MATRIX = {
  srgb: [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9689684, 1.8759318, 0.0415550],
    [0.0557101, -0.2040211, 1.0572252]
  ],
  'srgb-linear': [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9689684, 1.8759318, 0.0415550],
    [0.0557101, -0.2040211, 1.0572252]
  ],
  'display-p3': [
    [2.4934969, -0.9313836, -0.4027109],
    [-0.8294881, 1.7626644, 0.0236242],
    [0.0358456, -0.0761720, 0.9568849]
  ],
  'a98-rgb': [
    [2.0413690, -0.5649464, -0.3446944],
    [-0.9692660, 1.8760108, 0.0415560],
    [0.0134474, -0.1183892, 1.0154096]
  ],
  'prophoto-rgb': [
    [1.3459433, -0.2556075, -0.0511116],
    [-0.5445989, 1.5081673, 0.0205351],
    [0.0000000, 0.0000000, 1.2118128]
  ],
  'rec2020': [
    [1.716662, -0.355670, -0.253366],
    [-0.666684, 1.616481, 0.015768],
    [0.000000, 0.017673, 0.942018]
  ]
};

// Conversion matrices
const D65_TO_D50_MATRIX = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.0204830, 1.3299098]
];

const D50_TO_D65_MATRIX = [
  [1.0379269, 0.0217120, -0.0207253],
  [0.0156228, 0.9662998, -0.0037762],
  [-0.0092427, 0.0132647, 0.7430723]
];

// Helper functions
const labTransform = t => t > LAB_THRESHOLD
  ? Math.cbrt(t)
  : (t / LAB_TRANSFORM_COEFF) + LAB_TRANSFORM_OFFSET;

const inverseLabTransform = t => Math.pow(t, 3) > LAB_THRESHOLD
  ? Math.pow(t, 3)
  : (t - LAB_TRANSFORM_OFFSET) * LAB_TRANSFORM_COEFF;

const matrixMultiply = (matrix, vector) =>
  matrix.map(row => row.reduce((sum, val, i) => sum + val * vector[i], 0));

const gammaCorrectAndClamp = val => {
  val = val <= 0.0031308 ? val * 12.92 : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(1, val)) * 255;
};

// Convert LAB to XYZ with given white point
const labToXyz = (L, a, b, whitePoint = WHITE_D65) => {
  const Y = (L + 16) / 116;
  const [X, Z] = [a / 500 + Y, Y - b / 200];

  return [
    whitePoint[0] * inverseLabTransform(X),
    whitePoint[1] * inverseLabTransform(Y),
    whitePoint[2] * inverseLabTransform(Z)
  ];
};

// Convert XYZ to LAB with given white point
const xyzToLab = (X, Y, Z, whitePoint = WHITE_D65) => {
  const [Xr, Yr, Zr] = whitePoint.map((w, i) => [X, Y, Z][i] / w);

  return [
    116 * labTransform(Yr) - 16,
    500 * (labTransform(Xr) - labTransform(Yr)),
    200 * (labTransform(Yr) - labTransform(Zr))
  ];
};

// Convert XYZ from D65 to D50
const xyzD65ToXyzD50 = (X, Y, Z) => matrixMultiply(D65_TO_D50_MATRIX, [X, Y, Z]);

// Convert XYZ from D50 to D65
const xyzD50ToXyzD65 = (X, Y, Z) => matrixMultiply(D50_TO_D65_MATRIX, [X, Y, Z]);

// Convert LAB from D65 to D50
const labD65ToLabD50 = (L, a, b) => {
  const [X, Y, Z] = labToXyz(L, a, b, WHITE_D65);
  const [X_D50, Y_D50, Z_D50] = xyzD65ToXyzD50(X, Y, Z);
  return xyzToLab(X_D50, Y_D50, Z_D50, WHITE_D50);
};

// Convert LAB from D50 to D65
const labD50ToLabD65 = (L, a, b) => {
  const [X_D50, Y_D50, Z_D50] = labToXyz(L, a, b, WHITE_D50);
  const [X_D65, Y_D65, Z_D65] = xyzD50ToXyzD65(X_D50, Y_D50, Z_D50);
  return xyzToLab(X_D65, Y_D65, Z_D65, WHITE_D65);
};

// Convert RGB to XYZ
const rgbToXyz = (r, g, b, colorSpace = 'srgb') => {
  const rgb = [r, g, b].map(val => (val / 255 <= 0.04045
    ? val / 255 / 12.92
    : Math.pow((val / 255 + 0.055) / 1.055, 2.4)));

  return matrixMultiply(RGB_TO_XYZ_MATRIX[colorSpace], rgb);
};

// Convert XYZ to RGB
const xyzToRgb = (X, Y, Z, colorSpace = 'srgb') =>
  matrixMultiply(XYZ_TO_RGB_MATRIX[colorSpace], [X, Y, Z])
    .map(gammaCorrectAndClamp);

// Convert LAB from D50 to XYZ in D50
const labD50ToXyzD50 = (L, a, b) => labToXyz(L, a, b, WHITE_D50);

// Convert XYZ from D65 to LAB in D65
const xyzD65ToLabD65 = (X, Y, Z) => xyzToLab(X, Y, Z, WHITE_D65);

// Conversion from LAB to LCH
const labToLch = (L, a, b) => {
  const C = Math.sqrt(a * a + b * b);
  const H = Math.atan2(b, a) * (180 / Math.PI);
  return [L, C, (H + 360) % 360];
};

// Conversion from LCH to LAB
const lchToLab = (L, C, H) => {
  const hRad = H * (Math.PI / 180);
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return [L, a, b];
};

// Convert LCH from D65 to D50
const lchD65ToLchD50 = (L, C, H) => {
  const [a, b] = lchToLab(L, C, H);
  const [L_D50, a_D50, b_D50] = labD65ToLabD50(L, a, b);
  return labToLch(L_D50, a_D50, b_D50);
};

// Convert LCH from D50 to D65
const lchD50ToLchD65 = (L, C, H) => {
  const [a, b] = lchToLab(L, C, H);
  const [L_D65, a_D65, b_D65] = labD50ToLabD65(L, a, b);
  return labToLch(L_D65, a_D65, b_D65);
};

// Extend existing export with new color spaces and LCH functions
export {
  labToXyz,
  xyzToLab,
  rgbToXyz,
  xyzToRgb,
  labD65ToLabD50,
  labD50ToLabD65,
  labToLch,
  lchToLab,
  lchD65ToLchD50,
  lchD50ToLchD65
};
