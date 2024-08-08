// Conversion matrix from Rec. 2020 to sRGB
const rec2020ToRgbMatrix = [
  [0.636958, 0.144617, 0.168880],
  [0.262700, 0.677998, 0.059303],
  [0.000000, 0.028072, 1.060985]
];

// Helper function to multiply a matrix with RGB values
const multiplyMatrix = (matrix, rgb) => {
  return matrix.map(row =>
      row.reduce((sum, value, i) => sum + value * rgb[i], 0)
  );
};



// Convert Rec. 2020 to RGB (sRGB)
export const rec2020ToRgb = (r, g, b) => {
  const normalizedRec2020 = [r / 255, g / 255, b / 255];
  const sRGB = multiplyMatrix(rec2020ToRgbMatrix, normalizedRec2020);
  return sRGB.map(value => Math.round(Math.max(0, Math.min(255, value * 255))));
};


const rec2020Red = [255, 0, 0];
const sRGBRed = rec2020ToRgb(...rec2020Red);
console.log('sRGB Red:', sRGBRed); // Example output: [143, 0, 0]
