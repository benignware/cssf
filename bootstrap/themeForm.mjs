import { observe } from './observe.mjs';

import { initSyncForm } from './syncElements.mjs';
import { initFormFonts, disposeFormFonts } from './setupFonts.mjs';

// Global registry to track ThemeEditor instances
const themeEditorRegistry = new Map();

class ThemeEditor {
  constructor(form) {
    console.log('*** INIT FORM:', form);
    this.form = form;
    this.stylesheetId = this.generateUniqueId();
    this.initializeForm();
    this.addEventListeners();

    // Register this instance
    themeEditorRegistry.set(form, this);

    initSyncForm(form);
    initFormFonts(form);
  }

  generateUniqueId() {
    return `dynamic-stylesheet-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  sanitizePropertyValue(value) {
    if (value.startsWith('#')) {
      if (value.length === 4) {
        const [, r, g, b] = value.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        value = `#${r}${r}${g}${g}${b}${b}`;
      }
    }
    return value;
  }

  initializeForm() {
    this.initialValues = this.getInitialValues();

    for (const [name, value] of Object.entries(this.initialValues)) {
      const element = this.form.elements[name];
      if (!element || !element.tagName) continue;

      if (element.tagName.toLowerCase() === 'select') {
        const options = [...element.options];
        options.forEach(option => {
          option.selected = option.value === value;
        });
      } else if (element.type === 'radio' || element.type === 'checkbox') {
        element.checked = element.value === value;
      } else {
        element.value = value;
      }
    }

    const formData = new FormData(this.form);
    this.updateAttributes(formData);
    this.updateVisibility();
  }

  normalizeSelector(selector) {
    return selector.replace(/"/g, '');
  }

  getInitialValues() {
    const initialValues = {};
    const namedElements = [...this.form.elements].filter(element => element.name);

    for (const element of namedElements) {
      const name = element.name;
      let [selector, propertyName] = name.split('::property');
      if (!propertyName) continue;

      const trimmedPropertyName = propertyName.replace(/^\(|\)$/g, '').trim();
      selector = selector.replace(/^selector\(/, '').replace(/\)$/, '').trim();
      selector = this.normalizeSelector(selector);
      const elementSelectors = selector.split(',').map(part => part.trim());

      [...document.styleSheets].forEach(styleSheet => {
        [...styleSheet.cssRules].forEach(rule => {
          if (!rule.selectorText) return;

          const ruleSelectors = rule.selectorText.split(',').map(part => this.normalizeSelector(part).trim());
          const matchingSelectors = elementSelectors.filter(elementSelector => ruleSelectors.includes(elementSelector));
          if (matchingSelectors.length === 0) return;

          const properties = Object.fromEntries(
            rule.cssText.split('{')[1].split('}')[0].trim().split(';')
            .map(property => property.trim())
            .filter(property => property)
            .map(property => ([property.split(':')[0].trim(), property.split(':')[1].trim()]))
          );

          if (properties[trimmedPropertyName]) {
            let value = properties[trimmedPropertyName];
            value = this.sanitizePropertyValue(value);
            initialValues[name] = value;
          }
        });
      });
    }

    return initialValues;
  }

  updateStylesheet(formData) {
    let stylesheetContent = '';
    const propertiesBySelector = {};

    formData.forEach((value, name) => {
      const formElement = this.form.elements[name];
      if (!formElement) return;

      const isValid = !formElement.validity || formElement.validity.valid;

      if (name.includes('::property')) {
        const [selector, propertyName] = name.split('::property');
        const trimmedSelector = selector.replace(/^selector\(/, '').replace(/\)$/, '').trim();
        const trimmedPropertyName = propertyName.replace(/^\(|\)$/g, '').trim();

        if (isValid && this.initialValues[name] !== value) {
          if (!propertiesBySelector[trimmedSelector]) {
            propertiesBySelector[trimmedSelector] = [];
          }

          propertiesBySelector[trimmedSelector].push(`${trimmedPropertyName}: ${value}`);
        }
      }
    });

    for (const [selector, properties] of Object.entries(propertiesBySelector)) {
      stylesheetContent += `${selector} {\n`;
      stylesheetContent += `    ${properties.join(';\n    ')};\n`;
      stylesheetContent += `}\n`;
    }

    let styleSheet = document.getElementById(this.stylesheetId);

    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = this.stylesheetId;
      document.head.appendChild(styleSheet);
    }

    styleSheet.textContent = stylesheetContent;
    return stylesheetContent;
  }

  updateAttributes(formData) {
    formData.forEach((value, name) => {
      if (name.includes('::attribute')) {
        const [selector, attributeName] = name.split('::attribute');
        const trimmedSelector = selector.replace(/^selector\(/, '').replace(/\)$/, '').trim();
        const trimmedAttributeName = attributeName.replace(/^\(|\)$/g, '').trim();

        const elements = document.querySelectorAll(trimmedSelector);
        elements.forEach(element => {
          if (element.getAttribute(trimmedAttributeName) !== value) {
            element.setAttribute(trimmedAttributeName, value);
          }
        });
      }
    });
  }

  handleFormChange() {
    const formData = new FormData(this.form);
    const stylesheetContent = this.updateStylesheet(formData);
    this.updateAttributes(formData);
    this.updateVisibility();

    const textarea = document.querySelector('[data-output]');
    if (textarea) {
      textarea.value = stylesheetContent;
    }
  }

  updateVisibility() {
    const elements = document.querySelectorAll('[data-hidden-if]');
    elements.forEach(element => {
      const selector = element.getAttribute('data-hidden-if');
      const isVisible = document.querySelector(selector) === null;
      element.hidden = isVisible;
    });
  }

  addEventListeners() {
    this.handleFormInput = () => this.handleFormChange();
    this.form.addEventListener('input', this.handleFormInput);
    this.form.addEventListener('change', this.handleFormInput);

    this.copyButton = document.querySelector('[data-copy]');
    if (this.copyButton) {
      this.handleCopyButtonClick = () => {
        const textarea = document.querySelector('[data-output]');
        if (textarea) {
          textarea.select();
          document.execCommand('copy');
          alert('Stylesheet copied to clipboard!');
        }
      };
      this.copyButton.addEventListener('click', this.handleCopyButtonClick);
    }
  }

  removeEventListeners() {
    if (this.form) {
      this.form.removeEventListener('input', this.handleFormInput);
      this.form.removeEventListener('change', this.handleFormInput);
    }

    if (this.copyButton) {
      this.copyButton.removeEventListener('click', this.handleCopyButtonClick);
    }
  }

  dispose() {
    disposeSyncForms(this.form);
    disposeFormFonts(this.form);

    this.removeEventListeners();
    
    // Remove the dynamically created stylesheet
    const styleSheet = document.getElementById(this.stylesheetId);
    if (styleSheet) {
      styleSheet.remove();
    }
    
    // Deregister this instance
    themeEditorRegistry.delete(this.form);

    // Clear references for garbage collection
    this.form = null;
    this.copyButton = null;
    this.stylesheetId = null;
  }
}


observe(
  'form[data-theme-editor]',
  (addedNode) => {
    console.log('Form added:', addedNode);
    new ThemeEditor(addedNode)
  },
  (removedNode) => {
    // Find and dispose the ThemeEditor instance associated with the removed form
    const editor = themeEditorRegistry.get(removedNode);
    if (editor) {
      editor.dispose();
    }
    console.log('Form removed and disposed:', removedNode);
  }
);
