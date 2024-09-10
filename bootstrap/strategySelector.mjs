import {
  applyGrayscale,
  applyComplementary,
  applyIdentity,
  applyRandom
} from './colorStrategies.mjs';

import { mixColors, rgbToHex } from './colorUtils.mjs';

// Function to get a random strategy based on weights
export function getRandomStrategy(strategies) {
  const totalWeight = strategies.reduce((sum, strategy) => sum + strategy.weight, 0);
  const random = Math.random() * totalWeight;
  let accumulatedWeight = 0;

  for (const strategy of strategies) {
    accumulatedWeight += strategy.weight;
    if (random <= accumulatedWeight) {
      return strategy.strategy;
    }
  }

  return null; // Fallback in case no strategy was selected
}

// Function to apply a strategy to a color
export function applyStrategy(strategy, color) {
  switch (strategy) {
    case 'grayscale':
      return applyGrayscale(color);
    case 'complementary':
      return applyComplementary(color);
    case 'identity':
      return applyIdentity(color);
    case 'random':
      return applyRandom();
    default:
      return color; // Default case
  }
}

// Function to get color from sources
export function getColorFromSources(sources) {
  // Example logic for processing colors
  if (!sources || !sources.length) return '#000000';

  let r = 0, g = 0, b = 0;

  sources.forEach(source => {
    // Check if source is a valid color
    if (source.color && source.color.r !== undefined && source.color.g !== undefined && source.color.b !== undefined) {
      r += source.color.r;
      g += source.color.g;
      b += source.color.b;
    }
  });

  // Convert to average or another method if needed
  return rgbToHex(r / sources.length, g / sources.length, b / sources.length);
}


/**
 * Get color based on the provided strategies and sources.
 * 
 * @param {Object[]} strategies - Array of strategy objects.
 * @param {string} category - The category of the color to generate.
 * @returns {string} - The resulting color in hex format.
 */
export function getColorFromStrategies(strategies, category) {
  const colors = [];
  const weights = [];

  strategies.forEach(strategy => {
    if (strategy.source) {
      const sources = Array.isArray(strategy.source) ? strategy.source : [strategy.source];
      const color = getColorFromSources(sources);
      if (color) {
        colors.push(color);
        weights.push(strategy.weight || 1.0);
      }
    } else if (strategy.strategy === 'random') {
      colors.push(generatePrimaryColor());
      weights.push(strategy.weight || 1.0);
    } else {
      // Handle other strategies as needed
      // Example: use primary color for variations
      const color = getColorFromSources(['primary-color']);
      if (color) {
        colors.push(color);
        weights.push(strategy.weight || 1.0);
      }
    }
  });

  return mixColors(colors, weights);
}
