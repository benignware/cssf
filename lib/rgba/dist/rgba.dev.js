"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var chroma = require('chroma-js');

var abs = require('../abs');

var and = require('../and');

var ifelse = require('../ifelse');

var lt = require('../lt');

var gte = require('../gte');

var round = require('../round');

var mod = require('../mod');

var calc = require('../calc');

var _require = require('../utils'),
    parseFn = _require.parseFn,
    toDecimal = _require.toDecimal;

var hsl2rgb = function hsl2rgb(h, s, l) {
  var c = "(1 - ".concat(abs("2 * ".concat(l, " - 1")), ") * ").concat(s);
  var x = "".concat(c, " * (1 - ").concat(abs("".concat(mod("".concat(h, " / 60"), 2), " - 1")), ")");
  var m = "(".concat(l, " - (").concat(c, " / 2))");
  var rh = ifelse(and(gte(h, 120), lt(h, 240)), 0, ifelse(lt(h, 60), c, ifelse(gte(h, 300), c, x)));
  var gh = ifelse(gte(h, 240), 0, ifelse(and(lt(h, 180), gte(h, 60)), c, x));
  var bh = ifelse(lt(h, 120), 0, ifelse(and(lt(h, 300), gte(h, 180)), c, x));
  var r = "(".concat(rh, " + ").concat(m, ") * 255");
  var g = "(".concat(gh, " + ").concat(m, ") * 255");
  var b = "(".concat(bh, " + ").concat(m, ") * 255");
  r = round(r);
  g = round(g);
  b = round(b);
  r = calc(r);
  g = calc(g);
  b = calc(b);
  return [r, g, b];
};

module.exports = function rgba(r, g, b, a) {
  if (r && !b) {
    a = g;
    var color = r;

    if (color.match(/(hsl|rgb)a?\(/)) {
      var _parseFn = parseFn(color),
          _parseFn2 = _toArray(_parseFn),
          name = _parseFn2[0],
          args = _parseFn2.slice(1);

      if (name.startsWith('hsl')) {
        var _args = _slicedToArray(args, 3),
            h = _args[0],
            s = _args[1],
            l = _args[2];

        var _hsl2rgb = hsl2rgb(h, toDecimal(s), toDecimal(l));

        var _hsl2rgb2 = _slicedToArray(_hsl2rgb, 3);

        r = _hsl2rgb2[0];
        g = _hsl2rgb2[1];
        b = _hsl2rgb2[2];
      } else {
        var _args2 = _slicedToArray(args, 3);

        r = _args2[0];
        g = _args2[1];
        b = _args2[2];
      }
    } else {
      try {
        var _chroma$rgb = chroma(color).rgb();

        var _chroma$rgb2 = _slicedToArray(_chroma$rgb, 3);

        r = _chroma$rgb2[0];
        g = _chroma$rgb2[1];
        b = _chroma$rgb2[2];
      } catch (e) {
        return color;
      }
    }
  }

  a = typeof a !== 'undefined' ? a : 1;
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
};