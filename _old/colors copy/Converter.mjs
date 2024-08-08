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