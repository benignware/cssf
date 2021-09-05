"use strict";

var assert = require('assert');

var mod = require('./mod');

var evaluate = require('../eval');

describe('mod', function () {
  it('returns remainder', function () {
    assert.strictEqual(evaluate(mod(240, 360)), eval("240 % 360"));
  });
  it('returns remainder when a is negative', function () {
    assert.strictEqual(evaluate(mod(360 - 120, 360)), eval("360 - 120 % 360"));
  });
  it('returns remainder when a is larger than b', function () {
    assert.strictEqual(evaluate(mod(360 + 120, 360)), evaluate("(360 + 120) % 360"));
  });
});