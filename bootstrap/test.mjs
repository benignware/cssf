import { themeConfig } from './themeConfig.mjs';

import {
  applyStrategy
} from './themeStrategies.mjs';

import {
  getOutputScopes,
  getInputScopes,
  filterDefaultScopes,
  getInputValue,
  mergeScopes,
  isScoped,
  getDefaultScopeValue
} from './scopeHelpers.mjs';

// Parse dependencies function
function parseDependencies(config) {
  const dependencies = {};
  const reverseDependencies = {};

  // Initialize dependencies
  for (const key in config) {
    dependencies[key] = [];
    reverseDependencies[key] = [];
  }

  // Build dependency and reverse dependency maps
  for (const key in config) {
    const input = config[key].input;

    if (input && input.startsWith('var(--') && input.endsWith(')')) {
      const dependencyKey = input.slice(6, -1); // Correct slicing to remove 'var(--' and ')'

      if (dependencies[key] && !dependencies[key].includes(dependencyKey)) {
        dependencies[key].push(dependencyKey);
      }

      if (reverseDependencies[dependencyKey] && !reverseDependencies[dependencyKey].includes(key)) {
        reverseDependencies[dependencyKey].push(key);
      }
    }
  }

  return { dependencies, reverseDependencies };
}

// Topological Sort Algorithm
function topologicalSort(dependencies) {
  const sorted = [];
  const visited = new Set();
  const tempMarks = new Set();

  function visit(node) {
    if (tempMarks.has(node)) throw new Error('Cycle detected!');
    if (!visited.has(node)) {
      tempMarks.add(node);
      for (const neighbor of dependencies[node] || []) {
        visit(neighbor);
      }
      tempMarks.delete(node);
      visited.add(node);
      sorted.push(node);
    }
  }

  for (const node in dependencies) {
    if (!visited.has(node)) {
      visit(node);
    }
  }

  return sorted;
}



function processProperty(prop, config, processedValues, scopeName, scopeValue, inputValue = null) {
  // console.log(`????????????? Processing property ${prop} with config:`, config, scopeName, scopeValue, inputValue);

  console.log('PROCESS PROP: ', prop, config, scopeName, scopeValue, inputValue);
  if (!config) {
    console.error(`Config for property ${prop} is undefined.`);
    return '#000000'; // Fallback color
  }

  let baseValue = inputValue;

  // Resolve var(--property) references
  // const input = config.input;

  // console.log('PROCESS PROP: ', prop, input);

  // if (input && input.startsWith('var(--') && input.endsWith(')')) {
  //   const dependencyKey = input.slice(6, -1); // Strip off 'var(--' and ')'

  //   console.log('dependencyKey: ', dependencyKey);

  //   baseValue = getInputValue(dependencyKey, processedValues, scopeName, scopeValue);

  //   if (!baseValue) {
  //     console.warn(`Dependency ${dependencyKey} for property ${prop} is not yet processed.`);
  //     return null; // Return null to indicate unresolved dependency
  //   }
  // } else {
  //   baseValue = input || '#000000'; // Fallback to black if input is undefined
  // }

  const strategies = config.strategies || [{ strategy: 'random' }];
  let value = inputValue;

  for (const strategy of strategies) {
    if (!strategy.scope || (strategy.scope[scopeName] === scopeValue)) {
      const { strategy: strategyName, ...options } = strategy;
      const { min, max, step, unit } = config;
      
      value = applyStrategy(value, strategyName, { min, max, step, unit, ...options });
    }
  }

  // Ensure processedValues is initialized for the current property and scope

  return value;
}

