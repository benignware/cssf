// Gamma correction constants
const GAMMA = 2.4;
const GAMMA_CORRECT_THRESHOLD = 0.04045;

// Helper function to apply gamma correction
const applyGammaCorrection = (c, toLinear) =>
  toLinear
    ? (c <= GAMMA_CORRECT_THRESHOLD ? c / 12.92 : Math.pow((c + 0.055) / 1.055, GAMMA))
    : (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / GAMMA) - 0.055);

// Convert from linear RGB to sRGB (gamma-corrected)
export const rgbLinearToSrgb = (r, g, b) =>
  [r, g, b].map(c => applyGammaCorrection(c, false));

// Convert from sRGB (gamma-corrected) to linear RGB
export const srgbToRgbLinear = (r, g, b) =>
  [r, g, b].map(c => applyGammaCorrection(c, true));

// Implement rgbLinearToSrgbLinear function
export const rgbLinearToSrgbLinear = (r, g, b) => {
  // As linear RGB is equivalent to sRGB linear RGB, just return the values
  return [r, g, b];
};

// Implement srgbLinearToRgbLinear function
export const srgbLinearToRgbLinear = (r, g, b) =>
  srgbToRgbLinear(r, g, b);



// Convert from sRGB (gamma-corrected) to linear RGB
export const srgbToSrgbLinear = (r, g, b) =>
  [r, g, b].map(c => applyGammaCorrection(c, true));

// Convert from linear RGB to sRGB (gamma-corrected)
export const srgbLinearToSrgb = (r, g, b) =>
  [r, g, b].map(c => applyGammaCorrection(c, false));


// Convert from linear RGB to standard RGB [0, 255]
export const rgbLinearToRgb = (r, g, b) =>
  [r, g, b].map(c => Math.round(c * 255));

// Convert from standard RGB [0, 255] to linear RGB
export const rgbToRgbLinear = (r, g, b) =>
  [r, g, b].map(c => applyGammaCorrection(c / 255, true));

// RGB and sRGB Conversion
// export const srgbLinearToSrgb = (r, g, b) => [
//   r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055,
//   g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055,
//   b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055
// ];

// export const srgbToSrgbLinear = (r, g, b) => [
//   r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
//   g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
//   b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
// ];

// Gamma correction constants
// const GAMMA = 2.4;
// const GAMMA_CORRECT_THRESHOLD = 0.04045;

// // Helper function to apply gamma correction
// const applyGammaCorrection = (c, toLinear) =>
//   toLinear
//     ? (c <= GAMMA_CORRECT_THRESHOLD ? c / 12.92 : Math.pow((c + 0.055) / 1.055, GAMMA))
//     : (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / GAMMA) - 0.055);

// // Convert from sRGB to linear RGB
// export const srgbToSrgbLinear = (r, g, b) =>
//   [r, g, b].map(c => applyGammaCorrection(c, true));

// // Convert from linear RGB to sRGB
// export const srgbLinearToSrgb = (r, g, b) =>
//   [r, g, b].map(c => applyGammaCorrection(c, false));


// export const rgbLinearToSrgbLinear = (r, g, b) => srgbToSrgbLinear(r, g, b);
// export const srgbLinearToRgbLinear = (r, g, b) => srgbLinearToSrgb(r, g, b);

// export const rgbToRgbLinear = (r, g, b) => srgbToSrgbLinear(r / 255, g / 255, b / 255);
// export const rgbLinearToRgb = (r, g, b) => srgbLinearToSrgb(r, g, b).map(value => Math.round(value * 255));

// export const rgbToSrgb = (r, g, b) => srgbLinearToSrgb(...rgbToRgbLinear(r, g, b));
// export const srgbToRgb = (r, g, b) => rgbLinearToRgb(...srgbToSrgbLinear(r, g, b));

