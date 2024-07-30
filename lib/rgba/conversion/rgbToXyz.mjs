// rgbToXyz.mjs
export function rgbToXyz(r, g, b) {
  // Ensure input is between 0 and 1
  r = Math.min(1, Math.max(0, r));
  g = Math.min(1, Math.max(0, g));
  b = Math.min(1, Math.max(0, b));

  // Apply gamma correction to convert from gamma corrected RGB to linear RGB
  r = (r <= 0.04045) ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  g = (g <= 0.04045) ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  b = (b <= 0.04045) ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;

  // Convert RGB to XYZ using the conversion matrix
  let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  let y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  let z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  // Normalize to reference white (D65)
  const refX = 0.95047;
  const refY = 1.00000;
  const refZ = 1.08883;

  // Normalize XYZ values
  x /= refX;
  y /= refY;
  z /= refZ;

  // Ensure output is between 0 and 1
  x = Math.min(1, Math.max(0, x));
  y = Math.min(1, Math.max(0, y));
  z = Math.min(1, Math.max(0, z));

  return { x, y, z };
}


// export function rgbToXyz(r, g, b) {
  // // Apply gamma correction to convert from gamma corrected RGB to linear RGB
  // r = (r <= 0.04045) ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  // g = (g <= 0.04045) ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  // b = (b <= 0.04045) ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;

//   // Convert linear RGB to XYZ using the D65 illuminant conversion matrix
//   const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
//   const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
//   const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

//   return { x, y, z };
// }

// export function rgbToXyz(r, g, b) {
//   const x =  0.4124 * r + 0.3576 * g + 0.1805 * b
//   const y =  0.2126 * r + 0.7152 * g + 0.0722 * b
//   const z =  0.0193 * r + 0.1192 * g + 0.9505 * b
//   // For some reason, X, Y and Z are multiplied by 100.
//   return { x: x, y: y, z: z }
// }