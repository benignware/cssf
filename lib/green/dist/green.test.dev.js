"use strict";

var assert = require('assert');

var chroma = require('chroma-js');

var green = require('./green');

var evaluate = require('../eval');

describe('green', function () {
  it('retrieves green from rgb', function () {
    var rgb = 'rgb(123, 123, 123)';
    var r = green(rgb);
    assert.strictEqual(evaluate(r), 123);
  });
  it('retrieves green from hex', function () {
    var rgb = 'rgb(123, 245, 112)';
    var hex = chroma(rgb).hex();
    var g = green(hex);
    assert.strictEqual(evaluate(g), chroma(rgb).rgb()[1]);
  });
  it('retrieves red from from achromatic hsl', function () {
    var hsl = 'hsl(150, 10%, 20%)';
    var g = green(hsl);
    assert.strictEqual(evaluate(g), chroma(hsl).rgb()[1]);
  });
});