import { themeConfig } from './themeConfig.mjs';

function applyColorStrategy(color, strategy, amount) {
  console.log(`Applying strategy ${strategy} with amount ${amount} to color ${color}`);
  
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
      return adjustColorForIdentity(color, 'light');
    case 'reddish':
      return adjustColorToReddish(color);
    case 'greenish':
      return adjustColorToGreenish(color);
    case 'orangish':
      return adjustColorToOrangish(color);
    case 'bluish':
      return adjustColorToBluish(color);
    default:
      return color;
  }
}

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
  };

  Object.keys(config).forEach(key => resolveDependencies(key));
  console.log('Dependency graph:', graph);
  return graph;
}

function processThemeConfig(theme) {
  const graph = buildDependencyGraph(themeConfig);
  const resolved = {};

  const resolveProperty = (property) => {
    if (resolved[property]) return resolved[property];
    
    const config = themeConfig[property];
    if (!config) return;
    
    const { input, strategies } = config;
    let value = input;

    strategies.forEach(strategy => {
      if (strategy.scope === `colorScheme:${theme}`) {
        if (strategy.strategy === 'apply') {
          value = strategy.color || strategy.font || strategy.size || strategy.weight;
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
  
  // Generate CSS with scoping for colorScheme
  const css = Object.keys(resolved).map(key => `body[data-colorScheme="${theme}"] { --${key}: ${resolved[key]}; }`).join('\n');
  console.log('Generated CSS:', css);
  return css;
}

export function updateStylesheet(theme) {
  console.log(`Updating stylesheet for theme: ${theme}`);
  const css = processThemeConfig(theme);
  let styleSheet = document.getElementById('dynamic-styles');
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    document.head.appendChild(styleSheet);
  }
  styleSheet.textContent = css;
}

export function setupThemeSwitcher() {
  const radios = document.querySelectorAll('input[name="theme"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (event) => {
      const theme = event.target.value;
      console.log(`Switching theme to: ${theme}`);
      document.body.setAttribute('data-colorScheme', theme);
      updateStylesheet(theme);
    });
  });
}

const initialTheme = document.body.getAttribute('data-colorScheme') || 'light';
updateStylesheet(initialTheme);
setupThemeSwitcher();
