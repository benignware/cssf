import { parseFn } from '../ast/parseFn.mjs';
import { getColorArgs } from './getColorArgs.mjs';

export function convertToColorSyntax(legacyColor) {
  const [fnName, ...args] = parseFn(legacyColor);
  const components = [...getColorArgs(args.join(' '))];
  
  if (!['rgb', 'rgba'].includes(fnName.toLowerCase())) return legacyColor;

  // Find alpha separator in any position
  const slashIndex = components.findIndex(c => c === '/');
  let rgbValues, alphaValue;

  if (slashIndex !== -1) {
      // Modern syntax with slash separator
      rgbValues = components.slice(0, slashIndex);
      alphaValue = components.slice(slashIndex + 1).join(' ');
  } else if (fnName.toLowerCase() === 'rgba' && components.length === 4) {
      // Legacy comma-separated RGBA
      rgbValues = components.slice(0, 3);
      alphaValue = components[3];
  } else {
      // RGB without alpha
      rgbValues = components;
  }

  // Validate RGB component count
  if (rgbValues.length !== 3) return legacyColor;

  const decValues = rgbValues.map(c => {
    const n = parseFloat(c);

    if (!isNaN(n)) {
      return n / 255;
    }
    
    return c;
  });

  // Preserve original formatting
  const colorPart = decValues.join(' ');
  const alphaPart = alphaValue ? ` / ${alphaValue}` : '';
  
  return `color(srgb ${colorPart}${alphaPart})`;
}

export function convertToLegacySyntax(colorSyntax) {
    const [fnName, ...args] = parseFn(colorSyntax);
    const { c1, c2, c3, a, colorSpace } = getColorArgs(args.join(' '));
    const components = [c1, c2, c3, a];
    
    if (fnName !== 'color' || colorSpace !== 'srgb') return colorSyntax;

    const rgbValues = components.slice(0, 3);
    const alphaValue = components[3]

    // Construct legacy syntax
    const legacyFn = alphaValue ? 'rgba' : 'rgb';
    const params = [...rgbValues];
    if (alphaValue !== undefined) params.push(alphaValue);
    
    return `${legacyFn}(${params.join(', ')})`;
}

export const isColorEquivalent = (color1, color2) => {
  return convertToColorSyntax(color1) === convertToColorSyntax(color2);
}