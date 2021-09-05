"use strict";

var assert = require('assert');

var evaluate = require('../eval');

var gt = require('./gt');

describe('gt', function () {
  it('returns 1 if a is greater than b', function () {
    assert.strictEqual(evaluate(gt(1, 0)), 1);
  });
  it('returns 0 if a is lesser than b', function () {
    assert.strictEqual(evaluate(gt(0, 1)), 0);
  });
  it('returns 0 if a equals b', function () {
    assert.strictEqual(evaluate(gt(0, 0)), 0);
  });
});