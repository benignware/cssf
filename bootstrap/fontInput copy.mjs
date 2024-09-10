// fontInput.mjs

export default function setupFontInput(fontInputId, fontDropdownId, deviceFonts, googleFonts) {
  const fontInput = document.getElementById(fontInputId);
  const fontDropdown = document.getElementById(fontDropdownId);

  let selectedFont = '';
  let userInteraction = false; // Flag to track user interaction

  function populateDropdown() {
      fontDropdown.innerHTML = '';

      // Device fonts
      deviceFonts.forEach(font => {
          const div = document.createElement('a');
          div.className = 'dropdown-item';
          div.textContent = font;
          div.dataset.font = font;
          div.addEventListener('click', () => selectFont(font));
          fontDropdown.appendChild(div);
      });

      // Google fonts
      googleFonts.forEach(font => {
          const div = document.createElement('a');
          div.className = 'dropdown-item';
          div.textContent = font;
          div.dataset.font = font;
          div.addEventListener('click', () => selectFont(font));
          fontDropdown.appendChild(div);
      });

      // Highlight selected font
      highlightSelectedFont();
  }

  function selectFont(name) {
      selectedFont = name;
      fontInput.value = name;
      fontDropdown.style.display = 'none';

      // Dispatch custom event
      const event = new CustomEvent('fontSelected', { detail: { fontName: name } });
      document.dispatchEvent(event);

      // Fire native input and change events
      fontInput.dispatchEvent(new Event('input', { bubbles: true }));
      fontInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function highlightSelectedFont() {
      Array.from(fontDropdown.children).forEach(div => {
          if (div.dataset.font === selectedFont) {
              div.classList.add('active');
          } else {
              div.classList.remove('active');
          }
      });
  }

  fontInput.addEventListener('focus', (e) => {
      // Select the input field content
      fontInput.select();

      fontDropdown.style.display = 'block';

      // Show all items when input is focused
      Array.from(fontDropdown.children).forEach(div => {
          div.style.display = 'block';
      });

      // Track user interaction
      userInteraction = true;

      // Ensure the focus event does not trigger input filtering
      e.stopImmediatePropagation();
  });

  fontInput.addEventListener('blur', () => {
      setTimeout(() => fontDropdown.style.display = 'none', 200);

      // Reset user interaction flag
      userInteraction = false;
  });

  fontInput.addEventListener('input', (e) => {
      if (userInteraction) {
          // Handle user input
          const query = e.target.value.toLowerCase().trim();
          Array.from(fontDropdown.children).forEach(div => {
              const font = div.dataset.font.toLowerCase();
              const words = font.split(/\s+/); // Split font name into words
              const matches = query.length === 0 || words.some(word => word.includes(query)); // Show all if query is empty, otherwise filter

              div.style.display = matches ? 'block' : 'none';
          });
          highlightSelectedFont(); // Update the highlighting after filtering
      } else {
          // Handle programmatic input by dispatching the custom event immediately
          const event = new CustomEvent('fontSelected', { detail: { fontName: e.target.value } });
          document.dispatchEvent(event);
      }
      e.stopImmediatePropagation();
  });

  // Initialize the dropdown
  populateDropdown();
}
