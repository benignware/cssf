// Convert RGB to HSL
export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Convert HSL to RGB
export function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
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

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Convert RGB to HWB
// Convert RGB to HWB
export function rgbToHwb(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const whiteness = min;
    const blackness = 1 - max;

    let hue = 0;
    if (max === min) {
        hue = 0; // Achromatic case
    } else {
        const delta = max - min;
        switch (max) {
            case r:
                hue = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
        }
        hue /= 6;
        if (hue < 0) hue += 1;
    }
    hue = Math.round(hue * 360);

    return {
        h: hue,
        w: Math.round(whiteness * 100),
        b: Math.round(blackness * 100)
    };
}

// Convert HWB to RGB
// Convert HWB to RGB
export function hwbToRgb(h, w, b) {
    // Ensure hue is within [0, 360] and convert to [0, 1] range
    h = ((h % 360) + 360) % 360;
    const hNorm = h / 360;

    // Ensure whiteness and blackness are within [0, 100]
    w = Math.max(0, Math.min(100, w)); // Whiteness as a percentage
    b = Math.max(0, Math.min(100, b)); // Blackness as a percentage

    // Ensure that the sum of whiteness and blackness does not exceed 100%
    if (w + b > 100) {
        w = 100 - b; // Adjust whiteness if it exceeds the allowable range
    }

    // Convert whiteness and blackness from percentage to fraction
    const wFraction = w / 100;
    const bFraction = b / 100;

    // Function to convert hue to RGB
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    // Calculate adjusted values for p and q
    const q = 1 - bFraction;
    const p = (q - wFraction) / (1 - wFraction);

    // Compute RGB values using adjusted values and hue
    const r = hue2rgb(p, q, hNorm + 1 / 3);
    const g = hue2rgb(p, q, hNorm);
    const bValue = hue2rgb(p, q, hNorm - 1 / 3);

    // Ensure RGB values are within [0, 255] and round them
    return {
        r: Math.round(Math.max(0, Math.min(255, r * 255))),
        g: Math.round(Math.max(0, Math.min(255, g * 255))),
        b: Math.round(Math.max(0, Math.min(255, bValue * 255)))
    };
}


// Convert RGB to LAB using intermediate XYZ conversion
export function rgbToLab(r, g, b) {
    let { x, y, z } = rgbToXyz(r, g, b);

    x /= 95.047;
    y /= 100.000;
    z /= 108.883;

    x = x > 0.008856 ? Math.cbrt(x) : (x * 7.787) + (16 / 116);
    y = y > 0.008856 ? Math.cbrt(y) : (y * 7.787) + (16 / 116);
    z = z > 0.008856 ? Math.cbrt(z) : (z * 7.787) + (16 / 116);

    return {
        l: Math.round((116 * y) - 16),
        a: Math.round((x - y) * 500),
        b: Math.round((y - z) * 200)
    };
}

// Convert LAB to RGB using intermediate XYZ conversion
export function labToRgb(l, a, b) {
    let y = (l + 16) / 116;
    let x = a / 500 + y;
    let z = y - b / 200;

    x = x ** 3 > 0.008856 ? x ** 3 : (x - 16 / 116) / 7.787;
    y = y ** 3 > 0.008856 ? y ** 3 : (y - 16 / 116) / 7.787;
    z = z ** 3 > 0.008856 ? z ** 3 : (z - 16 / 116) / 7.787;

    x *= 95.047;
    y *= 100.000;
    z *= 108.883;

    return xyzToRgb(x, y, z);
}

// Convert RGB to XYZ
export function rgbToXyz(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    return {
        x: Math.round(r * 0.4124564 + g * 0.3575761 + b * 0.1804375),
        y: Math.round(r * 0.2126729 + g * 0.7151522 + b * 0.0721750),
        z: Math.round(r * 0.0193339 + g * 0.1191920 + b * 0.9503041)
    };
}

// Convert XYZ to RGB
export function xyzToRgb(x, y, z) {
    x /= 100;
    y /= 100;
    z /= 100;

    let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
    let g = x * -0.9683450 + y * 1.8759317 + z * 0.0415550;
    let b = x * 0.0557101 + y * -0.2040211 + z * 1.0572252;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

    return {
        r: Math.round(Math.max(0, Math.min(255, r * 255))),
        g: Math.round(Math.max(0, Math.min(255, g * 255))),
        b: Math.round(Math.max(0, Math.min(255, b * 255)))
    };
}

// Convert HSL to LAB
export function hslToLab(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgbToLab(rgb.r, rgb.g, rgb.b);
}

// Convert LAB to HSL
export function labToHsl(l, a, b) {
    const rgb = labToRgb(l, a, b);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// Convert HWB to LAB
export function hwbToLab(h, w, b) {
    const rgb = hwbToRgb(h, w, b);
    return rgbToLab(rgb.r, rgb.g, rgb.b);
}

// Convert LAB to HWB
export function labToHwb(l, a, b) {
    const rgb = labToRgb(l, a, b);
    return rgbToHwb(rgb.r, rgb.g, rgb.b);
}

// Convert LAB to LCH
export function labToLch(l, a, b) {
    let c = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) * 180 / Math.PI;
    if (h < 0) h += 360;
    return { l, c: Math.round(c), h: Math.round(h) };
}

// Convert LCH to LAB
export function lchToLab(l, c, h) {
    let a = Math.cos(h * Math.PI / 180) * c;
    let b = Math.sin(h * Math.PI / 180) * c;
    return { l, a: Math.round(a), b: Math.round(b) };
}

// Convert LAB to XYZ
export function labToXyz(l, a, b) {
    let y = (l + 16) / 116;
    let x = a / 500 + y;
    let z = y - b / 200;

    y = y ** 3 > 0.008856 ? y ** 3 : (y - 16 / 116) / 7.787;
    x = x ** 3 > 0.008856 ? x ** 3 : (x - 16 / 116) / 7.787;
    z = z ** 3 > 0.008856 ? z ** 3 : (z - 16 / 116) / 7.787;

    x *= 95.047;
    y *= 100.000;
    z *= 108.883;

    return { x: Math.round(x), y: Math.round(y), z: Math.round(z) };
}

// Convert XYZ to LAB
export function xyzToLab(x, y, z) {
    x /= 95.047;
    y /= 100.000;
    z /= 108.883;

    x = x > 0.008856 ? Math.cbrt(x) : (x * 7.787) + (16 / 116);
    y = y > 0.008856 ? Math.cbrt(y) : (y * 7.787) + (16 / 116);
    z = z > 0.008856 ? Math.cbrt(z) : (z * 7.787) + (16 / 116);

    return {
        l: Math.round((116 * y) - 16),
        a: Math.round((x - y) * 500),
        b: Math.round((y - z) * 200)
    };
}
