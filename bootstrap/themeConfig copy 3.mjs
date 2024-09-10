export const themeConfig = {
  'primary-color': {
    keywords: ['primary', 'color'],
    type: 'color',
    input: '#007bff', // Default primary color
    strategies: [
      { strategy: 'random' }  // Random strategy to determine the primary color
    ]
  },
  'background-color': {
    keywords: ['background', 'bg'],
    type: 'color',
    input: 'var(--primary-color)',
    strategies: [
      { strategy: 'tint', amount: 0.5, scope: 'colorScheme:light' },  // Lighten for light theme
      { strategy: 'shade', amount: 0.5, scope: 'colorScheme:dark' }  // Darken for dark theme
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
    input: 'var(--primary-color)',
    strategies: [
      { strategy: 'tint', amount: 0.8, scope: 'colorScheme:light' },  // Lighten for light theme
      { strategy: 'shade', amount: 0.8, scope: 'colorScheme:dark' }  // Darken for dark theme
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
      { strategy: 'random' }  // Random font family
    ]
  },
  'font-size': {
    keywords: ['font-size'],
    type: 'numeric',
    strategies: [
      { strategy: 'random' }  // Random font size
    ]
  },
  'font-weight': {
    keywords: ['font-weight'],
    type: 'numeric',
    strategies: [
      { strategy: 'random' }  // Random font weight
    ]
  }
};
