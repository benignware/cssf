"use strict";

var assert = require('assert');

var chroma = require('chroma-js');

var darken = require('./darken');

var evaluate = require('../eval');

describe('darken', function () {
  it('darkens color', function () {
    var hsl = 'hsl(123, 43%, 60%)';
    var actual = darken(hsl, 0.5);
    var expected = "hsl(123, 43%, 30%)";
    assert.strictEqual(evaluate(actual), expected);
  });
});