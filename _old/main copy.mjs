// List of CSS color spaces with non-'color' functions first and including specific 'color' spaces
const colorSpaces = [
    'rgb',
    'hsl',
    'hwb',
    'lab',
    'lch',
    'oklab', 'oklch',
    'xyz', 'xyz-d65', 'xyz-d50',
    'srgb', 'display-p3', 'rec2020', 'a98-rgb', 'prophoto-rgb',
];

// List of colors
const colors = [
    { name: 'red', r: 255, g: 0, b: 0 },
    { name: 'green', r: 0, g: 255, b: 0 },
    { name: 'blue', r: 0, g: 0, b: 255 }
];

// Get the hidden element used for color conversion
const colorConversionElement = document.getElementById('colorConversionElement');

// Function to get the CSS color function string
function getColorFunction(color, colorSpace) {
    const rgbColor = `rgb(${color.r} ${color.g} ${color.b})`;
    switch (colorSpace) {
        case 'lab':
            return `lab(from ${rgbColor} l a b / 1)`; // l, a, b placeholders
        case 'lch':
            return `lch(from ${rgbColor} l c h / 1)`; // l, c, h placeholders
        case 'hsl':
            return `hsl(from ${rgbColor} h s l / 1)`; // h, s, l placeholders
        case 'hwb':
            return `hwb(from ${rgbColor} h w b / 1)`; // h, w, b placeholders
        case 'rgb':
            return `rgb(from ${rgbColor} r g b / 1)`; // r, g, b placeholders
        case 'oklab':
            return `oklab(from ${rgbColor} l a b / 1)`; // l, a, b placeholders
        case 'oklch':
            return `oklch(from ${rgbColor} l c h / 1)`; // l, c, h placeholders
        case 'xyz':
            return `color(from ${rgbColor} xyz x y z / 1)`; // xyz color space
        case 'xyz-d65':
            return `color(from ${rgbColor} xyz-d65 x y z / 1)`; // xyz-d65 color space
        case 'xyz-d50':
            return `color(from ${rgbColor} xyz-d50 x y z / 1)`; // xyz-d50 color space
        default:
            return `color(from ${rgbColor} ${colorSpace} r g b / 1)`; // Default placeholder
    }
}

// Function to extract numeric components from a color function, ignoring non-numeric parts
function parseColorComponents(colorFunction) {
    // Define the list of known color spaces
    const knownColorSpaces = [
        'rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch',
        'xyz', 'xyz-d65', 'xyz-d50', 'srgb', 'display-p3',
        'rec2020', 'a98-rgb', 'prophoto-rgb'
    ];
    
    // Check if the color function is a "color" function
    if (colorFunction.startsWith('color(')) {
        // Remove the "color(" prefix and the trailing ")"
        let cleanedFunction = colorFunction.slice(6, -1).trim();
        
        // Split the cleaned function on spaces, the first part is the color-space
        const parts = cleanedFunction.split(/\s+/);
        
        // Remove the color-space argument (first part)
        parts.shift();
        
        // Join the remaining parts back together
        cleanedFunction = parts.join(' ').trim();

        // Match numeric values (allowing for optional negative sign and decimal points)
        const match = cleanedFunction.match(/-?\d+(\.\d+)?/g);
        
        if (match) {
            // Return up to the first three numeric values
            const [c1, c2, c3] = match.map(Number);
            return { c1, c2, c3 };
        }
    } else {
        // For non-"color" functions, simply match numeric values directly
        const match = colorFunction.match(/-?\d+(\.\d+)?/g);
        
        if (match) {
            // Return up to the first three numeric values
            const [c1, c2, c3] = match.map(Number);
            return { c1, c2, c3 };
        }
    }
    
    return { c1: null, c2: null, c3: null }; // Default in case of no match
}

// Create the results container
const resultsContainer = document.getElementById('resultsContainer');

// Iterate over colors to create rows
colors.forEach(color => {
    // Create a caption for the color
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = `Color: ${color.name}`;

    // Create a table for the color conversions
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Add table headers
    thead.innerHTML = `
        <tr>
            <th>Colorspace</th>
            <th class="align-left">Computed Color</th>
            <th class="align-left">c1</th>
            <th class="align-left">c2</th>
            <th class="align-left">c3</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create a row for each colorspace
    colorSpaces.forEach(colorSpace => {
        const cssColor = getColorFunction(color, colorSpace);

        // Apply the generated CSS color to the hidden element
        colorConversionElement.style.color = cssColor;

        // Read out the computed color
        const computedColor = getComputedStyle(colorConversionElement).color;

        // Extract color components
        const { c1, c2, c3 } = parseColorComponents(computedColor);

        const row = document.createElement('tr');

        // Create cells for the colorspace, computed color box, color components
        row.innerHTML = `
            <td width="1" style="white-space: nowrap">${colorSpace}</td>
            <td>
                <div class="color-sample-container">
                    <div class="color-sample" style="background-color: ${computedColor};" title="${cssColor}"></div>
                    <span>${computedColor}</span>
                </div>
            </td>
            <td class="align-left">${c1 !== null ? c1 : '-'}</td>
            <td class="align-left">${c2 !== null ? c2 : '-'}</td>
            <td class="align-left">${c3 !== null ? c3 : '-'}</td>
        `;
        
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultsContainer.appendChild(caption);
    resultsContainer.appendChild(table);
});
