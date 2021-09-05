// const not = require('../not');
// const and = require('../and');
// const eq = require('../eq');
// const gt = require('../gt');
const round = require('../round');
const { stripCalc } = require('../utils');

// module.exports = function lt(a, b) {
//   return and(not(eq(a, b)), not(gt(a, b)));
// };

module.exports = function lt(a, b) {
  const x = 0.00000000000001;

  a = stripCalc(a);
  b = stripCalc(b);

  return round(
    `((${b}) - min(${b}, ${a})) / max(max(${b}, ${a}) - min(${b}, ${a}), ${x})`
  );
};
