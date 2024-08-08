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

// Conversion Between Linear RGB and sRGB
const srgbLinearToSrgb = (r, g, b) => [
  (r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055),
  (g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055),
  (b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055)
];

const srgbToSrgbLinear = (r, g, b) => [
  (r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)),
  (g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)),
  (b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4))
];

const rgbToRgbLinear = (r, g, b) => srgbToSrgbLinear(r / 255, g / 255, b / 255);
const rgbLinearToRgb = (r, g, b) => srgbLinearToSrgb(r, g, b).map(value => Math.round(value * 255));

export {
  rgbLinearToRgb,
  rgbToRgbLinear,
  srgbLinearToSrgb,
  srgbToSrgbLinear
}


// Conversion Between RGB and XYZ
const XyzToLinearRgbMatrix = [
  [ 3.2404542, -1.5371385, -0.4985314 ],
  [-0.9692660,  1.8760108,  0.0415560 ],
  [ 0.0556434, -0.2040259,  1.0572252 ]
];

const LinearRgbToXyzMatrix = [
  [ 0.4124564,  0.3575761,  0.1804375 ],
  [ 0.2126729,  0.7151522,  0.0721750 ],
  [ 0.0193339,  0.1191920,  0.9503041 ]
];

const xyzToRgbLinear = (x, y, z) => {
  const [rLinear, gLinear, bLinear] = matrixMultiply(XyzToLinearRgbMatrix, [x, y, z]);
  return [
    clamp(rLinear, 0, 1),
    clamp(gLinear, 0, 1),
    clamp(bLinear, 0, 1)
  ];
};

const xyzToRgb = (x, y, z) => {
  const [rLinear, gLinear, bLinear] = xyzToRgbLinear(x, y, z);
  return rgbLinearToRgb(rLinear, gLinear, bLinear);
};

const rgbToXyzLinear = (r, g, b) => {
  const [rLinear, gLinear, bLinear] = rgbToRgbLinear(r, g, b);
  return matrixMultiply(LinearRgbToXyzMatrix, [rLinear, gLinear, bLinear]);
};

const rgbToXyz = (r, g, b) => {
  const [x, y, z] = rgbToXyzLinear(r, g, b);
  return [x, y, z];
};

// White Point Conversion
const XyzD65ToXyzD50Matrix = [
  [1.047809, 0.022919, -0.050077],
  [0.029482, 0.990715, -0.017068],
  [-0.009242, 0.015360, 0.751724]
];

const XyzD50ToXyzD65Matrix = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.0204830, 1.3299098]
];

const xyzD65ToXyzD50 = (x, y, z) => matrixMultiply(XyzD65ToXyzD50Matrix, [x, y, z]);
const xyzD50ToXyzD65 = (x, y, z) => matrixMultiply(XyzD50ToXyzD65Matrix, [x, y, z]);

export {
  xyzToRgb,
  rgbToXyz,
  xyzD65ToXyzD50,
  xyzD50ToXyzD65
}


// Rec.2020 Color Space Conversions
const XyzToRec2020Matrix = [
  [1.716651, -0.355670, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.017642, -0.042779, 0.941965]
];

const Rec2020ToXyzMatrix = [
  [0.636958, 0.144617, 0.168881],
  [0.262700, 0.677993, 0.059307],
  [0.000000, 0.028897, 1.060987]
];

const rec2020ToXyz = (r, g, b) => matrixMultiply(Rec2020ToXyzMatrix, [r, g, b]);
const xyzToRec2020Linear = (x, y, z) => matrixMultiply(XyzToRec2020Matrix, [x, y, z])
  .map(value => clamp(value, 0, 1));
const xyzToRec2020 = (x, y, z) => srgbLinearToSrgb(...xyzToRec2020Linear(x, y, z));

// Display P3 Color Space Conversions
const DisplayP3ToXyzMatrix = [
  [0.486570, 0.265670, 0.198217],
  [0.228975, 0.691739, 0.079286],
  [0.000000, 0.045113, 0.959971]
];

const XyzToDisplayP3Matrix = [
  [2.493496, -0.829255, 0.035854],
  [-0.829643, 1.762783, -0.016701],
  [0.035537, -0.046256, 1.057222]
];

