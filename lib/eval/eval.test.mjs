import assert from 'assert';
import evaluate from './eval.mjs';

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

  // it('evaluates modulus expression', () => {
  //   const expression = '(360 + 120) % 360';

  //   assert.strictEqual(evaluate(expression), eval(expression));
  // });

  it('evaluates calc expression', () => {
    const result = evaluate(
      'calc(((((0 / 1e-14) / 10) * 5e-323) / 5e-323) * 10)'
    );

    assert.strictEqual(result, 0);
  });

  it('evaluates dynamic expression', () => {
    const result = evaluate(
      'hsla(var(--primary-h), var(--primary-s), calc(var(--primary-l) / 2%))',
      {
        'primary-h': '260',
        'primary-s': '40%',
        'primary-l': '80%',
      }
    );

    assert.strictEqual(result, 'hsla(260, 40%, 40%)');
  });
});
