import { deviceFonts, googleFonts } from "./setupFonts.mjs";
import { hexToHSL, hslToHex } from "./hsl.mjs";

// Use the fonts from setupFonts.mjs
const fonts = [...googleFonts]; // You can include deviceFonts if needed

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[data-theme-editor]');
    const shuffleButton = document.querySelector('button[data-shuffle]');

    if (!form || !shuffleButton) {
        console.error('Required elements are missing.');
        return;
    }

    const attributeCategories = {
      'body-background-color': ['body-bg', 'background', 'bg'],
      'body-text-color': ['body-color', 'text-color'],
      'primary-color': ['primary-color', 'primary'],
      'secondary-color': ['secondary-color', 'secondary'],
      'tertiary-color': ['tertiary-color', 'tertiary'],
      'success-color': ['success-color', 'success'],
      'warning-color': ['warning-color', 'warning'],
      'error-color': ['error-color', 'danger-color', 'error', 'danger'],
      'info-color': ['info-color', 'info'],
      'border-color': ['border-color'],
      'font-size': ['font-size'],
      'font-family': ['font-family', 'font'],
      'line-height': ['line-height'],
      'border-width': ['border-width']
    };

    const colorStrategies = {
      'general': {
          'body-background-color': [
              { strategy: 'grayscale', weight: 0.5 },
              { strategy: 'complementary', weight: 0.3 },
              { strategy: 'identity', weight: 0.2 }
          ],
          'body-text-color': [
              { strategy: 'contrast', weight: 1.0 }
          ],
          'border-color': [
              { strategy: 'adjusted', weight: 0.5 },
              { strategy: 'complementary', weight: 0.5 }
          ]
      },
      'identity': {
          'primary-color': [
              { strategy: 'random', weight: 1.0 }
          ],
          'secondary-color': [
              { strategy: 'complementary', weight: 0.7 },
              { strategy: 'random', weight: 0.3 }
          ],
          'tertiary-color': [
              { strategy: 'variation', weight: 1.0 }
          ]
      },
      'functional': {
          'success-color': [
              { strategy: 'greenish', weight: 1.0 }
          ],
          'warning-color': [
              { strategy: 'orangish', weight: 1.0 }
          ],
          'error-color': [
              { strategy: 'reddish', weight: 1.0 }
          ],
          'info-color': [
              { strategy: 'bluish', weight: 1.0 }
          ]
      }
  };
  
  
  const colorBoundaries = {
      'general': {
          'light': { min: 0.7, max: 0.9 },
          'dark': { min: 0.1, max: 0.3 }
      },
      'identity': {
          'light': { min: 0.4, max: 0.8 },
          'dark': { min: 0.2, max: 0.6 }
      },
      'functional': {
          'success': { h: 120, s: 0.4, l: 0.5 },
          'warning': { h: 45, s: 0.9, l: 0.5 },
          'error': { h: 0, s: 0.7, l: 0.5 },
          'info': { h: 200, s: 0.7, l: 0.5 }
      }
    };  

    const functionalColorBaseHues = {
      success: 120,  // Greenish
      warning: 45,   // Orangish
      error: 0,      // Reddish
      info: 200      // Bluish
    };
      

    const defaultRanges = {
        'font-size': { min: 8, max: 72, unit: 'px' },
        'border-width': { min: 0.5, max: 10, unit: 'px' },
        'line-height': { min: 1, max: 2, unit: '' }
    };

    const MIN_BACKGROUND_LIGHTNESS = 0.2; // Minimum lightness for dark theme background
    const MAX_BACKGROUND_LIGHTNESS = 0.9; // Maximum lightness for light theme background

    function parseUnit(value) {
        const match = value.match(/([0-9.]+)([a-z%]+)$/);
        return match ? { value: parseFloat(match[1]), unit: match[2] } : { value: parseFloat(value), unit: '' };
    }

    function generatePrimaryColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function adjustColorForTheme(color, ratio) {
        const rgb = parseInt(color.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const adjustedR = Math.max(0, Math.min(255, Math.round(r * ratio)));
        const adjustedG = Math.max(0, Math.min(255, Math.round(g * ratio)));
        const adjustedB = Math.max(0, Math.min(255, Math.round(b * ratio)));
        return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
    }

    function adjustColorForCategory(color, category, theme) {
      const strategies = colorStrategies[theme] && colorStrategies[theme][category];
      if (!strategies) return color;
  
      const selectedStrategy = getRandomWeightedStrategy(strategies);
  
      switch (selectedStrategy) {
          case 'grayscale':
              return adjustToGrayscale(color);
          case 'complementary':
              return adjustColorForComplementary(color);
          case 'identity':
              return adjustColorForIdentity(color);
          case 'contrast':
              return getContrastColor(color);
          case 'greenish':
              return generateFunctionalColor(color, 'success');
          case 'orangish':
              return generateFunctionalColor(color, 'warning');
          case 'reddish':
              return generateFunctionalColor(color, 'error');
          case 'bluish':
              return generateFunctionalColor(color, 'info');
          default:
              return color;
      }
  }
  

    function getLightness(hexColor) {
        const rgb = parseInt(hexColor.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const rNormalized = r / 255;
        const gNormalized = g / 255;
        const bNormalized = b / 255;
        const rL = rNormalized <= 0.03928 ? rNormalized / 12.92 : Math.pow((rNormalized + 0.055) / 1.055, 2.4);
        const gL = gNormalized <= 0.03928 ? gNormalized / 12.92 : Math.pow((gNormalized + 0.055) / 1.055, 2.4);
        const bL = bNormalized <= 0.03928 ? bNormalized / 12.92 : Math.pow((bNormalized + 0.055) / 1.055, 2.4);
        return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    }

    function adjustBackgroundColorForLightTheme(primaryColor) {
        const hsl = hexToHSL(primaryColor);
        hsl.l = MAX_BACKGROUND_LIGHTNESS;
        return hslToHex(hsl.h, hsl.s, hsl.l);
    }

    function adjustBackgroundColorForDarkTheme(primaryColor) {
        const hsl = hexToHSL(primaryColor);
        hsl.l = MIN_BACKGROUND_LIGHTNESS;
        return hslToHex(hsl.h, hsl.s, hsl.l);
    }

    function generateBorderColor(backgroundColor, textColor) {
        const textLuminance = getLightness(textColor);
        const borderColorLuminance = Math.max(Math.min(textLuminance + 0.3, MAX_BACKGROUND_LIGHTNESS), MIN_BACKGROUND_LIGHTNESS);
        const hsl = hexToHSL(textColor);
        return hslToHex(hsl.h, hsl.s, borderColorLuminance);
    }

    function generateFunctionalColor(type) {
      const color = colorBoundaries['functional'][type];
      return hslToHex(color.h / 360, color.s, color.l); // Convert to hex format
    }
  
  function getRandomWeightedStrategy(strategies) {
    const totalWeight = strategies.reduce((sum, item) => sum + item.weight, 0);
    const random = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (const strategy of strategies) {
        cumulativeWeight += strategy.weight;
        if (random < cumulativeWeight) {
            return strategy.strategy;
        }
    }
    // Fallback in case of rounding errors
    return strategies[strategies.length - 1].strategy;
}

function adjustColorForCategory(color, category, theme) {
  const strategies = colorStrategies[theme] && colorStrategies[theme][category];
  if (!strategies) return color;

  const selectedStrategy = getRandomWeightedStrategy(strategies);
  console.log(`Category: ${category}, Theme: ${theme}, Selected Strategy: ${selectedStrategy}`);

  switch (selectedStrategy) {
      case 'grayscale':
          return adjustToGrayscale(color);
      case 'complementary':
          return adjustColorForComplementary(color);
      case 'identity':
          return adjustColorForIdentity(color);
      case 'contrast':
          return getContrastColor(color);
      case 'greenish':
          return generateFunctionalColor('success');
      case 'orangish':
          return generateFunctionalColor('warning');
      case 'reddish':
          return generateFunctionalColor('error');
      case 'bluish':
          return generateFunctionalColor('info');
      default:
          return color;
  }
}


  
  function adjustToGrayscale(color) {
      const hsl = hexToHSL(color);
      hsl.s = 0; // remove saturation
      return hslToHex(hsl.h, hsl.s, hsl.l);
  }
  
  function adjustColorForComplementary(color) {
      const hsl = hexToHSL(color);
      hsl.h = (hsl.h + 0.5) % 1; // shift hue by 180 degrees
      return hslToHex(hsl.h, hsl.s, hsl.l);
  }
  
  function adjustColorForIdentity(color) {
      // Implement specific identity color adjustments here
      return color;
  }

  function adjustColorForCategory(color, category, theme) {
    const strategies = colorStrategies[theme] && colorStrategies[theme][category];
    if (!strategies) return color;

    const selectedStrategy = getRandomWeightedStrategy(strategies);

    switch (selectedStrategy) {
        case 'grayscale':
            return adjustToGrayscale(color);
        case 'complementary':
            return adjustColorForComplementary(color);
        case 'identity':
            return adjustColorForIdentity(color);
        case 'contrast':
            return getContrastColor(color);
        case 'greenish':
            return generateFunctionalColor(color, 'success');
        case 'orangish':
            return generateFunctionalColor(color, 'warning');
        case 'reddish':
            return generateFunctionalColor(color, 'error');
        case 'bluish':
            return generateFunctionalColor(color, 'info');
        default:
            return color;
    }
}

    function getContrastColor(hexColor) {
        return getLightness(hexColor) < 0.5 ? '#ffffff' : '#000000';
    }

    function getRandomValue(input) {
        const type = input.getAttribute('data-type');
        const minAttr = input.getAttribute('data-min');
        const maxAttr = input.getAttribute('data-max');
        let minValue, maxValue, unit;
        const step = parseFloat(input.getAttribute('data-step')) || 1;

        if (minAttr && maxAttr) {
            const minParsed = parseUnit(minAttr);
            const maxParsed = parseUnit(maxAttr);

            if (minParsed.unit === maxParsed.unit) {
                unit = minParsed.unit;
                minValue = minParsed.value;
                maxValue = maxParsed.value;
            } else {
                console.error('Mismatched units:', minAttr, maxAttr);
                return null;
            }
        } else if (defaultRanges[type]) {
            ({ min: minValue = defaultRanges[type].min, max: maxValue = defaultRanges[type].max, unit = defaultRanges[type].unit } = defaultRanges[type]);
        } else {
            console.error('No range data for input:', input);
            return null;
        }

        const randomValue = Math.random() * (maxValue - minValue) + minValue;
        return `${(Math.round(randomValue / step) * step).toFixed(2)}${unit}`;
    }

    function getSelectorFromName(name) {
        const match = name.match(/\[(.*?)\]/);
        return match ? match[1] : null;
    }

    function determineCategory(name) {
      for (const category in attributeCategories) {
          for (const keyword of attributeCategories[category]) {
              if (name.includes(keyword)) {
                  return category;
              }
          }
      }
      return 'unknown';
  }

    function getCategoryColorBySelector(category, selector) {
        const elements = form.querySelectorAll(`[name]`);
        for (const element of elements) {
            const elementSelector = getSelectorFromName(element.name);
            if (elementSelector && elementSelector === selector) {
                const elementCategory = determineCategory(element.name);
                if (elementCategory === category) {
                    return element.value;
                }
            }
        }
        return null;
    }

    function getThemeFromName(name) {
      const match = name.match(/\[data-bs-theme=(light|dark)\]/);
      return match ? match[1] : 'light';
  }

    function getRandomFont() {
        return fonts[Math.floor(Math.random() * fonts.length)];
    }
  
  function generateFunctionalColor(primaryColor, type) {
    const hsl = hexToHSL(primaryColor);
    const baseHue = functionalColorBaseHues[type];
    
    // Adjust hue to make sure the color is in the desired range.
    const adjustedHSL = {
        h: baseHue / 360,        // Base hue is directly used here.
        s: Math.min(1, hsl.s + 0.2),  // Slightly increase saturation for vividness
        l: Math.min(1, hsl.l + 0.2)   // Adjust lightness to ensure readability
    };

    // Ensure lightness is within bounds for readability
    adjustedHSL.l = Math.max(0.2, adjustedHSL.l);
    adjustedHSL.l = Math.min(0.8, adjustedHSL.l);

    return hslToHex(adjustedHSL.h, adjustedHSL.s, adjustedHSL.l);
}

  
function shuffleTheme() {
  const elements = form.querySelectorAll('[name]');
  const primaryColor = generatePrimaryColor();

  // First pass: Assign primary color and handle fonts
  elements.forEach(element => {
      const category = determineCategory(element.name);
      if (category === 'font-family') {
          element.value = getRandomFont();
          element.dispatchEvent(new Event('input'));
      }
  });

  // Second pass: Handle color categories
  elements.forEach(element => {
      const category = determineCategory(element.name);
      const selector = getSelectorFromName(element.name);
      const theme = getThemeFromName(element.name);

      switch (category) {
          case 'primary-color':
              element.value = primaryColor;
              break;

          case 'body-background-color':
              const bgColor = adjustColorForCategory(primaryColor, 'body-background-color', theme);
              if (theme === 'light') {
                  element.value = adjustBackgroundColorForLightTheme(bgColor);
              } else if (theme === 'dark') {
                  element.value = adjustBackgroundColorForDarkTheme(bgColor);
              }
              break;

          case 'body-text-color':
              const backgroundColor = getCategoryColorBySelector('body-background-color', selector);
              if (backgroundColor) {
                  element.value = getContrastColor(backgroundColor);
              }
              break;

          case 'border-color':
              const bgColorForBorder = getCategoryColorBySelector('body-background-color', selector);
              const textCol = getCategoryColorBySelector('body-text-color', selector);
              if (bgColorForBorder && textCol) {
                  element.value = generateBorderColor(bgColorForBorder, textCol);
              }
              break;

          case 'success-color':
          case 'warning-color':
          case 'error-color':
          case 'info-color':
              const functionalType = category.replace('-color', '');
              element.value = generateFunctionalColor(primaryColor, functionalType);
              break;

          case 'font-size':
          case 'border-width':
          case 'line-height':
              element.value = getRandomValue(element);
              break;

          default:
              if (element.hasAttribute('data-min') && element.hasAttribute('data-max')) {
                  element.value = getRandomValue(element);
              } else {
                  console.warn('Unknown category or unhandled field:', category);
              }
      }

      element.dispatchEvent(new Event('input'));
  });

  form.dispatchEvent(new Event('change'));
}

  
  

    shuffleButton.addEventListener('click', shuffleTheme);
});
