"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('../utils'),
    parseFn = _require.parseFn;

var rgba = require('../rgba');

var multiply = require('../multiply'); // http://www.w3.org/TR/AERT#color-contrast


function brightness(color) {
  color = rgba(color);

  var _parseFn = parseFn(color),
      _parseFn2 = _slicedToArray(_parseFn, 4),
      r = _parseFn2[1],
      g = _parseFn2[2],
      b = _parseFn2[3]; // return (multiply(r, 299) + multiply(g, 587) + multiply(b, 114)) / 1000;


  return "(".concat(r, " * 299 + ").concat(g, " * 587 + ").concat(b, " * 114) / 1000 / 255");
}

module.exports = brightness;