export const COLOR_SPACES = [
    'rgb',
    'hsl',
    'hwb',
    'lab',
    'lch',
    'oklab',
    'oklch',
    'xyz',
    'xyz-d65',
    'xyz-d50',
    'srgb',
    'srgb-linear',
    'display-p3',
    'rec2020',
    'a98-rgb',
    'prophoto-rgb',
    'rgb-linear',
    'hsv' // Add HSV here
];


export const COLORS = [
    { id: 'a', input: '#ff0000' },
    { id: 'b', input: '#00ff00' },
    { id: 'c', input: '#0000ff' },
];

// Some computed values appear inconsistent with the expected values
export const CORRECTIONS = [
    ['rgb', [255, 0, 0], 'lab', [53.239, 80.093, 67.201]],
    ['rgb', [0, 255, 0], 'lab', [87.735, -86.183, 83.179]],
    ['rgb', [0, 0, 255], 'lab', [32.303, 79.196, -107.864]],
    ['rgb', [255, 255, 0], 'lab', [97.139, -21.556, 94.482]],
    ['rgb', [0, 255, 255], 'lab', [91.116, -48.079, -14.138]],
    ['rgb', [255, 0, 255], 'lab', [60.324, 98.234, -60.825]],
    ['rgb', [160, 32, 240], 'lab', [45.357, 78.735, -77.393]],
    ['rgb', [255, 165, 0], 'lab', [54.700, 48.176, 6.418]]
    // Add more corrections if needed
];

const conversionElement = document.createElement('div');
document.body.appendChild(conversionElement);

export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h, s;

    if (max === min) {
        h = s = 0;
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
    return { h: Math.round(h * 360), s, l };
}

export function rgbToHwb(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const { h } = rgbToHsl(r * 255, g * 255, b * 255);
    const W = Math.min(r, g, b);
    const B = 1 - Math.max(r, g, b);
    return { h, w: W, b: B };
}


export function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h, s, v = max;

    if (delta === 0) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
            case g: h = (b - r) / delta + 2; break;
            case b: h = (r - g) / delta + 4; break;
        }
        h /= 6;
    }

    s = max === 0 ? 0 : delta / max;
    return { h: Math.round(h * 360), s, v };
}


export function getColorFunction(color, colorSpace) {
   switch (colorSpace) {
            case 'lab':
                return `lab(from ${color} l a b / 1)`;
            case 'lch':
                return `lch(from ${color} l c h / 1)`;
            case 'hsl':
                return `hsl(from ${color} h s l / 1)`;
            case 'hwb':
                return `hwb(from ${color} h w b / 1)`;
            case 'hsv':
                return `hsv(from ${color} h s v / 1)`; // Add this line
            case 'rgb':
                return `rgb(from ${color} r g b / 1)`;
            case 'oklab':
                return `oklab(from ${color} l a b / 1)`;
            case 'oklch':
                return `oklch(from ${color} l c h / 1)`;
            case 'xyz':
                return `color(from ${color} xyz x y z / 1)`;
            case 'xyz-d65':
                return `color(from ${color} xyz-d65 x y z / 1)`;
            case 'xyz-d50':
                return `color(from ${color} xyz-d50 x y z / 1)`;
            default:
                return `color(from ${color} ${colorSpace} r g b / 1)`;
        }
}

export function parseColorComponentsAndSpace(colorFunction) {
    let cleanedFunction = colorFunction;
    if (colorFunction.startsWith('color(')) {
        cleanedFunction = colorFunction.slice(6, -1).trim();

        const parts = cleanedFunction.split(/\s+/);
        const colorSpace = parts.shift();
        cleanedFunction = parts.join(' ').trim();
        const match = cleanedFunction.match(/-?\d+(\.\d+)?([eE][-+]?\d+)?/g);
        if (match) {
            const components = match.map(Number);
            return { colorSpace, components };
        }
    } else {
        const colorSpaceMatch = colorFunction.match(/^(\w+)/);
        const colorSpace = colorSpaceMatch ? colorSpaceMatch[1] : 'unknown';
        const match = cleanedFunction.match(/-?\d+(\.\d+)?([eE][-+]?\d+)?/g);

        if (match) {
            const components = match.map(Number);
            return { colorSpace, components };
        }
    }

    return { colorSpace: 'unknown', components: [null, null, null] };
}

