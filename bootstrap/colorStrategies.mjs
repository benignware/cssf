// colorStrategies.mjs
import {
  adjustToGrayscale,
  adjustColorForComplementary,
  adjustColorForIdentity,
  mixColors
} from './colorUtils.mjs';

// Strategy functions
export function applyGrayscale(color) {
  return adjustToGrayscale(color);
}

export function applyComplementary(color) {
  return adjustColorForComplementary(color);
}

export function applyIdentity(color) {
  return color; // No change
}

export function applyRandom() {
  // Generate a random color
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

export const colorStrategies = {
  'body-background-color': [
    { strategy: 'identity', weight: 0.5 },
    { strategy: 'complementary', weight: 0.3 },
    { strategy: 'grayscale', weight: 0.2 }
  ],
  'secondary-background-color': [
    { strategy: 'shade', weight: 1.0, source: 'body-background-color' }
  ],
  'tertiary-background-color': [
    { strategy: 'tint', weight: 1.0, source: 'body-background-color' }
  ],
  'body-text-color': [
    { strategy: 'contrast', weight: 1.0, source: 'body-background-color' }
  ],
  'border-color': [
    { strategy: 'grayscale', weight: 0.4, source: ['body-text-color', 'body-background-color'] },
    { strategy: 'identity', weight: 0.3, source: 'body-text-color' },
    { strategy: 'complementary', weight: 0.3, source: 'body-text-color' }
  ],
  'primary-color': [
    { strategy: 'random', weight: 1.0 }
  ],
  'secondary-color': [
    { strategy: 'complementary', weight: 0.7, source: 'primary-color' },
    { strategy: 'random', weight: 0.3 }
  ],
  'tertiary-color': [
    { strategy: 'variation', weight: 1.0, source: 'primary-color' }
  ],
  'success-color': [
    { strategy: 'greenish', weight: 1.0 }
  ],
  'warning-color': [
    { strategy: 'orangish', weight: 1.0 }
  ],
  'error-color': [
    { strategy: 'reddish', weight: 1.0, source: 'primary-color' }
  ],
  'info-color': [
    { strategy: 'bluish', weight: 1.0 }
  ]
};

