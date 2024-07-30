// rgbToLab.mjs
import { rgbToXyz } from './rgbToXyz.mjs';

export function rgbToLab(r, g, b) {
  // Convert RGB to XYZ
  const { x, y, z } = rgbToXyz(r, g, b);

  // Convert XYZ to LAB
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  const xRatio = x / refX;
  const yRatio = y / refY;
  const zRatio = z / refZ;

  const xLab = (xRatio > 0.008856) ? Math.cbrt(xRatio) : (xRatio * 7.787) + (16 / 116);
  const yLab = (yRatio > 0.008856) ? Math.cbrt(yRatio) : (yRatio * 7.787) + (16 / 116);
  const zLab = (zRatio > 0.008856) ? Math.cbrt(zRatio) : (zRatio * 7.787) + (16 / 116);

  const l = (116 * yLab) - 16;
  const a = 500 * (xLab - yLab);
  const bLab = 200 * (yLab - zLab);

  // Normalize LAB values to [0, 1]
  const labMin = -128;
  const labMax = 128;

  return {
    l: (l - labMin) / (labMax - labMin),
    a: (a - labMin) / (labMax - labMin),
    b: (bLab - labMin) / (labMax - labMin),
  };
}
