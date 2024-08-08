export class ColorConverter {
  constructor(conversions = {}) {
    this.conversions = {};
    Object.entries(conversions).forEach(([key, func]) => {
      this.registerConversion(key, func);
    });
  }

  // Register a color conversion
  registerConversion(fromSpace, toSpace, func) {
    let key;
  
    if (typeof toSpace === 'function') {
      func = toSpace;
      key = fromSpace;
    } else {
      key = `${this.toCamelCase(fromSpace)}To${this.toCamelCase(toSpace)}`;
    }

    this.conversions[key] = func;
  }

  // Convert camelCase or PascalCase to hyphen-format
  toHyphenated(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  // Convert hyphen-format to camelCase
  toCamelCase(str) {
    let result = str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

    result = result.charAt(0).toLowerCase() + result.slice(1);
      
    return result;
  }

  // Split a conversion key into fromSpace and toSpace
  splitKey(key) {
    // Normalize key format
    const normalizedKey = this.toCamelCase(key);
    // Match patterns like 'xyzD65ToXyz' or 'prophotoRgbToA98Rgb'
    const match = normalizedKey.match(/^([a-zA-Z0-9]+)To([a-zA-Z0-9]+)$/);
    if (!match) throw new Error(`Invalid conversion key format: ${key}`);
    let [_, fromSpace, toSpace] = match;

    toSpace = this.toCamelCase(toSpace);

    return [fromSpace, toSpace];
  }

  // Create a conversion pipeline from one color space to another
  createPipeline(fromSpace, toSpace) {
    const pipeline = [];
    const visited = new Set();

    fromSpace = this.toCamelCase(fromSpace);
    toSpace = this.toCamelCase(toSpace);

    const findPath = (currentSpace, targetSpace) => {
      if (currentSpace === targetSpace) return true;
      if (visited.has(currentSpace)) return false;

      visited.add(currentSpace);

      for (const [key, func] of Object.entries(this.conversions)) {
        
        const [source, dest] = this.splitKey(key);

        // console.log(currentSpace, 'findPath --->', source, 'DEST: ', dest, targetSpace);

        if (source === currentSpace && dest) {
          if (findPath(dest, targetSpace)) {
            pipeline.unshift(func);
            return true;
          }
        }
      }

      return false;
    };

    if (!findPath(fromSpace, toSpace)) {
      return null; // Return null if no path is found
    }

    return pipeline;
  }

  // Get all registered conversion methods as an object in camelCase format
  getConversions() {
    return this.conversions;
  }

  // Convert color values from one space to another
  convertColor(fromSpace, toSpace, ...values) {
    if (fromSpace === toSpace) {
      throw new Error(`Source and target color spaces are the same: ${fromSpace}`);
    }

    const pipeline = this.createPipeline(fromSpace, toSpace);

    if (!pipeline) {
      throw new Error(`Conversion path from ${fromSpace} to ${toSpace} not found.`);
    }

    let result = values;

    for (const conversion of pipeline) {
      result = conversion(...result);
    }

    return result;
  }

  // Check if a conversion path exists from fromSpace to toSpace or for a conversionKey
  hasConversion(fromSpaceOrKey, toSpace) {
    if (typeof toSpace === 'undefined') {
      // Handle conversionKey format
      const key = fromSpaceOrKey;

      try {
        const [fromSpace, toSpace] = this.splitKey(key);
        return this.createPipeline(fromSpace, toSpace) !== null;
      } catch (e) {
        return false;
      }
    } else {
      // Handle fromSpace and toSpace format
      const fromSpace = fromSpaceOrKey;
      return this.createPipeline(fromSpace, toSpace) !== null;
    }
  }
}
