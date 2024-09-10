export const themeConfig = {
  attributes: {
    colorScheme: {
      values: ['dark', 'light'],
      default: 'light'
    }
  },
  properties: {
    'primary-color': {
      keywords: ['primary-color', 'primary'],
      type: 'color',
      strategies: [
        { strategy: 'random' }
      ]
    },
    'body-background-color': {
      keywords: ['body-bg', 'background', 'bg'],
      type: 'color',
      strategies: [
        { strategy: 'grayscale', weight: 0.5 },
        { strategy: 'complementary', weight: 0.3 },
        { strategy: 'identity', weight: 0.2 }
      ]
    },
    'secondary-background-color': {
      keywords: ['secondary-background', 'secondary-bg', 'secondary-body-bg'],
      type: 'color',
      source: 'body-background-color',
      strategies: [
        { strategy: 'shade', weight: 1.0 }
      ]
    },
    'tertiary-background-color': {
      keywords: ['tertiary-background', 'tertiary-bg', 'tertiary-body-bg'],
      type: 'color',
      source: 'body-background-color',
      strategies: [
        { strategy: 'tint', weight: 1.0 }
      ]
    },
    'body-text-color': {
      keywords: ['body-color', 'text-color'],
      type: 'color',
      source: 'body-background-color',
      strategies: [
        { strategy: 'contrast', weight: 1.0 }
      ]
    },
    'border-color': {
      keywords: ['border-color'],
      type: 'color',
      sources: ['body-text-color', 'body-background-color'],
      strategies: [
        { strategy: 'grayscale', weight: 0.4 },
        { strategy: 'identity', weight: 0.3 },
        { strategy: 'complementary', weight: 0.3 }
      ]
    },
    'secondary-color': {
      keywords: ['secondary-color', 'secondary'],
      type: 'color',
      strategies: [
        { strategy: 'complementary', weight: 0.7 },
        { strategy: 'random', weight: 0.3 }
      ]
    },
    'tertiary-color': {
      keywords: ['tertiary-color', 'tertiary'],
      type: 'color',
      source: 'primary-color',
      strategies: [
        { strategy: 'complementary', weight: 0.7 },
        { strategy: 'random', weight: 0.3 }
      ]
    },
    'success-color': {
      keywords: ['success-color', 'success'],
      type: 'color',
      source: 'primary-color',
      strategies: [
        { strategy: 'greenish', weight: 1.0 }
      ]
    },
    'warning-color': {
      keywords: ['warning-color', 'warning'],
      type: 'color',
      source: 'primary-color',
      strategies: [
        { strategy: 'orangish', weight: 1.0 }
      ]
    },
    'error-color': {
      keywords: ['error-color', 'danger-color', 'error', 'danger'],
      type: 'color',
      source: 'primary-color',
      strategies: [
        { strategy: 'reddish', weight: 1.0 }
      ]
    },
    'info-color': {
      keywords: ['info-color', 'info'],
      type: 'color',
      source: 'primary-color',
      strategies: [
        { strategy: 'bluish', weight: 1.0 }
      ]
    },
    'font-size': {
      keywords: ['font-size'],
      type: 'numeric',
      strategies: [
        { strategy: 'random', min: 12, max: 20, unit: 'px' } // Font size in pixels
      ]
    },
    'font-family': {
      keywords: ['font-family', 'sans-serif'],
      type: 'font',
      strategies: [
        { strategy: 'random', values: ['Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Courier New', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Oswald', 'Nunito'] } // Predefined list of fonts
      ]
    },
    'line-height': {
      keywords: ['line-height'],
      type: 'numeric',
      strategies: [
        { strategy: 'random', min: 1.2, max: 2 } // Line height (unit-less)
      ]
    },
    'border-width': {
      keywords: ['border-width'],
      type: 'numeric',
      strategies: [
        { strategy: 'random', min: 1, max: 10, unit: 'px' } // Border width in pixels
      ]
    },
    'border-radius': {
      keywords: ['border-radius'],
      type: 'numeric',
      strategies: [
        { strategy: 'random', min: 0, max: 50, unit: 'px' } // Border radius in pixels
      ]
    },
    'font-weight': {
      keywords: ['font-weight'],
      type: 'numeric',
      strategies: [
        { strategy: 'random', values: [100, 200, 300, 400, 500, 600, 700, 800, 900] } // Font weight steps
      ]
    }
  }
};
