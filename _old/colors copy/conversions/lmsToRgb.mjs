export function lmsToRgb(L, M, S) {
  // Define the transformation matrix
  const matrix = [
      [4.4679, -3.5873, 0.1193],
      [-1.2186, 2.3809, -0.1624],
      [0.0497, -0.0970, 0.7966]
  ];

  // Perform the matrix multiplication
  let R = matrix[0][0] * L + matrix[0][1] * M + matrix[0][2] * S;
  let G = matrix[1][0] * L + matrix[1][1] * M + matrix[1][2] * S;
  let B = matrix[2][0] * L + matrix[2][1] * M + matrix[2][2] * S;
  
  // Scale the RGB values to 0-255 range
  R *= 255;
  G *= 255;
  B *= 255;

  // Clamp values to [0, 255] range and round to nearest integer
  return [
      Math.min(255, Math.max(0, Math.round(R))),
      Math.min(255, Math.max(0, Math.round(G))),
      Math.min(255, Math.max(0, Math.round(B)))
  ];
}