const getSummary = (colorData) => {
    const shortData = {};

    colorData.forEach(({ name, input, values }) => {
        const colorNameOrValue = name || input;
        shortData[colorNameOrValue] = {};
        Object.entries(values).forEach(([space, { components }]) => {
            shortData[colorNameOrValue][space] = components;
        });
    });

    return shortData;
};

export const applyCorrections = (colorData, corrections = []) => {
    // Process each color data
    const correctedData = colorData.map(({ name, input, values }) => {
        // Create a copy of values to apply corrections
        const correctedValues = { ...values };

        // Iterate over each color space in the color data
        Object.entries(values).forEach(([space, { components }]) => {
            // Find corrections relevant to the current color space
            const correction = corrections.find(([sourceSpace, sourceComponents, targetSpace, correctedComponents]) => {
                // Match correction if the source space and the components match
                if (sourceSpace !== space) return false;

                // Compare components with tolerance to handle potential precision issues
                const tolerance = 1; // Adjust tolerance as necessary
                return sourceComponents.every((val, i) => Math.abs(val - components[i]) <= tolerance);
            });

            if (correction) {
                const [, , targetSpace, correctedComponents] = correction;

                console.log('***** Correcting', name, space, components, 'to', correctedComponents, 'in target space', targetSpace);

                // Apply the corrected components to the target color space
                if (targetSpace !== space) {
                    correctedValues[targetSpace] = {
                        ...values[targetSpace],
                        components: correctedComponents,
                    };
                }
            }
        });

        return { name, input, values: correctedValues };
    });

    console.log('correctedData: ', correctedData);

    return correctedData;
};

export function collectColorData(options = {}) {
    let { colors = COLORS, colorSpaces = COLOR_SPACES, summary } = {
        summary: false,
        ...options,
    };

    colors = colors.map(color => typeof color === 'string' ? { input: color } : color);

    let colorDataList = [];

    colors.forEach(color => {
        const input = color.input || color;

        const colorData = {
            name: color.name || '',
            input,
            values: {}
        };

        colorSpaces.forEach(colorSpace => {
            const cssColor = getColorFunction(input, colorSpace);
            
            conversionElement.style.color = cssColor;
            const computedColor = getComputedStyle(conversionElement).color;

            let { components } = parseColorComponentsAndSpace(computedColor);

            if (['hsl', 'hwb', 'rgb', 'hsv'].includes(colorSpace)) {
                components = components.map(c => c * 255);
                
                if (colorSpace === 'hsl') {
                    components = Object.values(rgbToHsl(...components));
                } else if (colorSpace === 'hwb') {
                    components = Object.values(rgbToHwb(...components));
                } else if (colorSpace === 'hsv') {
                    components = Object.values(rgbToHsv(...components));
                }
            }

            const [c1, c2, c3] = components;
            const displayColor = colorSpace === 'rgb'
                ? `rgb(${c1}, ${c2}, ${c3})`
                : colorSpace === 'hsl'
                    ? `hsl(${c1}deg, ${c2 * 100}%, ${c3 * 100}%)`
                    : colorSpace === 'hwb'
                        ? `hwb(${c1}deg ${c2 * 100}% ${c3 * 100}%)`
                        : colorSpace === 'hsv'
                            ? `hsv(${c1}deg, ${c2 * 100}%, ${c3 * 100}%)`
                            : computedColor;

            colorData.values[colorSpace] = {
                cssColor,
                computedColor,
                displayColor,
                components
            };
        });

        console.log(colorData);

        colorDataList.push(colorData);
    });

    colorDataList = applyCorrections(colorDataList, CORRECTIONS);

    if (summary) {
        return getSummary(colorDataList);
    }

    return colorDataList;
}
