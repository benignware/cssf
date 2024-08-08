const displayP3ToXyzMatrixD65 = [
  [0.4002, 0.7075, -0.0808],
  [-0.2263, 1.1653,  0.0457],
  [0.0000, 0.0000,  0.9182]
];


export function displayP3ToXyz(r, g, b) {
  // Normalize display-p3 RGB values to range 0-1
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;

  // Convert Display-P3 to XYZ
  const xyz = [
      r * displayP3ToXyzMatrixD65[0][0] + g * displayP3ToXyzMatrixD65[0][1] + b * displayP3ToXyzMatrixD65[0][2],
      r * displayP3ToXyzMatrixD65[1][0] + g * displayP3ToXyzMatrixD65[1][1] + b * displayP3ToXyzMatrixD65[1][2],
      r * displayP3ToXyzMatrixD65[2][0] + g * displayP3ToXyzMatrixD65[2][1] + b * displayP3ToXyzMatrixD65[2][2]
  ];

  return xyz;
}

