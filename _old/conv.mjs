// conversions.mjs

import * as chroma from 'chroma-js';

// Conversion from a98-rgb to display-p3
export function a98rgbToDisplayP3(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('display-p3');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from a98-rgb to rec2020
export function a98rgbToRec2020(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('rec2020');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from a98-rgb to srgb
export function a98rgbToSrgb(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('srgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from a98-rgb to xyz
export function a98rgbToXyz(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('xyz');
    return {
        x: color.rgb()[0] / 255,
        y: color.rgb()[1] / 255,
        z: color.rgb()[2] / 255
    };
}

// Conversion from display-p3 to a98-rgb
export function displayP3ToA98rgb(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('a98-rgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from display-p3 to rec2020
export function displayP3ToRec2020(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('rec2020');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from display-p3 to xyz
export function displayP3ToXyz(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('xyz');
    return {
        x: color.rgb()[0] / 255,
        y: color.rgb()[1] / 255,
        z: color.rgb()[2] / 255
    };
}

// Conversion from lab to lch
export function labToLch(l, a, b) {
    const color = chroma.lab(l, a, b).convert('lch');
    return {
        l: color.lch()[0],
        c: color.lch()[1],
        h: color.lch()[2]
    };
}

// Conversion from lab to xyz
export function labToXyz(l, a, b) {
    const color = chroma.lab(l, a, b).convert('xyz');
    return {
        x: color.xyz()[0],
        y: color.xyz()[1],
        z: color.xyz()[2]
    };
}

// Conversion from lch to lab
export function lchToLab(l, c, h) {
    const color = chroma.lch(l, c, h).convert('lab');
    return {
        l: color.lab()[0],
        a: color.lab()[1],
        b: color.lab()[2]
    };
}

// Conversion from oklab to oklch
export function oklabToOklch(l, a, b) {
    const color = chroma.oklab(l, a, b).convert('oklch');
    return {
        l: color.oklch()[0],
        c: color.oklch()[1],
        h: color.oklch()[2]
    };
}

// Conversion from oklab to xyz
export function oklabToXyz(l, a, b) {
    const color = chroma.oklab(l, a, b).convert('xyz');
    return {
        x: color.xyz()[0],
        y: color.xyz()[1],
        z: color.xyz()[2]
    };
}

// Conversion from oklch to oklab
export function oklchToOklab(l, c, h) {
    const color = chroma.oklch(l, c, h).convert('oklab');
    return {
        l: color.oklab()[0],
        a: color.oklab()[1],
        b: color.oklab()[2]
    };
}

// Conversion from prophoto-rgb to display-p3
export function prophotoRgbToDisplayP3(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('display-p3');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from prophoto-rgb to rec2020
export function prophotoRgbToRec2020(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('rec2020');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from prophoto-rgb to xyz
export function prophotoRgbToXyz(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('xyz');
    return {
        x: color.rgb()[0] / 255,
        y: color.rgb()[1] / 255,
        z: color.rgb()[2] / 255
    };
}

// Conversion from rec2020 to a98-rgb
export function rec2020ToA98rgb(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('a98-rgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from rec2020 to display-p3
export function rec2020ToDisplayP3(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('display-p3');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from rec2020 to srgb
export function rec2020ToSrgb(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('srgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from rec2020 to xyz
export function rec2020ToXyz(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('xyz');
    return {
        x: color.rgb()[0] / 255,
        y: color.rgb()[1] / 255,
        z: color.rgb()[2] / 255
    };
}

// Conversion from srgb-linear to srgb
export function srgbLinearToSrgb(r, g, b) {
    return {
        r: r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
        g: g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
        b: b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
    };
}

// Conversion from srgb to a98-rgb
export function srgbToA98rgb(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('a98-rgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from srgb to rec2020
export function srgbToRec2020(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('rec2020');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from srgb to xyz
export function srgbToXyz(r, g, b) {
    const color = chroma.rgb(r * 255, g * 255, b * 255).convert('xyz');
    return {
        x: color.rgb()[0] / 255,
        y: color.rgb()[1] / 255,
        z: color.rgb()[2] / 255
    };
}

// Conversion from xyz to a98-rgb
export function xyzToA98rgb(x, y, z) {
    const color = chroma.xyz(x * 100, y * 100, z * 100).convert('a98-rgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from xyz to display-p3
export function xyzToDisplayP3(x, y, z) {
    const color = chroma.xyz(x * 100, y * 100, z * 100).convert('display-p3');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from xyz to rec2020
export function xyzToRec2020(x, y, z) {
    const color = chroma.xyz(x * 100, y * 100, z * 100).convert('rec2020');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}

// Conversion from xyz to srgb
export function xyzToSrgb(x, y, z) {
    const color = chroma.xyz(x * 100, y * 100, z * 100).convert('srgb');
    return {
        r: color.rgb()[0] / 255,
        g: color.rgb()[1] / 255,
        b: color.rgb()[2] / 255
    };
}
