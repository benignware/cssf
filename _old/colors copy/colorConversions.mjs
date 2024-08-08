// colorConversions.js

// Converts from sRGB to XYZ
export function srgbToXyz([r, g, b]) {
  // Convert sRGB to linear RGB
  const [rLinear, gLinear, bLinear] = [r, g, b].map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));

  // Apply RGB to XYZ matrix
  return [
      0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear,
      0.2126729 * rLinear + 0.7151522 * gLinear + 0.0721750 * bLinear,
      0.0193339 * rLinear + 0.1191920 * gLinear + 0.9503041 * bLinear
  ];
}

// Converts from XYZ to sRGB
export function xyzToSrgb([x, y, z]) {
  // Apply XYZ to RGB matrix
  const [rLinear, gLinear, bLinear] = [
      3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
      -0.9692660 * x + 1.8760108 * y + 0.0415560 * z,
      0.0556434 * x - 0.2040259 * y + 1.0572252 * z
  ];

  // Convert linear RGB to sRGB
  return [
      rLinear <= 0.0031308 ? 12.92 * rLinear : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055,
      gLinear <= 0.0031308 ? 12.92 * gLinear : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055,
      bLinear <= 0.0031308 ? 12.92 * bLinear : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055
  ];
}

// Converts from linear sRGB to XYZ
export function srgbLinearToXyz([rLinear, gLinear, bLinear]) {
  // Apply RGB to XYZ matrix
  return [
      0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear,
      0.2126729 * rLinear + 0.7151522 * gLinear + 0.0721750 * bLinear,
      0.0193339 * rLinear + 0.1191920 * gLinear + 0.9503041 * bLinear
  ];
}

// Converts from XYZ to linear sRGB
export function xyzToSrgbLinear([x, y, z]) {
  // Apply XYZ to RGB matrix
  const [rLinear, gLinear, bLinear] = [
      3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
      -0.9692660 * x + 1.8760108 * y + 0.0415560 * z,
      0.0556434 * x - 0.2040259 * y + 1.0572252 * z
  ];

  return [rLinear, gLinear, bLinear];
}



// Example conversion functions

// Display-P3 to XYZ conversion
// // colorConversions.mjs
// export function displayP3ToXyz(r, g, b) {
//   // Normalize Display-P3 values (0-255) to [0, 1]
//   r = r / 255;
//   g = g / 255;
//   b = b / 255;

//   // Define the Display-P3 to XYZ conversion matrix
//   const matrix = [
//     [0.4866, 0.2651, 0.1980],
//     [0.2285, 0.6916, 0.0799],
//     [0.0000, 0.0451, 0.9182]
//   ];

//   // Apply the matrix transformation
//   const x = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
//   const y = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
//   const z = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

//   return [x, y, z];
// }
// export function xyzToDisplayP3(x, y, z) {
//   // Define the XYZ to Display-P3 conversion matrix
//   const matrix = [
//     [2.49349, -0.82949, -0.24300],
//     [-0.47309, 1.55500, 0.04256],
//     [0.01765, -0.01760, 0.83030]
//   ];

//   // Apply the matrix transformation
//   const r = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
//   const g = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
//   const b = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;

//   // Clamp and scale the values to [0, 255]
//   return [
//     Math.round(Math.min(Math.max(r * 255, 0), 255)),
//     Math.round(Math.min(Math.max(g * 255, 0), 255)),
//     Math.round(Math.min(Math.max(b * 255, 0), 255))
//   ];
// }
// Converts from Display-P3 to XYZ
export function displayP3ToXyz([r, g, b]) {
  // Normalize Display-P3 values (0-255) to [0, 1]
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  // Define the Display-P3 to XYZ conversion matrix
  const matrix = [
    [0.4866, 0.2651, 0.1980],
    [0.2285, 0.6916, 0.0799],
    [0.0000, 0.0451, 0.9182]
  ];

  // Apply the matrix transformation
  const x = matrix[0][0] * normalizedR + matrix[0][1] * normalizedG + matrix[0][2] * normalizedB;
  const y = matrix[1][0] * normalizedR + matrix[1][1] * normalizedG + matrix[1][2] * normalizedB;
  const z = matrix[2][0] * normalizedR + matrix[2][1] * normalizedG + matrix[2][2] * normalizedB;

  return [x, y, z];
}

// Converts from XYZ to Display-P3
export function xyzToDisplayP3([x, y, z]) {
  // Define the XYZ to Display-P3 conversion matrix
  const matrix = [
    [2.49349, -0.82949, -0.24300],
    [-0.47309, 1.55500, 0.04256],
    [0.01765, -0.01760, 0.83030]
  ];

  // Apply the matrix transformation
  const r = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
  const g = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
  const b = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;

  // Scale the RGB values to the range [0, 255]
  const scaledR = r * 255;
  const scaledG = g * 255;
  const scaledB = b * 255;

  return [scaledR, scaledG, scaledB];
}

// Example usage of color conversion functions


