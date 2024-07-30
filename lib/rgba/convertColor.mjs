export function toPrecision(value, decimals) {
  if (typeof value === 'number' && !isNaN(value)) {
    return Number(value.toFixed(decimals));
  }
  return undefined; // Or throw an error if appropriate
}

import {
  convertComponent,
  toRelativeColor,
  toAbsoluteColor
} from './convertColorComponents.mjs';

import {
  rgbToHsl, hslToRgb,
  rgbToHwb, hwbToRgb,
  rgbToLab, labToRgb,
  lchToLab, labToLch,
  xyzToRgb, rgbToXyz,
  labToXyz, xyzToLab
} from './colorConversions.mjs'; // Adjust the path accordingly

export const convertColor = (colorComponents, fromColorspace, toColorspace, fromRelative, toRelative) => {
  const colorComponentsConverted = fromRelative
    ? toRelativeColor(colorComponents, fromColorspace)
    : colorComponents;

  console.log('Converted Color Components:', colorComponentsConverted);

  let intermediate;

  // Convert from source colorspace to RGB
  switch (fromColorspace.toLowerCase()) {
    case 'rgb':
      intermediate = colorComponentsConverted;
      break;
    case 'hsl':
      intermediate = hslToRgb(colorComponentsConverted.h, colorComponentsConverted.s, colorComponentsConverted.l);
      break;
    case 'hwb':
      intermediate = hwbToRgb(colorComponentsConverted.h, colorComponentsConverted.w, colorComponentsConverted.b);
      break;
    case 'lab':
      intermediate = labToRgb(colorComponentsConverted.l, colorComponentsConverted.a, colorComponentsConverted.b);
      break;
    case 'lch':
      const lab = lchToLab(colorComponentsConverted.l, colorComponentsConverted.c, colorComponentsConverted.h);
      intermediate = labToRgb(lab.l, lab.a, lab.b);
      break;
    case 'xyz':
      intermediate = xyzToRgb(colorComponentsConverted.x, colorComponentsConverted.y, colorComponentsConverted.z);
      break;
    default:
      throw new Error(`Unsupported source colorspace: ${fromColorspace}`);
  }

  console.log('Intermediate RGB:', intermediate);

  let result;

  // Convert from RGB to target colorspace
  switch (toColorspace.toLowerCase()) {
    case 'rgb':
      result = intermediate;
      break;
    case 'hsl':
      result = rgbToHsl(intermediate.r, intermediate.g, intermediate.b);
      break;
    case 'hwb':
      result = rgbToHwb(intermediate.r, intermediate.g, intermediate.b);
      break;
    case 'lab':
      result = rgbToLab(intermediate.r, intermediate.g, intermediate.b);
      break;
    case 'lch':
      const lab = rgbToLab(intermediate.r, intermediate.g, intermediate.b);
      result = labToLch(lab.l, lab.a, lab.b);
      break;
    case 'xyz':
      result = rgbToXyz(intermediate.r, intermediate.g, intermediate.b);
      break;
    default:
      throw new Error(`Unsupported target colorspace: ${toColorspace}`);
  }

  console.log('Result:', result);

  // Convert result to relative or absolute values
  const res = toRelative
    ? toRelativeColor(result, toColorspace)
    : result;

  return res;
};
