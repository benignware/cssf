const path = require('path');
const fs = require('fs');
const { renderSync } = require('./render');

const middleware = (options = {}) => {
  const { baseDir = process.cwd() } = options;

  return function (req, res, next) {
    const file = path.join(baseDir, req.path);

    if (fs.existsSync(file) && path.extname(file) === '.scss') {
      const { css } = renderSync({ file });

      res.set('Content-Type', 'text/css');

      res.send(css);
    }

    next();
  };
};

module.exports = middleware;
