// Import functions and theme configuration
import {
  adjustToShade,
  adjustToTint,
  adjustColorForContrast,
  adjustToGrayscale,
  adjustColorForComplementary,
  adjustColorForIdentity,
  adjustColorToBluish,
  adjustColorToGreenish,
  adjustColorToOrangish,
  adjustColorToReddish,
} from './colorFilters.mjs';

import { themeConfig } from './themeConfig.mjs';
import { deviceFonts, googleFonts } from "./fonts.mjs";

// Helper functions
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomValueWithUnit(min, max, unit) {
  const randomValue = getRandomValue(min, max);
  // Include unit only if it's defined
  return unit ? `${randomValue.toFixed(2)}${unit}` : `${randomValue.toFixed(2)}`;
}


function getRandomColor(min = 0, max = 100) {
  const randomValue = getRandomValue(min, max);
  return `#${Math.floor(randomValue * 16777215 / 100).toString(16).padStart(6, '0')}`;
}

function getRandomFont(values) {
  const fonts = values || [...deviceFonts, ...googleFonts];
  const randomIndex = Math.floor(Math.random() * fonts.length);
  return fonts[randomIndex];
}

function getRandomFromList(values) {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function applyStrategy(value, type, strategy, theme, options = {}) {
  console.log('Applying strategy:', value, type, strategy, theme, options);
  const { unit } = options;

  switch (type) {
    case 'color':
      switch (strategy) {
        case 'shade':
          return adjustToShade(value, 0.15);
        case 'tint':
          return adjustToTint(value, 0.15);
        case 'contrast':
          return adjustColorForContrast(value, '#000000', 4.5);
        case 'grayscale':
          return adjustToGrayscale(value);
        case 'complementary':
          return adjustColorForComplementary(value);
        case 'identity':
          return adjustColorForIdentity(value, theme);
        case 'reddish':
          return adjustColorToReddish(value);
        case 'greenish':
          return adjustColorToGreenish(value);
        case 'orangish':
          return adjustColorToOrangish(value);
        case 'bluish':
          return adjustColorToBluish(value);
        case 'random':
          return getRandomColor();
        default:
          throw new Error(`Unknown strategy: ${strategy}`);
      }
    case 'numeric':
      if (strategy === 'random') {
        console.log('Random value:', options);
        return getRandomValueWithUnit(options.min, options.max, unit);
      }
      throw new Error(`Unknown strategy for numeric type: ${strategy}`);
    case 'font':
      if (strategy === 'random') {
        return getRandomFont(options.values);
      }
      throw new Error(`Unknown strategy for font type: ${strategy}`);
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

function getValueFromStrategies(value, category, type) {
  console.log('****', value, category, type);
  const strategies = themeConfig[category]?.strategies || [];
  const totalWeight = strategies.reduce((acc, s) => acc + (s.weight || 1), 0);
  let random = Math.random() * totalWeight;

  for (const s of strategies) {
    random -= s.weight || 1;
    if (random <= 0) {
      return applyStrategy(value, type, s.strategy, 'light', s);
    }
  }

  return value;
}

function topologicalSort() {
  const sortedCategories = [];
  const visited = new Set();
  const tempMark = new Set();

  function visit(category) {
    if (tempMark.has(category)) throw new Error('Cyclic dependency detected');
    if (!visited.has(category)) {
      tempMark.add(category);
      const config = themeConfig[category];
      if (config) {
        const sources = Array.isArray(config.source) ? config.source : (config.source ? [config.source] : []);
        // Ensure sources are not undefined and do not include the category itself
        sources.filter(source => source !== category)
               .forEach(source => visit(source));
      }
      tempMark.delete(category);
      visited.add(category);
      sortedCategories.push(category);
    }
  }

  Object.keys(themeConfig).forEach(category => visit(category));
  return sortedCategories;
}

function getValueFromSources(sources, categoryValues, type) {
  console.log('Getting value from sources:', sources, categoryValues, type);
  const defaultValue = type === 'color' ? getRandomColor() : (type === 'numeric' ? getRandomValueWithUnit(config.min, config.max, config.unit) : '');
  // Resolve sources and filter out undefined values
  const values = sources.map(source => categoryValues[source]).filter(value => value !== undefined);
  
  if (values.length === 0) return defaultValue;

  let value = values[0] || defaultValue;

  const strategies = themeConfig[sources[0]]?.strategies || [];
  strategies.forEach(({ strategy, weight = 1, values }) => {
    value = applyStrategy(value, type, strategy, 'light', values);
  });

  return value;
}

export function processAllCategories(theme) {
  const sortedCategories = topologicalSort();
  const categoryValues = {};

  sortedCategories.forEach(category => {
    const config = themeConfig[category];
    if (config) {
      // Handle sources with a default fallback
      const sources = config.source
        ? (Array.isArray(config.source) ? config.source : [config.source])
        : [];
      const filteredSources = sources.filter(source => source !== undefined && source !== category);

      const type = config.type || 'color';
      const strategies = config.strategies || [];

      // Use a random base value if no valid sources are available
      const baseValue = filteredSources.length > 0
        ? getValueFromSources(filteredSources, categoryValues, type)
        : (type === 'color' ? getRandomColor() : (type === 'numeric' ? getRandomValueWithUnit(0, 10, 'px') : ''));

      console.log('Base value:', baseValue);
      const newValue = getValueFromStrategies(baseValue, category, type);

      console.log('newValue: ', newValue);

      categoryValues[category] = newValue;
    }
  });

  return categoryValues;
}
