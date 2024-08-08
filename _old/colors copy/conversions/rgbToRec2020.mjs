

// Helper function to multiply a matrix with RGB values
const multiplyMatrix = (matrix, rgb) => {
  return matrix.map(row =>
      row.reduce((sum, value, i) => sum + value * rgb[i], 0)
  );
};

// Conversion matrix from sRGB to Rec. 2020
const rgbToRec2020Matrix = [
  [1.716651, -0.355670, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.000000, -0.042780, 1.059830]
];

// Convert RGB (sRGB) to Rec. 2020
export const rgbToRec2020 = (r, g, b) => {
  const normalizedRGB = [r / 255, g / 255, b / 255];
  const rec2020 = multiplyMatrix(rgbToRec2020Matrix, normalizedRGB);
  return rec2020.map(value => Math.round(Math.max(0, Math.min(255, value * 255))));
};

const sRGBRedValue = [143, 0, 0];
const rec2020RedValue = rgbToRec2020(...sRGBRedValue);
console.log('Rec. 2020 Red:', rec2020RedValue); // Example output: [255, 0, 0]



// function rgbToRec2020(r, g, b) {
//   // Ensure RGB values are in the range [0, 1]
//   r = Math.max(0, Math.min(1, r));
//   g = Math.max(0, Math.min(1, g));
//   b = Math.max(0, Math.min(1, b));

//   // Convert from sRGB to Linear RGB
//   function toLinear(c) {
//       return (c <= 0.04045) ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
//   }
//   let rLinear = toLinear(r);
//   let gLinear = toLinear(g);
//   let bLinear = toLinear(b);

//   // Convert Linear RGB to Rec. 2020
//   // Rec. 2020 transformation matrix
//   const matrix = [
//       [0.636958, 0.144617, 0.168880],
//       [0.262700, 0.677998, 0.059302],
//       [0.000000, 0.028073, 1.060881]
//   ];

//   let rRec2020 = matrix[0][0] * rLinear + matrix[0][1] * gLinear + matrix[0][2] * bLinear;
//   let gRec2020 = matrix[1][0] * rLinear + matrix[1][1] * gLinear + matrix[1][2] * bLinear;
//   let bRec2020 = matrix[2][0] * rLinear + matrix[2][1] * gLinear + matrix[2][2] * bLinear;

//   // Ensure Rec. 2020 values are in the range [0, 1]
//   rRec2020 = Math.max(0, Math.min(1, rRec2020));
//   gRec2020 = Math.max(0, Math.min(1, gRec2020));
//   bRec2020 = Math.max(0, Math.min(1, bRec2020));

//   return { r: rRec2020, g: gRec2020, b: bRec2020 };
// }
