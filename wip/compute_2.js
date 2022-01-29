const { compute } = require('../lib/utils');
const evaluate = require('../lib/eval');

const multiply = compute('*');
const add = compute('+');
const subtract = compute('-');

const l = '40%';
const s = '60%';

// `${l} * (1 + ${s})`,

// const value = multiply(l, add(1, s));

// `${l} + ${s} - ${l} * ${s}`

// const value = subtract(add(l, s), multiply(l, add(1, s)));

const value = multiply('50%', '50%');

console.log('VALUE: ', value);
