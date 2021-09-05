"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var assert = require('assert');

var chroma = require('chroma-js');

var evaluate = require('../eval');

var luminance = require('./luminance');

describe('luminance', function () {
  it('retrieves luminance of rgb color', function () {
    var rgb = 'rgb(25, 255, 255)';
    var color = chroma(rgb);
    var lum = luminance(rgb);
    assert.strictEqual(evaluate(lum).toFixed(4), color.luminance().toFixed(4));
  });
  it('retrieves luminance of rgb dynamically', function () {
    var rgb = 'rgb(25, 255, 255)';
    var color = chroma(rgb);

    var _color$rgb = color.rgb(),
        _color$rgb2 = _slicedToArray(_color$rgb, 3),
        r = _color$rgb2[0],
        g = _color$rgb2[1],
        b = _color$rgb2[2];

    var lum = evaluate(luminance("rgb(var(--r), var(--g), var(--b))"), {
      r: r,
      g: g,
      b: b
    });
    assert.strictEqual(evaluate(lum).toFixed(4), color.luminance().toFixed(4));
  });
});