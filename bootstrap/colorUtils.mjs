

export function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function rgbToHex(r, g, b) {
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  const toHex = (x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h, s, l };
}


// Convert HSL to RGB
export function hslToRgb(hsl) {
  let { h, s, l } = hsl;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}



export function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

export function hslToHex(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// export function getLuminance(rgb) {
//   const [r, g, b] = rgb.map(value => {
//     value /= 255;
//     return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
//   });
//   return 0.2126 * r + 0.7152 * g + 0.0722 * b;
// }

// Helper function to calculate luminance of a color
export function getLuminance(color) {
  // Convert color to RGB format if necessary
  console.log('GET LUMINANCE', color);
  const rgb = hexToRgb(color); // Assuming hexToRgb is defined to convert hex color to RGB

  console.log('GET rgb', rgb);

  const r = rgb[0] / 255;
  const g = rgb[0] / 255;
  const b = rgb[0] / 255;

  console.log('GET rgb', r, g, b);

  // Apply sRGB gamma correction
  const rLuminance = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLuminance = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLuminance = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLuminance + 0.7152 * gLuminance + 0.0722 * bLuminance;
}


export function getLightness(hexColor) {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;
  const rL = rNormalized <= 0.03928 ? rNormalized / 12.92 : Math.pow((rNormalized + 0.055) / 1.055, 2.4);
  const gL = gNormalized <= 0.03928 ? gNormalized / 12.92 : Math.pow((gNormalized + 0.055) / 1.055, 2.4);
  const bL = bNormalized <= 0.03928 ? bNormalized / 12.92 : Math.pow((bNormalized + 0.055) / 1.055, 2.4);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

export function getContrastRatio(color1, color2) {
  console.log('GET CONTRAST RATIO', color1, color2);
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  console.log('luminance1', luminance1, 'luminance2', luminance2);
  return (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
}

export function getContrastColor(hexColor) {
  return getLightness(hexColor) < 0.5 ? '#ffffff' : '#000000';
}


export function mixColors(colors, weights) {
  if (!Array.isArray(colors) || !Array.isArray(weights)) {
    throw new Error("Colors and weights must be arrays.");
  }
  
  if (colors.length !== weights.length) {
    throw new Error("The number of colors and weights must be the same.");
  }
  
  if (colors.length === 0) {
    throw new Error("At least one color is required.");
  }
  
  const rgbColors = colors.map(color => hexToRgb(color));
  
  let r = 0, g = 0, b = 0, totalWeight = 0;

  for (let i = 0; i < colors.length; i++) {
    totalWeight += weights[i];
    r += rgbColors[i][0] * weights[i];
    g += rgbColors[i][1] * weights[i];
    b += rgbColors[i][2] * weights[i];
  }

  r = Math.round(r / totalWeight);
  g = Math.round(g / totalWeight);
  b = Math.round(b / totalWeight);

  return rgbToHex(r, g, b);
}
