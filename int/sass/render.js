const sass = require('sass');
const functions = require('./functions');

function renderSync(options = {}) {
  const result = sass.renderSync({
    ...options,
    functions: {
      ...options.functions,
      ...functions,
    },
    includePaths: [],
  });

  return result;
}

module.exports = {
  renderSync
}
