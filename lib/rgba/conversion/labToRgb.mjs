// labToRgb.mjs
import { xyzToRgb } from './xyzToRgb.mjs'; // Import the xyzToRgb function

export function labToRgb(l, a, b) {
  // Convert LAB to XYZ
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const refX =  95.047;
  const refY = 100.000;
  const refZ = 108.883;

  x = refX * ((x ** 3 > 0.008856) ? x ** 3 : (x - 16 / 116) / 7.787);
  y = refY * ((y ** 3 > 0.008856) ? y ** 3 : (y - 16 / 116) / 7.787);
  z = refZ * ((z ** 3 > 0.008856) ? z ** 3 : (z - 16 / 116) / 7.787);

  // Convert XYZ to RGB using xyzToRgb function
  return xyzToRgb(x / 100, y / 100, z / 100);
}
