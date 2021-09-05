const rgba = require('../rgba');
const { parseFn } = require('../utils');

function blue(color) {
  const [, , , b] = parseFn(rgba(color));

  return b;
}

module.exports = blue;
