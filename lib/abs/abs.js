module.exports = function abs(value) {
  return `max(${value}, -1 * (${value}))`;
};
