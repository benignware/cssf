export class ColorConverter {
  constructor() {
    this.colorSpaces = {};

    // Register color spaces
    this.registerColorSpace('rgb'); // Register RGB color space with no conversions
  }

  // Register a color space with its conversion methods and optional parent
  registerColorSpace(name, parent = null, conversions = {}) {
    if (typeof name !== 'string') {
      throw new TypeError('Color space name must be a string');
    }

    if (typeof parent === 'object') {
      conversions = parent;
      parent = null;
    }

    this.colorSpaces[name.toLowerCase()] = {
      parent,
      conversions: conversions || {}
    };
  }

  // Get the color space with inherited properties
  getColorSpace(name) {
    if (typeof name !== 'string') {
      throw new TypeError('Color space name must be a string');
    }

    const colorSpace = this.colorSpaces[name];
    
    if (!colorSpace) {
      return null;
    }

    // Resolve parent color spaces if needed
    if (colorSpace.parent) {
      const parentSpace = this.getColorSpace(colorSpace.parent);
      
      if (parentSpace) {
        return {
          ...parentSpace,
          ...colorSpace,
          conversions: {
            ...parentSpace.conversions,
            ...colorSpace.conversions
          } };
      }
    }

    return colorSpace;
  }

  // Get all registered conversion methods as an object in camelCase format
  getConversions() {
    const conversions = {};

    for (const name of Object.keys(this.colorSpaces)) {
      const spaceObj = this.getColorSpace(name);

      if (!spaceObj) continue;

      const colorSpaceConversions = spaceObj.conversions;

      for (const [conversionName, func] of Object.entries(colorSpaceConversions)) {
        const match = conversionName.match(/(to|from)(.*)/);

        if (!match) continue;

        const [direction, target] = match.slice(1).map(s => s.toLowerCase());
        const source = direction === 'to' ? name : target;
        const dest = direction === 'to' ? target : name;
        const key = `${source}_to_${dest}`;

        conversions[key] = func;
      }
    }

    return conversions;
  }

  // Create a conversion pipeline from one color space to another
  createPipeline(fromSpace, toSpace) {
    const conversions = this.getConversions();

    const pipeline = [];
    const visited = new Set();

    const findPath = (currentSpace, targetSpace) => {
      if (currentSpace === targetSpace) return true;
      if (visited.has(currentSpace)) return false;

      visited.add(currentSpace);

      const currentSpaceObj = this.getColorSpace(currentSpace);
      if (!currentSpaceObj) return false;

      // Check for direct conversion functions
      
      for (const [conversionName, func] of Object.entries(conversions)) {
        const [source, dest] = conversionName.split('_to_');

        if (source === currentSpace.toLowerCase() && dest) {
          if (findPath(dest.charAt(0).toLowerCase() + dest.slice(1), targetSpace.toLowerCase())) {
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

  // Convert color values from one space to another
  convertColor(fromSpace, toSpace, ...values) {
    if (fromSpace === toSpace) {
      throw new Error(`Source and target color spaces are the same: ${fromSpace}`);
    }

    const fromSpaceObj = this.getColorSpace(fromSpace);
    const toSpaceObj = this.getColorSpace(toSpace);

    if (!fromSpaceObj || !toSpaceObj) {
      throw new Error('Color space not registered.');
    }

    // Create conversion pipeline
    const pipeline = this.createPipeline(fromSpace, toSpace);

    let result = values;

    // Apply the pipeline of conversion functions
    for (const conversion of pipeline) {
      result = conversion(...result);
    }

    return result;
  }
}
