// Utility functions
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const rgbToLinearRgb = (r, g, b) => [
  r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
  g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
  b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
];

const linearRgbToRgb = (r, g, b) => [
  r <= 0.0031308 ? r * 12.92 : (Math.pow(r, 1 / 2.4) * 1.055) - 0.055,
  g <= 0.0031308 ? g * 12.92 : (Math.pow(g, 1 / 2.4) * 1.055) - 0.055,
  b <= 0.0031308 ? b * 12.92 : (Math.pow(b, 1 / 2.4) * 1.055) - 0.055
];

// RGB to XYZ and XYZ to RGB
const rgbToXyzD65 = (r, g, b) => {
  const [rLinear, gLinear, bLinear] = rgbToLinearRgb(r, g, b);
  return [
    rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375,
    rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750,
    rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041
  ];
};

const xyzD65ToRgb = (x, y, z) => {
  const r = x * 3.2404542 - y * 1.5371385 - z * 0.4985314;
  const g = -x * 0.9692660 + y * 1.8760108 + z * 0.0415560;
  const b = x * 0.0556434 - y * 0.2040259 + z * 1.0572252;
  return linearRgbToRgb(r, g, b);
};

// HSL to RGB and HWB to RGB
const hslToRgb = (h, s, l) => {
  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) return [l, l, l];

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [
    hueToRgb(p, q, h + 1 / 3),
    hueToRgb(p, q, h),
    hueToRgb(p, q, h - 1 / 3)
  ];
};

const hwbToRgb = (h, w, b) => {
  const rgb = hslToRgb(h, 1 - w - b, 0.5);
  return rgb.map(v => clamp(v + b));
};

const hslToXyzD65 = (h, s, l) => {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToXyzD65(r, g, b);
};

const hwbToXyzD65 = (h, w, b) => {
  const [r, g, b] = hwbToRgb(h, w, b);
  return rgbToXyzD65(r, g, b);
};

// LAB to XYZ and XYZ to LAB
const labToXyzD65 = (l, a, b) => {
  const y = (l + 16) / 116;
  const x = a / 500 + y;
  const z = y - b / 200;

  const f = (t) => t > 0.2068966 ? Math.pow(t, 3) : (t - 16 / 116) / 7.787;

  return [
    f(x) * 0.95047,
    f(y),
    f(z) * 1.08883
  ];
};

const xyzD65ToLab = (x, y, z) => {
  const xNormalized = x / 0.95047;
  const zNormalized = z / 1.08883;

  const f = (t) => t > 0.008856 ? Math.pow(t, 1 / 3) : (t * 7.787) + (16 / 116);

  return [
    116 * f(y) - 16,
    500 * (f(xNormalized) - f(y)),
    200 * (f(y) - f(zNormalized))
  ];
};

// LCH to LAB and LAB to LCH
const lchToLab = (l, c, h) => [
  l,
  c * Math.cos((h / 180) * Math.PI),
  c * Math.sin((h / 180) * Math.PI)
];

const labToLch = (l, a, b) => [
  l,
  Math.sqrt(a * a + b * b),
  Math.atan2(b, a) * (180 / Math.PI)
];

// Export functions
export {
  rgbToXyzD65,
  xyzD65ToRgb,
  hslToXyzD65,
  hwbToXyzD65,
  labToXyzD65,
  xyzD65ToLab,
  lchToLab,
  labToLch
};
