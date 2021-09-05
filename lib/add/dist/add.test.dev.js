"use strict";

var assert = require('assert');

var add = require('./add');

describe('add', function () {
  it('computes plain numbers', function () {
    assert.strictEqual(add(3, 5), 8);
  });
  it('computes same units', function () {
    assert.strictEqual(add('3px', '5px'), '8px');
  });
  it("doesn't compute different units", function () {
    assert.strictEqual(add('3px', '5rem'), 'calc(3px + 5rem)');
  });
  it("doesn't compute terms", function () {
    assert.strictEqual(add('(3px + 4px)', '5rem'), 'calc((3px + 4px) + 5rem)');
  });
  it('concatenates strings', function () {
    assert.strictEqual(add('Hello', ' World'), 'Hello World');
  });
});