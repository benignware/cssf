// Convert OKLab to OKLCH
export const oklabToOklch = (L, a, b) => {
  const C = Math.sqrt(a ** 2 + b ** 2);
  const H = Math.atan2(b, a) * (180 / Math.PI);
  return [L, C, (H + 360) % 360]; // Ensure H is within [0, 360)
};

// Convert OKLCH to OKLab
export const oklchToOklab = (L, C, H) => {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return [L, a, b];
};