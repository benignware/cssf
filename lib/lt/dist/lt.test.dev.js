"use strict";

var assert = require('assert');

var evaluate = require('../eval');

var lt = require('./lt');

describe('lt', function () {
  it('returns 1 if a is lesser than b', function () {
    assert.strictEqual(evaluate(lt(0, 1)), 1);
  });
  it('returns 0 if a is greater than b', function () {
    assert.strictEqual(evaluate(lt(1, 0)), 0);
  });
  it('returns 0 if a equals b', function () {
    assert.strictEqual(evaluate(lt(0, 0)), 0);
  });
});