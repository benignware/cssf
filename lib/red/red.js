const rgba = require('../rgba');
const { parseFn } = require('../utils');

function red(color) {
  const [, red] = parseFn(rgba(color));

  return red;
}

module.exports = red;