function processThemeConfig(config) {
  const { properties, scopes } = config;
  const { dependencies } = parseDependencies(properties);

  // Sort properties by dependencies to ensure correct processing order
  let sortedProperties = topologicalSort(dependencies);

  console.log('Sorted Properties:\n\n' + sortedProperties.join('\n') + '\n\n');

  const processedValues = {};
  const maxAttempts = 50; // Set a reasonable limit to avoid infinite loops
  let attempts = 0;

  // Initialize processedValues for each property and scope
  for (const prop in properties) {
    processedValues[prop] = {};
    processedValues[prop]['_global'] = null; // Global value for non-scoped properties
    for (const scopeName in scopes) {
      processedValues[prop][scopeName] = {};
    }
  }

  // Process properties based on sorted order and scopes
  while (sortedProperties.length > 0 && attempts < maxAttempts) {
    attempts++;

    const prop = sortedProperties.shift();

    console.log('---------------------------------');
    console.log(`* ${prop}`);
    console.log('---------------------------------');
  
    const propertyConfig = properties[prop];

    const inputScopes = getInputScopes(propertyConfig.input, processedValues);

    const outputScopes = getOutputScopes(propertyConfig);

    const mergedScopes = mergeScopes(inputScopes, outputScopes);

    const allScopes = Object.keys(mergedScopes).length ? mergedScopes : { _global: true };


    // Process scoped properties
    for (const scopeName in allScopes) {
      let scopeValues = allScopes[scopeName];

      scopeValues = Array.isArray(scopeValues) ? scopeValues : [null];

      for (const scopeValue of scopeValues) {

        let inputValue = null;

        if (propertyConfig.input) {
          inputValue = getInputValue(propertyConfig.input, processedValues, scopeName, scopeValue);
          console.log(`SCOPE: ${scopeName}:${scopeValue} - INPUT VALUE:`, inputValue);
        }

        const value = processProperty(prop, propertyConfig, processedValues, scopeName, scopeValue, inputValue);

        // console.log('PROCESSED VALUE:', prop, value);

        if (value === null) {
          console.error(`Failed to process ${prop} for ${scopeName}:${scopeValue} due to unresolved dependencies.`);
          // Requeue the property if unresolved
          sortedProperties.push(prop);
          break; // Exit scope loop to retry the property later
        }

        if (!processedValues[prop]) {
          processedValues[prop] = {};
        }
      
        if (!scopeValue) {
          processedValues[prop][scopeName] = value;
        } else {

          if (!processedValues[prop][scopeName]) {
            processedValues[prop][scopeName] = {};
          }

          processedValues[prop][scopeName][scopeValue] = value;
        }
      }
    }

    if (attempts >= maxAttempts) {
      console.error('Reached maximum number of attempts, some properties could not be processed.');
    }

    // console.log('Processed Values:', processedValues);
    console.log('\n\n');
  }

  return processedValues;
}


function generateCSS(processedValues) {
  const cssData = {
    ':root': [],
  };

  // Map to store selectors and their corresponding CSS rules
  const selectorMap = new Map();

  for (const prop in processedValues) {
    for (const scopeName in processedValues[prop]) {
      if (scopeName === '_global') {
        // Handle _global scope, directly add to :root
        const globalValue = processedValues[prop]['_global'];
        if (globalValue) {
          cssData[':root'].push(`  --${prop}: ${globalValue};`);
        }
      } else {
        const values = processedValues[prop][scopeName];
        for (const scopeValue in values) {
          const value = values[scopeValue];
          if (value) {
            const selector = `[data-${scopeName}="${scopeValue}"]`;

            if (scopeValue === getDefaultScopeValue(themeConfig, scopeName)) {
              // If it's a default scope value, add it to both :root and the specific scope
              cssData[':root'].push(`  --${prop}: ${value};`);
              if (!selectorMap.has(selector)) {
                selectorMap.set(selector, []);
              }
              selectorMap.get(selector).push(`  --${prop}: ${value};`);
            } else {
              // Add to specific selector only
              if (!selectorMap.has(selector)) {
                selectorMap.set(selector, []);
              }
              selectorMap.get(selector).push(`  --${prop}: ${value};`);
            }
          }
        }
      }
    }
  }

  // Combine only default scope selectors with :root
  const defaultScopeSelectors = [];
  for (const [selector, rules] of selectorMap.entries()) {
    if (rules.every(rule => cssData[':root'].includes(rule))) {
      defaultScopeSelectors.push(selector);
    }
  }

  let cssString = '';

  if (defaultScopeSelectors.length > 0) {
    const combinedSelector = `:root, ${defaultScopeSelectors.join(', ')}`;
    cssString += `${combinedSelector} {\n${cssData[':root'].join('\n')}\n}\n`;
  } else {
    cssString += `:root {\n${cssData[':root'].join('\n')}\n}\n`;
  }

  // Generate CSS for non-default selectors
  for (const [selector, rules] of selectorMap.entries()) {
    if (!defaultScopeSelectors.includes(selector)) {
      cssString += `${selector} {\n${rules.join('\n')}\n}\n`;
    }
  }

  return cssString;
}



// Update the stylesheet in the HTML
function updateStylesheet() {
  console.log('Updating stylesheet');
  // Example usage
  const processedValues = processThemeConfig(themeConfig);
  const css = generateCSS(processedValues);

  console.log(css); // This will output the generated CSS based on the processed values.

  // Join all CSS rules into a single string

  // Apply the styles to the document
  let styleSheet = document.getElementById('dynamic-styles');
  
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.type = "text/css";
    styleSheet.id = 'dynamic-styles';
    document.head.appendChild(styleSheet);
  }
  
  styleSheet.textContent = css;
  document.head.appendChild(styleSheet);
}


// Handle theme switching
function setupThemeSwitcher() {
  const radios = document.querySelectorAll('input[name="theme"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (event) => {
      const theme = event.target.value;
      console.log(`Switching theme to: ${theme}`);
      document.body.setAttribute('data-color-scheme', theme);
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


setupThemeSwitcher();
setupShuffleButton();

updateStylesheet();