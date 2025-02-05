(function () {

  function memoize(fn) {
    const cache = new Map();
  
    return function(...args) {
      const key = JSON.stringify(args);
  
      if (cache.has(key)) {
        return cache.get(key);
      }
  
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }

  // Check if the value is a recognized color format
  const isRecognizedColor = memoize((value) => {
    const result = /^(#[0-9a-fA-F]{3,8}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*\d+(\.\d+)?)?\)|hsla?\(\s*\d+\s*,\s*\d+%,\s*\d+%(\s*,\s*\d+(\.\d+)?)?\)|\b(?:aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow)\b)$/.test(value) && !value.includes('var(');
    // console.log('IS RECOGNIZED COLOR', value, '--->', result);
    return result;
  });

  // Extract color channels from a color string
  const extractColorChannels = memoize((color) => {
    let match;

    // Handle hex colors (#RGB, #RRGGBB, #RRGGBBAA)
    if ((match = color.match(/^#([a-fA-F0-9]{3,8})$/))) {
        let hex = match[1];
        if (hex.length === 3) hex = [...hex].map(x => x + x).join(''); // Expand #RGB to #RRGGBB
        if (hex.length === 4) hex = [...hex].map(x => x + x).join(''); // Expand #RRGBA to #RRGGBBAA
        const rgb = hex.match(/.{2}/g).map(x => parseInt(x, 16)); // Convert hex pairs to integers
        return {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            a: rgb[3] !== undefined ? (rgb[3] / 255).toFixed(3) : 1
        };
    }

    // Handle RGB(A) and HSL(A) colors
    if ((match = color.match(/^(rgb|hsl)a?\(([^)]+)\)$/i))) {
        const parts = match[2].split(/,\s*/).map(x => parseFloat(x));
        return {
            r: parts[0],
            g: parts[1],
            b: parts[2],
            a: parts[3] !== undefined ? parts[3] : 1
        };
    }

    // Not a recognized color format
    return null;
  });


  const stylesheetArray = []; // Array to hold stylesheet representations
  let combinedStyles = {}; // Object to hold merged styles
  const customStylesheetId = 'custom-styles'; // Identifier for the custom stylesheet
  let customStyleSheet = null;

  // Create a new <style> element and return its stylesheet
  function createCustomStyleSheet() {
    if (!customStyleSheet) {
      const style = document.createElement('style');
      style.id = customStylesheetId; // Set the title for the custom stylesheet
      document.body.appendChild(style);
      return style.sheet;
    } else {
      const style = document.querySelector(`style[id="${customStylesheetId}"]`);
      const lastElement = document.body.lastElementChild;

      // Make sure the custom stylesheet is the last element in the body
      if (customStyleSheet.ownerNode !== lastElement) {
        document.body.appendChild(style);
      }

      // Clear the existing rules
      while (customStyleSheet.cssRules.length) {
        customStyleSheet.deleteRule(0);
      }

      return style.sheet;
    }
  }

  // Function to collect all stylesheets and create a representation
  function collectStyles() {
      Array.from(document.styleSheets).forEach(sheet => {
          try {
              // Check if the stylesheet is not the custom one
              if (sheet.title !== customStylesheetId && sheet.cssRules) {
                  const stylesheetData = {
                      stylesheet: sheet, // Reference to the original stylesheet
                      data: {}, // This will hold the parsed CSS data
                  };
                  processStyleSheet(sheet, stylesheetData);
                  stylesheetArray.push(stylesheetData);
              }
          } catch (e) {
              console.warn("Cannot access stylesheet:", e);
          }
      });
  }

  // Process a single stylesheet to collect its rules
  function processStyleSheet(sheet, stylesheetData) {
      if (!sheet.cssRules) {
          // console.warn("No CSS rules found in stylesheet:", sheet);
          return;
      }

      Array.from(sheet.cssRules).forEach(rule => {
          if (rule.style) {
              processStyleRule(rule, stylesheetData.data);
          }
      });
  }

  // Process a style rule and store it in the stylesheet data
  function processStyleRule(rule, data) {
      const style = rule.style;
      const selectorText = rule.selectorText;

      // Initialize the selector in the data if it doesn't exist
      if (!data[selectorText]) {
          data[selectorText] = {};
      }

      // Collect all properties and their values
      for (let i = 0; i < style.length; i++) {
          const property = style[i];

          if (!property.startsWith('--')) {
            continue;
          }
          const value = style.getPropertyValue(property).trim();
          data[selectorText][property] = value; // Store all properties
      }
  }

  // Function to merge all stylesheet data into a combined object
  function mergeStyles() {
      combinedStyles = {}; // Reset combined styles

      stylesheetArray.forEach(stylesheetData => {
          const data = stylesheetData.data;

          for (const selector in data) {
              if (!combinedStyles[selector]) {
                  combinedStyles[selector] = {};
              }
              for (const property in data[selector]) {
                  // Merge properties, prioritizing the last stylesheet's value
                  combinedStyles[selector][property] = data[selector][property];
              }
          }
      });
  }

  // Function to generate a new stylesheet from the combined styles
  function generateStylesheet() {
    customStyleSheet = createCustomStyleSheet();
    const rules = [];
      
      for (const selector in combinedStyles) {
          const properties = combinedStyles[selector];
          const processed = Object.entries(properties)
                .reduce((acc, [prop, val]) => {
                  // Check if the value is a recognized color and process it
                  if (isRecognizedColor(val)) {
                    
                    const channels = extractColorChannels(val);
                    
                    if (channels) {
                      acc[`${prop}-r`] = channels.r;
                      acc[`${prop}-g`] = channels.g;
                      acc[`${prop}-b`] = channels.b;
                      acc[`${prop}-a`] = channels.a;
                    }
                  }
                  
                  return acc;
                }, {});

          if (Object.keys(processed).length) {
            const ruleText = `${selector} {\n${Object.entries(processed).map(([prop, val]) => `\t${prop}: ${val};`).join('\n ')}\n}`;

            rules.push(ruleText);
          }
      }

      for (const rule of rules) {
          customStyleSheet.insertRule(rule, customStyleSheet.cssRules.length);
      }

      // customStyleSheet.insertRule(rules.join('\n'), customStyleSheet.cssRules.length);

      // const style = document.querySelector(`style[id="${customStylesheetId}"]`);

      // style.textContent = rules.join('\n');
  }

  // Patch the textContent property of the <style> element
  function patchStyleElement() {
      const originalTextContentSetter = HTMLStyleElement.prototype.__lookupSetter__('textContent');

      Object.defineProperty(HTMLStyleElement.prototype, 'textContent', {
          set: function(value) {
              // Call the original setter
              originalTextContentSetter.call(this, value);

              const sheet = this.sheet;

              if (sheet === customStyleSheet) {
                  // If the stylesheet is the custom one, do nothing
                  // console.log('Ignoring custom stylesheet');
                  return;
              }

              // Check if the stylesheet already exists in the array
              const stylesheetData = stylesheetArray.find(sheetData => sheetData.stylesheet === sheet);
              if (stylesheetData) {
                  // If it exists, process it
                  stylesheetData.data = {}; // Clear previous data
                  processStyleSheet(sheet, stylesheetData); // Process the stylesheet
              } else {
                  // If it doesn't exist, determine its position in the DOM
                  const position = Array.from(document.styleSheets).indexOf(this);

                  // Create a new stylesheet representation
                  const newStylesheetData = {
                      stylesheet: this.sheet,
                      data: {}
                  };
                  processStyleSheet(this.sheet, newStylesheetData);
                  // Insert it in the correct position in the array
                  stylesheetArray.splice(position, 0, newStylesheetData);
              }

              mergeStyles(); // Merge the updated styles
              window.requestAnimationFrame(generateStylesheet); // Generate the new stylesheet
              generateStylesheet(); // Generate the new stylesheet

          }
      });
  }

  const patchCSSStyleDeclaration = () => {
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;

    CSSStyleDeclaration.prototype.setProperty = function (property, value, priority) {
      originalSetProperty.call(this, property, value, priority);
      
      if (property.startsWith('--') && isRecognizedColor(value)) {
        const element = this.ownerElement;
        
        if (element) {
          // Force an immediate update by triggering reflow
          // const computedValue = getComputedStyle(element).getPropertyValue(property).trim();
          //   console.log(`CSS Variable Set: ${property} = ${value} (computed: ${computedValue}) on`, element);

          // Extract and apply color channels
          const colorChannels = extractColorChannels(value);
          
          if (colorChannels) {
            this.setProperty(`${property}-r`, colorChannels.r, priority);
            this.setProperty(`${property}-g`, colorChannels.g, priority);
            this.setProperty(`${property}-b`, colorChannels.b, priority);
            this.setProperty(`${property}-a`, colorChannels.a, priority);
          }
        }
      } else {
        originalSetProperty.call(this, property, value, priority);
      }
    };

    Object.defineProperty(CSSStyleDeclaration.prototype, 'ownerElement', {
      get: function () {
        return this.parentRule ? null : [...document.querySelectorAll('*')].find(el => el.style === this);
      },
      configurable: true
    });
  };
  

  // Initialize the process
  function init() {
      collectStyles(); // Collect all stylesheets
      mergeStyles(); // Merge styles into combinedStyles
      generateStylesheet(); // Generate the initial stylesheet
      patchStyleElement(); // Patch the textContent property
      patchCSSStyleDeclaration(); // Patch the CSSStyleDeclaration
  }

  init();
})();
