import {
  adjustToGrayscale,
  adjustColorForComplementary,
  adjustColorForIdentity,
  adjustToShade,
  adjustToTint,
  getContrastColor,
  hexToHSL,
  hslToHex,
  mixColors
} from "./colorUtils.mjs";
import { colorStrategies } from "./themeAdjustments.mjs";

function mixSourceColors(sources, elementMap) {
  const colors = sources.map(sourceCategory => {
    const sourceElement = elementMap.find(e => e.category === sourceCategory);
    return sourceElement ? sourceElement.element.value : null;
  }).filter(Boolean); // Remove any null values

  if (colors.length === 0) return null; // No valid colors found

  if (colors.length === 1) return colors[0]; // Only one valid color

  // Mix the colors 50%
  return mixColors(colors[0], colors[1]);
}

export function getThemeAdjustments(themeData) {
  const { elementMap } = themeData;

  elementMap.forEach(({ element, category, theme }) => {
    const strategies = colorStrategies[category];

    if (!strategies) {
      return; // Skip if no strategies are defined
    }

    const selectedStrategy = getRandomWeightedStrategy(strategies);

    // Determine the source color(s)
    const source = strategies.find(s => s.strategy === selectedStrategy).source || 'primary-color';
    let sourceColor = null;

    if (Array.isArray(source)) {
      // If multiple sources are provided, mix them
      sourceColor = mixSourceColors(source, elementMap);
    } else {
      // Single source
      const sourceElement = elementMap.find(e => e.category === source);
      sourceColor = sourceElement ? sourceElement.element.value : null;
    }

    // Apply the adjustment strategy
    let adjustedColor;
    switch (selectedStrategy) {
      case 'grayscale':
        adjustedColor = adjustToGrayscale(sourceColor);
        break;
      case 'complementary':
        adjustedColor = adjustColorForComplementary(sourceColor);
        break;
      case 'identity':
        adjustedColor = adjustColorForIdentity(sourceColor);
        break;
      case 'contrast':
        adjustedColor = getContrastColor(sourceColor);
        break;
      case 'shade':
        adjustedColor = adjustToShade(sourceColor);
        break;
      case 'tint':
        adjustedColor = adjustToTint(sourceColor);
        break;
      case 'greenish':
      case 'orangish':
      case 'reddish':
      case 'bluish':
        adjustedColor = generateFunctionalColor(selectedStrategy, sourceColor);
        break;
      default:
        adjustedColor = sourceColor;
    }

    element.value = adjustedColor;
  });

  return themeData; // Return the modified themeData with adjusted colors
}
