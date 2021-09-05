"use strict";

var assert = require('assert');

var round = require('./round');

describe('round', function () {
  it('rounds value up', function () {
    var x = 0.53137254901960786;
    assert.strictEqual(eval(round(x)), Math.round(x));
  });
  it('rounds value down ', function () {
    var x = 0.43137254901960786;
    assert.strictEqual(eval(round(x)), Math.round(x));
  });
  xit('rounds value up at two digits', function () {
    var x = 0.43537254901960786;
    assert.strictEqual(eval(round(x, 2)), Number(x.toFixed(2)));
  });
  xit('rounds value down at two digits', function () {
    var x = 0.43137254901960786;
    assert.strictEqual(eval(round(x, 2)), Number(x.toFixed(2)));
  });
});