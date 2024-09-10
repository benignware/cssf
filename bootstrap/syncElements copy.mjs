const units = {
  'rem': { min: 0, max: 10, step: 0.05, base: 16 },
  'px': { min: 0, max: 100, step: 1 },
  'em': { min: 0, max: 5, step: 0.25 },
  '%': { min: 0, max: 100, step: 1 },
  'vh': { min: 0, max: 100, step: 1 },
  'vw': { min: 0, max: 100, step: 1 },
  'pt': { min: 0, max: 100, step: 1 }
};

const sanitizePropertyValue = (value) => {
  if (value.startsWith('#')) {
    if (value.length === 4) {
      const [, r, g, b] = value.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
      value = `#${r}${r}${g}${g}${b}${b}`;
    }
  }
  return value;
};

// Utility function to convert units dynamically
function convertUnits(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;

  const tempElement = document.createElement('div');
  document.body.appendChild(tempElement);

  const basePxSize = units['rem'] ? units['rem'].base : 16;

  if (fromUnit === 'rem') {
    tempElement.style.fontSize = `${value}rem`;
  } else if (fromUnit === 'em') {
    tempElement.style.fontSize = `${value}em`;
  } else if (fromUnit === 'px') {
    tempElement.style.fontSize = `${value}px`;
  } else if (fromUnit === '%') {
    tempElement.style.fontSize = `${value}%`;
  } else if (fromUnit === 'vh') {
    tempElement.style.height = `${value}vh`;
  } else if (fromUnit === 'vw') {
    tempElement.style.width = `${value}vw`;
  } else if (fromUnit === 'pt') {
    tempElement.style.fontSize = `${value}pt`;
  }

  const computedSize = window.getComputedStyle(tempElement).fontSize || window.getComputedStyle(tempElement).height || window.getComputedStyle(tempElement).width;
  document.body.removeChild(tempElement);

  const computedSizeNumeric = parseFloat(computedSize);

  if (toUnit === 'px') return computedSizeNumeric;
  if (toUnit === 'rem') return computedSizeNumeric / basePxSize;
  if (toUnit === 'em') {
    const parentElement = document.createElement('div');
    parentElement.style.fontSize = '1em';
    document.body.appendChild(parentElement);
    const parentSize = window.getComputedStyle(parentElement).fontSize;
    document.body.removeChild(parentElement);
    const parentSizeNumeric = parseFloat(parentSize);
    return computedSizeNumeric / parentSizeNumeric;
  }
  if (toUnit === 'vh') return computedSizeNumeric / (window.innerHeight / 100);
  if (toUnit === 'vw') return computedSizeNumeric / (window.innerWidth / 100);
  if (toUnit === 'pt') return computedSizeNumeric * 1.333;

  return value;
}

function extractUnit(value) {
  if (typeof value !== 'string') return '';
  if (value.match(/#[0-9a-fA-F]{3,6}/)) return '';

  const match = value.match(/[a-zA-Z%]+$/);
  return match ? match[0] : '';
}

function isValidCssColor(value) {
  // Check if value is a valid hex color (e.g., #fff, #123456)
  const hexColorPattern = /^#([0-9a-fA-F]{3}){1,2}$/;
  if (hexColorPattern.test(value)) {
    return true;
  }

  // Check if value is a valid rgb/rgba color (e.g., rgb(255, 255, 255), rgba(0, 0, 0, 0.5))
  const rgbColorPattern = /^rgb(a)?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*(,\s*(0?\.\d+|1(\.0+)?))?\s*\)$/;
  if (rgbColorPattern.test(value)) {
    const [_, a, r, g, b, alpha] = value.match(/rgb(a)?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(0?\.\d+|1(\.0+)?))?\s*\)/);
    if (a === undefined || alpha === undefined || (parseFloat(alpha) >= 0 && parseFloat(alpha) <= 1)) {
      return true;
    }
  }

  // Check if value is a valid named color (e.g., "black", "white")
  const colorNames = [
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'gray', 'grey',
    'silver', 'maroon', 'olive', 'purple', 'teal', 'navy', 'aqua', 'fuchsia', 'lime', 'orange'
  ];

  if (colorNames.includes(value.toLowerCase())) {
    return true;
  }

  return false;
}


