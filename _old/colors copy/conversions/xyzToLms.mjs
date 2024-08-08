export const xyzToLms = (x, y, z) => {
  const l = x * 0.7328 + y * -0.7036 + z * 0.0030;
  const m = x * 0.4296 + y * 1.6975 + z * 0.0136;
  const s = x * -0.1624 + y * 0.0061 + z * 0.9834;
  return [l, m, s];
}