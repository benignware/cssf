
export const convertComponent = (value, isToRelative, range = [0, 1]) => {
  const valueStr = String(value); // Convert to string to safely use match
  const numValue = parseFloat(valueStr);
  const valueUnit = valueStr.match(/[a-z%]+$/)?.[0] || '';

  if (valueUnit === 'deg') {
    return isToRelative ? numValue / 360 : numValue * 360;
  } else if (valueUnit === 'turn') {
    return isToRelative ? numValue : numValue * 360;
  } else if (valueUnit === '%') {
    return isToRelative ? numValue / 100 : numValue * 100;
  } else if (valueUnit === '') {
    return isToRelative ? numValue / range[1] : numValue * range[1];
  }
  
  return numValue; // No unit conversion needed
};



const convertColorComponents = (colorComponents, isToRelative, components, ranges) => {
  let convertedComponents = {};
  components.forEach((component, index) => {
    if (colorComponents[component] !== undefined) {
      const range = ranges[index];
      const convertedValue = convertComponent(colorComponents[component], isToRelative, range);
      convertedComponents[component] = isToRelative ? convertedValue : parseFloat(convertedValue.toFixed(2)); // Use toFixed to match expected precision
    }
  });
  return convertedComponents;
};

export const toRelativeColor = (colorComponents, colorspace) => {
  switch (colorspace.toLowerCase()) {
    case 'rgb':
      return convertColorComponents(colorComponents, true, ['r', 'g', 'b'], [[0, 255], [0, 255], [0, 255]]);
    case 'hsl':
      return convertColorComponents(colorComponents, true, ['h', 's', 'l'], [[0, 360], [0, 100], [0, 100]]);
    case 'hwb':
      return convertColorComponents(colorComponents, true, ['h', 'w', 'b'], [[0, 360], [0, 100], [0, 100]]);
    case 'lab':
      return convertColorComponents(colorComponents, true, ['l', 'a', 'b'], [[0, 100], [-128, 127], [-128, 127]]);
    case 'lch':
      return convertColorComponents(colorComponents, true, ['l', 'c', 'h'], [[0, 100], [0, 100], [0, 360]]);
    case 'xyz':
      return convertColorComponents(colorComponents, true, ['x', 'y', 'z'], [[0, 1], [0, 1], [0, 1]]);
    default:
      throw new Error(`Unsupported colorspace: ${colorspace}`);
  }
};

export const toAbsoluteColor = (colorComponents, colorspace) => {
  switch (colorspace.toLowerCase()) {
    case 'rgb':
      return convertColorComponents(colorComponents, false, ['r', 'g', 'b'], [[0, 255], [0, 255], [0, 255]]);
    case 'hsl':
      return convertColorComponents(colorComponents, false, ['h', 's', 'l'], [[0, 360], [0, 100], [0, 100]]);
    case 'hwb':
      return convertColorComponents(colorComponents, false, ['h', 'w', 'b'], [[0, 360], [0, 100], [0, 100]]);
    case 'lab':
      return convertColorComponents(colorComponents, false, ['l', 'a', 'b'], [[0, 100], [-128, 127], [-128, 127]]);
    case 'lch':
      return convertColorComponents(colorComponents, false, ['l', 'c', 'h'], [[0, 100], [0, 100], [0, 360]]);
    case 'xyz':
      return convertColorComponents(colorComponents, false, ['x', 'y', 'z'], [[0, 100], [0, 100], [0, 100]]);
    default:
      throw new Error(`Unsupported colorspace: ${colorspace}`);
  }
};