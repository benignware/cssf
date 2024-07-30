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

// Test cases
console.log(lmsToRgb(0.4002, -0.2263, 0.0000)); // Expected: [255, 0, 0]
console.log(lmsToRgb(0.7075, 1.1653, 0.0000)); // Expected: [0, 255, 0]
console.log(lmsToRgb(-0.0808, 0.0457, 0.9182)); // Expected: [0, 0, 255]
console.log(lmsToRgb(1.0000, 1.0000, 1.0000)); // Expected: [255, 255, 255]
console.log(lmsToRgb(0.0000, 0.0000, 0.0000)); // Expected: [0, 0, 0]
console.log(lmsToRgb(0.7420, 0.7420, 0.7420)); // Expected: [211, 211, 211]
console.log(lmsToRgb(0.3800, 0.3800, 0.3800)); // Expected: [169, 169, 169]
