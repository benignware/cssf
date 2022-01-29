const stylus = require("stylus");
const { rgba } = require("./lib/colors");

var express = require('express'),
    stylus = require('stylus');

function mylib(style) {
  style.define('rgba', function(red, green, blue, alpha = 1) {
    const res = rgba(red, green, blue, alpha);
    return new stylus.nodes.Literal(res);
  });
}

const str = `
  $primary = rgba(var(--primary-r, 123), var(--primary-g, 233), var(--primary-b, 123));

  body {
    &:hover {
      background-color: rgba($primary, 0.6);
    }
  }
`;

stylus.render(str, { use: mylib }, function (err, css) {
  if (err) throw err;
  console.log(css);
});
