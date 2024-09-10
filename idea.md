Here's the issue at that I pointed you but you didn't change it as expected.
The issue is that 
// Process non-scoped properties separately if not scoped
is actually not a exact valid requirement.
So, let's not just loop through every scope we find in the config. Instead, in the property loop, for each property we look up 1. if the output value is scoped, i.e. if the strategies contain strategies with scope field, if so we get the strategy scopes for that property. So, let's have a function getOutputScopes(property). We find the scopeName and scopeValue by splitting the scope field value on the strategy, e.g. 'color-scheme:dark', getOutputScopes should return an object with a key for each scope that has as value an array of scope names. 2. we look up if the input value is scoped and get the input scopes by looking up the property's input field value (which is a property name) in the already processed values, there we have stored values according to their scope name and value. So, we create another function getInputScopes(inputProp, processedValues) it returns the result in the same format as getOutputScopes. So, we get an object with key scopeName and a list with scope values.

// Process scoped properties
    for (const scopeName in scopes) {
      const scopeValues = scopes[scopeName].values;

      for (const scopeValue in scopeValues) {
        const value = processProperty(prop, properties[prop], processedValues, scopeName, scopeValue);

        if (value === null) {
          console.error(`Failed to process ${prop} for ${scopeName}:${scopeValue} due to unresolved dependencies.`);
          // Requeue the property if unresolved
          sortedProperties.push(prop);
          break; // Exit scope loop to retry the property later
        }

        processedValues[prop][scopeName][scopeValue] = value;
      }
    }

    // Process non-scoped properties separately if not scoped
    if (!isScoped(properties[prop])) {
      const nonScopedValue = processProperty(prop, properties[prop], processedValues, 'default', 'default');
      if (nonScopedValue) {
        processedValues[prop]['default']['default'] = nonScopedValue;
      }
    }


