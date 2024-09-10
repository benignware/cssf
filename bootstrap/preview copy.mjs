const sanitizePropertyValue = (value) => {
  if (value.startsWith('#')) {
    // If color is 3-digit shorthand, expand to 6-digit
    if (value.length === 4) {
      const [, r, g, b] = value.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
      value = `#${r}${r}${g}${g}${b}${b}`;
    }
  }

  return value;
}


// Function to set initial form values based on CSS variables
function initializeForm() {
  // console.log('UPDATE FORM FROM DOCUMENT');
  const form = document.getElementById('theme-form');

  const cssVariables = getComputedStyle(document.documentElement);
  const formElements = [...form.elements];

  formElements.forEach(el => {
    el.addEventListener('input', handleInputChange);
    el.addEventListener('change', handleInputChange);
  
    if (!el.name) {
      return;
    }

    const name = el.name;

    // console.log('NAME: ', name);

    let value;

    if (name === 'theme') {
      value = document.body.hasAttribute('data-bs-theme')
        ? document.body.getAttribute('data-bs-theme')
        : 'light';
      
    } else {
      value = cssVariables.getPropertyValue(`${name}`).trim();

      value = sanitizePropertyValue(value);
    }

    // console.log('VALUE: ', value);

    if (el.tagName.toLowerCase() === 'select') {
      const options = [...el.options];

      options.forEach(option => {
        option.selected = option.value === value;
      });
    } else if (el.type === 'radio' || el.type === 'checkbox') {
      el.checked = el.value === value;
    } else {
      el.value = value;
    }
  
    const { sync } = el.dataset;

    if (sync) {
      const syncEls = [...document.querySelectorAll(sync)]
        .filter(syncEl => syncEl !== el);
      
      syncEls.forEach(syncEl => {
        syncEl.value = value;
      });
    }
  });
}

// Function to update CSS variables based on form inputs
function updateDocument() {
  // console.log('Updating document');
  const form = document.getElementById('theme-form');
  const formData = new FormData(form);

  for (const [name, value] of formData.entries()) {
    // console.log(name, value);
    if (name === 'theme') {
      if (value === 'dark') {
        document.body.setAttribute('data-bs-theme', value);
      } else {
        document.body.removeAttribute('data-bs-theme');
      }
    } else {

      document.documentElement.style.setProperty(`${name}`, value);
    }
  }
}

const handleInputChange = (event) => {
  event.preventDefault();
  updateDocument();
}

initializeForm();


// Sync related form elements
document.addEventListener('DOMContentLoaded', function () {
  const syncElements = document.querySelectorAll('[data-sync]');
  
  function extractUnit(value) {
    if (typeof value !== 'string') return '';
    
    const match = value.match(/[a-zA-Z%]+$/);
    return match ? match[0] : '';
  }

  function updateTextField(e) {
    const target = e.target;
    const sync = target.dataset.sync;
    const syncElements = [...document.querySelectorAll(`[data-sync="${sync}"]`)]
      .filter(el => el !== target);

    if (!syncElements.length) return;

    const placeholder = target.getAttribute('placeholder');
    const value = target.value;
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const unit = extractUnit(value) || target.dataset.unit || extractUnit(placeholder) || '';

    syncElements.forEach(el => {
      switch (el.type) {
        case 'range':
          const [min, max, step] = {
            'rem': [0, 10, 0.05],
            'px': [0, 100, 1],
            'em': [0, 5, 0.25],
          }[unit] || [el.min || 0, el.max || 100, el.step || 1];

          el.min = min;
          el.max = max;
          el.step = step;

          el.value = Math.max(min, Math.min(max, numericValue));
          el.setAttribute('data-unit', unit); // Preserve unit
          break;
        case 'text':
          el.value = `${value}${unit}`;
          break;
        case 'color':
          el.value = value;
          break;
      }
    });
  }

  function initializeInputs() {
      const syncGroups = Array.from(syncElements).reduce((acc, el) => {
          const sync = el.dataset.sync;
          if (!acc[sync]) acc[sync] = [];
          acc[sync].push(el);
          return acc;
      }, {});

      for (const sync in syncGroups) {
          const group = syncGroups[sync];
          const source = group.find(el => el.hasAttribute('name'));
          
          if (!source) continue; // Skip if no source found
          const sourceValue = source.value;
          const unit = extractUnit(sourceValue);

          updateTextField({ target: source });
      }
  }

  syncElements.forEach(element => {
      element.addEventListener('input', updateTextField);
  });

  initializeInputs();
});