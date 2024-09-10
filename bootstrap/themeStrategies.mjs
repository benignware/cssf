import {
  adjustToShade,
  adjustToTint,
  adjustColorForContrast,
  adjustColorToReddish,
  adjustColorToGreenish,
  adjustColorToOrangish,
  adjustColorToBluish,
  adjustColorByLightness,
  adjustColorToLightnessBound,
  adjustToGrayscale
} from './colorFilters.mjs';

const extractUnit = (value) => {
  if (typeof value !== 'string') return '';
  if (value.match(/#[0-9a-fA-F]{3,6}/)) return '';

  const match = value.match(/[a-zA-Z%]+$/);
  return match ? match[0] : '';
}

const generateRandomNumber = (options = {}) => {
  let { min, max, step, unit, digits = 2 } = options;
  
  unit = unit || extractUnit(min) || extractUnit(max) || '';

  const [minValue, maxValue] = [parseFloat(min), parseFloat(max)];

  let value = Math.random() * (maxValue - minValue) + minValue;

  if (step) {
    value = Math.round(value / step) * step;
  }

  if (digits === 0) {
    value = Math.round(value);
  }

  if (digits > 0) {
    value = value.toFixed(digits);
  }

  if (digits >= 0) {
    value = String(value).replace(/\.0+$/, '');
  }

  return `${value}${unit}`;
}

export function applyStrategy(baseValue, strategy, options = {}) {
  let finalValue;

  switch (strategy) {
    case 'randomColor':
      finalValue = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      break;
    case 'grayscale':
      finalValue = adjustToGrayscale(baseValue, options);
      break
    case 'tint':
      finalValue = adjustToTint(baseValue, options.amount || 0.05);
      break;
    case 'shade':
      finalValue = adjustToShade(baseValue, options.amount || 0.15);
      break;
    case 'tintOrShade':
      finalValue = adjustColorByLightness(baseValue, options.amount || 0.5);
      break;
    case 'lightnessBound':
      finalValue = adjustColorToLightnessBound(baseValue, options.amount || 0.5, 0, 1);
      break;
    case 'contrast':
      finalValue = adjustColorForContrast(baseValue);
      break;
    case 'greenish':
      finalValue = adjustColorToGreenish(baseValue);
      break;
    case 'orangish':
      finalValue = adjustColorToOrangish(baseValue);
      break;
    case 'reddish':
      finalValue = adjustColorToReddish(baseValue);
      break;
    case 'bluish':
      finalValue = adjustColorToBluish(baseValue);
      break;

    // Font strategies
    case 'randomFont':
      finalValue = 'Arial, sans-serif'; // Simple fallback for demonstration
      break;
    
    case 'randomNumber':
      // finalValue = `${Math.floor(Math.random() * 10) + 10}px`; // Random size between 10px and 110px
      finalValue = generateRandomNumber(options);
      break;

    // Value strategies
    default:
      console.error(`Unknown strategy: ${strategy}`);
      finalValue = baseValue;
  }

  return finalValue;
}