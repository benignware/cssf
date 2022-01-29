const csstree = require('css-tree');

const parse = (input) =>
  typeof input === 'number'
    ? String(input)
    : csstree.parse(
        !input.match(/\{/) ? `.____root { prop: \n${input}\n}` : input
      );

const stringify = (ast) =>
  csstree.generate(ast).replace(/^\.____root\s*\{\s*prop:\s*(.*)\}$/, '$1');

const parseFn = (input) => {
  const ast = parse(input);
  const fn = csstree.find(ast, (node) => node.type === 'Function');

  if (fn) {
    const args = fn.children
      .toArray()
      .filter(({ type }) => type !== 'Operator')
      .map((node) => csstree.generate(node));

    return [fn.name, ...args];
  }

  return null;
};

const dec2hex = (...numbers) =>
  `#${numbers.map((number) => number.toString(16).padStart(2, '0')).join('')}`;

const hex2dec = (hex) =>
  [
    ...hex
      .replace(/^\s*#/, '')
      .toLowerCase()
      .match(/.{1,2}/g),
  ].map((chunk) => parseInt(chunk, 16));

const rgba2hex = (r, g, b, a = 1) => dec2hex(...[r, g, b, Math.round(a * 255)]);

const hex2rgba = (hex) =>
  hex2dec(hex.trim().padEnd(8, '0')).map((number, index) =>
    index === 3 ? parseFloat((number / 255).toFixed(2)) : number
  );

const rgba = [245, 83, 4, 0.43];
const hex = rgba2hex(...rgba);

const Color = (color) =>
  color.match(/^\s*#/) ? ['rgb', ...hex2dec(color)] : parseFn(color);

console.log(hex);

const result = hex2rgba(hex);

console.log(result, rgba);