function isValidCssValue(value) {
  if (!value) return false;
  return /^(\d+(\.\d+)?)(px|em|rem|%|vh|vw|pt|cm|mm|in|pc)?$/.test(value);
}

function validateInput(element, valueAsNumber, syncProps = null) {
  if (!Reflect.has(element, 'validity')) {
    return true;
  }

  element.setCustomValidity('');

  const { min, max, minUnit, maxUnit } = syncProps || getSyncProps(element);

  const value = element.value;

  let isValid = true;
  let invalidFeedback = '';
  let type = element.dataset.type;

  if (!type) {
    type = element.tagName.toLowerCase() === 'input' ? element.type : element.tagName.toLowerCase();
  }

  if (element.required && !element.value) {
    isValid = false;
    invalidFeedback = 'This field is required';
  }

  if (isValid) {
    const value = element.value;
    
    if (type === 'color') {
      isValid = isValidCssColor(value);
      invalidFeedback = 'Please select a valid color';
    }
    
    if (type === 'value') {
      isValid = isValidCssValue(value);
      invalidFeedback = 'Please enter a valid CSS value';
    } 
  }

  if (isValid) {
    valueAsNumber = typeof valueAsNumber !== 'undefined'
      ? valueAsNumber
      : Reflect.has(element, 'valueAsNumber')
        ? element.valueAsNumber
        : !isNaN(parseFloat(value))
          ? parseFloat(value)
          : undefined;

    if (!isNaN(valueAsNumber) && valueAsNumber !== undefined) {
      if (min !== undefined && valueAsNumber < min) {
        isValid = false;
        invalidFeedback = `Value must be greater than or equal to ${min}${minUnit || ''}`;
      }
      
      if (max !== undefined && valueAsNumber > max) {
        isValid = false;
        invalidFeedback = `Value must be less than or equal to ${max}${maxUnit || ''}`;
      }
    }
  }

  const syncGroup = getSyncGroup(element);

  syncGroup
    .forEach(el => {
      if (Reflect.has(el, 'validity')) {
        if (!isValid) {
          el.classList.add('is-invalid');
          el.setCustomValidity('Invalid value');
        } else {
          el.classList.remove('is-invalid');
          el.setCustomValidity('');
        }
      } else if (el.dataset.type === 'invalid') {
        el.innerHTML = invalidFeedback;
      }
  });

  return isValid;
}

export function getSyncGroup(element) {
  const sync = element.dataset.sync;

  return [...document.querySelectorAll(`[data-sync="${sync}"]`)];
}

export function getSyncProps(element, targetUnit = null) {
  const syncGroup = getSyncGroup(element);

  let {
    unit,
    min, minAsNumber, minUnit,
    max, maxAsNumber, maxUnit,
    step, stepAsNumber, stepUnit
  } = syncGroup.reduce((acc, el) => {
    const dataset = el.dataset;
    
    const valueAsNumber = !isNaN(parseFloat(el.value))
      ? parseFloat(el.value)
      : acc.valueAsNumber;

    const unit = dataset.unit || extractUnit(el.value) || acc.unit;

    const minAsNumber = dataset.min !== undefined && !isNaN(parseFloat(dataset.min))
        ? parseFloat(dataset.min)
        : !isNaN(parseFloat(el.min))
          ? parseFloat(el.min)
          : acc.minAsNumber;

    const minUnit = dataset.minUnit || extractUnit(dataset.min) || acc.minUnit;

    const maxAsNumber = dataset.max !== undefined && !isNaN(parseFloat(dataset.max))
      ? parseFloat(dataset.max)
      : !isNaN(parseFloat(el.max))
        ? parseFloat(el.max)
        : acc.maxAsNumber;

    const maxUnit = dataset.maxUnit || extractUnit(dataset.max) || acc.maxUnit;

    const stepAsNumber = dataset.step !== undefined && !isNaN(parseFloat(dataset.step))
      ? parseFloat(dataset.step)
      : !isNaN(parseFloat(el.step))
        ? parseFloat(el.step)
        : acc.stepAsNumber;

    const stepUnit = dataset.stepUnit || extractUnit(dataset.step) || acc.stepUnit;

    const min = typeof minAsNumber !== undefined
      ? minUnit
        ? `${minAsNumber}${minUnit}`
        : minAsNumber
      : acc.min;

    const max = typeof maxAsNumber !== undefined
      ? maxUnit
        ? `${maxAsNumber}${maxUnit}`
        : maxAsNumber
      : acc.max;

    const step = typeof stepAsNumber !== undefined
      ? stepUnit
        ? `${stepAsNumber}${stepUnit}`
        : stepAsNumber
      : acc.step;

    return {
      min,
      max,
      step,
      unit,
      valueAsNumber,
      minAsNumber,
      minUnit,
      maxAsNumber,
      maxUnit,
      stepAsNumber,
      stepUnit
    };
  }, {});

  targetUnit = targetUnit || unit;

  if (targetUnit) {
    min = convertUnits(minAsNumber, minUnit, targetUnit);
    minUnit = targetUnit;
    max = convertUnits(maxAsNumber, maxUnit, targetUnit);
    maxUnit = targetUnit;
    step = convertUnits(stepAsNumber, stepUnit, targetUnit);
  }

  return { min, minUnit, max, maxUnit, step, unit };
}

