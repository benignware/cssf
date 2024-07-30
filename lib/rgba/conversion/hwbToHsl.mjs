// hwbToHsl.mjs

/**
 * Convert HWB (Hue, Whiteness, Blackness) to HSL (Hue, Saturation, Lightness).
 * @param {number} h - Hue, between 0 and 1.
 * @param {number} w - Whiteness, between 0 and 1.
 * @param {number} b - Blackness, between 0 and 1.
 * @returns {object} The HSL values with properties h, s, and l.
 */
export function hwbToHsl(h, w, b) {
    if (w + b > 1) {
      throw new Error('Whiteness and Blackness cannot sum to more than 1.');
    }
  
    // Calculate lightness
    const max = Math.max(w, b);
    const l = (1 - w - b) / (1 - max);
    
    // Debug output for lightness calculation
    console.log(`hwbToHsl Debug: w = ${w}, b = ${b}, max = ${max}, l = ${l}`);
  
    // Calculate saturation
    const minLightness = Math.min(l, 1 - l);
    let s;
    if (minLightness === 0) {
      s = 0;
    } else {
      s = (1 - Math.abs(2 * l - 1)) / (1 - minLightness);
    }
    
    // Debug output for saturation calculation
    console.log(`hwbToHsl Debug: saturation = ${s}`);
  
    return {
      h: h,
      s: s,
      l: l
    };
  }
  