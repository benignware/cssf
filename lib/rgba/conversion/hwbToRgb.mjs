import { hslToRgb } from './hslToRgb.mjs'; // Ensure the path is correct

// Convert HWB to RGB
export function hwbToRgb(h, w, b) {
    console.log('hwbToRgb - Input:', { h, w, b });

    // Normalize input values
    h = Math.min(1, Math.max(0, h)); // Hue between 0 and 1
    w = Math.min(1, Math.max(0, w)); // Whiteness between 0 and 1
    b = Math.min(1, Math.max(0, b)); // Blackness between 0 and 1

    console.log('Normalized:', { h, w, b });

    // Calculate lightness (l)
    const l = 1 - b; // Lightness
    console.log('Lightness (l):', l);

    // Calculate saturation (s)
    const s = (l > 0 && l < 1) ? (1 - (w / (1 - l))) / (1 - l) : 0;
    console.log('Saturation (s):', s);

    // Convert hue to 0-360 degrees for HSL conversion
    const hue = h * 360; // Hue in degrees
    console.log('Hue:', hue);

    // Convert HWB to HSL values
    const hsl = { h: hue / 360, s: s * 100, l: l * 100 };
    console.log('HSL:', hsl);

    // Convert HSL to RGB (normalized values between 0 and 1)
    const rgb = hslToRgb(hsl.h, hsl.s / 100, hsl.l / 100);
    console.log('RGB from HSL (before adjustment):', rgb);

    // Adjust for whiteness and blackness
    const adjustedRgb = {
        r: Math.min(1, Math.max(0, rgb.r * (1 - b) + w)),
        g: Math.min(1, Math.max(0, rgb.g * (1 - b) + w)),
        b: Math.min(1, Math.max(0, rgb.b * (1 - b) + w)),
    };
    console.log('Adjusted RGB:', adjustedRgb);

    return adjustedRgb;
}
