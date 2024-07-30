// conversions.mjs

// RGB to HSL conversion
export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = h;
    let l = h;

    if (max === min) {
        s = 0;
        h = 0; // Hue is undefined
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

    return [h * 360, s * 100, l * 100];
}

// HSL to RGB conversion with percent inputs
export function hslToRgb(h, s, l) {
    // Ensure inputs are within the expected range
    h = Math.min(Math.max(h, 0), 360);
    s = Math.min(Math.max(s, 0), 100) / 100;
    l = Math.min(Math.max(l, 0), 100) / 100;

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    // Adjust the RGB values and convert to 0-255 range
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}


// RGB to HSV conversion

// RGB to HSV conversion
// RGB to HSV conversion
export function rgbToHsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    // return {
    //     h: Math.round(h * 360),
    //     s: percentRoundFn(s * 100),
    //     v: percentRoundFn(v * 100)
    // };
    return [Math.round(h * 360), percentRoundFn(s * 100), percentRoundFn(v * 100)];
}

export function hsvToRgb(h, s, v) {
    h /= 360;
    s /= 100;
    v /= 100;
    let r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function pivotRgbToXyz(value) {
    value /= 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

export function rgbToXyz(r, g, b) {
    r = pivotRgbToXyz(r);
    g = pivotRgbToXyz(g);
    b = pivotRgbToXyz(b);

    // Convert to XYZ using the linear transformation matrix
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
    const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

    return [x * 100, y * 100, z * 100];
}

// RGB to XYZ conversion
// export function rgbToXyz(r, g, b) {
//     r /= 255;
//     g /= 255;
//     b /= 255;

//     // Apply gamma correction
//     r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
//     g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
//     b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

//     // Apply RGB to XYZ matrix transformation
//     const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
//     const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
//     const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

//     return [x * 100, y * 100, z * 100]; // Convert to percentage
// }


// XYZ to RGB conversion
// XYZ to RGB conversion
export function xyzToRgb(x, y, z) {
    console.log(`XYZ: ${x}, ${y}, ${z}`);
    // Convert to the range [0, 1]
    x /= 100;
    y /= 100;
    z /= 100;

    // Apply the XYZ to RGB matrix transformation
    let r = x * 3.2404542 + y * (-1.5371385) + z * (-0.4985314);
    let g = x * (-0.9692660) + y * 1.8760108 + z * 0.0415560;
    let b = x * 0.0556434 + y * (-0.2040259) + z * 1.0572252;

    console.log(`RGB: ${r}, ${g}, ${b}`);

    // Apply gamma correction
    r = (r > 0.0031308) ? (1.055 * Math.pow(r, (1 / 2.4)) - 0.055) : (r * 12.92);
    g = (g > 0.0031308) ? (1.055 * Math.pow(g, (1 / 2.4)) - 0.055) : (g * 12.92);
    b = (b > 0.0031308) ? (1.055 * Math.pow(b, (1 / 2.4)) - 0.055) : (b * 12.92);

    console.log(`RGB: ${r}, ${g}, ${b}`);

    // Convert to the range [0, 255]
    r = Math.round(Math.max(0, Math.min(255, r * 255)));
    g = Math.round(Math.max(0, Math.min(255, g * 255)));
    b = Math.round(Math.max(0, Math.min(255, b * 255)));

    console.log(`RGB: ${r}, ${g}, ${b}`);

    return [r, g, b];
}

// export function xyzToRgb(x, y, z) {
//     x /= 100;
//     y /= 100;
//     z /= 100;

//     // Convert to RGB
//     let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
//     let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
//     let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

//     // Apply gamma correction
//     r = r <= 0.0031308 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
//     g = g <= 0.0031308 ? g * 12.92 : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
//     b = b <= 0.0031308 ? b * 12.92 : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

//     return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
// }

// XYZ to Lab conversion
// export function xyzToLab(x, y, z) {
//     const xNormalized = x / REF_X;
//     const yNormalized = y / REF_Y;
//     const zNormalized = z / REF_Z;

//     const labX = pivotXyzToLab(xNormalized);
//     const labY = pivotXyzToLab(yNormalized);
//     const labZ = pivotXyzToLab(zNormalized);

//     return [116 * labY - 16, labX - labY, labZ - labY];
// }

// Constants for XYZ to Lab conversion
const REF_X = 95.047;
const REF_Y = 100.000;
const REF_Z = 108.883;

// const delta = 6 / 29;
// const pivotXyzToLab = (t) => {
//     if (t > delta) {
//         return Math.pow(t, 1 / 3);
//     } else {
//         return (t / 0.008856) * (7.787) + (16 / 116);
//     }
// };
// Constants for reference white
// const REF_X = 95.047;
// const REF_Y = 100.000;
// const REF_Z = 108.883;

// Helper function for pivoting XYZ to Lab
// function pivotXyzToLab(value) {
//     return value > 0.008856 ? Math.pow(value, 1 / 3) : (value * 7.787) + (16 / 116);
// }

// // Define reference values (These values are standard reference values)
// const REF_X =  95.047; // Reference white for X
// const REF_Y = 100.000; // Reference white for Y
// const REF_Z = 108.883; // Reference white for Z

// Function to pivot XYZ to Lab (this is a standard transformation step)
function pivotXyzToLab(value) {
    const epsilon = 0.008856;
    const kappa = 903.3;

    if (value > epsilon) {
        return Math.cbrt(value);
    } else {
        return (value * kappa + 16) / 116;
    }
}

// XYZ to Lab conversion function with percentage outputs
export function xyzToLab(x, y, z) {
    // Normalize the XYZ values
    x /= REF_X;
    y /= REF_Y;
    z /= REF_Z;

    // Pivot the normalized values
    x = pivotXyzToLab(x);
    y = pivotXyzToLab(y);
    z = pivotXyzToLab(z);

    // Calculate Lab values
    const l = (116 * y) - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    // Normalize L to [0, 100] percent
    const lPercent = Math.max(0, Math.min(100, l));

    // Normalize a and b to a typical range in Lab (usually around -128 to 127 for each)
    // For percentage output, we'll normalize to [-100, 100] percent range
    const aPercent = Math.max(-100, Math.min(100, (a / 500) * 100));
    const bPercent = Math.max(-100, Math.min(100, (b / 200) * 100));

    // Return Lab values as percentages
    return [lPercent, aPercent, bPercent];
}



function pivotLabToXyz(value) {
    const v = Math.pow(value, 3);
    return v > 0.008856 ? v : (value - 16 / 116) / 7.787;
}

// export function xyzToLab(x, y, z) {
//     x /= REF_X;
//     y /= REF_Y;
//     z /= REF_Z;

//     x = pivotXyzToLab(x);
//     y = pivotXyzToLab(y);
//     z = pivotXyzToLab(z);

//     const l = (116 * y) - 16;
//     const a = 500 * (x - y);
//     const b = 200 * (y - z);

//     return [l, a, b];
// }


// Lab to XYZ conversion
// export function labToXyz(l, a, b) {
//     console.log(`LAB: ${l}, ${a}, ${b}`);
//     const labY = (l + 16) / 116;
//     const labX = a / 500 + labY;
//     const labZ = labY - b / 200;
//     console.log(`LAB: ${labX}, ${labY}, ${labZ}`);

//     const x = REF_X * pivotLabToXyz(labX);
//     const y = REF_Y * pivotLabToXyz(labY);
//     const z = REF_Z * pivotLabToXyz(labZ);

//     console.log(`XYZ: ${x}, ${y}, ${z}`);

//     return [x, y, z];
// }

export function labToXyz(l, a, b) {
    const y = (l + 16) / 116;
    const x = a / 500 + y;
    const z = y - b / 200;
  
    const pivot = (value) => {
      const v = Math.pow(value, 3);
      return v > 0.008856 ? v : (value - 16 / 116) / 7.787;
    };
  
    return [
      pivot(x) * 95.047, // D65 illuminant X
      pivot(y) * 100.000, // D65 illuminant Y
      pivot(z) * 108.883 // D65 illuminant Z
    ];
  }
  

// Lab to RGB conversion
export function labToRgb(l, a, b) {
    // Convert Lab to XYZ
    const xyz = labToXyz(l, a, b);
    
    // Convert XYZ to RGB
    const rgb = xyzToRgb(xyz[0], xyz[1], xyz[2]);
    
    return rgb;
}

export function lchToRgb(l, c, h) {
    // Convert LCH to Lab
    const lab = lchToLab(l, c, h);
    
    // Convert Lab to XYZ
    const xyz = labToXyz(lab[0], lab[1], lab[2]);
    
    // Convert XYZ to RGB
    return xyzToRgb(xyz[0], xyz[1], xyz[2]);
}

export function rgbToLab(r, g, b) {
    // Convert RGB to XYZ
    const xyz = rgbToXyz(r, g, b);
    
    // Convert XYZ to Lab
    const lab = xyzToLab(xyz[0], xyz[1], xyz[2]);
    
    return lab;
}

export function rgbToLch(r, g, b) {
    const [x, y, z] = rgbToXyz(r, g, b);
    console.log(`XYZ: ${x}, ${y}, ${z}`);
    let l, a;
    [l, a, b] = xyzToLab(x, y, z);
    console.log(`Lab: ${l}, ${a}, ${b}`);
    const lch = labToLch(l, a, b);
    console.log(`LCH: ${lch}`);
    return lch;
}

export function labToLch(l, a, b) {
    // Calculate chroma from a* and b*
    let c = Math.sqrt(a * a + b * b);
    
    // Calculate hue in radians, then convert to degrees
    const h = Math.atan2(b, a) * (180 / Math.PI);

    // Ensure hue is between 0 and 360 degrees
    const hue = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;

    // c = Math.round(c);
    // hue = Math.round(hue);
    // hue = Math.max(0, hue);
    
    return [l, c, hue];
}


export function lchToLab(l, c, h) {
    // Clamp chroma to be non-negative
    c = Math.max(c, 0);

    // Convert hue from degrees to radians
    const hr = (h * Math.PI) / 180;

    // Calculate a* and b* from chroma and hue
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);

    // Return the Lab values
    return [l, a, b];
}


