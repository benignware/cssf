import {
  adjustToShade,
  adjustToTint,
  adjustColorForContrast,
  adjustToGrayscale,
  adjustColorForComplementary,
  adjustColorForIdentity,
  adjustColorToReddish,
  adjustColorToGreenish,
  adjustColorToOrangish,
  adjustColorToBluish
} from './colorFilters.mjs';

import { themeConfig } from './themeConfig.mjs';

// Function to apply color adjustment strategies
function applyColorStrategy(color, strategy, amount) {
  console.log(`Applying strategy: ${strategy} with amount: ${amount} to color: ${color}`);

  if (!color) {
    console.warn('No color provided for strategy.');
    return color;
  }

  switch (strategy) {
    case 'shade':
      return adjustToShade(color, amount);
    case 'tint':
      return adjustToTint(color, amount);
    case 'grayscale':
      return adjustToGrayscale(color);
    case 'complementary':
      return adjustColorForComplementary(color);
    case 'identity':
      return adjustColorForIdentity(color);
    case 'reddish':
      return adjustColorToReddish(color);
    case 'greenish':
      return adjustColorToGreenish(color);
    case 'orangish':
      return adjustColorToOrangish(color);
    case 'bluish':
      return adjustColorToBluish(color);
    default:
      console.warn(`Unknown strategy: ${strategy}`);
      return color;
  }
}

// Utility function to check if a value is a CSS variable
function isCssVariable(value) {
  return /^var\(--.*\)$/.test(value);
}

// Build the dependency graph
function buildDependencyGraph(config) {
  const graph = {};
  const resolveDependencies = (key) => {
    if (graph[key]) return;
    
    const { input, source } = config[key] || {};
    
    if (source) {
      graph[key] = graph[key] || [];
      if (Array.isArray(source)) {
        source.forEach(dependency => {
          resolveDependencies(dependency);
          graph[key].push(dependency);
        });
      } else {
        resolveDependencies(source);
        graph[key].push(source);
      }
    }

    if (input && isCssVariable(input)) {
      const variableName = input.match(/^var\(--(.*)\)$/)[1];
      resolveDependencies(variableName);
      graph[key] = graph[key] || [];
      graph[key].push(variableName);
    }
  };

  Object.keys(config).forEach(key => resolveDependencies(key));
  console.log('Dependency graph:', graph);
  return graph;
}

// Process the theme configuration to resolve values for a given theme
function processThemeConfig(theme) {
  const graph = buildDependencyGraph(themeConfig);
  const resolved = {};

  const resolveProperty = (property) => {
    if (resolved[property]) return resolved[property];
    
    const config = themeConfig[property];
    if (!config) {
      console.warn(`No config found for property: ${property}`);
      return;
    }
    
    const { input, strategies } = config;
    let value = input;

    if (isCssVariable(value)) {
      const variableName = value.match(/^var\(--(.*)\)$/)[1];
      value = resolveProperty(variableName);
    }

    console.log(`Initial resolved value for ${property}: ${value}`);
    
    strategies.forEach(strategy => {
      if (!strategy.scope || strategy.scope === `colorScheme:${theme}`) {
        if (strategy.strategy === 'apply') {
          if (strategy.color) value = strategy.color;
          if (strategy.font) value = strategy.font;
          if (strategy.size) value = strategy.size;
          if (strategy.weight) value = strategy.weight;
        } else {
          value = applyColorStrategy(value, strategy.strategy, strategy.amount);
        }
      }
    });

    resolved[property] = value;
    console.log(`Resolved ${property}: ${value}`);
    return value;
  };

  Object.keys(themeConfig).forEach(property => resolveProperty(property));
  
  return resolved;
}

// Generate formatted CSS for both light and dark themes
function generateCombinedCSS() {
  const themes = ['light', 'dark'];
  const css = themes.map(theme => {
    const resolved = processThemeConfig(theme);

    return Object.keys(resolved).map(key => 
      `  --${key}: ${resolved[key]};`
    ).join('\n');
  }).map((cssBlock, index) => 
    `body[data-colorScheme="${themes[index]}"] {\n${cssBlock}\n}`
  ).join('\n\n');

  console.log('Generated CSS for both themes:', css);
  return css;
}

// Update the stylesheet in the HTML
function updateStylesheet() {
  console.log('Updating stylesheet');
  const css = generateCombinedCSS();
  let styleSheet = document.getElementById('dynamic-styles');
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    document.head.appendChild(styleSheet);
  }
  styleSheet.textContent = css;
}

// Handle theme switching
function setupThemeSwitcher() {
  const radios = document.querySelectorAll('input[name="theme"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (event) => {
      const theme = event.target.value;
      console.log(`Switching theme to: ${theme}`);
      document.body.setAttribute('data-colorScheme', theme);
    });
  });
}

// Add shuffle functionality
function setupShuffleButton() {
  const button = document.getElementById('shuffle-btn');
  button.addEventListener('click', () => {
    console.log('Shuffling colors');
    updateStylesheet();
  });
}

// Initialize theme switcher, shuffle button, and set default stylesheet
setupThemeSwitcher();
setupShuffleButton();
updateStylesheet();
