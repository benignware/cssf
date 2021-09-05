"use strict";

var assert = require('assert');

var evaluate = require('./eval');

describe('eval', function () {
  it('evaluates numerical expression', function () {
    var result = evaluate('12');
    assert.strictEqual(result, 12);
  });
  it('evaluates unit expression', function () {
    var result = evaluate('10px');
    assert.strictEqual(result, '10px');
  });
  it('evaluates addition', function () {
    var result = evaluate('30.12px + 9.88px');
    assert.strictEqual(result, '40px');
  });
  it('evaluates multiplication', function () {
    var a = '30.123456789px';
    var b = '10.123456789px';
    var result = evaluate("".concat(a, " * ").concat(b));
    assert.strictEqual(result, "".concat(parseFloat(a) * parseFloat(b), "px"));
  });
  it('evaluates arithmetic expression', function () {
    var expression = '0.5 / 10 * 4.9406564584124654e-323 / 4.9406564584124654e-323';
    assert.strictEqual(evaluate(expression), eval(expression));
  });
  it('evaluates calc expression', function () {
    var result = evaluate('calc(((((0 / 1e-14) / 10) * 5e-323) / 5e-323) * 10)');
    assert.strictEqual(result, 0);
  });
  it('evaluates dynamic expression', function () {
    var result = evaluate('hsla(var(--primary-h), var(--primary-s), calc(var(--primary-l) / 2%))', {
      'primary-h': '260',
      'primary-s': '40%',
      'primary-l': '80%'
    });
    assert.strictEqual(result, 'hsla(260, 40%, 40%)');
  });
});