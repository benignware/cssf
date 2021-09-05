const { computer, memoize } = require('../utils');

const _subtract = memoize(computer('-'));

function subtract(a, ...b) {
  return _subtract(a, ...b);
}

module.exports = subtract;
