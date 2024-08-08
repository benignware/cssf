// Utility Functions
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// Matrix Multiplication Helper
const matrixMultiply = (matrix, vector) => {
  if (!Array.isArray(matrix) || !Array.isArray(vector) || matrix.length !== 3 || vector.length !== 3) {
    throw new TypeError('Both matrix and vector must be arrays of appropriate size');
  }

  return matrix.map(row =>
    row.reduce((sum, value, i) => sum + value * vector[i], 0)
  );
};


// Color Space Conversion Functions
const srgbToSrgbLinear = (r, g, b) => [
  (r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)),
  (g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)),
  (b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4))
];

const srgbLinearToSrgb = (r, g, b) => [
  (r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055),
  (g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055),
  (b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055)
];

// RGB to Linear RGB Conversion
const rgbToRgbLinear = (r, g, b) => {
  // Convert [0, 255] RGB values to [0, 1] range
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;

  // Convert sRGB to Linear RGB
  return srgbToSrgbLinear(rNormalized, gNormalized, bNormalized);
};

// Linear RGB to RGB Conversion
const rgbLinearToRgb = (r, g, b) => {
  // Convert Linear RGB to sRGB
  const [rSrgb, gSrgb, bSrgb] = srgbLinearToSrgb(r, g, b);

  // Convert [0, 1] sRGB values to [0, 255] range
  return [
    rSrgb * 255,
    gSrgb * 255,
    bSrgb * 255
  ];
};

// Matrix Constants
const A98RgbToXyzMatrix = [
  [0.5767309, 0.1855540, 0.1881852],
  [0.2973769, 0.6273491, 0.0752741],
  [0.0270343, 0.0706872, 0.9911085]
];

const XyzToA98RgbMatrix = [
  [2.0413690, -0.5649464, -0.3446944],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0134474, -0.1183897, 1.0154096]
];

const Rec2020ToXyzMatrix = [
  [0.636958, 0.144617, 0.168881],
  [0.262700, 0.677993, 0.059307],
  [0.000000, 0.028897, 1.060987]
];

const XyzToRec2020Matrix = [
  [1.716651, -0.355670, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.017642, -0.042779, 0.941965]
];

const DisplayP3ToXyzMatrix = [
  [0.486570, 0.265670, 0.198217],
  [0.228970, 0.691730, 0.079300],
  [0.000000, 0.045113, 0.919521]
];

const XyzToDisplayP3Matrix = [
  [2.493496, -0.829255, 0.335640],
  [-0.829365, 1.761871, 0.023641],
  [0.035700, -0.046365, 1.057209]
];

const ProphotoRgbToXyzMatrix = [
  [0.7347, 0.2653, 0.0000],
  [0.0000, 0.6900, 0.1100],
  [0.0000, 0.0500, 0.9500]
];

const XyzToProphotoRgbMatrix = [
  [1.345943, -0.255607, -0.051111],
  [-0.544598, 1.509228, 0.020536],
  [0.000000, 0.000000, 1.000000]
];

const XyzToLinearRgbMatrix = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9682669, 1.8758024, 0.0415550],
  [0.0556434, -0.2040259, 1.0572252]
];

const LinearRgbToXyzMatrix = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

const XyzD65ToXyzD50Matrix = [
  [0.9555766, -0.0283886, 0.0721923],
  [0.0172732, 0.9907658, -0.0182494],
  [-0.0006226, 0.0158339, 0.9374036]
];

const XyzD50ToXyzD65Matrix = [
  [1.0478112, 0.0228866, -0.0501270],
  [0.0295424, 0.9904844, -0.0170491],
  [-0.0092345, 0.0150436, 0.7521316]
];



// Implementing Linear RGB to XYZ and XYZ to Linear RGB
const linearRgbToXyz = (r, g, b) => matrixMultiply(LinearRgbToXyzMatrix, [r, g, b]);
const xyzToLinearRgb = (x, y, z) => matrixMultiply(XyzToLinearRgbMatrix, [x, y, z]);

// Specific Color Space Conversions
const xyzD65ToXyzD50 = (x, y, z) => matrixMultiply(XyzD65ToXyzD50Matrix, [x, y, z]);
const xyzD50ToXyzD65 = (x, y, z) => matrixMultiply(XyzD50ToXyzD65Matrix, [x, y, z]);

const displayP3ToXyz = (r, g, b) => matrixMultiply(DisplayP3ToXyzMatrix, [r, g, b]);
const xyzToDisplayP3 = (x, y, z) => matrixMultiply(XyzToDisplayP3Matrix, [x, y, z]);

const prophotoRgbToXyz = (r, g, b) => matrixMultiply(ProphotoRgbToXyzMatrix, [r, g, b]);
const xyzToProphotoRgb = (x, y, z) => matrixMultiply(XyzToProphotoRgbMatrix, [x, y, z]);

const xyzToA98Rgb = (x, y, z) => matrixMultiply(XyzToA98RgbMatrix, [x, y, z]);
const a98RgbToXyz = (r, g, b) => matrixMultiply(A98RgbToXyzMatrix, [r, g, b]);

const xyzToRec2020 = (x, y, z) => matrixMultiply(XyzToRec2020Matrix, [x, y, z]);
const rec2020ToXyz = (r, g, b) => matrixMultiply(Rec2020ToXyzMatrix, [r, g, b]);

// Export functions
export {
  rgbToRgbLinear,
  rgbLinearToRgb,

  srgbToSrgbLinear,
  srgbLinearToSrgb,

  linearRgbToXyz,
  xyzToLinearRgb,

  a98RgbToXyz,
  xyzToA98Rgb,

  xyzToDisplayP3,
  displayP3ToXyz,

  xyzToRec2020,
  rec2020ToXyz,

  xyzD50ToXyzD65,
  xyzD65ToXyzD50,

  prophotoRgbToXyz,
  xyzToProphotoRgb
};



