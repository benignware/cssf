import {
  deviceFonts,
  googleFonts
} from "./fonts.mjs";
import {
  hexToHSL,
  hslToHex,
  getLightness
} from "./hsl.mjs";

import {
  colorStrategies,
  colorBoundaries,
  categories,
  defaultRanges,
  MAX_BACKGROUND_LIGHTNESS, 
  MIN_BACKGROUND_LIGHTNESS
} from "./themeAdjustments.mjs";

import {
  parseUnit
} from "./utils.mjs";


// Use the fonts from setupFonts.mjs
const fonts = [...googleFonts]; // You can include deviceFonts if needed

function generatePrimaryColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function adjustColorForCategory(color, category) {
  console.log('Adjusting color for:', color, 'Category:', category);

  const strategies = colorStrategies[category];

  if (!strategies) {
    console.warn(`No strategies found for category: ${category}`);
    return color;
  }

  const selectedStrategy = getRandomWeightedStrategy(strategies);

  console.log('selectedStrategy: ', color, selectedStrategy);

  switch (selectedStrategy) {
    case 'grayscale':
      return adjustToGrayscale(color);
    case 'complementary':
      return adjustColorForComplementary(color);
    case 'identity':
      return adjustColorForIdentity(color);
    case 'contrast':
      return getContrastColor(color);
    case 'shade':
      return adjustToShade(color);
    case 'tint':
      return adjustToTint(color);
    case 'greenish':
    case 'orangish':
    case 'reddish':
    case 'bluish':
      return generateFunctionalColor(selectedStrategy);
    default:
      return color;
  }
}


