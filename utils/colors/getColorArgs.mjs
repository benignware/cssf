// import { isNumber, number, parseArgs } from '../../lib/utils.mjs';
import { isNumber, number, unit } from '../calc/number.mjs';
import { parseArgs } from '../ast/parseArgs.mjs';
import { isColorKey } from './keyToRgb.mjs';

class ColorArgs {
  constructor(from, colorSpace, c1, c2, c3, a) {
    Object.assign(
      this,
      from && { from },
      colorSpace && { colorSpace },
      { c1, c2, c3 },
      typeof a !== 'undefined' ? { a } : null
    );
  }

  [Symbol.iterator]() {
    const result = [this.c1, this.c2, this.c3];

    if (typeof this.a !== 'undefined') {
      result.push(this.a);
    }
    
    return result[Symbol.iterator]();
  }
}

export const getColorArgs = (from = null, colorSpace = null, ...args) => {
  const input = [from, colorSpace, ...args].join(' ');
  
  args = parseArgs(input, { tokens: true });

  const fromIndex = args.findIndex((arg, index, array) => {
    return arg.startsWith('from') && arg.length > 4 || index > 0 &&  array[index - 1] === 'from';
  });

  if (fromIndex >= 0) {
    from = args[fromIndex].replace(/^from\s+/, '');
    args = args.slice(fromIndex + 1);
  } else {
    from = null;
  }
  
  colorSpace = args.find((arg) => {
    const c = !isColorKey(arg) && /^[a-z-]{2,}[0-9a-z]*$/.test(arg);

    return c;
  });
  
  let [c1, c2, c3, a] = args
    .filter((arg) => {
      return !arg.startsWith('from')
        && (!from || arg !== from)
        && (!colorSpace || arg !== colorSpace)
    });
    
  // Convert to number if possible
  [c1, c2, c3, a] = [c1, c2, c3, a].map((arg) => {
    const n = number(arg);
    const u = unit(arg);

    return !isNaN(n) && !u ? n : arg;
  });

  const colorArgs = new ColorArgs(from, colorSpace, c1, c2, c3, a);

  return colorArgs;
};