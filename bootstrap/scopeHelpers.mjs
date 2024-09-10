// scopeHelpers.mjs

export function getPropertyName(inputProp) {
  if (inputProp && inputProp.startsWith('var(--') && inputProp.endsWith(')')) {
    inputProp = inputProp.slice(6, -1); // Strip off 'var(--' and ')' characters
  }

  return inputProp;
}

export function isScoped(config) {
  return config.strategies.some(strategy => strategy.scope);
}

export function getInputValue(prop, processedValues, scopeName, scopeValue) {
  prop = getPropertyName(prop);

  // console.log('GET INPUT VALUE', prop, scopeName, scopeValue, processedValues[prop]);
  
  return processedValues[prop]?.[scopeName]?.[scopeValue] ||
         processedValues[prop]?.['_global'] ||
         null;
}

export function getOutputScopes(property) {
  const scopes = {};

  if (property.strategies) {
    property.strategies.forEach(strategy => {
      if (strategy.scope) {
        // Assuming scope is an object like { 'color-scheme': 'light' }
        for (const [scopeName, scopeValue] of Object.entries(strategy.scope)) {
          if (!scopes[scopeName]) {
            scopes[scopeName] = [];
          }
          
          if (!scopes[scopeName].includes(scopeValue)) {
            scopes[scopeName].push(scopeValue);
          }
        }
      }
    });
  }

  return scopes;
}

// scopeHelpers.mjs

export function getInputScopes(inputProp, processedValues) {
  inputProp = getPropertyName(inputProp);
  
  const inputScopes = {};
  
  // Retrieve scopes from processedValues based on inputProp
  for (const [scopeName, scopeValues] of Object.entries(processedValues[inputProp] || {})) {
    if (scopeName === '_global') {
      // inputScopes['_global'] = true;
    } else {
      
      const keys = Object.keys(scopeValues);

      if (keys.length > 0) {
        inputScopes[scopeName] = Object.keys(scopeValues);
      }
    }
  }

  return inputScopes;
}

export function filterDefaultScopes(inputScopes, outputScopes) {
  const filteredInputScopes = {};
  const filteredOutputScopes = {};

  for (const [scopeName, scopeValues] of Object.entries(inputScopes)) {
    filteredInputScopes[scopeName] = scopeValues.filter(value => value !== '_global');
  }

  for (const [scopeName, scopeValues] of Object.entries(outputScopes)) {
    filteredOutputScopes[scopeName] = scopeValues.filter(value => value !== '_global');
  }

  return {
    inputScopes: filteredInputScopes,
    outputScopes: filteredOutputScopes
  };
}



// scopeHelpers.mjs

export function mergeScopes(inputScopes, outputScopes) {
  let mergedScopes = { ...inputScopes, ...outputScopes };

  mergedScopes = Object.fromEntries( Object.entries(mergedScopes).map(([key, value]) => key === '_global' ? ['_global', true] : [key, Array.from(new Set(value))]) );

  return mergedScopes;
}

export function getDefaultScopeValue(themeConfig, scopeName) {
  if (scopeName === '_global') {
    return true;
  }

  console.log('scopeName: ', scopeName);
  const scope = themeConfig.scopes[scopeName];
  const defaultScope = Object.keys(scope.values).find(value => scope.values[value].default);

  return defaultScope;
}