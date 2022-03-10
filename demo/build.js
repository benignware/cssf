const fs = require('fs');
const path = require('path');
const { render } = require('..');
const content = fs.readFileSync(
  path.resolve(__dirname, 'src/index.f.css'),
  'utf-8'
);

const output = render(content);

fs.writeFileSync(path.join(__dirname, 'dist/index.css'), output, 'utf-8');
