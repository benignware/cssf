// const { evaluate } = require('./utils');

// const unit = (value) => {
//   const [, unit] = input.match(/(-?[\d.]+)([\w%/]+)?/) || [];
// }

const shf = (digits = 0) => `4.9406564584124654e-${324 - digits}`;

const round = (value, digits = 0) =>
  `((${value}) * ${shf(digits)} / ${shf(digits)})`;

const abs = (value) => `max(${value}, -1 * (${value}))`;

// const clamp = (min, value, max) => `max(${min}, min(${value}, ${max}))`;

const sign = (value) => `(${value} / ${abs(value)})`; // clamp(-1, var(--a), 1);

// const eq = (a, b) =>
//   `max(0, 1 - ${round(
//     `(${abs(`((${a}) - (${b}))`)} / max(${a}, ${b}) + 0.5)`
//   )})`;

// const eq = (a, b) =>
//   `(1 - (${round(
//     `${abs(`(${a}) - (${b})`)} / max(max((${a}), (${b})), 0.000000000000000001)`
//   )}))`;

// const c = a - Math.min(a, b);
// const d = Math.max(Math.max(a, b) - Math.min(a, b), 0.000000000000000001);

// const eq = (a, b) =>
//   `1 - ((${a}) - min(${a}, ${b})) / max(max(${a}, ${b}) - min(${a}, ${b}), 0.000000000000000001)`;

const eq = (a, b) => {
  const x = 0.00000000000001;
  const c = `(1 - ${x}) + ${abs(`(${a}) - (${b})`)} / max(${a}, ${b}, ${x})`;
  const d = `min(${c}, 1) - 0.5 + ${x}`;
  const e = `1 - ${round(d)}`;

  return e;
};

const not = (a) => `(1 - (${a}))`;

const gt = (a, b) => {
  const res = round(
    `((${a}) - min(${a}, ${b})) / max(max(${a}, ${b}) - min(${a}, ${b}), 0.000000000000000001)`
  );

  // console.log('gteq: ', a, b, '-> ', res);

  return res;
};

//   const c = a - Math.min(a, b);
// const d = Math.max(Math.max(a, b) - Math.min(a, b), 0.0000000000001);

// const lteq = (a, b) => eq(`min((${a}), (${b}))`, a);
const lteq = (a, b) => not(gt(a, b));

const and = (a, b) => `((${a}) * (${b}))`;

// const gteq = (a, b) => round(`min(${a}, ${b})`);

const lt = (a, b) => and(not(eq(a, b)), not(gt(a, b)));

const gteq = (a, b) => not(lt(a, b));

// const gt = (a, b) => ifelse(eq(a, b), 0, gteq(a, b));

const ifelse = (condition, ...values) =>
  `(((${values[0]}) * (${condition})) + ((${values[1]}) * (1 - (${condition}))))`;

// const calc = expression => `calc(${expression})`;

// const evaluate = new Function(
//   'term',
//   `
// const { min, max } = Math;

// return eval(term);
// `
// );

module.exports = {
  shf,
  round,
  abs,
  // clamp,
  sign,
  eq,
  not,
  and,
  lteq,
  gteq,
  lt,
  gt,
  ifelse,
  // evaluate,
};
