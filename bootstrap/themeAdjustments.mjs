
export const categories = {
  'body-background-color': ['body-bg', 'background', 'bg'],
  'secondary-background-color': ['secondary-background', 'secondary-bg', 'secondary-body-bg'],
  'tertiary-background-color': ['tertiary-background', 'tertiary-bg', 'tertiary-body-bg'],
  'body-text-color': ['body-color', 'text-color'],
  'primary-color': ['primary-color', 'primary'],
  'secondary-color': ['secondary-color', 'secondary'],
  'tertiary-color': ['tertiary-color', 'tertiary'],
  'success-color': ['success-color', 'success'],
  'warning-color': ['warning-color', 'warning'],
  'error-color': ['error-color', 'danger-color', 'error', 'danger'],
  'info-color': ['info-color', 'info'],
  'border-color': ['border-color'],
  'font-size': ['font-size'],
  'font-family': ['font-family', 'sans-serif'],
  'line-height': ['line-height'],
  'border-width': ['border-width']
};

export const colorStrategies = {
  'body-background-color': [
    { strategy: 'grayscale', weight: 0.5 },
    { strategy: 'complementary', weight: 0.3 },
    { strategy: 'identity', weight: 0.2 }
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
    { strategy: 'complementary', weight: 0.7 },
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
    { strategy: 'reddish', weight: 1.0 }
  ],
  'info-color': [
    { strategy: 'bluish', weight: 1.0 }
  ]
};



export const colorBoundaries = {
  'general': {
    'light': {
      min: 0.7,
      max: 0.9
    },
    'dark': {
      min: 0.1,
      max: 0.3
    }
  },
  'identity': {
    'light': {
      min: 0.4,
      max: 0.8
    },
    'dark': {
      min: 0.2,
      max: 0.6
    }
  },
  'functional': {
    'success': {
      h: 120,
      s: 0.4,
      l: 0.5
    },
    'warning': {
      h: 45,
      s: 0.9,
      l: 0.5
    },
    'error': {
      h: 0,
      s: 0.7,
      l: 0.5
    },
    'info': {
      h: 200,
      s: 0.7,
      l: 0.5
    }
  }
};

export const defaultRanges = {
  'font-size': {
    min: 8,
    max: 72,
    unit: 'px'
  },
  'border-width': {
    min: 0.5,
    max: 10,
    unit: 'px'
  },
  'line-height': {
    min: 1,
    max: 2,
    unit: ''
  }
};
