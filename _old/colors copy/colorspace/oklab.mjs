// Convert OKLab to linear RGB
const oklabToLinearRgb = (L, a, b) => {
  const r = L + 0.3963377774 * a + 0.2158037573 * b;
  const g = L - 0.1055613458 * a - 0.0638541728 * b;
  const bComponent = L - 0.0894841775 * a - 0.0105776338 * b;

  return [r, g, bComponent];
};

// Convert linear RGB to XYZ
const linearRgbToXyz = (r, g, b) => {
  const x = 0.4002 * r + 0.7075 * g - 0.0808 * b;
  const y = -0.2263 * r + 1.1653 * g + 0.0457 * b;
  const z = 0.0000 * r + 0.0000 * g + 1.0000 * b;

  return [x, y, z];
};

export const oklabToXyz = (L, a, b) => {
  const [r, g, bComponent] = oklabToLinearRgb(L, a, b);
  return linearRgbToXyz(r, g, bComponent);
};

// Convert XYZ to linear RGB
const xyzToLinearRgb = (x, y, z) => {
  const r = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  const g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
  const b = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

  return [r, g, b];
};

// Convert linear RGB to OKLab
const linearRgbToOklab = (r, g, b) => {
  const L = r * 0.4002 + g * 0.7075 - b * 0.0808;
  const a = -r * 0.2263 + g * 1.1653 + b * 0.0457;
  const bComponent = r * 0.0000 + g * 0.0000 + b * 1.0000;

  return [L, a, bComponent];
};

export const xyzToOklab = (x, y, z) => {
  const [r, g, b] = xyzToLinearRgb(x, y, z);
  return linearRgbToOklab(r, g, b);
};
