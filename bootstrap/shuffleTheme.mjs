import { processAllCategories } from './strategyUtils.mjs';  // Import processAllCategories
import { getThemeData, setThemeData } from './themeUtils.mjs';
import { themeConfig } from './themeConfig.mjs';

// Function to shuffle theme data based on the updated configuration
function shuffleThemeData(themeData) {
  console.log('Shuffling theme data:', themeData);

  // Assume themeConfig is used to determine which categories to process
  const theme = 'light'; // You may need to adjust this based on actual theme detection logic

  // Use processAllCategories to get the processed colors for all categories
  const processedColors = processAllCategories(theme);

  console.log('Processed colors from processAllCategories:', processedColors);

  // Iterate over all properties in themeData
  for (const [property, data] of Object.entries(themeData)) {
    const members = data.members;

    members.forEach(member => {
      const { selector, theme: memberTheme } = member;

      // Determine the theme from the selector
      const isLightTheme = selector.includes('[data-bs-theme=light]');
      const isDarkTheme = selector.includes('[data-bs-theme=dark]');
      const currentTheme = isLightTheme ? 'light' : isDarkTheme ? 'dark' : memberTheme || 'light';

      console.log('Current theme:', currentTheme);

      // Update member.value with processed color for the category
      if (data.category in processedColors) {
        member.value = processedColors[data.category];
        console.log(`Updated ${data.category} to ${processedColors[data.category]}`);
      }
    });
  }

  console.log('Shuffled theme data:', themeData);
  return themeData;
}

// Main function to shuffle the theme
export function shuffleTheme(form) {
  console.log('Shuffling theme...', form);
  let themeData = getThemeData(form);
  console.log('Current theme data:', themeData);
  
  themeData = shuffleThemeData(themeData);
  console.log('Updated theme data:', themeData);
  
  setThemeData(form, themeData);

  // Trigger a change event on the form
  const event = new Event('change', { bubbles: true });
  form.dispatchEvent(event);
}

// Add event listener to handle shuffle button clicks
document.addEventListener('click', function(event) {
  const shuffleButton = event.target.closest('[data-shuffle]');

  if (shuffleButton) {
    const form = shuffleButton.closest('form');
    
    if (form) {
      shuffleTheme(form);
    }
  }
});
