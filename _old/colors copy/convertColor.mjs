import { hexToRgb } from './conversions/hexToRgb.mjs';
import { rgbToHex } from './conversions/rgbToHex.mjs';
import { keyToRgb } from './conversions/keyToRgb.mjs';
import { rgbToKey } from './conversions/rgbToKey.mjs';
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

import { xyzToDisplayP3 } from './conversions/xyzToDisplayP3.mjs';

const colorConversions = {
  hexToRgb,
  rgbToHex,
  keyToRgb,
  rgbToKey,
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
  xyzToDisplayP3,
};

// Convert keys to a normalized format for easier matching
const normalizedConversions = Object.fromEntries(
  Object.entries(colorConversions).map(([key, func]) => [
    key.toLowerCase(),
    func,
  ])
);

// Define a function to create a pipeline of conversions
const createPipeline = (fromSpace, toSpace) => {
  const pipeline = [];
  const visited = new Set(); // Track visited nodes

  const findPath = (currentSpace, targetSpace) => {
    if (currentSpace === targetSpace) return true;
    if (visited.has(currentSpace)) return false; // Avoid revisiting nodes

    visited.add(currentSpace);

    for (const [key, func] of Object.entries(normalizedConversions)) {
      const [source, dest] = key.split('to');
      if (source === currentSpace.toLowerCase()) {
        if (findPath(dest, targetSpace.toLowerCase())) {
          pipeline.unshift(func);
          return true;
        }
      }
    }

    return false;
  };

  if (!findPath(fromSpace.toLowerCase(), toSpace.toLowerCase())) {
    throw new Error(`Conversion path from ${fromSpace} to ${toSpace} not found.`);
  }

  return pipeline;
};


// Unified conversion function
export const convertColor = (fromSpace, toSpace, ...values) => {
  console.log('convertColor', fromSpace, toSpace, values);
  if (fromSpace === toSpace) {
    throw new Error(`Source and target color spaces are the same: ${fromSpace}`);
  }

  const pipeline = createPipeline(fromSpace, toSpace);
  console.log('pipeline: ', pipeline);

  let result = values;

  for (const conversion of pipeline) {
    result = conversion(...result);
  }

  return result;
};
