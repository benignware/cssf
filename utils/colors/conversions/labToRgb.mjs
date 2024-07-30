import { labToXyz } from './labToXyz.mjs';
import { xyzToRgb } from './xyzToRgb.mjs';

export const labToRgb = (l, a, b) => {
  const [x, y, z] = labToXyz(l, a, b);

  return xyzToRgb(x, y, z);
}