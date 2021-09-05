"use strict";

var assert = require('assert');

var chroma = require('chroma-js');

var red = require('./red');

var evaluate = require('../eval');

describe('red', function () {
  it('retrieves red from achromatic rgb', function () {
    var rgb = 'rgb(123, 123, 123)';
    var r = red(rgb);
    assert.strictEqual(evaluate(r), 123);
  });
  it('retrieves red from hex', function () {
    var rgb = 'rgb(123, 245, 112)';
    var hex = chroma(rgb).hex();
    var r = red(hex);
    assert.strictEqual(evaluate(r), chroma(rgb).rgb()[0]);
  });
  it('retrieves red from from achromatic hsl', function () {
    var hsl = 'hsl(150, 10%, 20%)';
    var r = red(hsl);
    assert.strictEqual(evaluate(r), chroma(hsl).rgb()[0]);
  });
});