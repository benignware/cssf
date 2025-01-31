(function () {
    const processedVariables = new Set();
    let customStyleSheet = createCustomStyleSheet();
  
    // Monkey patch for inline style variable tracking
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  
    CSSStyleDeclaration.prototype.setProperty = function (property, value, priority) {
      if (property.startsWith('--')) {
        const element = this.ownerElement;
        if (element) {
          originalSetProperty.call(this, property, value, priority);
  
          // Force an immediate update by triggering reflow
          const computedValue = getComputedStyle(element).getPropertyValue(property).trim();
        //   console.log(`CSS Variable Set: ${property} = ${value} (computed: ${computedValue}) on`, element);
  
          // Extract and apply color channels
          const colorChannels = extractColorChannels(computedValue);
          if (colorChannels) {
            applyColorChannels(element, property, colorChannels);
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
  
    function extractColorChannels(color) {
      let match;
  
      // Handle hex colors (#RGB, #RRGGBB, #RRGGBBAA)
      if ((match = color.match(/^#([a-fA-F0-9]{3,8})$/))) {
        let hex = match[1];
        if (hex.length === 3) hex = [...hex].map(x => x + x).join(''); // Expand #RGB to #RRGGBB
        if (hex.length === 4) hex = [...hex].map(x => x + x).join(''); // Expand #RGBA to #RRGGBBAA
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
    }
  
    function applyColorChannels(element, property, channels) {
      const baseName = property.replace(/-?$/, ''); // Remove trailing `-`
      
      // Apply the extracted values immediately
      element.style.setProperty(`${baseName}-r`, channels.r);
      element.style.setProperty(`${baseName}-g`, channels.g);
      element.style.setProperty(`${baseName}-b`, channels.b);
      element.style.setProperty(`${baseName}-a`, channels.a);
  
    //   console.log(`Extracted channels for ${property}:`, channels);
  
      // Force a reflow to apply changes immediately
      void element.offsetWidth;
    }
  
    function processStylesheets() {
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.style) {
                processStyleRule(rule);
              }
            });
          }
        } catch (e) {
          console.warn("Cannot access stylesheet:", sheet.href, e);
        }
      });
    }
  
    function processStyleRule(rule) {
      const style = rule.style;
      for (let i = 0; i < style.length; i++) {
        const property = style[i];
        if (property.startsWith('--') && !processedVariables.has(property)) {
          const value = style.getPropertyValue(property).trim();
          const colorChannels = extractColorChannels(value);
          if (colorChannels) {
            applyColorChannelsToElement(rule.selectorText, property, colorChannels);
            processedVariables.add(property);
          }
        }
      }
    }
  
    function applyColorChannelsToElement(selector, property, channels) {
      if (!selector) return;
      const baseName = property.replace(/-?$/, ''); // Remove trailing `-`
  
      // Create a rule for the new color channels in the custom stylesheet
      const ruleText = `
        ${selector} {
          ${baseName}-r: ${channels.r};
          ${baseName}-g: ${channels.g};
          ${baseName}-b: ${channels.b};
          ${baseName}-a: ${channels.a};
        }
      `;
      customStyleSheet.insertRule(ruleText, customStyleSheet.cssRules.length);
    //   console.log(`Added channels for ${property} in ${selector}:`, channels);
    }
  
    function createCustomStyleSheet() {
      const style = document.createElement('style');
      document.head.appendChild(style);
      return style.sheet;
    }
  
    function observeStylesheets() {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
              setTimeout(processStylesheets, 100);
            }
          });
        });
      });
  
      observer.observe(document.head, { childList: true, subtree: true });
    }
  
    function init() {
      observeStylesheets();
      processStylesheets();
    }
  
    init();
  })();
  