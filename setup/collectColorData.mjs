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
];

export const COLORS = [
    { id: 'a', input: '#ff0000' },
    { id: 'b', input: '#00ff00' },
    { id: 'c', input: '#0000ff' },
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

export function collectColorData(options = {}) {
    let { colors = COLORS, colorSpaces = COLOR_SPACES, summary } = {
        summary: false,
        ...options,
    };

    colors = colors.map(color => typeof color === 'string' ? { input: color } : color);

    const colorDataList = [];

    colors.forEach(color => {
        const input = color.input || color;

        const colorData = {
            name: color.name || '',
            input,
            values: {}
        };

        colorSpaces.forEach(colorSpace => {
            console.log(colorSpace, input);
            const cssColor = getColorFunction(input, colorSpace);
            
            conversionElement.style.color = cssColor;
            const computedColor = getComputedStyle(conversionElement).color;

            console.log(cssColor, computedColor);

            let { components } = parseColorComponentsAndSpace(computedColor);

            if (['hsl', 'hwb', 'rgb'].includes(colorSpace)) {
                components = components.map(c => c * 255);
                
                if (colorSpace === 'hsl') {
                    components = Object.values(rgbToHsl(...components));
                } else if (colorSpace === 'hwb') {
                    components = Object.values(rgbToHwb(...components));
                }
            }

            const [c1, c2, c3] = components;
            const displayColor = colorSpace === 'rgb'
                ? `rgb(${c1}, ${c2}, ${c3})`
                : colorSpace === 'hsl'
                    ? `hsl(${c1}deg, ${c2 * 100}%, ${c3 * 100}%)`
                    : colorSpace === 'hwb'
                        ? `hwb(${c1}deg ${c2 * 100}% ${c3 * 100}%)`
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

    if (summary) {
        return getSummary(colorDataList);
    }

    return colorDataList;
}


export const myTestFunction = () => {
    console.log('HELLO TEST');

    return 'HELLO TEST';
}