const express = require('express');
const stylus = require('stylus');
const cssfn = require('./middleware');

const app = express();
const port = 3020;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send(`<html>
  <head>
    <style>
      ${stylus.render(
        `
        $red = #990000;
        $green = #009900;
        $blue = #000099;
        $gray = #aaaaaa;

        $color = $gray;
        
        $primary-rgb = rgba(var(--primary-r), var(--primary-g), var(--primary-b));
        $primary-hsl = hsla(var(--primary-h), var(--primary-s), var(--primary-l));

        :root {
          --primary-r: red($color);
          --primary-g: green($color);
          --primary-b: blue($color);
          --primary-h: hue($color);
          --primary-s: saturation($color);
          --primary-l: luminance($color);
        }

        .bg-primary {
          background: rgba(red($primary-hsl), green($primary-hsl), blue($primary-hsl), 1);
          height: 200px;
        }
      `,
        { use: cssfn }
      )}
    </style>
  </head>
  <body>
    <div class="bg-primary">
        Primary
    </div>
  </body>
</html>`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