// LAB Color Space Conversion Functions


// Convert LAB to XYZ
const labToXyz = (L, a, b) => {
  const Y = (L + 16) / 116;
  const X = a / 500 + Y;
  const Z = Y - b / 200;

  const f = (t) => t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;

  return [
    f(X) * 0.95047, // D65 Reference White X
    f(Y) * 1.00000, // D65 Reference White Y
    f(Z) * 1.08883  // D65 Reference White Z
  ];
};

// Convert XYZ to LAB
const xyzToLab = (X, Y, Z) => {
  X /= 0.95047; // D65 Reference White X
  Y /= 1.00000; // D65 Reference White Y
  Z /= 1.08883; // D65 Reference White Z

  const f = (t) => t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116;

  return [
    116 * f(Y) - 16,
    500 * (f(X) - f(Y)),
    200 * (f(Y) - f(Z))
  ];
};

// Convert LAB to LCH
const labToLch = (L, a, b) => {
  const C = Math.sqrt(a ** 2 + b ** 2);
  const H = Math.atan2(b, a) * (180 / Math.PI);
  return [L, C, (H + 360) % 360]; // Ensure H is within [0, 360)
};

// Convert LCH to LAB
const lchToLab = (L, C, H) => {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return [L, a, b];
};

// Convert OKLab to XYZ
const oklabToXyz = (L, a, b) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;

  return [
    l * 0.400000 + m * 0.400000 + s * 0.200000, // Conversion based on standard coefficients
    l * 0.166000 + m * 0.166000 + s * 0.600000,
    l * 0.237000 + m * 0.237000 + s * 0.000000
  ];
};

// Convert XYZ to OKLab
const xyzToOklab = (X, Y, Z) => {
  const l = (0.4000 * X + 0.4000 * Y + 0.2000 * Z) ** (1 / 3);
  const m = (0.4000 * X + 0.2000 * Y + 0.2000 * Z) ** (1 / 3);
  const s = (0.2000 * X + 0.2000 * Y + 0.6000 * Z) ** (1 / 3);

  return [l, m, s];
};

// Convert OKLab to OKLCH
const oklabToOklch = (L, a, b) => {
  const C = Math.sqrt(a ** 2 + b ** 2);
  const H = Math.atan2(b, a) * (180 / Math.PI);
  return [L, C, (H + 360) % 360]; // Ensure H is within [0, 360)
};

// Convert OKLCH to OKLab
const oklchToOklab = (L, C, H) => {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return [L, a, b];
};



export {
  // labToXyz,
  // xyzToLab,
  // oklabToXyz,
  // xyzToOklab,
  // labToLch,
  // lchToLab,
  // oklabToOklch,
  // oklchToOklab,
};  


// // Hue-Based Color Space Conversion Functions
// const hueToRgb = (p, q, t) => {
//   if (t < 0) t += 1;
//   if (t > 1) t -= 1;
//   if (t < 1 / 6) return p + (q - p) * 6 * t;
//   if (t < 1 / 2) return q;
//   if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//   return p;
// };

// // HSL to RGB
// const hslToRgb = (h, s, l) => {
//   h = clamp(h, 0, 360) / 360;
//   s = clamp(s, 0, 1);
//   l = clamp(l, 0, 1);

//   if (s === 0) {
//     // Achromatic case
//     const value = l * 255;
//     return [value, value, value];
//   }

//   const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//   const p = 2 * l - q;

//   return [
//     Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
//     Math.round(hueToRgb(p, q, h) * 255),
//     Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
//   ];
// };

// // RGB to HSL
// const rgbToHsl = (r, g, b) => {
//   r = clamp(r, 0, 255) / 255;
//   g = clamp(g, 0, 255) / 255;
//   b = clamp(b, 0, 255) / 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   const delta = max - min;

//   let h = 0;
//   let s = 0;
//   let l = (max + min) / 2;

//   if (delta !== 0) {
//     s = delta / (1 - Math.abs(2 * l - 1));
//     switch (max) {
//       case r:
//         h = (g - b) / delta + (g < b ? 6 : 0);
//         break;
//       case g:
//         h = (b - r) / delta + 2;
//         break;
//       case b:
//         h = (r - g) / delta + 4;
//         break;
//     }
//     h /= 6;
//   }

//   return [h * 360, s, l];
// };

// // HWB to RGB
// const hwbToRgb = (h, W, B) => {
//   h = clamp(h, 0, 360) / 360;
//   W = clamp(W, 0, 1);
//   B = clamp(B, 0, 1);

//   // Convert HWB to HSL
//   const hsl = hslToRgb(h * 360, 1, 0.5);
//   const w = W * 255;
//   const b = B * 255;

//   // Interpolate RGB values
//   return [
//     Math.round(clamp(hsl[0] * (1 - W - B) + w, 0, 255)),
//     Math.round(clamp(hsl[1] * (1 - W - B) + w, 0, 255)),
//     Math.round(clamp(hsl[2] * (1 - W - B) + w, 0, 255))
//   ];
// };

// // RGB to HWB
// const rgbToHwb = (r, g, b) => {
//   r = clamp(r, 0, 255) / 255;
//   g = clamp(g, 0, 255) / 255;
//   b = clamp(b, 0, 255) / 255;

//   // Convert RGB to HSL
//   const [h, s, l] = rgbToHsl(r * 255, g * 255, b * 255);

//   // Calculate white and black components
//   const W = Math.min(r, g, b);
//   const B = 1 - Math.max(r, g, b);

//   return [h, W, B];
// };


// // Export functions
// export {
//   // hslToRgb,
//   // rgbToHsl,
//   // hwbToRgb,
//   // rgbToHwb
// };