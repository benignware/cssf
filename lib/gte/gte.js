const not = require('../not');
const lt = require('../lt');

function gte(a, b) {
  return not(lt(a, b));
}

module.exports = gte;