function handleFormChange(e) {
  syncInputElements(e.target);
}

// Add event listeners to form elements
function handleInputChange(e) {
  syncInputElement(e.target);
}

function syncInputElements(form) {
  const syncElements = [...form.querySelectorAll('[data-sync]')];

  syncElements.forEach(el => {
    if (el.hasAttribute('name')) {
      syncInputElement(el);
    }
  });
}

function syncInputElement(target) {
  const sync = target.dataset.sync;

  if (!sync) return;
  const syncGroup = [...document.querySelectorAll(`[data-sync="${sync}"]`)];
  const syncElements = syncGroup.filter(el => el !== target);

  const sourceElement = syncGroup.find(el => el.hasAttribute('name')) || target;
  const isUnitSelect = target.tagName.toLowerCase() === 'select'
    && [...target.options].some(option => option.value.match(/(rem|px|em|%|vh|vw|pt)/));

  const sourceValue = typeof sourceElement.value === 'string' && !isNaN(parseFloat(sourceElement.value))
    ? parseFloat(sourceElement.value)
    : sourceElement.value;
  const sourceUnit = extractUnit(sourceElement.value);

  let unit = isUnitSelect ? target.value : extractUnit(target.value) || sourceUnit || '';
  let numericValue = target.valueAsNumber || !isNaN(parseFloat(target.value))
    ? parseFloat(target.value)
    : NaN;

  if (isUnitSelect) {
    numericValue = convertUnits(sourceValue, sourceUnit, unit);
  }

  const { min, max, step, ...syncProps } = getSyncProps(target, unit);

  syncElements.forEach(el => {
    const inputType = el.tagName.toLowerCase() === 'input' ? el.type : el.tagName.toLowerCase();
    
    switch (inputType) {
      case 'range':
      case 'number':
        el.min = min;
        el.max = max;
        el.step = step;
        el.value = String(numericValue);
        break;
      case 'text':
      case 'hidden':
        el.value = unit
          ? `${!isNaN(numericValue) ? numericValue : ''}${unit}`
          : target.value;
        break;
      case 'color':
        el.value = isValidCssColor(target.value) ? sanitizePropertyValue(target.value) : '';
        break;
      case 'select':
        const options = [...el.options];
        options.forEach(option => {
          option.selected = option.value === unit;
        });
        el.setAttribute('data-unit', unit);
        break;
    }
  });

  syncGroup.forEach(el => {
    validateInput(el, numericValue, { min, max, ...syncProps });
  });
}

export function initSyncForm(form) {
  const syncElements = form.querySelectorAll('[data-sync]');

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
    syncInputElement(source);
  }

  syncElements.forEach(el => {
    el.addEventListener('change', handleInputChange);
    el.addEventListener('input', handleInputChange);
  });

  form.addEventListener('input', handleFormChange);
  form.addEventListener('change', handleFormChange);
}

export function initializeForms() {
  const forms = document.querySelectorAll('[data-theme-editor]');

  forms.forEach(form => {
    const syncElements = form.querySelectorAll('[data-sync]');

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
      syncInputElement(source);
    }

    syncElements.forEach(el => {
      el.addEventListener('change', handleInputChange);
      el.addEventListener('input', handleInputChange);
    });

    // form.addEventListener('input', handleFormChange);
    // form.addEventListener('change', handleFormChange);
  });
}

document.addEventListener('DOMContentLoaded', initializeForms);
