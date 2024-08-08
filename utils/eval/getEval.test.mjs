import { expect } from 'chai';
import assert from 'assert';
import { getEval } from './getEval.mjs';

// Sample environment and options for the tests
const baseEnv = {};
const options = {};

// Create the evaluation function using getEval
const evalFn = getEval(baseEnv, options);

describe('Evaluation Tests', () => {
  // Basic and important arithmetic tests
  it('should evaluate addition inside calc', () => {
    const result = evalFn('calc(3 + 4)');
    expect(result).to.equal(7);
  });

  it('should evaluate subtraction inside calc', () => {
    const result = evalFn('calc(10 - 4)');
    expect(result).to.equal(6);
  });

  it('should evaluate multiplication inside calc', () => {
    const result = evalFn('calc(3 * 4)');
    expect(result).to.equal(12);
  });

  it('should evaluate division inside calc', () => {
    const result = evalFn('calc(12 / 4)');
    expect(result).to.equal(3);
  });

  it('evaluates unit expression', () => {
    assert.strictEqual(evalFn('10px'), '10px');
  });

  it('evaluates calc expression', () => {
    assert.strictEqual(evalFn('calc(10px * 2)'), '20px');
  });

  it('evaluates addition with units', () => {
    assert.strictEqual(evalFn('calc(10px + 20px)'), '30px');
  });

  it('evaluates arithmetic with floating points', () => {
    assert.strictEqual(evalFn('calc(0.5 / 10 * 4.9406564584124654e-323 / 4.9406564584124654e-323)'), 0.1);
  });

  it('evaluates expression containing min', () => {
    assert.strictEqual(evalFn('min(10 + 50 * 2, 20)'), 20);
  });

  it('evaluates expression containing max', () => {
    assert.strictEqual(evalFn('max(10 + 50 * 2, 20)'), 110);
  });

  it('evaluates dynamic expression', () => {
    assert.strictEqual(evalFn(
      'calc((var(--a) + var(--b)) * var(--c))',
      {
        '--a': 1,
        '--b': 2,
        '--c': 3,
      }
    ), 9);
  });

  it('evaluates constants', () => {
    assert.strictEqual(evalFn('pi'), Math.PI);
  });

  it('evaluates calc with constants', () => {
    assert.strictEqual(evalFn('calc(pi * 2)'), Math.PI * 2);
  });

  it('correctly resolves infinity constant', () => {
    assert.strictEqual(evalFn('infinity'), Infinity);
  });

  it('correctly resolves negative infinity constant', () => {
    assert.strictEqual(evalFn('-infinity'), -Infinity);
  });

  xit('resolves to negative zero when computing constants', () => {
    assert.strictEqual(evalFn('calc(1 / -infinity)'), -0);
  });

  it('doesn\'t evaluate undefined functions', () => {
    assert.strictEqual(evalFn('xyz(0, 0, 0)'), 'xyz(0, 0, 0)');
  });

  it('splits consecutive arguments', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(calc(10px + 1px)10px'), 'abc(11px 10px)');
  });

  it('handles space-separated arguments', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(10 0 0)'), 'abc(10 0 0)');
  });

  it('handles space-separated arguments with variables', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(calc(10 * 10) var(--b) 0)', {
      '--b': '50px',
    }), 'abc(100 50px 0)');
  });

  it('handles slash-separated arguments', () => {
    const abcd = (...args) => `abcd(${args.join(', ')})`;
    const e = getEval({ abcd });

    assert.strictEqual(e('abcd(calc(10 * 10) 0 0 / 1)'), 'abcd(100 0 0 / 1)');
  });

  it('splits and joins concatenated arguments', () => {
    const input = 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)';
    const result = evalFn(input);

    assert.strictEqual(result, 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)');
  });
});
