const floor = require('../floor');
const evaluate = require('../eval');
// const ifelse = require('../ifelse');

// const lhf = -Number.MAX_SAFE_INTEGER + 1;

// function int(value) {
//   return `((${value}) + ${lhf} - ${lhf})`;
// }

module.exports = function mod(a, b) {
  const c = `(${a}) / (${b})`;
  const i = floor(c);
  const result = `((${a}) - (${b}) * (${i}))`;

  // const actual = evaluate(result);
  // const expected = evaluate(`${a} % ${b}`);
  // const ok = actual === expected;

  // console.log(
  //   `MOD: ${a} % ${b} -> `,
  //   'ok?', ok,
  //   actual,
  //   'expected:',
  //   expected,
  //   'c: ',
  //   evaluate(c),
  //   'i: ',
  //   evaluate(i)
  // );

  return result;
};
