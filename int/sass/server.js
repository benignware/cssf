const express = require('express');
const path = require('path');
const fs = require('fs');

const middleware = require('./middleware');

const app = express();
const port = 3020;

app.use(middleware({ baseDir: __dirname }));

app.get('/', function (req, res) {
  const file = path.join(__dirname, 'index.html');

  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    res.send(content);

    return;
  }
});

app.get('*', function (req, res) {
  res.status(404);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