const displayP3ToXyz = (r, g, b) => matrixMultiply(DisplayP3ToXyzMatrix, [r, g, b]);
const xyzToDisplayP3 = (x, y, z) => srgbLinearToSrgb(...matrixMultiply(XyzToDisplayP3Matrix, [x, y, z]));

// A98 RGB Color Space Conversions
const A98RgbToXyzMatrix = [
  [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
  [0.29734497525053605, 0.6273635662554661, 0.07529145849499719],
  [0.02703136138641234, 0.07068885253582723, 0.9913375368376388]
];

const XyzToA98RgbMatrix = [
  [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
  [-0.9692436362808795, 1.8759675015077202, 0.04155505740717559],
  [0.013444280632031142, -0.11836239223101838, 1.0151749933068696]
];

const a98RgbToXyz = (r, g, b) => matrixMultiply(A98RgbToXyzMatrix, [r, g, b]);
const xyzToA98Rgb = (x, y, z) => srgbLinearToSrgb(...matrixMultiply(XyzToA98RgbMatrix, [x, y, z]));

// Prophoto RGB Color Space Conversions
const ProphotoRgbToXyzMatrix = [
  [0.7977605, 0.1351852, 0.0313493],
  [0.2880714, 0.7118431, 0.0000857],
  [0.0000000, 0.0000000, 0.8251046]
];

const XyzToProphotoRgbMatrix = [
  [1.3459433, -0.2556075, -0.0511118],
  [-0.5445989, 1.5081673, 0.0205351],
  [0.0000000, 0.0000000, 1.2118128]
];

const prophotoRgbToXyz = (r, g, b) => matrixMultiply(ProphotoRgbToXyzMatrix, [r, g, b]);
const xyzToProphotoRgb = (x, y, z) => srgbLinearToSrgb(...matrixMultiply(XyzToProphotoRgbMatrix, [x, y, z]));


export {
  a98RgbToXyz,
  xyzToA98Rgb,
  prophotoRgbToXyz,
  xyzToProphotoRgb,
  rec2020ToXyz,
  xyzToRec2020,
  displayP3ToXyz,
  xyzToDisplayP3
}

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
  labToXyz,
  xyzToLab,
  oklabToXyz,
  xyzToOklab,
  labToLch,
  lchToLab,
  oklabToOklch,
  oklchToOklab,
};  

// Hue-Based Color Space Conversion Functions
const hueToRgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

// HSL to RGB
const hslToRgb = (h, s, l) => {
  h = clamp(h, 0, 360) / 360;
  s = clamp(s, 0, 1);
  l = clamp(l, 0, 1);

  if (s === 0) {
    // Achromatic case
    const value = l * 255;
    return [value, value, value];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [
    Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, h) * 255),
    Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
  ];
};

// RGB to HSL
const rgbToHsl = (r, g, b) => {
  r = clamp(r, 0, 255) / 255;
  g = clamp(g, 0, 255) / 255;
  b = clamp(b, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
};

// HWB to RGB
const hwbToRgb = (h, W, B) => {
  h = clamp(h, 0, 360) / 360;
  W = clamp(W, 0, 1);
  B = clamp(B, 0, 1);

  // Convert HWB to HSL
  const hsl = hslToRgb(h * 360, 1, 0.5);
  const w = W * 255;
  const b = B * 255;

  // Interpolate RGB values
  return [
    Math.round(clamp(hsl[0] * (1 - W - B) + w, 0, 255)),
    Math.round(clamp(hsl[1] * (1 - W - B) + w, 0, 255)),
    Math.round(clamp(hsl[2] * (1 - W - B) + w, 0, 255))
  ];
};

// RGB to HWB
const rgbToHwb = (r, g, b) => {
  r = clamp(r, 0, 255) / 255;
  g = clamp(g, 0, 255) / 255;
  b = clamp(b, 0, 255) / 255;

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r * 255, g * 255, b * 255);

  // Calculate white and black components
  const W = Math.min(r, g, b);
  const B = 1 - Math.max(r, g, b);

  return [h, W, B];
};


// Export functions
export {
  hslToRgb,
  rgbToHsl,
  hwbToRgb,
  rgbToHwb
};