function adjustToShade(color, amount = 0.15) {
  const hsl = hexToHSL(color);
  hsl.l = Math.max(0, hsl.l - amount); // Darken the lightness
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

function adjustToTint(color, amount = 0.05) {
  const hsl = hexToHSL(color);
  hsl.l = Math.min(1, hsl.l + amount); // Lighten the lightness
  return hslToHex(hsl.h, hsl.s, hsl.l);
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

function generateFunctionalColor(type, primaryColor) {
  const hslPrimary = hexToHSL(primaryColor);
  
  // Extract primary color attributes
  const primaryLightness = hslPrimary.l;

  // Define functional color variations
  const functionalColorAttributes = {
    'success': { h: 120 / 360, s: 0.5, l: primaryLightness * 1.1 }, // Example lightness increase for success
    'warning': { h: 45 / 360, s: 0.8, l: primaryLightness * 1.2 }, // Example lightness increase for warning
    'error': { h: 0 / 360, s: 0.8, l: primaryLightness * 0.9 },     // Example lightness decrease for error
    'info': { h: 200 / 360, s: 0.6, l: primaryLightness * 1.0 }      // Example lightness unchanged for info
  };

  // Use default values if type not found
  const colorAttrs = functionalColorAttributes[type] || { h: 0, s: 0, l: 0.5 };

  // Ensure lightness is within valid range
  const adjustedLightness = Math.max(MIN_BACKGROUND_LIGHTNESS, Math.min(MAX_BACKGROUND_LIGHTNESS, colorAttrs.l));

  return hslToHex(colorAttrs.h, colorAttrs.s, adjustedLightness);
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

function adjustColorForIdentity(color, theme) {
  const hsl = hexToHSL(color);
  const adjustment = theme === 'light' ? 0.2 : -0.2; // Adjust the tone based on theme
  hsl.l = Math.max(0, Math.min(1, hsl.l + adjustment));
  return hslToHex(hsl.h, hsl.s, hsl.l);
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
    ({
      min: minValue = defaultRanges[type].min,
      max: maxValue = defaultRanges[type].max,
      unit = defaultRanges[type].unit
    } = defaultRanges[type]);
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

function getPropertyFromName(name) {
  let [selector, propertyName] = name.split('::property');

  if (!propertyName) {
    return null;
  }

  const trimmedPropertyName = propertyName.replace(/^\(|\)$/g, '').trim();

  return trimmedPropertyName;
}

function determineCategory(name) {
  
  const prop = getPropertyFromName(name);
  console.log('Determining category for:', prop);

  if (!prop) return 'unknown';

  // Create a list to store potential matches with their ranks
  const matches = [];

  for (const category in categories) {
    for (const keyword of categories[category]) {
      if (prop.includes(keyword)) {
        // Rank based on keyword length and position in string (more specific match should come first)
        const rank = prop.indexOf(keyword) + keyword.length;
        matches.push({ category, rank });
      }
    }
  }

  // Sort matches by rank: lowest rank value is most specific
  matches.sort((a, b) => a.rank - b.rank);

  // Return the best match if any, otherwise 'unknown'
  const result = matches.length > 0 ? matches[0].category : 'unknown';

  console.log('Determined category:', result);

  return result;
}

function getCategoryColorBySelector(category, selector) {
  const form = document.querySelector('form[data-theme-editor]'); // TODO: Store form reference
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

function extractElementData(elements) {
  const elementMap = new Map();
  const propertyMap = new Map();

  elements.forEach(element => {
    const name = element.name;
    const category = determineCategory(name);
    const selector = getSelectorFromName(name);
    const theme = getThemeFromName(name);

    // Store each element by its name attribute
    elementMap.set(name, {
      element,
      category,
      selector,
      theme,
      min: element.getAttribute('data-min'),
      max: element.getAttribute('data-max')
    });

    // Collect properties and their variations
    if (selector) {
      if (!propertyMap.has(selector)) {
        propertyMap.set(selector, []);
      }
      propertyMap.get(selector).push({
        element,
        category,
        theme,
        min: element.getAttribute('data-min'),
        max: element.getAttribute('data-max')
      });
    }
  });

  return { elementMap, propertyMap };
}


function shuffleTheme() {
  console.log('SHUFFLE THEME');
  const form = document.querySelector('form[data-theme-editor]');
  const elements = form.querySelectorAll('[name]');
  const primaryColor = generatePrimaryColor();

  const { elementMap, propertyMap } = extractElementData(elements);

  let backgroundColor = null;
  let secondaryBackgroundColor = null;
  let tertiaryBackgroundColor = null;

  // Determine primary background color
  elementMap.forEach(({ element, category }) => {
    if (category === 'body-background-color') {
      if (!backgroundColor) {
        backgroundColor = adjustColorForCategory(primaryColor, 'body-background-color');
        console.log('Generated body-background-color:', backgroundColor);
      }
    }
  });

  if (backgroundColor) {
    // Adjust background colors based on theme
    const lightBackground = adjustBackgroundColorForLightTheme(backgroundColor);
    const darkBackground = adjustBackgroundColorForDarkTheme(backgroundColor);

    // Generate secondary and tertiary background colors
    elementMap.forEach(({ element, category, theme }) => {
      if (category === 'secondary-background-color' && !secondaryBackgroundColor) {
        secondaryBackgroundColor = theme === 'light'
          ? adjustToShade(lightBackground, 0.1)
          : adjustToTint(darkBackground, 0.1);
        console.log('Generated secondary-background-color:', secondaryBackgroundColor);
      }

      if (category === 'tertiary-background-color' && !tertiaryBackgroundColor) {
        tertiaryBackgroundColor = theme === 'light'
          ? adjustToShade(lightBackground, 0.2)
          : adjustToTint(darkBackground, 0.2);
        console.log('Generated tertiary-background-color:', tertiaryBackgroundColor);
      }
    });

    // Apply the generated colors
    elementMap.forEach(data => {
      const { element, category, selector, theme } = data;

      switch (category) {
        case 'primary-color':
          element.value = primaryColor;
          break;

        case 'body-background-color':
          element.value = theme === 'light' ? lightBackground : darkBackground;
          break;

        case 'secondary-background-color':
          element.value = secondaryBackgroundColor;
          break;

        case 'tertiary-background-color':
          element.value = tertiaryBackgroundColor;
          break;

        case 'body-text-color':
          const bgColor = theme === 'light' ? lightBackground : darkBackground;
          if (bgColor) {
            element.value = getContrastColor(bgColor);
          }
          break;

        case 'border-color':
          const bgColorForBorder = theme === 'light' ? lightBackground : darkBackground;
          const textCol = getCategoryColorBySelector('body-text-color', selector);
          if (bgColorForBorder && textCol) {
            element.value = generateBorderColor(bgColorForBorder, textCol);
          }
          break;

        // Handle functional colors and other categories as before
        case 'success-color':
        case 'warning-color':
        case 'error-color':
        case 'info-color':
          const functionalType = category.replace('-color', '');
          element.value = generateFunctionalColor(functionalType, primaryColor);
          break;

        default:
          // Handle other categories as before
          if (element.hasAttribute('data-min') && element.hasAttribute('data-max')) {
            const randomValue = getRandomValue(element);
            if (randomValue !== null) {
              element.value = randomValue;
            } else {
              console.warn('No range data for input:', element);
            }
          } else {
            console.warn('Unhandled property or unknown category:', category);
          }
      }
    });
  } else {
    console.error('Failed to generate body-background-color.');
  }

  form.dispatchEvent(new Event('change'));
}

document.addEventListener('click', (event) => {
  const shuffleButton = event.target.closest('button[data-shuffle]');

  if (shuffleButton) {
    shuffleTheme();
  }
});