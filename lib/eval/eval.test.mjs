import assert from 'assert';
import evaluate from './eval.mjs';
import { colorBrightness } from '../index.mjs';
import getEval from './getEval.mjs';

describe('eval', () => {
  it('evaluates numerical expression', () => {
    assert.strictEqual(evaluate('12'), 12);
  });

  it('evaluates unit expression', () => {
    assert.strictEqual(evaluate('10px'), '10px');
  });

  it('evaluates calc expression', () => {
    assert.strictEqual(evaluate('calc(10px * 2)'), '20px');
  });

  it('evaluates addition', () => {
    assert.strictEqual(evaluate(`calc(10px + 20px)`), '30px');
  });

  it('evaluates subtraction', () => {
    assert.strictEqual(evaluate(`calc(30.1px - 10.1px)`), '20px');
  });

  it('evaluates multiplication', () => {
    assert.strictEqual(evaluate(`calc(10px * 2)`), '20px');
  });

  it('evaluates division', () => {
    assert.strictEqual(evaluate(`calc(20px / 2)`), '10px');
  });

  it('ignores operators not inside calc', () => {
    assert.strictEqual(evaluate(`100px / 2`), '100px / 2');
  });

  it(`evaluates expression containing 'min'`, () => {
    assert.strictEqual(evaluate('min(10 + 50 * 2, 20)'), 20);
  });

  it(`evaluates expression containing 'max'`, () => {
    assert.strictEqual(evaluate('max(10 + 50 * 2, 20)'), 110);
  });

  it('evaluates arithmetic expression', () => {
    assert.strictEqual(evaluate('calc(0.5 / 10 * 4.9406564584124654e-323 / 4.9406564584124654e-323)'), 0.1);
  });

  xit('evaluates calc expression', () => {
    assert.strictEqual('calc(((((0 / 1e-14) / 10) * 5e-323) / 5e-323) * 10)', 0);
  });

  it('evaluates dynamic expression', () => {
    assert.strictEqual(evaluate(
      'calc((var(--a) + var(--b)) * var(--c))',
      {
        '--a': 1,
        '--b': 2,
        '--c': 3,
      }
    ), 9);
  });

  it('evaluates constants', () => {
    assert.strictEqual(evaluate('pi'),  Math.PI);
  });

  it('evaluates calc with constants', () => {
    assert.strictEqual(evaluate('calc(pi * 2)'),  Math.PI * 2);
  });

  it(`correctly resolves infinity constant`, () => {
    assert.strictEqual(evaluate('infinity'), Infinity);
  });

  it(`correctly resolves negative infinity constant`, () => {
    assert.strictEqual(evaluate('-infinity'), -Infinity);
  });

  it(`resolves to negative zero when computing constants`, () => {
    assert.strictEqual(evaluate('calc(1 / -infinity)'), -0);
  });

  it(`doesn't evaluate undefined functions`, () => {
    assert.strictEqual(evaluate('xyz(0, 0, 0)'), 'xyz(0, 0, 0)');
  });

  it('splits consecutive arguments', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(calc(10px + 1px)10px'), 'abc(11px 10px)');
  });

  it('splits consecutive arguments', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(from def(a b c) calc(120 * x) b c)'), 'abc(from def(a b c) calc(120 * x) b c)');
  });

  it('handles space-separated arguments', () => {
    const abc = (...args) => {
      return `abc(${args.join(', ')})`;
    }
    const e = getEval({ abc });

    assert.strictEqual(e('abc(10 0 0)'), 'abc(10 0 0)');
  });

  it('handles space-separated arguments woth variables', () => {
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

  xit('evaluates dynamic expression with core color function', () => {
    assert.strictEqual(evaluate(
      'hsla(var(--primary-h) var(--primary-s) calc(var(--primary-l) / 2))', {
        '--primary-h': '260',
        '--primary-s': '40%',
        '--primary-l': '80%',
      }
    ), 'hsla(260 40% 40%)');
  });

  xit ('evaiuates nested expression', () => {
    const rgb = 'rgba(127.5, 0, 127.5, 1)';
    const nrgb = `rgba(red(${rgb}), green(${rgb}), blue(${rgb}), alpha(${rgb}))`;

    const br = `colorBrightness(${nrgb})`;
    const result = evaluate(br);

    assert.strictEqual(result, 0.2065);
  });

  xit ('splits and joins concatenated arguments', () => {
    const input = 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)';
    const result = evaluate(input);
    
    assert.strictEqual(result, 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)');
  });
});
