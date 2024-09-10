// fontInput.mjs

export default class FontInput {
    constructor(fontInputElement, options) {
      // Ensure fontInputElement is a valid HTML element
      if (!(fontInputElement instanceof HTMLElement)) {
        throw new TypeError('fontInputElement must be an HTML element');
      }
  
      this.fontInput = fontInputElement;
  
      // Find the next sibling element with a data-font-dropdown attribute
      this.fontDropdown = this.fontInput.nextElementSibling;
      while (this.fontDropdown && !this.fontDropdown.dataset.fontDropdown) {
        this.fontDropdown = this.fontDropdown.nextElementSibling;
      }
  
      if (!this.fontDropdown) {
        throw new Error('Dropdown element with data-font-dropdown attribute not found');
      }
  
      // Combine deviceFonts and googleFonts
      this.fonts = options.fonts || [];
  
      // Initialize properties
      this.selectedFont = '';
      this.userInteraction = false; // Flag to track user interaction
  
      // Bind methods
      this.populateDropdown = this.populateDropdown.bind(this);
      this.selectFont = this.selectFont.bind(this);
      this.highlightSelectedFont = this.highlightSelectedFont.bind(this);
  
      // Initialize the component
      this.initialize();
    }
  
    initialize() {
      this.populateDropdown();
  
      this.fontInput.addEventListener('focus', (e) => {
        this.fontInput.select();
        this.fontDropdown.style.display = 'block';
  
        // Show all items when input is focused
        Array.from(this.fontDropdown.children).forEach(div => {
          div.style.display = 'block';
        });
  
        this.userInteraction = true;
  
        e.stopImmediatePropagation();
      });
  
      this.fontInput.addEventListener('blur', () => {
        setTimeout(() => this.fontDropdown.style.display = 'none', 200);
        this.userInteraction = false;
      });
  
      this.fontInput.addEventListener('input', (e) => {
        if (this.userInteraction) {
          this.handleInput(e);
        } else {
          this.handleProgrammaticInput(e);
        }
        e.stopImmediatePropagation();
      });
    }
  
    populateDropdown() {
      this.fontDropdown.innerHTML = '';
  
      // Populate dropdown with all fonts
      this.fonts.forEach(font => {
        const div = document.createElement('a');
        div.className = 'dropdown-item';
        div.textContent = font;
        div.dataset.font = font;
        div.addEventListener('click', () => this.selectFont(font));
        this.fontDropdown.appendChild(div);
      });
  
      this.highlightSelectedFont();
    }
  
    selectFont(name) {
      this.selectedFont = name;
      this.fontInput.value = name;
      this.fontDropdown.style.display = 'none';
  
      // Dispatch custom event
      const event = new CustomEvent('fontSelected', { detail: { fontName: name } });
      document.dispatchEvent(event);
  
      // Fire native input and change events
      this.fontInput.dispatchEvent(new Event('input', { bubbles: true }));
      this.fontInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  
    highlightSelectedFont() {
      Array.from(this.fontDropdown.children).forEach(div => {
        if (div.dataset.font === this.selectedFont) {
          div.classList.add('active');
        } else {
          div.classList.remove('active');
        }
      });
    }
  
    handleInput(e) {
      const query = e.target.value.toLowerCase().trim();
      Array.from(this.fontDropdown.children).forEach(div => {
        const font = div.dataset.font.toLowerCase();
        const words = font.split(/\s+/); // Split font name into words
        const matches = query.length === 0 || words.some(word => word.includes(query)); // Show all if query is empty, otherwise filter
  
        div.style.display = matches ? 'block' : 'none';
      });
      this.highlightSelectedFont(); // Update the highlighting after filtering
    }
  
    handleProgrammaticInput(e) {
      const event = new CustomEvent('fontSelected', { detail: { fontName: e.target.value } });
      document.dispatchEvent(event);
    }
  }
  