import { isNumber, number, parseArgs } from '../../lib/utils.mjs';

class ColorArgs {
  constructor(from, colorspace, c1, c2, c3, a = 1) {
    Object.assign(this, from && { from }, colorspace && { colorspace }, { c1, c2, c3, a });
  }

  [Symbol.iterator]() {
    return [this.c1, this.c2, this.c3, this.a][Symbol.iterator]();
  }
}

export const getColorArgs = (from = null, colorspace = null, ...args) => {
  const input = [from, colorspace, ...args].join(' ');
  
  args = parseArgs(input, { tokens: true });
  from = args.find((arg, index, array) =>
      arg.startsWith('from') && arg.length > 4
      || index > 0 &&  array[index - 1] === 'from')?.replace(/^from\s*/, '');
  colorspace = args.find((arg) => !arg.startsWith('from') && /^[a-z-]{2,}$/.test(arg));
  
  const [c1, c2, c3, a = 1] = args
    .filter((arg) =>
      !arg.startsWith('from')
      && (!from || arg !== from)
      && (!colorspace || arg !== colorspace))
    .map(arg => isNumber(arg) ? number(arg) : arg);

  // cArgs = from
  //   ? Object.values(Object.assign({}, components, cArgs))
  //   : cArgs;

  // const [c1, c2, c3, a = 1] = cArgs;

  const colorArgs = new ColorArgs(from, colorspace, c1, c2, c3, a);

  return colorArgs;
};