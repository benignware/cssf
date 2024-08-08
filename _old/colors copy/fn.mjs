import { getColorAgs } from './utils.js';

srgb | srgb-linear | display-p3 | a98-rgb | prophoto-rgb | rec2020
xyz | xyz-d50 | xyz-d65 | lab | lab-d50 | lab-d65 | lch | lch-d50 | lch-d65 | hsl | hwb | rgb | rgba | cmyk | cmyka

/*
When adding multiple colorspaces and multiple conversions from different source - remember we want to build a library - it could happen that an intermediate conversion method is already registered. So, how can we organize the code that intermediate conversions are automatically found. So, a conversion pipe

ok. So, now let's add functionality to convert between absolute and relative color component values.
* A relative value is always between 0 and 1
* An absolute value is the typical value related to its colorspace, e.g. hue is between 0 and 360, so this is always related to the position of the color component. Percentages however should be between 0 and 1
* All colorspace conversion functions, xyzToRgb etc, is assumed to work with absolute values
* When registering a colorspace, we can also pass a function 'toRelative' and 'toAbsolute' so we can register color spaces with individual methods.
* The convertColor function should have a parameter that let's us also control whether input is absolute or relative or whether the output should be absolute or relative


Now it's showing the from color in the computed color column. That should be hidden. 
So, for all colorspaces, first create the from color, pass it to the test element, read out the result and the components, if the convert space key is rgb, hsl or hwb, the browser returns the component in srgb, but we want the actual rgb, hsl, hwb components in the data, so for those apply the extra conversion rgbToHsl, rgbToHwb and put the result in the data. For rgb, hsl, hwb we show in the computed color column a different value, i.e. the components with css units deg, % wrapped in the function, e.g. rgb(255 0 0), hsl(120deg 50% 50%), etc


change the colorconverter class to instead of registering a color-space, we want to registerConversion. Multiple usages should be possible:

 registerConversion(fromSpace, toSpace, func)
fromSpace and toSpace are expected in hyphen-format

 registerConversion(conversionKey, func) 

A conversionKey is of the format '[fromSpace]To[toSpace]' where fromSpace is expected camelcase and toSpace is expected pascal-case

casing must be strict, e.g.
prophoto-rgb -> prophotoRgb
So we convert back and forth.

 registerConversion(conversions) 

Also possible, conversions is an object with keys of the format '[fromSpace]To[toSpace]' where fromSpace is expected camelcase and toSpace is expected pascal-case, values the functions


have a look at this code for generating a colorspace conversion table. Let's refactor the code to properly separate data processing and display layer. So, let's first create the data with all information we gathered for each color and colorspace. Fields: colorspace, input, from, computed, display, components and what else we have that could be useful. Then, from the data, create the html table. Then, create the output conversion table data. This should only contain the components for each color and colorspace



We have this working color conversion code es6 for lab <-> lch (d65 illuminant)
Now we want to add the d50 illuminant for lch.
lchD50ToLchD65 and vice versa.
You may make use of
import { xyzD65ToXyzD50, xyzD50ToXyzD65 } from './xyz.mjs';
import { labD50ToLabD65, labD65ToLabD50 } from './lab.mjs';
You may create and export any intermediate step.


Add test values for lch-d65 and lch-d50.
For lch-d65, just copy over from lch.
For lch-d50, please generate valid test data, lch with d50 illuminant.
Do not remove any columns, just add the new ones.
Do not change any existing values, just add new ones.

*/

