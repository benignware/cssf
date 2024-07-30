/**
 * 
 * Create a function that converts a set of color components between absolute and relative values. It should have a colorspace parameter so it can be used with colorspaces dynamically. it should support the colorspaces specified in css color level module 4 and the function should use the corresponding identifiers, 'rgb', 'hsl', 'hwb', 'lab', 'lch', 'xyz'. You can make use of two helper functions that do already exist to parse css values and units. These are: number(value) and unit(value). 
In ES6, please.
 */

import { rgbToHsl, rgbToHwb, rgbToLab, labToRgb, lchToLab, labToLch, hslToRgb, hwbToRgb } from './colorConversions.mjs';
// import { number, unit } from '../utils.mjs';

// Helper functions (assuming these are defined elsewhere and imported here)
function number(value) {
    return parseFloat(value);
}

function unit(value) {
    return value.replace(/[0-9.]/g, '');
}
// The function to test
export function convertColorComponents(components, colorspace, toRelative = true) {
  return components.map((component, index) => {
      let parsedValue = number(component);
      let parsedUnit = unit(component);
      let result;

      switch (colorspace.toLowerCase()) {
          case 'rgb':
              if (parsedUnit === '%') {
                  result = toRelative ? parsedValue / 100 : parsedValue * 100;
              } else {
                  result = toRelative ? parsedValue / 255 : parsedValue * 255;
              }
              break;

          case 'hsl':
          case 'hwb':
              if (index === 0) { // Hue in HSL/HWB, which can be in degrees or absolute numbers
                  if (parsedUnit === 'deg' || toRelative) {
                      result = parsedValue; // HSL/HWB hue is typically in degrees and remains unchanged
                  } else {
                      result = toRelative ? parsedValue / 360 : parsedValue * 360;
                  }
              } else {
                  result = parsedValue; // Percentages for saturation/lightness/whiteness/blackness
              }
              break;

          case 'lab':
              result = parsedValue; // Lab values are usually absolute and typically don't need conversion
              break;

          case 'lch':
              if (index === 0) { // Lightness in LCH
                  result = parsedValue; // Usually absolute
              } else if (index === 1) { // Chroma in LCH
                  result = parsedValue; // Can vary, typically absolute
              } else { // Hue in LCH, can be degrees or radians
                  if (parsedUnit === 'deg' || parsedUnit === 'rad' || toRelative) {
                      result = parsedValue; // Typically in degrees
                  } else {
                      result = toRelative ? parsedValue / 360 : parsedValue * 360;
                  }
              }
              break;

          default:
              throw new Error(`Unsupported colorspace: ${colorspace}`);
      }

      return result;
  });
}

// Reference values for each color space
const REFERENCE_VALUES = {
    rgb: [255, 255, 255],   // Maximum values for RGB
    hsl: [360, 100, 100],   // Maximum values for HSL
    hwb: [360, 100, 100],   // Maximum values for HWB
    lab: [100, 255, 255],   // Approximate range for Lab
    lch: [100, 255, 360],   // Approximate range for LCH
};

function convertColorSpace(components, fromColorSpace, toColorSpace, toRelative = true) {
    // Normalize the components to absolute values using convertColorValue
    const absoluteComponents = components.map((component, index) =>
        convertColorValue(component, unit(component), 'absolute', REFERENCE_VALUES[fromColorSpace.toLowerCase()][index], fromColorSpace.toLowerCase())
    );

    let rgbComponents;

    // Convert from any space to RGB first
    switch (fromColorSpace.toLowerCase()) {
        case 'rgb':
            rgbComponents = absoluteComponents;
            break;
        case 'hsl':
            rgbComponents = hslToRgb(...absoluteComponents);
            break;
        case 'hwb':
            rgbComponents = hwbToRgb(...absoluteComponents);
            break;
        case 'lab':
            rgbComponents = labToRgb(...absoluteComponents);
            break;
        case 'lch':
            const labComponents = lchToLab(...absoluteComponents);
            rgbComponents = labToRgb(...labComponents);
            break;
        default:
            throw new Error(`Unsupported fromColorSpace: ${fromColorSpace}`);
    }

    let resultComponents;

    // Convert from RGB to target space
    switch (toColorSpace.toLowerCase()) {
        case 'rgb':
            resultComponents = rgbComponents;
            break;
        case 'hsl':
            resultComponents = rgbToHsl(...rgbComponents);
            break;
        case 'hwb':
            resultComponents = rgbToHwb(...rgbComponents);
            break;
        case 'lab':
            resultComponents = rgbToLab(...rgbComponents);
            break;
        case 'lch':
            const lab = rgbToLab(...rgbComponents);
            resultComponents = labToLch(...lab);
            break;
        default:
            throw new Error(`Unsupported toColorSpace: ${toColorSpace}`);
    }

    // Convert the result components back to relative values if needed
    return resultComponents.map((component, index) =>
        convertColorValue(
            component,
            'absolute',
            toRelative ? '%' : 'absolute',
            REFERENCE_VALUES[toColorSpace.toLowerCase()][index],
            toColorSpace.toLowerCase()
        )
    );
}

export { convertColorSpace };
