

// Define the XYZ to Display-P3 matrix for D65
const xyzToDisplayP3MatrixD65 = [
  [ 2.49349, -0.82928,  0.33560],
  [-0.27215,  1.20667, -0.09709],
  [-0.00430,  0.00000,  1.00940]
];


export function xyzToDisplayP3(x, y, z) {
  // Convert XYZ to Display-P3
  const rgb = [
      x * xyzToDisplayP3MatrixD65[0][0] + y * xyzToDisplayP3MatrixD65[0][1] + z * xyzToDisplayP3MatrixD65[0][2],
      x * xyzToDisplayP3MatrixD65[1][0] + y * xyzToDisplayP3MatrixD65[1][1] + z * xyzToDisplayP3MatrixD65[1][2],
      x * xyzToDisplayP3MatrixD65[2][0] + y * xyzToDisplayP3MatrixD65[2][1] + z * xyzToDisplayP3MatrixD65[2][2]
  ];

  // Apply gamma correction (Display-P3 uses a gamma of 2.2)
  const gammaCorrect = value => value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
  const rgbCorrected = rgb.map(value => Math.round(gammaCorrect(value) * 255));

  return rgbCorrected;
}
