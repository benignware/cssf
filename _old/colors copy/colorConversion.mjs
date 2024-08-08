// colorConversion.mjs

// Constants
const MATRIX_SRGB_TO_XYZ = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

const MATRIX_XYZ_TO_SRGB = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252]
];


const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

// For A98-RGB, the gamma correction function might differ from sRGB
const GAMMA_A98RGB = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const INV_GAMMA_A98RGB = c => c <= 0.00304 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const GAMMA_SRGB = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const INV_GAMMA_SRGB = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const linearToGamma = (r, g, b) => [
  INV_GAMMA_SRGB(r), INV_GAMMA_SRGB(g), INV_GAMMA_SRGB(b)
];

const gammaToLinear = (r, g, b) => [
  GAMMA_SRGB(r), GAMMA_SRGB(g), GAMMA_SRGB(b)
];


const matrixMultiply = (matrix, r, g, b) => [
  matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b,
  matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b,
  matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b
];


// Conversion Functions
export function srgbToXyz(r, g, b) {
  [r, g, b] = gammaToLinear(r / 255, g / 255, b / 255);
  return matrixMultiply(MATRIX_SRGB_TO_XYZ, r, g, b);
}

export function xyzToSrgb(x, y, z) {
  let [r, g, b] = matrixMultiply(MATRIX_XYZ_TO_SRGB, x, y, z);
  [r, g, b] = linearToGamma(r, g, b);
  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255))
  ];
}

export function srgbLinearToXyz(r, g, b) {
  return matrixMultiply(MATRIX_SRGB_TO_XYZ, r, g, b);
}

export function xyzToSrgbLinear(x, y, z) {
  let [r, g, b] = matrixMultiply(MATRIX_XYZ_TO_SRGB, x, y, z);
  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b))
  ];
}

// Display-P3 Functions
const MATRIX_DISPLAY_P3_TO_XYZ = [
  [0.4002, 0.7075, -0.0808],
  [-0.2263, 1.1653, 0.0457],
  [0.0000, 0.0000, 0.9182]
];

const MATRIX_XYZ_TO_DISPLAY_P3 = [
  [4.4690, -3.5864, 0.1193],
  [-1.2190, 2.3830, -0.1491],
  [0.0458, -0.0593, 1.0464]
];


export function displayP3ToXyz(r, g, b) {
  [r, g, b] = gammaToLinear(r / 255, g / 255, b / 255);
  return matrixMultiply(MATRIX_DISPLAY_P3_TO_XYZ, r, g, b);
}

export function xyzToDisplayP3(x, y, z) {
  let [r, g, b] = matrixMultiply(MATRIX_XYZ_TO_DISPLAY_P3, x, y, z);
  [r, g, b] = linearToGamma(r, g, b);
  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255))
  ];
}

// A98-RGB Functions


const MATRIX_A98RGB_TO_XYZ = [
  [0.5767309, 0.1855540, 0.1881852],
  [0.2973769, 0.6273491, 0.0752741],
  [0.0270343, 0.0706872, 0.9911085]
];

const MATRIX_XYZ_TO_A98RGB = [
  [1.4003672, -0.6635935, -0.0985278],
  [-0.6125560, 1.7169855, 0.0067506],
  [0.0668810, -0.0773511, 0.9336137]
];

export function a98RgbToXyz(r, g, b) {
  [r, g, b] = gammaToLinear(r / 255, g / 255, b / 255);
  return matrixMultiply(MATRIX_A98RGB_TO_XYZ, r, g, b);
}

export function xyzToA98Rgb(x, y, z) {
  // Matrix multiplication
  const [linearR, linearG, linearB] = matrixMultiply(MATRIX_XYZ_TO_A98RGB, x, y, z);

  // Gamma correction
  const [gammaR, gammaG, gammaB] = linearToGamma(linearR, linearG, linearB);

  // Return gamma-corrected RGB values
  return [
    Math.round(clamp(gammaR * 255, 0, 255)),
    Math.round(clamp(gammaG * 255, 0, 255)),
    Math.round(clamp(gammaB * 255, 0, 255))
  ];
}


// ProPhoto RGB Functions
const MATRIX_PROPHOTO_TO_XYZ = [
  [0.797674, 0.135191, 0.031353],
  [0.288040, 0.711879, 0.000000],
  [0.000000, 0.000000, 0.825210]
];

const MATRIX_XYZ_TO_PROPHOTO = [
  [1.3451, -0.2559, -0.0512],
  [-0.5446, 1.5082, 0.0144],
  [0.0000, 0.0000, 1.1372]
];

export function proPhotoRgbToXyz(r, g, b) {
  [r, g, b] = gammaToLinear(r / 255, g / 255, b / 255);
  return matrixMultiply(MATRIX_PROPHOTO_TO_XYZ, r, g, b);
}

export function xyzToProPhotoRgb(x, y, z) {
  let [r, g, b] = matrixMultiply(MATRIX_XYZ_TO_PROPHOTO, x, y, z);
  [r, g, b] = linearToGamma(r, g, b);
  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255))
  ];
}

// Rec. 2020 RGB Functions
const MATRIX_REC2020_TO_XYZ = [
  [0.636958, 0.144617, 0.168880],
  [0.262700, 0.677998, 0.059303],
  [0.000000, 0.028072, 1.060985]
];

const MATRIX_XYZ_TO_REC2020 = [
  [1.716651, -0.355671, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.017643, -0.042769, 0.942103]
];

export function rec2020ToXyz(r, g, b) {
  [r, g, b] = gammaToLinear(r / 255, g / 255, b / 255);
  return matrixMultiply(MATRIX_REC2020_TO_XYZ, r, g, b);
}

export function xyzToRec2020(x, y, z) {
  let [r, g, b] = matrixMultiply(MATRIX_XYZ_TO_REC2020, x, y, z);
  [r, g, b] = linearToGamma(r, g, b);
  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255))
  ];
}
