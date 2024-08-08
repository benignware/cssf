export const lmsToXyz = (l, m, s) => {
  const x = l * 0.7328 + m * 0.4296 - s * 0.1624;
  const y = l * -0.7036 + m * 1.6975 + s * 0.0061;
  const z = l * 0.0030 + m * 0.0136 + s * 0.9834;
  return [x, y, z];
}