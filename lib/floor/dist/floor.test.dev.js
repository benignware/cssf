"use strict";

var assert = require('assert');

var evaluate = require('../eval');

var floor = require('./floor');

describe('floor', function () {
  it('rounds to next smaller integer', function () {
    var a = 2.99999;
    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });
  it('is safe with zero', function () {
    var a = 2.66;
    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });
  it('rounds value down', function () {
    var a = 3.1111;
    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });
  it('rounds negative value down', function () {
    var a = -3.1111;
    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });
  it('rounds negative value to next smaller integer', function () {
    var a = -2.99999;
    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });
});