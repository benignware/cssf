import { rgbToHsl } from './conversions/rgbToHsl.mjs';
import { hslToRgb } from './conversions/hslToRgb.mjs';
import { xyzToRgb } from './conversions/xyzToRgb.mjs';
import { rgbToXyz } from './conversions/rgbToXyz.mjs';
import { xyzToLab } from './conversions/xyzToLab.mjs';
import { labToXyz } from './conversions/labToXyz.mjs';
import { rgbToLab } from './conversions/rgbToLab.mjs';
import { labToRgb } from './conversions/labToRgb.mjs';
import { rgbToLms } from './conversions/rgbToLms.mjs';
import { lmsToRgb } from './conversions/lmsToRgb.mjs';
import { lmsToXyz } from './conversions/lmsToXyz.mjs';
import { xyzToLms } from './conversions/xyzToLms.mjs';

const colorSpaceConversions = {
  rgbToHsl,
  hslToRgb,
  rgbToXyz,
  xyzToRgb,
  xyzToLab,
  labToXyz,
  rgbToLab,
  labToRgb,
  rgbToLms,
  lmsToRgb,
  lmsToXyz,
  xyzToLms,
};

// Unified conversion function
export const convertColorSpace = (fromSpace, toSpace, ...values) => {
  if (fromSpace === toSpace) {
    throw new Error(`Source and target color spaces are the same: ${fromSpace}`);
  }

  const relativeValues = colorSpaceConversions[`${fromSpace}To${toSpace.charAt(0).toUpperCase() + toSpace.slice(1)}`];
  if (!relativeValues) throw new Error(`Conversion from ${fromSpace} to ${toSpace} is not implemented`);

  return relativeValues(...values);
};
