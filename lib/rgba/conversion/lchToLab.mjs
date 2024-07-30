// lchToLab.mjs

export function lchToLab(l, c, h) {
  // Convert normalized LCH values to actual values
  const L = l * 100;   // Lightness in [0, 100]
  const C = c * 100;   // Chroma in [0, 100]
  const H = h * 360;   // Hue in [0, 360] degrees

  // Convert Hue from degrees to radians
  const hRad = (H / 360) * 2 * Math.PI;

  // Calculate a and b
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // Normalize LAB values to [0, 1]
  // Assuming L ranges from [0, 100], and a & b range from [-100, 100]
  const lNormalized = (L - 0) / (100 - 0);  // L: [0, 100] normalized to [0, 1]
  const aNormalized = (a + 100) / 200;       // a: [-100, 100] normalized to [0, 1]
  const bNormalized = (b + 100) / 200;       // b: [-100, 100] normalized to [0, 1]

  return {
    l: lNormalized,
    a: aNormalized,
    b: bNormalized
  };
}
