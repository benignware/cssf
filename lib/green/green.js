const rgba = require('../rgba');
const { parseFn } = require('../utils');

function green(color) {
  const [, , g] = parseFn(rgba(color));

  return g;
}

module.exports = green;
