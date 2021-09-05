"use strict";

var assert = require('assert');

var chroma = require('chroma-js');

var blue = require('./blue');

var evaluate = require('../eval');

describe('blue', function () {
  it('retrieves blue from rgb', function () {
    var rgb = 'rgb(123, 123, 123)';
    var b = blue(rgb);
    assert.strictEqual(evaluate(b), 123);
  });
  it('retrieves blue from hex', function () {
    var rgb = 'rgb(123, 245, 112)';
    var hex = chroma(rgb).hex();
    var b = blue(hex);
    assert.strictEqual(evaluate(b), chroma(rgb).rgb()[2]);
  });
});