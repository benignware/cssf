import assert from 'assert';
import evaluate from './eval.mjs';
import { colorBrightness } from '../index.mjs';

describe('eval', () => {
  it('evaluates numerical expression', () => {
    const result = evaluate('12');

    assert.strictEqual(result, 12);
  });

  it('evaluates unit expression', () => {
    const result = evaluate('10px');

    assert.strictEqual(result, '10px');
  });

  it('evaluates addition', () => {
    const a = '30.123456789px';
    const b = '10.123456789px';
    const result = evaluate(`${a} + ${b}`);

    assert.strictEqual(result, `${parseFloat(a) + parseFloat(b)}px`);
  });

  it('evaluates subtraction', () => {
    const a = '30.123456789px';
    const b = '10.123456789px';
    const result = evaluate(`${a} - ${b}`);

    assert.strictEqual(result, `${parseFloat(a) - parseFloat(b)}px`);
  });

  it('evaluates multiplication', () => {
    const a = '30.123456789px';
    const b = '10.123456789px';
    const result = evaluate(`${a} * ${b}`);

    assert.strictEqual(result, `${parseFloat(a) * parseFloat(b)}px`);
  });

  it('evaluates division', () => {
    const a = '30.123456789px';
    const b = '10.123456789px';
    const result = evaluate(`${a} / ${b}`);

    assert.strictEqual(result, `${parseFloat(a) / parseFloat(b)}px`);
  });

  it(`evaluates expression containing 'min'`, () => {
    assert.strictEqual(evaluate('min(10 + 50 * 2, 20)'), 20);
  });

  it(`evaluates expression containing 'max'`, () => {
    assert.strictEqual(evaluate('max(10 + 50 * 2, 20)'), 110);
  });

  it('evaluates arithmetic expression', () => {
    const expression =
      '0.5 / 10 * 4.9406564584124654e-323 / 4.9406564584124654e-323';

    assert.strictEqual(evaluate(expression), eval(expression));
  });

  it('evaluates calc expression', () => {
    const result = evaluate(
      'calc(((((0 / 1e-14) / 10) * 5e-323) / 5e-323) * 10)'
    );

    assert.strictEqual(result, 0);
  });

  it('evaluates dynamic expression', () => {
    const result = evaluate(
      'calc((var(--a) + var(--b)) * var(--c))',
      {
        '--a': 1,
        '--b': 2,
        '--c': 3,
      }
    );

    assert.strictEqual(result, 9);
  });


  it('evaluates contants', () => {
    const input = 'calc(pi * 2)';
    const result = evaluate(input);
    const expected = Math.PI * 2;

    assert.strictEqual(result, expected);
  });

  it(`correctly resolves infinity constant`, () => {
    const input = 'infinity';
    const result = evaluate(input);

    assert.strictEqual(result, Infinity);
  });

  it(`correctly resolves negative infinity constant`, () => {
    const input = '-infinity';
    const result = evaluate(input);

    assert.strictEqual(result, -Infinity);
  });

  it(`resolves to negative zero when computing constants`, () => {
    const input = 'calc(1 / -infinity)';
    const result = evaluate(input);

    assert.strictEqual(result, -0);
  });

  it(`doesn't evaluate undefined functions`, () => {
    const input = 'xyz(0, 0, 0)';
    const result = evaluate(input);

    assert.strictEqual(result, input);
  });

  it('evaluates dynamic expression with core color function', () => {
    const result = evaluate(
      'hsla(var(--primary-h), var(--primary-s), calc(var(--primary-l) / 2))',
      {
        '--primary-h': '260',
        '--primary-s': '40%',
        '--primary-l': '80%',
      }
    );

    assert.strictEqual(result, 'hsla(260, 40%, 40%, 1)');
  });

  it ('evaiuates nested expression', () => {
    const rgb = 'rgba(127.5, 0, 127.5, 1)';
    // let rgb = 'rgba(calc(((0 - 255) * (1 - 0.5)) + 255), calc(((0 - 0) * (1 - 0.5)) + 0), calc(((255 - 255) * (1 - 0.5)) + 255), calc(((1 - 1) * (1 - 0.5)) + 1))';
    // const cm = `colorMix(in srgb, ${rgb} 50%, #00f 50%)`;
    const nrgb = `rgba(red(${rgb}), green(${rgb}), blue(${rgb}), alpha(${rgb}))`;

    const br = `colorBrightness(${nrgb})`;
    const result = evaluate(br);

    assert.strictEqual(result, 0.2065);
  });

  it ('splits and joins concatenated arguments', () => {
    const input = 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)';
    const result = evaluate(input);
    
    assert.strictEqual(result, 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)');
  });
});
