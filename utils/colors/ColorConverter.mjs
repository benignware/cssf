import { camelCase, pascalCase, kebabCase } from 'change-case';

export class ColorConverter {
  #conversions;
  #options;

  constructor(conversions = {}, options = {}) {
    this.#conversions = {};
    this.#options = options;
    this.addConversions(conversions);
  }

  addConversion(fromSpace, toSpace, func) {
    if (typeof toSpace === 'function') {
      func = toSpace;
      toSpace = fromSpace;
      fromSpace = undefined;
    }

    if (typeof fromSpace === 'undefined' || typeof toSpace === 'undefined' || typeof func !== 'function') {
      throw new Error('Invalid parameters: Both fromSpace and toSpace must be provided with a function.');
    }

    if (fromSpace && toSpace) {
      const key = `${camelCase(fromSpace)}To${pascalCase(toSpace)}`;
      this.#conversions[key] = func;
    } else {
      throw new Error('Invalid parameters: Both fromSpace and toSpace must be provided.');
    }
  }

  addConversions(conversions) {
    if (Array.isArray(conversions)) {
      conversions.forEach(([fromSpace, toSpace, func]) => {
        if (typeof func !== 'function') {
          throw new Error('Conversion functions must be provided.');
        }
        this.addConversion(fromSpace, toSpace, func);
      });
    } else if (typeof conversions === 'object' && conversions !== null) {
      const colorSpaceKeys = Object.keys(conversions).filter(key => typeof conversions[key] === 'object');
      if (colorSpaceKeys.length > 0) {
        colorSpaceKeys.forEach(fromSpace => {
          const conversionObject = conversions[fromSpace];
          if (typeof conversionObject !== 'object' || conversionObject === null) {
            throw new Error('Color space conversions must be provided as an object.');
          }
          Object.entries(conversionObject).forEach(([key, func]) => {
            if (typeof func !== 'function') {
              throw new Error('Conversion functions must be provided.');
            }
            const conversionType = key.startsWith('from') ? 'from' : 'to';
            const targetSpace = conversionType === 'from' ? fromSpace : key.replace(/^to/, '').toLowerCase();
            const sourceSpace = conversionType === 'to' ? fromSpace : key.replace(/^from/, '').toLowerCase();
            this.addConversion(sourceSpace, targetSpace, func);
          });
        });
      } else {
        Object.entries(conversions).forEach(([key, func]) => {
          if (typeof func !== 'function') {
            throw new Error('Conversion functions must be provided.');
          }
          const [fromSpace, toSpace] = this.#splitKey(key);
          this.addConversion(fromSpace, toSpace, func);
        });
      }
    } else {
      throw new Error('Invalid conversions format. Expected an array or object.');
    }
  }

  addColorSpace(colorSpace, conversions) {
    if (typeof conversions !== 'object' || conversions === null) {
      throw new Error('Color space conversions must be provided as an object.');
    }

    Object.entries(conversions).forEach(([key, func]) => {
      if (typeof func !== 'function') {
        throw new Error('Conversion functions must be provided.');
      }

      const conversionType = key.startsWith('from') ? 'from' : 'to';
      const targetSpace = conversionType === 'from' ? colorSpace : key.replace(/^to/, '').toLowerCase();
      const sourceSpace = conversionType === 'to' ? colorSpace : key.replace(/^from/, '').toLowerCase();
      this.addConversion(sourceSpace, targetSpace, func);
    });
  }

  getConversions() {
    return this.#conversions;
  }

  getColorSpaces() {
    const spaces = new Set();

    Object.keys(this.#conversions).forEach(key => {
      const [fromSpace, toSpace] = this.#splitKey(key);
      spaces.add(fromSpace);
      spaces.add(toSpace);
    });

    return Array.from(spaces);
  }

  convertColor(fromSpace, toSpace, ...values) {
    fromSpace = camelCase(fromSpace);
    toSpace = camelCase(toSpace);

    if (fromSpace === toSpace) {
      return values;
    }
    const { transformer } = this.#options;
    const pipeline = this.#createPipeline(fromSpace, toSpace);

    if (!pipeline) {
      throw new Error(`Conversion path from ${fromSpace} to ${toSpace} not found.`);
    }

    let result = values;

    for (const conversion of pipeline) {
      result = conversion(...result);

      if (transformer) {
        result = transformer(result, fromSpace, toSpace);
      }
    }

    return result;
  }

  hasConversion(fromSpaceOrKey, toSpace) {
    try {
      if (typeof toSpace === 'undefined') {
        const key = fromSpaceOrKey;
        const [fromSpace, toSpace] = this.#splitKey(key);
        return this.getConversionPath(fromSpace, toSpace).length > 0;
      } else {
        const fromSpace = fromSpaceOrKey;
        return this.getConversionPath(fromSpace, toSpace).length > 0;
      }
    } catch {
      return false;
    }
  }

  #splitKey(key) {
    const normalizedKey = camelCase(key);
    const match = normalizedKey.match(/^([a-zA-Z0-9-]+)To([a-zA-Z0-9-]+)$/);
    if (!match) throw new Error(`Invalid conversion key format: ${key}`);
    let [_, fromSpace, toSpace] = match;
    toSpace = camelCase(toSpace);
    return [fromSpace, toSpace];
  }

  #createPipeline(fromSpace, toSpace) {
    const queue = [[fromSpace, []]];
    const visited = new Set();
    fromSpace = camelCase(fromSpace);
    toSpace = camelCase(toSpace);

    while (queue.length > 0) {
      const [currentSpace, path] = queue.shift();

      if (currentSpace === toSpace) {
        return path;
      }

      if (visited.has(currentSpace)) continue;

      visited.add(currentSpace);

      for (const [key, func] of Object.entries(this.#conversions)) {
        const [source, dest] = this.#splitKey(key);

        if (source === currentSpace) {
          queue.push([dest, [...path, func]]);
        }
      }
    }

    return null; // No path found
  }

  getConversionPath(fromSpace, toSpace) {
    fromSpace = camelCase(fromSpace);
    toSpace = camelCase(toSpace);

    const pipeline = this.#createPipeline(fromSpace, toSpace);

    if (!pipeline) {
      throw new Error(`Conversion path from ${fromSpace} to ${toSpace} not found.`);
    }

    const path = [fromSpace];
    let currentSpace = fromSpace;

    for (const conversion of pipeline) {
      for (const [key] of Object.entries(this.#conversions)) {
        if (conversion === this.#conversions[key]) {
          const [source, dest] = this.#splitKey(key);

          if (source === currentSpace) {
            path.push(dest);
            currentSpace = dest;
            break;
          }
        }
      }
    }

    const result = path.map(space => kebabCase(space));

    return result;
  }
}
