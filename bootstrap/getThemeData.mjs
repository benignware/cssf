import { categories } from "./themeAdjustments.mjs";

// Helper function to extract selector from name
function getSelectorFromName(name) {
  const match = name.match(/\[(.*?)\]/);
  return match ? match[1] : null;
}

// Helper function to extract theme from name
function getThemeFromName(name) {
  return name.includes('light') ? 'light' : 'dark';
}

// Helper function to extract property from name
function getPropertyFromName(name) {
  let [selector, propertyName] = name.split('::property');

  if (!propertyName) {
    return null;
  }

  const trimmedPropertyName = propertyName.replace(/^\(|\)$/g, '').trim();
  return trimmedPropertyName;
}
// Helper function to determine the best category based on keyword token matches
function determineCategory(propertyName) {
  const categoryScores = {};

  // Tokenize the property name
  const tokens = propertyName.split(/[\s\-_:]+/).map(token => token.toLowerCase());

  // Initialize category scores
  Object.keys(categories).forEach(category => {
    categoryScores[category] = 0;
  });

  // Score each category based on token matches
  Object.keys(categories).forEach(category => {
    const keywords = categories[category];

    // Count the number of keyword matches
    keywords.forEach(keyword => {
      const keywordTokens = keyword.split(/[\s\-_:]+/).map(token => token.toLowerCase());

      keywordTokens.forEach(keywordToken => {
        if (tokens.includes(keywordToken)) {
          categoryScores[category]++;
        }
      });
    });
  });

  // Debugging: Log category scores to understand the ranking
  // console.log('Category Scores for property:', propertyName, categoryScores);

  // Determine the category with the highest score
  const bestCategory = Object.keys(categoryScores).reduce((maxCat, cat) => 
    categoryScores[cat] > (categoryScores[maxCat] || 0) ? cat : maxCat, 
    'unknown'
  );

  // Debugging: Log the best category found
  // console.log('Best Category:', bestCategory);

  return bestCategory;
}


// The main getThemeData function
export function getThemeData() {
  const elements = document.querySelectorAll('form[data-theme-editor] [name]');
  const elementMap = [];
  const propertyMap = new Map();

  elements.forEach(element => {
    const name = element.name;
    const selector = getSelectorFromName(name);
    const theme = getThemeFromName(name);
    const prop = getPropertyFromName(name);

    if (!prop) return;

    // Determine category based on property using ranking algorithm
    const category = determineCategory(prop);

    // Debugging output
    if (prop.includes('tertiary')) {
      // ('ELEMENT:', { element, name, selector, theme, prop });
      // console.log('CATEGORY:', category);
    }

    // Store element data
    elementMap.push({
      element,
      category,
      selector,
      theme
    });

    // Organize by selector
    if (selector) {
      if (!propertyMap.has(selector)) {
        propertyMap.set(selector, []);
      }
      propertyMap.get(selector).push({
        element,
        category,
        theme
      });
    }
  });

  // console.log('THEME DATA:', { elementMap, propertyMap });

  return { elementMap, propertyMap };
}
