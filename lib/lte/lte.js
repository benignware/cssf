const not = require('../not');
const gt = require('../gt');

module.exports = function lte(a, b) {
  return not(gt(a, b));
};
