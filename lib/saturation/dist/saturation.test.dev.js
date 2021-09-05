"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var assert = require('assert');

var chroma = require('chroma-js');

var saturation = require('./saturation');

var evaluate = require('../eval');

describe('saturation', function () {
  it('retrieves saturation from hsl', function () {
    var hsl = 'hsl(123, 43%, 60%)';
    var s = saturation(hsl);
    assert.strictEqual(evaluate(s), Number(chroma(hsl).hsl()[1].toFixed(2)));
  });
  it('retrieves saturation from hex', function () {
    var hsl = 'hsl(123, 43%, 60%)';
    var color = chroma(hsl);
    var hex = color.hex();
    var s = saturation(hex);
    assert.strictEqual(evaluate(s), Number(chroma(hsl).hsl()[1].toFixed(2)));
  });
  it('retrieves saturation from from rgb', function () {
    var hsl = 'hsl(123, 43%, 60%)';
    var color = chroma(hsl);
    var rgb = "rgb(".concat(color.rgb().join(', '), ")");
    var s = saturation(rgb);
    assert.strictEqual(evaluate(s), chroma(hsl).hsl()[1]);
  });
  it('retrieves saturation from rgb dynamically', function () {
    var hsl = 'hsl(123, 43%, 60%)';
    var color = chroma(hsl);

    var _color$rgb = color.rgb(),
        _color$rgb2 = _slicedToArray(_color$rgb, 3),
        r = _color$rgb2[0],
        g = _color$rgb2[1],
        b = _color$rgb2[2];

    var rgb = "rgb(var(--r), var(--g), var(--b))";
    var s = saturation(rgb);
    assert.strictEqual(evaluate(s, {
      r: r,
      g: g,
      b: b
    }), chroma(hsl).hsl()[1]);
  });
});