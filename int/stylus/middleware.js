const stylus = require('stylus');

const {
  hsla,
  rgba,
  hue,
  saturation,
  luminance,
  red,
  green,
  blue,
  darken,
} = require('../../lib');

const fnProxy = (fn) => {
  const p = function (arg1, arg2, arg3, arg4, arg5) {
    let args = [arg1, arg2, arg3, arg4, arg5];
    args = args.map((arg) => (arg ? String(arg) : undefined));
    const result = fn.apply(this, args);

    return new stylus.nodes.Literal(result);
  };

  return p;
};

function cssfn(style) {
  style.define('hsla', fnProxy(hsla));
  style.define('rgba', fnProxy(rgba));
  style.define('hue', fnProxy(hue));
  style.define('saturation', fnProxy(saturation));
  style.define('luminance', fnProxy(luminance));
  style.define('red', fnProxy(red));
  style.define('green', fnProxy(green));
  style.define('blue', fnProxy(blue));
  style.define('cssf-darken', fnProxy(darken));
}

module.exports = cssfn;
