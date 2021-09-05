const { computer, memoize } = require('../utils');

const _add = memoize(computer('+'));

function add(a, ...b) {
  return _add(a, ...b);
}

module.exports = add;
