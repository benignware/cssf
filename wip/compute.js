const evaluate_ = require('./lib/eval');

function unit(value) {
  if (!isNaN(Number(value))) {
    return '';
  }

  return (String(value).match(/^s*[\d.-]+([a-z%]+)/) || [])[1] || '';
}

const compute = (operator) => (a, b) => {
  console.log('COMPUTE: ', operator, a, b);
  const au = unit(a);
  const bu = unit(b);

  a = parseFloat(a);
  b = parseFloat(b);

  console.log('PARSE FLOAT: ', a, b);

  let u;

  if (['*', '/'].includes(operator) && (au === '%' || bu === '%')) {
    u = au || bu;

    if (!(au === '%' && bu === '%')) {
      a = au === '%' && bu ? a / 100 : a;
      b = bu === '%' && au ? b / 100 : b;
    }
  } else {
    u = au || bu;
  }

  const result = new Function('a', 'b', `return a ${operator} b;`)(a, b);

  console.log('result: ', result, 'U:', u, `${result}${u}`);

  return `${result}${u}`;
};

const divide = compute('/');
const multiply = compute('*');

// const a = 5;
// const b = 1;

const expression = '43 + (15 - 4)';

// const result = multiply(a, b);
const expected = eval(
  expression
);

// const actual1 = divide(0.5, multiply(10, 3));

// const actual2 = multiply(divide(0.5, 10), 3);

const actual3 = evaluate_(expression);

console.log('--->', actual3 === expected);