/*

Refactoring Rules

* Analyse the sttucture, what can be shared? What can be reused?
* Use constants
* Use helper functions
* Use arrow functions, preferably short syntax, add line-breaks at a certain point
* Keep line-breaks between functions
* Group constants together with the functions that use them
* Exported functions may also be arrow functions
* Combine function calls without intermediate variables if possible, use spread operator if needed
* Do not group constants in objects, Do not include constants in functions
* Mixing up helper function case convention with constants, e.g. CLAMP
* Missing code after refactoring
* Make sure you test the code after refactoring
* Always provvide the entire file
* Do not make any other changes than the ones requested, never change the logic
* Export the conversion functions at the end of the file
* For all identifiers and function names, especially the helpers and constants, use their typically used names
* If we can make it more concise by using arrays or objects, do so
* Make sure, you stick to the rules


Test refactoring:
* Make sure, you get rid of intermediate variables
* Combine describe blocks if it makes sense, e.g. by conversion directions or conversion types
* Make sure, you don't break the tests, i.e. never change any values or logic
* Do not make the tests dynamic if not explicitly requested


it('should convert RGB to XYZ with D65 whitepoint correctly', () => {
        expect(converter.convertColor('rgb', 'xyz-d65', 255, 0, 0))
          .to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339]);
      });
*/


/*
Test refactoring:
Make sure, you don't break the tests. So, let's refactor it step by step...

Get rid of intermediate variables like so:
Before:
 it('should convert RGB to XYZ with D65 whitepoint correctly', () => {
       const expectedXyz = [0.4124564, 0.2126729, 0.0193339]; // Red in XYZ with D65 whitepoint
  
        const xyz = converter.convertColor('rgb', 'xyz-d65', 255, 0, 0);
        expect(xyz).to.be.deepCloseTo(expectedXyz, 1e-6);
      });


After:

it('should convert RGB to XYZ with D65 whitepoint correctly', () => {
        expect(converter.convertColor('rgb', 'xyz-d65', 255, 0, 0))
          .to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339]);
      });

*/


/*

Here's a working implementation of the pipeline:

export class ColorConverter {
  constructor(conversions = {}) {
    this.conversions = conversions;
  }

  addConversion(fromSpace, toSpace, func) {
    this.conversions[`${fromSpace.toLowerCase()}to${toSpace.toLowerCase()}`] = func;
  }

  createPipeline(fromSpace, toSpace) {
    const pipeline = [];
    const visited = new Set(); // Track visited nodes

    const findPath = (currentSpace, targetSpace) => {
      if (currentSpace === targetSpace) return true;
      if (visited.has(currentSpace)) return false; // Avoid revisiting nodes

      visited.add(currentSpace);

      for (const [key, func] of Object.entries(this.conversions)) {
        const [source, dest] = key.split('to');
        if (source === currentSpace.toLowerCase()) {
          if (findPath(dest, targetSpace.toLowerCase())) {
            pipeline.unshift(func);
            return true;
          }
        }
      }

      return false;
    };

    if (!findPath(fromSpace.toLowerCase(), toSpace.toLowerCase())) {
      throw new Error(`Conversion path from ${fromSpace} to ${toSpace} not found.`);
    }

    return pipeline;
  }

  convertColor(fromSpace, toSpace, ...values) {
    if (fromSpace === toSpace) {
      throw new Error(`Source and target color spaces are the same: ${fromSpace}`);
    }

    const pipeline = this.createPipeline(fromSpace, toSpace);

    let result = values;

    for (const conversion of pipeline) {
      result = conversion(...result);
    }

    return result;
  }
}

However, the requirements are now a bit different.

converter = new ColorConverter();

    // Register color spaces
    converter.registerColorSpace('rgb');  // Register RGB color space with no conversions

    converter.registerColorSpace('hsl', {
      'toRgb': hslToRgb,  // Conversion from HSL to RGB
      'fromRgb': rgbToHsl // Conversion from RGB to HSL
    });

We want to register color spaces like this:

converter.registerColorSpace('xyz', {
  'toRgb': (xyz) => xyzToRgb(xyz),   // Placeholder: Convert XYZ to RGB
  'fromRgb': (lab) => xyzToRgb(lab)  // Placeholder: Convert RGB to XYZ
});

And also derived colorspaces. In that case, the second parameter is the parent identifier and the following is the whitepoints which are passed to the conversion method of the parent.

// XYZ with whitepoints
converter.registerColorSpace('xyz-d50', 'xyz', [0.3457, 0.3585]); // D50
converter.registerColorSpace('xyz-d65', 'xyz', [0.3127, 0.3290]); // D65

*/
const colorSpaces = {
  'srgb': {
    white: [0.3127, 0.3290],
    primaries: [
      [0.64, 0.33],
      [0.30, 0.60],
      [0.15, 0.06]
    ]
  },
  'srgb-linear': {
    white: [0.3127, 0.3290],
    primaries: [
      [0.64, 0.33],
      [0.30, 0.60],
      [0.15, 0.06]
    ]
  },
  'display-p3': {
    white: [0.3127, 0.3290],
    primaries: [
      [0.68, 0.32],
      [0.265, 0.69],
      [0.15, 0.06]
    ]
  },
  'a98-rgb': {
    white: [0.3127, 0.3290],
    primaries: [
      [0.64, 0.33],
      [0.21, 0.71],
      [0.15, 0.06]
    ]
  },
  'prophoto-rgb': {
    white: [0.3127, 0.3290],
    primaries: [
      [0.7347, 0.2653],
      [0.1596, 0.8404],
      [0.0366, 0.0001]
    ]
  },
  'rec2020': {
    white: [0.3127, 0.3290],
    primaries: [
      [0.708, 0.292],
      [0.170, 0.797],
      [0.131, 0.046]
    ]
  }
};

