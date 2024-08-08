// constants.mjs

// Matrix Constants
export const A98RgbToXyz = [
  [0.5767309, 0.1855540, 0.1881852],
  [0.2973769, 0.6273491, 0.0752741],
  [0.0270343, 0.0706872, 0.9911085]
];

export const XyzToA98Rgb = [
  [2.0413690, -0.5649464, -0.3446944],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0134474, -0.1183897, 1.0154096]
];

export const Rec2020ToXyz = [
  [0.636958, 0.144617, 0.168881],
  [0.262700, 0.677993, 0.059307],
  [0.000000, 0.028897, 1.060987]
];

export const XyzToRec2020 = [
  [1.716651, -0.355670, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.017642, -0.042779, 0.941965]
];

export const LinearRgbToXyz = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

export const XyzToLinearRgb = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9682669, 1.8758024, 0.0415550],
  [0.0556434, -0.2040259, 1.0572252]
];

export const DisplayP3ToXyz = [
  [0.486570, 0.265670, 0.198217],
  [0.228970, 0.691730, 0.079300],
  [0.000000, 0.045113, 0.919521]
];

export const XyzToDisplayP3 = [
  [2.493496, -0.829255, 0.335640],
  [-0.829365, 1.761871, 0.023641],
  [0.035700, -0.046365, 1.057209]
];

export const ProphotoRgbToXyz = [
  [0.7347, 0.2653, 0.0000],
  [0.0000, 0.6900, 0.1100],
  [0.0000, 0.0500, 0.9500]
];

export const XyzToProphotoRgb = [
  [1.345943, -0.255607, -0.051111],
  [-0.544598, 1.509228, 0.020536],
  [0.000000, 0.000000, 1.000000]
];

export const XyzD65ToXyzD50 = [
  [0.9555766, -0.0283886, 0.0721923],
  [0.0172732, 0.9907658, -0.0182494],
  [-0.0006226, 0.0158339, 0.9374036]
];

export const XyzD50ToXyzD65 = [
  [1.0478112, 0.0228866, -0.0501270],
  [0.0295424, 0.9904844, -0.0170491],
  [-0.0092345, 0.0150436, 0.7521316]
];

// Piecewise Functions for sRGB to Linear RGB and vice versa
export function srgbToLinear(rgb) {
  return rgb.map(value => {
    if (value <= 0.04045) {
      return value / 12.92;
    } else {
      return Math.pow((value + 0.055) / 1.055, 2.4);
    }
  });
}

export function linearToSrgb(rgb) {
  return rgb.map(value => {
    if (value <= 0.0031308) {
      return value * 12.92;
    } else {
      return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    }
  });
}
