export const themeConfig = {
  scopes: {
    'color-scheme': {
      keywords: ['color-scheme', 'theme'],
      pattern: '[data-{{name}}="{{value}}"]',
      values: {
        'light': {
          keywords: ['light'],
          type: 'string',
          default: true
        },
        'dark': {
          keywords: ['dark'],
          type: 'string'
        }
      }
    }
  },
  properties: {
    'background-color': {
      keywords: ['background', 'bg'],
      type: 'color',
      input: 'var(--primary-color)',
      strategies: [
        { strategy: 'lightnessBound', amount: 0.9, scope: { 'color-scheme': 'light' } },  // Lighten for light theme
        { strategy: 'lightnessBound', amount: 0.1, scope: { 'color-scheme': 'dark' } },  // Darken for dark theme
        { strategy: 'grayscale' }  // Convert to grayscale
      ]
    },
    'text-color': {
      keywords: ['text', 'color'],
      type: 'color',
      input: 'var(--background-color)', // Use background color as base
      strategies: [
        { strategy: 'contrast' }  // Adjust text color for contrast with background
      ]
    },
    'border-color': {
      keywords: ['border', 'color'],
      type: 'color',
      input: 'var(--background-color)',
      strategies: [
        { strategy: 'shade', amount: 0.5, scope: { 'color-scheme': 'light' } },  // Lighten for light theme
        { strategy: 'tint', amount: 0.5, scope: { 'color-scheme': 'dark' } },  // Darken for dark theme

      ]
    },
    'primary-color': {
      keywords: ['primary', 'color'],
      type: 'color',
      input: '#007bff', // Default primary color
      strategies: [
        { strategy: 'randomColor' }  // Random strategy to determine the primary color
      ]
    },
    'success-color': {
      keywords: ['success', 'color'],
      type: 'color',
      input: 'var(--primary-color)',
      strategies: [
        { strategy: 'greenish' }  // Adjust primary to greenish
      ]
    },
    'warning-color': {
      keywords: ['warning', 'color'],
      type: 'color',
      input: 'var(--primary-color)',
      strategies: [
        { strategy: 'orangish' }  // Adjust primary to orangish
      ]
    },
    'error-color': {
      keywords: ['error', 'color'],
      type: 'color',
      input: 'var(--primary-color)',
      strategies: [
        { strategy: 'reddish' }  // Adjust primary to reddish
      ]
    },
    'info-color': {
      keywords: ['info', 'color'],
      type: 'color',
      input: 'var(--primary-color)',
      strategies: [
        { strategy: 'bluish' }  // Adjust primary to bluish
      ]
    },
    'font-family': {
      keywords: ['font-family'],
      type: 'font',
      strategies: [
        { strategy: 'randomFont' }  // Random font family
      ]
    },
    'font-size': {
      keywords: ['font-size'],
      type: 'numeric',
      min: '12px',
      max: '24px',
      strategies: [
        { strategy: 'randomNumber' }  // Random font size
      ]
    },
    'font-weight': {
      keywords: ['font-weight'],
      type: 'numeric',
      strategies: [
        { strategy: 'randomNumber', min: 100, max: 900, step: 100 }  // Random font weight
      ]
    }
  }
};