// // Converts from XYZ to Display-P3
// export function xyzToDisplayP3([x, y, z]) {
//   // Apply XYZ to RGB matrix
//   const [rLinear, gLinear, bLinear] = [
//       2.49349 * x - 0.82985 * y - 0.0357 * z,
//       -0.82904 * x + 1.76126 * y + 0.02361 * z,
//       0.03585 * x - 0.07214 * y + 0.96294 * z
//   ];

//   // Convert linear RGB to Display-P3
//   return [rLinear <= 0.0031308 ? 12.92 * rLinear : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055,
//           gLinear <= 0.0031308 ? 12.92 * gLinear : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055,
//           bLinear <= 0.0031308 ? 12.92 * bLinear : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055];
// }

// Converts from a98RGB to XYZ
export function a98RgbToXyz([r, g, b]) {
  // Convert a98RGB to linear RGB
  const [rLinear, gLinear, bLinear] = [r, g, b].map(v => v <= 0.5 ? v / 0.2439 : Math.pow((v + 0.055) / 1.055, 2.4));

  // Apply RGB to XYZ matrix
  return [
      0.5767309 * rLinear + 0.1855540 * gLinear + 0.1881852 * bLinear,
      0.2973769 * rLinear + 0.6273491 * gLinear + 0.0752741 * bLinear,
      0.0270343 * rLinear + 0.0706872 * gLinear + 0.9911085 * bLinear
  ];
}

// Converts from XYZ to a98RGB
export function xyzToA98Rgb([x, y, z]) {
  // Apply XYZ to RGB matrix
  const [rLinear, gLinear, bLinear] = [
      2.04159 * x - 0.56496 * y - 0.34473 * z,
      -0.96926 * x + 1.87601 * y + 0.04156 * z,
      0.01344 * x - 0.11836 * y + 1.01517 * z
  ];

  // Convert linear RGB to a98RGB
  return [rLinear <= 0.0031308 ? 12.92 * rLinear : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055,
          gLinear <= 0.0031308 ? 12.92 * gLinear : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055,
          bLinear <= 0.0031308 ? 12.92 * bLinear : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055];
}

// Converts from ProPhoto RGB to XYZ
export function proPhotoRgbToXyz([r, g, b]) {
  // Convert ProPhoto RGB to linear RGB
  const [rLinear, gLinear, bLinear] = [r, g, b].map(v => v <= 0.5 ? v / 0.3457 : Math.pow((v + 0.0975) / 1.099, 2.4));

  // Apply RGB to XYZ matrix
  return [
      0.7976749 * rLinear + 0.1351917 * gLinear + 0.0313534 * bLinear,
      0.2880402 * rLinear + 0.7118741 * gLinear + 0.0000857 * bLinear,
      0.0000000 * rLinear + 0.0000000 * gLinear + 0.8252100 * bLinear
  ];
}

// Converts from XYZ to ProPhoto RGB
export function xyzToProPhotoRgb([x, y, z]) {
  // Apply XYZ to RGB matrix
  const [rLinear, gLinear, bLinear] = [
      1.3459433 * x - 0.2556075 * y - 0.0511116 * z,
      -0.5445989 * x + 1.5081673 * y + 0.0205351 * z,
       0.0000000 * x + 0.0000000 * y + 0.8252100 * z
  ];

  // Convert linear RGB to ProPhoto RGB
  return [rLinear <= 0.0031308 ? 12.92 * rLinear : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055,
          gLinear <= 0.0031308 ? 12.92 * gLinear : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055,
          bLinear <= 0.0031308 ? 12.92 * bLinear : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055];
}

// Converts from Rec. 2020 to XYZ
export function rec2020ToXyz([r, g, b]) {
  // Convert Rec. 2020 to linear RGB
  const [rLinear, gLinear, bLinear] = [r, g, b].map(v => v <= 0.018 ? v / 4.5 : Math.pow((v + 0.099) / 1.099, 1 / 0.45));

  // Apply RGB to XYZ matrix
  return [
      0.636958 * rLinear + 0.144617 * gLinear + 0.168882 * bLinear,
      0.262700 * rLinear + 0.677998 * gLinear + 0.059303 * bLinear,
      0.000000 * rLinear + 0.028072 * gLinear + 1.060985 * bLinear
  ];
}

// Converts from XYZ to Rec. 2020
export function xyzToRec2020([x, y, z]) {
  // Apply XYZ to RGB matrix
  const [rLinear, gLinear, bLinear] = [
      1.716651 * x - 0.355670 * y - 0.253365 * z,
      -0.666684 * x + 1.616481 * y + 0.015768 * z,
      0.017600 * x - 0.042555 * y + 0.953715 * z
  ];

  // Convert linear RGB to Rec. 2020
  return [rLinear <= 0.0031308 ? 12.92 * rLinear : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055,
          gLinear <= 0.0031308 ? 12.92 * gLinear : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055,
          bLinear <= 0.0031308 ? 12.92 * bLinear : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055];
}
