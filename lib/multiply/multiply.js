const { computer, memoize } = require('../utils');

const _multiply = memoize(computer('*'));

function multiply(a, ...b) {
  return _multiply(a, ...b);
}

module.exports = multiply;
