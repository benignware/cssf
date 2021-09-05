"use strict";

var assert = require('assert');

var divide = require('./divide');

describe('divide', function () {
  it('divides numbers', function () {
    assert.strictEqual(divide(4, 255), 4 / 255);
  });
});