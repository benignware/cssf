const { computer, memoize } = require('../utils');

const _divide = memoize(computer('/'));

function divide(a, ...b) {
  return _divide(a, ...b);
}

module.exports = divide;