export function color(from = null, colorspace, ...components) {
  const { from, colorspace, c1, c2, c3, a } = getColorArgs(from, colorspace, components);

  const 
}


const converter = new ColorConverter();

converter.registerColorSpace('lab', {
  'toRgb': labToRgb,
  'fromRgb': rgbToLab
});

converter.registerColorSpace('lab-d65', 'lab', [0.3127, 0.3290]);


/*

import { ColorConverter } from "./ColorConverter.mjs";
import { rgbToXyz, xyzToRgb } from "./conversions/xyzRgbConversions.mjs";
import { xyzToLab, labToXyz } from "./conversions/xyzLabConversions.mjs";
import { labToLch, lchToLab } from "./conversions/labLchConversions.mjs";

// Create an instance of ColorConverter
const converter = new ColorConverter();

// Register base XYZ color space with conversion functions
converter.registerColorSpace('xyz', {
  'toRgb': (r, g, b, whitepoint) => rgbToXyz(r, g, b, whitepoint),
  'fromRgb': (r, g, b, whitepoint) => xyzToRgb(r, g, b, whitepoint)
});

// Register XYZ color spaces with whitepoints
converter.registerColorSpace('xyz-d50', 'xyz', [0.96422, 1.00000, 0.82521]); // D50 whitepoint
converter.registerColorSpace('xyz-d65', 'xyz', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

// Register Lab color spaces with conversion functions
converter.registerColorSpace('lab', {
  'toXyz': (l, a, b, whitepoint) => labToXyz(l, a, b, whitepoint),
  'fromXyz': (x, y, z, whitepoint) => xyzToLab(x, y, z, whitepoint)
});

// Register Lab color spaces derived from base Lab color space
converter.registerColorSpace('lab-d50', 'lab', [0.96422, 1.00000, 0.82521]); // D50 whitepoint
converter.registerColorSpace('lab-d65', 'lab', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

// Register LCH color spaces with conversion functions
converter.registerColorSpace('lch', {
  'toLab': (l, c, h, whitepoint) => lchToLab(l, c, h, whitepoint),
  'fromLab': (l, a, b, whitepoint) => labToLch(l, a, b, whitepoint)
});

// Register LCH color spaces derived from base LCH color space
converter.registerColorSpace('lch-d50', 'lch', [0.96422, 1.00000, 0.82521]); // D50 whitepoint
converter.registerColorSpace('lch-d65', 'lch', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

// Register RGB color spaces with the D65 whitepoint
converter.registerColorSpace('srgb', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('srgb-linear', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('display-p3', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('a98-rgb', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('prophoto-rgb', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('rec2020', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

*/


