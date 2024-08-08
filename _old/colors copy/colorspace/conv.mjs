// Reference white values
const Xn_D65 = 0.95047;
const Yn_D65 = 1.00000;
const Zn_D65 = 1.08883;

const Xn_D50 = 0.96422;
const Yn_D50 = 1.00000;
const Zn_D50 = 0.82521;

// Helper function to apply the f(t) function for LAB conversions
const f = t => t > Math.pow(6/29, 3) 
  ? Math.cbrt(t) 
  : (t / (3 * Math.pow(6/29, 2))) + 4/29;

// Convert XYZ to LAB (assumed D65)
const xyzToLab = (x, y, z) => {
  const X = x / Xn_D65;
  const Y = y / Yn_D65;
  const Z = z / Zn_D65;

  const L = 116 * f(Y) - 16;
  const a = 500 * (f(X) - f(Y));
  const b = 200 * (f(Y) - f(Z));

  return [L, a, b];
};

// Convert LAB to XYZ (assumed D65)
const labToXyz = (L, a, b) => {
  const Y = (L + 16) / 116;
  const X = a / 500 + Y;
  const Z = Y - b / 200;

  const f_inv = t => Math.pow(t, 3) > Math.pow(6/29, 3) 
    ? Math.pow(t, 3) 
    : (t - 4/29) * 3 * Math.pow(6/29, 2);

  return [
    Xn_D65 * f_inv(X),
    Yn_D65 * f_inv(Y),
    Zn_D65 * f_inv(Z)
  ];
};

// Convert XYZ-D65 to XYZ-D50
const xyzD65ToXyzD50 = (x, y, z) => {
  const M = [
    [ 0.4002, -0.2263, 0.0000],
    [ 0.7075,  1.1653, 0.0000],
    [-0.0808,  0.0457, 0.9182]
  ];

  return [
    M[0][0] * x + M[0][1] * y + M[0][2] * z,
    M[1][0] * x + M[1][1] * y + M[1][2] * z,
    M[2][0] * x + M[2][1] * y + M[2][2] * z
  ];
};

// Convert XYZ-D50 to XYZ-D65
const xyzD50ToXyzD65 = (x, y, z) => {
  const M_inv = [
    [0.4002, 0.7075, -0.0808],
    [-0.2263, 1.1653, 0.0457],
    [0.0000, 0.0000, 0.9182]
  ];

  return [
    M_inv[0][0] * x + M_inv[0][1] * y + M_inv[0][2] * z,
    M_inv[1][0] * x + M_inv[1][1] * y + M_inv[1][2] * z,
    M_inv[2][0] * x + M_inv[2][1] * y + M_inv[2][2] * z
  ];
};

// Convert RGB to XYZ
const rgbToXyz = (r, g, b) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return [
    r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
    r * 0.0193339 + g * 0.1191920 + b * 0.9503041
  ];
};

// Convert XYZ to RGB
const xyzToRgb = (x, y, z) => {
  x /= 100;
  y /= 100;
  z /= 100;

  const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const g = x * -0.9689459 + y * 1.8759318 + z * 0.0415540;
  const b = x * 0.0557101 + y * -0.2040211 + z * 1.0572252;

  const clamp = value => Math.max(0, Math.min(1, value));
  
  // Apply gamma correction and clamp values
  const gammaCorrect = value => 
    value <= 0.0031308 
      ? value * 12.92 
      : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

  return [
    Math.round(clamp(gammaCorrect(r)) * 255),
    Math.round(clamp(gammaCorrect(g)) * 255),
    Math.round(clamp(gammaCorrect(b)) * 255)
  ];
};

// Convert XYZ-D50 to LAB
const xyzD50ToLab = (x, y, z) => {
  // Convert XYZ-D50 to XYZ-D65 first
  const [x_d65, y_d65, z_d65] = xyzD50ToXyzD65(x, y, z);
  
  // Convert XYZ-D65 to LAB
  return xyzToLab(x_d65, y_d65, z_d65);
};

// Exported functions
export {
  rgbToXyz,
  xyzD65ToXyzD50,
  xyzD50ToXyzD65,
  xyzToLab,
  labToXyz,
  xyzToRgb,
  xyzD50ToLab
};

// Test conversion
const rgb = [255, 0, 0]; // Red color

// Convert RGB to XYZ-D65
const xyzD65 = rgbToXyz(...rgb);

// Convert XYZ-D65 to XYZ-D50
const xyzD50 = xyzD65ToXyzD50(...xyzD65);

// Convert XYZ-D50 to Lab
const lab = xyzD50ToLab(...xyzD50);

// Convert Lab back to XYZ-D50
const xyzD50_back = labToXyz(...lab);

// Convert XYZ-D50 back to XYZ-D65
const xyzD65_back = xyzD50ToXyzD65(...xyzD50_back);

// Convert XYZ-D65 back to RGB
const rgb_back = xyzToRgb(...xyzD65_back);

console.log('RGB:', rgb);
console.log('XYZ-D65:', xyzD65);
console.log('XYZ-D50:', xyzD50);
console.log('Lab:', lab);
console.log('XYZ-D50 (back):', xyzD50_back);
console.log('XYZ-D65 (back):', xyzD65_back);
console.log('RGB (back):', rgb_back);
