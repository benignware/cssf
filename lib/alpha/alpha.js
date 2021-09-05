const rgba = require('../rgba');
const hsla = require('../hsla');
const { parseFn } = require('../utils');

function alpha(color) {
  color = (color.match(/^\s*hsl/) ? hsla : rgba)(color);

  const [, , , , a] = parseFn(color);

  return a;
}

module.exports = alpha;
