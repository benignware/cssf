// Helper function to multiply a matrix with RGB values
const multiplyMatrix = (matrix, rgb) => {
  return matrix.map(row =>
      row.reduce((sum, value, i) => sum + value * rgb[i], 0)
  );
};

// Rec. 2020 to XYZ conversion matrix
const rec2020ToXyzMatrix = [
  [0.636958, 0.144617, 0.168880],
  [0.262700, 0.677998, 0.059303],
  [0.000000, 0.028073, 1.060883]
];

const xyzToRec2020Matrix = [
  [1.716652, -0.355670, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.017639, -0.042770, 0.942103]
];

export const rec2020ToXyz = (r, g, b) => {
  const normalizedRgb = [r / 255, g / 255, b / 255];
  const xyz = multiplyMatrix(rec2020ToXyzMatrix, normalizedRgb);
  return xyz.map(value => Math.round(value * 10000) / 10000); // Limit to 4 decimal places
};

export const xyzToRec2020 = (x, y, z) => {
  const normalizedXyz = [x, y, z];
  const rgb = multiplyMatrix(xyzToRec2020Matrix, normalizedXyz);
  return rgb.map(value => Math.round(Math.max(0, Math.min(255, value * 255))));
};
