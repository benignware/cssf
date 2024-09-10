import {
  deviceFonts,
  googleFonts
} from "./fonts.mjs";

import {
  hexToHSL,
  hslToHex,
  getLightness,
  adjustToGrayscale,
  adjustColorForComplementary,
  adjustColorForIdentity,
  adjustToShade,
  adjustToTint,
  adjustBackgroundColorForLightTheme,
  adjustBackgroundColorForDarkTheme,
  getContrastColor,

} from "./colorUtils.mjs";

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

import { getThemeData } from './getThemeData.mjs';

// Use the fonts from setupFonts.mjs
const fonts = [...googleFonts]; // You can include deviceFonts if needed

function generatePrimaryColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function adjustColorForCategory(color, category) {

  if (category === 'border-color') {
    console.log('***** BORDER COLOR ADJUSTMENT *****');
  }

  const strategies = colorStrategies[category];

  if (!strategies) {
    console.warn(`No strategies found for category: ${category}`);
    return color;
  }

  const selectedStrategy = getRandomWeightedStrategy(strategies);

  if (category === 'border-color') {
    console.log('selectedStrategy: ', color, selectedStrategy);
  }

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



export function generateFunctionalColor(type, primaryColor) {
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
  // console.log('Determining category for:', prop);

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

  // console.log('Determined category:', result);

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

function getRandomFont() {
  return fonts[Math.floor(Math.random() * fonts.length)];
}

export function shuffleTheme() {
  console.log('SHUFFLE THEME');
  const form = document.querySelector('form[data-theme-editor]');
  const primaryColor = generatePrimaryColor();

  // Get theme data
  const { elementMap } = getThemeData();

  let backgroundColor = null;
  let lightBackground = null;
  let darkBackground = null;
  let secondaryBackgroundColorLight = null;
  let tertiaryBackgroundColorLight = null;
  let secondaryBackgroundColorDark = null;
  let tertiaryBackgroundColorDark = null;

  // Determine primary background color
  elementMap.forEach(({ element, category }) => {
    if (category === 'body-background-color') {
      if (!backgroundColor) {
        backgroundColor = adjustColorForCategory(primaryColor, 'body-background-color');
        console.log('Generated body-background-color:', backgroundColor);
      }
    }
  });

  // Check if backgroundColor is generated correctly
  if (!backgroundColor) {
    console.error('Failed to generate body-background-color.');
    return;
  }

  // Adjust background colors based on theme
  lightBackground = adjustBackgroundColorForLightTheme(backgroundColor);
  darkBackground = adjustBackgroundColorForDarkTheme(backgroundColor);

  console.log('Light Background:', lightBackground);
  console.log('Dark Background:', darkBackground);

  // Generate secondary and tertiary background colors for light theme
  secondaryBackgroundColorLight = adjustToShade(lightBackground, 0.045); // Darker for light theme
  tertiaryBackgroundColorLight = adjustToShade(lightBackground, 0.065); // Even darker for light theme

  // Generate secondary and tertiary background colors for dark theme
  secondaryBackgroundColorDark = adjustToTint(darkBackground, 0.045); // Lighter for dark theme
  tertiaryBackgroundColorDark = adjustToTint(darkBackground, 0.065); // Even lighter for dark theme

  console.log('Secondary Background Color Light:', secondaryBackgroundColorLight);
  console.log('Tertiary Background Color Light:', tertiaryBackgroundColorLight);
  console.log('Secondary Background Color Dark:', secondaryBackgroundColorDark);
  console.log('Tertiary Background Color Dark:', tertiaryBackgroundColorDark);

  // Apply the generated colors and handle other properties
  elementMap.forEach(({ element, category, theme, selector }) => {
    switch (category) {
      case 'primary-color':
        element.value = primaryColor;
        break;

      case 'body-background-color':
        element.value = theme === 'light' ? lightBackground : darkBackground;
        break;

      case 'secondary-background-color':
        element.value = theme === 'light' ? secondaryBackgroundColorLight : secondaryBackgroundColorDark;
        break;

      case 'tertiary-background-color':
        element.value = theme === 'light' ? tertiaryBackgroundColorLight : tertiaryBackgroundColorDark;
        break;

      case 'body-text-color':
        const bgColor = theme === 'light' ? lightBackground : darkBackground;
        if (bgColor) {
          element.value = getContrastColor(bgColor);
        }
        break;

        case 'border-color':
          console.log('***** BORDER COLOR GENERATION *****');
          
          // Fetch the correct background color based on the theme
          const bgColorForBorder = theme === 'light' ? lightBackground : darkBackground;
          
          // Fetch the correct text color using getThemeData
          const textCol = elementMap.find(e => e.category === 'body-text-color' && e.selector === selector)?.element.value || '#000000';

          console.log('Border Color Context:', { theme, bgColorForBorder, textCol });

          // Generate the border color using the category adjustment function
          const adjustedBorderColor = adjustColorForCategory(textCol, 'border-color');

          console.log('Generated Border Color:', adjustedBorderColor);

          // Apply the generated border color
          element.value = adjustedBorderColor;
          break;

      

      case 'success-color':
      case 'warning-color':
      case 'error-color':
      case 'info-color':
        const functionalType = category.replace('-color', '');
        element.value = generateFunctionalColor(functionalType, primaryColor);
        break;

      case 'font-size':
      case 'border-width':
      case 'line-height':
        element.value = getRandomValue(element);
        break;

      case 'font-family':
        element.value = getRandomFont();
        break;

      default:
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

  form.dispatchEvent(new Event('change'));
}



document.addEventListener('click', (event) => {
  const shuffleButton = event.target.closest('button[data-shuffle]');

  if (shuffleButton) {
    shuffleTheme();
  }
});