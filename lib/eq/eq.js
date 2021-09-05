const round = require('../round');
const abs = require('../abs');
const { stripCalc } = require('../utils');

module.exports = function eq(a, b) {
  // a = stripCalc(a);
  // b = stripCalc(b);
  // const x = 0.00000000000001;
  // console.log('EQ: ', a, b);

  // const c = `(1 - ${x}) + ${abs(`(${a}) - (${b})`)} / max(${a}, ${b}, ${x})`;
  // const d = `min(${c}, 1) - 0.5 + ${x}`;
  // const e = `1 - ${round(d)}`;

  // return e;
  const x = 0.00000000000001;
  const c = `max(0, min(${abs(`(${a}) - (${b})`)}, 1))`;
  // console.log('c: ', c);
  const d = `(${c} + 0.5 - ${x})`;
  // console.log('d: ', d);
  const e = round(d);
  // console.log('e: ', e);
  const f = `(1 - ${e})`;

  // console.log('f: ', f);

  return f;
};