/*

ok. I see, something has been forgotten. np.

Here's how we want to init it:

import { ColorConverter } from "./ColorConverter.mjs";
import { rgbToXyz } from "./conversions/rgbToXyz.mjs";
import { xyzToRgb } from "./conversions/xyzToRgb.mjs";
import { xyzToLab } from "./conversions/xyzToLab.mjs";
import { labToXyz } from "./conversions/labToXyz.mjs";

// Create an instance of ColorConverter
const converter = new ColorConverter();

// Register base XYZ color space with conversion functions
converter.registerColorSpace('xyz', {
  'toRgb': (r, g, b, whitepoint) => rgbToXyz(r, g, b, whitepoint),
  'fromRgb': (r, g, b, whitepoint) => xyzToRgb(r, g, b, whitepoint)
});

// Register XYZ color spaces with whitepoints
converter.registerColorSpace('xyz-d50', 'xyz', [0.96422, 1.00000, 0.82521]); // D50 whitepoint
converter.registerColorSpace('xyz-d65', 'xyz', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

// Register Lab color spaces with conversion functions
converter.registerColorSpace('lab', {
  'toXyz': (l, a, b, whitepoint) => labToXyz(l, a, b, whitepoint),
  'fromXyz': (x, y, z, whitepoint) => xyzToLab(x, y, z, whitepoint)
});

// Register Lab color spaces derived from base Lab color space
converter.registerColorSpace('lab-d50', 'lab', [0.96422, 1.00000, 0.82521]); // D50 whitepoint
converter.registerColorSpace('lab-d65', 'lab', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

// Register LCH color spaces with conversion functions
converter.registerColorSpace('lch', {
  'toLab': (l, c, h, whitepoint) => lchToLab(l, c, h, whitepoint),
  'fromLab': (l, a, b, whitepoint) => labToLch(l, a, b, whitepoint)
});

// Register LCH color spaces derived from base LCH color space
converter.registerColorSpace('lch-d50', 'lch', [0.96422, 1.00000, 0.82521]); // D50 whitepoint
converter.registerColorSpace('lch-d65', 'lch', [0.95047, 1.00000, 1.08883]); // D65 whitepoint

// Register RGB color spaces with the D65 whitepoint
converter.registerColorSpace('srgb', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('srgb-linear', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('display-p3', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('a98-rgb', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('prophoto-rgb', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint
converter.registerColorSpace('rec2020', 'xyz-d65', [0.95047, 1.00000, 1.08883]); // D65 whitepoint


Here's the actual implementation

import { identityRgbConversion } from './identityRgbConversion.mjs';

export class ColorConverter {
  constructor() {
    this.colorSpaces = {};

    // Register the fundamental RGB color space
    this.registerColorSpace('rgb');
  }

  // Register a color space with its conversion methods, parent, and whitepoints
  registerColorSpace(name, conversions = {}, parent = null, whitepoints = []) {
    if (typeof name !== 'string') {
      throw new TypeError('Color space name must be a string');
    }

    this.colorSpaces[name.toLowerCase()] = {
      parent: parent ? parent.toLowerCase() : null,
      whitepoints,
      conversions
    };
    console.log(`Registered color space: ${name}`, this.colorSpaces[name.toLowerCase()]);
  }

  // Get the color space with inherited properties
  getColorSpace(name) {
    if (typeof name !== 'string') {
      throw new TypeError('Color space name must be a string');
    }

    const colorSpace = this.colorSpaces[name.toLowerCase()];
    if (!colorSpace) {
      console.log(`Color space ${name} not found.`);
      return null;
    }

    // Resolve parent color spaces if needed
    if (colorSpace.parent) {
      const parentSpace = this.getColorSpace(colorSpace.parent);
      if (parentSpace) {
        return { ...parentSpace, ...colorSpace };
      }
    }

    return colorSpace;
  }

  // Get all registered conversion methods as an object
  getConversions() {
    const conversions = {};
    
    for (const name of Object.keys(this.colorSpaces)) {
      const spaceObj = this.getColorSpace(name);
      if (!spaceObj) {
        console.log('Color space not found:', name);
        continue;
      }

      // Filter absolute/relative conversions
      const normalizeFunctions = ['toAbsolute', 'fromAbsolute', 'fromRelative', 'toRelative'];
      const colorSpaceConversions = Object.fromEntries(
        Object.entries(spaceObj.conversions).filter(([key, value]) => !normalizeFunctions.some(func => key.includes(func))
      ));

      for (const [conversionName, func] of Object.entries(colorSpaceConversions)) {
        const [direction, target] = conversionName.match(/(to|from)(\w+)/).slice(1).map(s => s.toLowerCase());
        const source = direction === 'to' ? name : target;
        const dest = direction === 'to' ? target : name;

        conversions[`${source}To${dest}`] = func;
      }
    }

    return conversions;
  }

  // Create a conversion pipeline from one color space to another
  createPipeline(fromSpace, toSpace) {
    const pipeline = [];
    const visited = new Set(); // Track visited nodes

    const conversions = this.getConversions(); // Retrieve all conversions

    const findPath = (currentSpace, targetSpace) => {
      if (currentSpace === targetSpace) return true;
      if (visited.has(currentSpace)) {
        return false; // Avoid revisiting nodes
      }

      visited.add(currentSpace);

      const currentSpaceObj = this.getColorSpace(currentSpace);
      if (!currentSpaceObj) {
        console.log('Current space not found:', currentSpace);
        return false;
      }

      // Check for direct conversion functions
      for (const [conversionName, func] of Object.entries(conversions)) {
        const [source, dest] = conversionName.split('To');
        if (source === currentSpace.toLowerCase()) {
          if (findPath(dest.charAt(0).toLowerCase() + dest.slice(1), targetSpace.toLowerCase())) {
            pipeline.unshift(func);
            return true;
          }
        }
      }

      // Check if we need to go through parent spaces
      if (currentSpaceObj.parent) {
        if (findPath(currentSpaceObj.parent, targetSpace.toLowerCase())) {
          const parentConversions = this.getColorSpace(currentSpaceObj.parent).conversions;
          for (const [conversionName, func] of Object.entries(parentConversions)) {
            const [source, dest] = conversionName.split('to');
            if (source === currentSpace.toLowerCase()) {
              pipeline.unshift(func);
              return true;
            }
          }
        }
      }

      return false;
    };

    if (!findPath(fromSpace.toLowerCase(), toSpace.toLowerCase())) {
      throw new Error(`Conversion path from ${fromSpace} to ${toSpace} not found.`);
    }

    return pipeline;
  }

  // Convert color values from one space to another
  convertColor(fromSpace, toSpace, ...values) {
    if (fromSpace === toSpace) {
      throw new Error(`Source and target color spaces are the same: ${fromSpace}`);
    }

    console.log('Converting from', fromSpace, 'to', toSpace, 'with values:', values);

    const fromSpaceObj = this.getColorSpace(fromSpace);
    const toSpaceObj = this.getColorSpace(toSpace);

    if (!fromSpaceObj || !toSpaceObj) {
      throw new Error('Color space not registered.');
    }

    // Create conversion pipeline
    const pipeline = this.createPipeline(fromSpace, toSpace);

    let result = values;
    let fromWhitepoint = fromSpaceObj.whitepoints;
    let toWhitepoint = toSpaceObj.whitepoints;

    if (fromSpace.toLowerCase() === 'rgb' || toSpace.toLowerCase() === 'rgb') {
      // Use identity conversion for RGB with whitepoint adjustments
      result = identityRgbConversion(result, fromWhitepoint, toWhitepoint);
    } else {
      for (const conversion of pipeline) {
        result = conversion(result, fromWhitepoint, toWhitepoint);
      }
    }

    return result;
  }
}

*/