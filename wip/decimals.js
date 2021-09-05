const csstree = require('css-tree');
const { unit } = require('./lib/utils');

const parse = (input) =>
  csstree.parse(!input.match(/\{/) ? `.____root { prop: \n${input}\n}` : input);

const stringify = (ast) =>
  csstree.generate(ast).replace(/^\.____root\s*\{\s*prop:\s*(.*)\}$/, '$1');

const toDecimal = (expression) => {
  expression = String(expression).replace(/^\s*calc\((.*)\)\s*$/, '$1');

  if (unit(expression) === '%') {
    expression = parseFloat(expression) / 100;
  } else {
    expression = String(expression).replace(/^(.*)\s*\*\s*100%\s*$/, '$1');
  }

  return `calc(${expression.trim()})`;
};

const toPercent = (expression) => {
  expression = toDecimal(expression);
  expression = String(expression).replace(/^\s*calc\((.*)\)\s*$/, '$1');

  return `calc(${expression.trim()} * 100%)`;
};

const percent = 'calc(0.43534 * 100%)';
const decimal = toDecimal(percent);

console.log('to decimal: ', decimal);

console.log('to percent: ', toPercent(decimal));
