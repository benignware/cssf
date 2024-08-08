export function oklabToOklch(l, a, b) {
  const C = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a) * (180 / Math.PI) % 360;
  return [l, C, h < 0 ? h + 360 : h];
}

export function oklchToOklab(l, C, h) {
  const hRad = h * (Math.PI / 180);
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return [l, a, b];
}
