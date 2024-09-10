let initialValues = {};

const sanitizePropertyValue = (value) => {
  if (value.startsWith('#')) {
    // If color is 3-digit shorthand, expand to 6-digit
    if (value.length === 4) {
      const [, r, g, b] = value.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
      value = `#${r}${r}${g}${g}${b}${b}`;
    }
  }

  return value;
};

function initializeForm() {
  const form = document.getElementById('style-form');

  console.log('FORM: ', form);

  initialValues = getInitialValues();

  

  for (const [name, value] of Object.entries(initialValues)) {
    const element = form.elements[name];
    if (!element) {
      continue;
    }

    if (!element.tagName) {
      continue;
    }

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

  const formData = new FormData(form);

  updateAttributes(formData);
  updateVisibility();
}

const normalizeSelector = (selector) => selector.replace(/"/g, '');

function getInitialValues() {
  const initialValues = {};
  const form = document.getElementById('style-form');

  const namedElements = [...form.elements].filter(element => element.name);
  for (const element of namedElements) {
    const name = element.name;
    let [selector, propertyName] = name.split('::property');

    if (!propertyName) {
      continue;
    }

    const trimmedPropertyName = propertyName.replace(/^\(|\)$/g, '').trim();

    selector = selector.replace(/^selector\(/, '').replace(/\)$/, '').trim();
    selector = normalizeSelector(selector);

    const elementSelectors = selector.split(',').map(part => part.trim());

    [...document.styleSheets].forEach(styleSheet => {
      [...styleSheet.cssRules].forEach(rule => {
        if (!rule.selectorText) {
          return;
        }

        const ruleSelectors = rule.selectorText.split(',').map(part => normalizeSelector(part).trim());
        const matchingSelectors = elementSelectors.filter(elementSelector => ruleSelectors.includes(elementSelector));

        if (matchingSelectors.length === 0) {
          return;
        }

        const properties = Object.fromEntries(
          rule.cssText.split('{')[1].split('}')[0].trim().split(';')
          .map(property => property.trim())
          .filter(property => property)
          .map(property => ([property.split(':')[0].trim(), property.split(':')[1].trim()]))
        );

        if (properties[trimmedPropertyName]) {
          let value = properties[trimmedPropertyName];

          value = sanitizePropertyValue(value);

          initialValues[name] = value;
        }
      });
    });
  }

  return initialValues;
}

function updateStylesheet(formData) {
  let stylesheetContent = '';
  const propertiesBySelector = {};
  const form = document.getElementById('style-form');

  formData.forEach((value, name) => {
    const [formElement] = form.elements[name] instanceof NodeList ? form.elements[name] : [form.elements[name]];

    // const isValid = !formElement.classList.contains('is-invalid');
    const isValid = formElement.validity.valid;

    // if (isValid) {
    //   return;
    // }

    if (name.includes('::property')) {
      const [selector, propertyName] = name.split('::property');
      const trimmedSelector = selector.replace(/^selector\(/, '').replace(/\)$/, '').trim();
      const trimmedPropertyName = propertyName.replace(/^\(|\)$/g, '').trim();

      if (isValid && initialValues[name] !== value) {
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

  let styleSheet = document.getElementById('dynamic-stylesheet');

  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-stylesheet';

    document.head.appendChild(styleSheet);
  }

  styleSheet.textContent = stylesheetContent;
  return stylesheetContent; // Return content for modal display
}

function updateAttributes(formData) {
  formData.forEach((value, name) => {
    if (name.includes('::attribute')) {
      const [selector, attributeName] = name.split('::attribute');
      const trimmedSelector = selector.replace(/^selector\(/, '').replace(/\)$/, '').trim();
      const trimmedAttributeName = attributeName.replace(/^\(|\)$/g, '').trim();

      document.querySelectorAll(trimmedSelector).forEach(element => {
        if (element.getAttribute(trimmedAttributeName) !== value) {
          element.setAttribute(trimmedAttributeName, value);
        }
      });
    }
  });
}


function handleFormChange(e) {
  // Validate only elements with the data-type attribute
  const form = document.getElementById('style-form');
  const inputs = form.querySelectorAll('input[data-type]');

  // inputs.forEach(validateInput);

  const formData = new FormData(form);

  const stylesheetContent = updateStylesheet(formData);
  updateAttributes(formData);
  updateVisibility();

  // Update the modal textarea with the generated stylesheet
  const textarea = document.getElementById('stylesheet-textarea');
  textarea.value = stylesheetContent;
}


function updateVisibility() {
  const elements = document.querySelectorAll('[data-hidden-if]');

  elements.forEach(element => {
    const selector = element.getAttribute('data-hidden-if');
    const isVisible = document.querySelector(selector) === null;
    element.hidden = isVisible;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeForm();

  const form = document.getElementById('style-form');
  form.addEventListener('input', handleFormChange);
  form.addEventListener('change', handleFormChange);

  document.getElementById('show-stylesheet-btn').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('stylesheetModal'));
    modal.show();
  });

  document.getElementById('copy-to-clipboard-btn').addEventListener('click', () => {
    const textarea = document.getElementById('stylesheet-textarea');
    textarea.select();
    document.execCommand('copy');
    alert('Stylesheet copied to clipboard!');
  });


});

