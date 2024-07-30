import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import pow from './pow.mjs';
import { toPrecision } from '../utils.mjs';

describe('pow', () => {
  it('returns the value of a base raised to the power of a number.', () => {
    assert.strictEqual(evaluate(`calc(${pow(2, 2)})`), 4);
  });

  it('returns the value of a base raised to the power of a number dynamically', () => {
    const base = 2;
    const exponent = 2;
    const result = pow(`var(--base)`, 2);

    assert.strictEqual(evaluate(`calc(${pow(`var(--base)`, 2)})`, {
      '--base': base,
    }), 4);
  });

  it('returns the value of a decimal base raised to the power of a number.', () => {
    assert.strictEqual(evaluate(`calc(${pow(0.46576, 2)})`), Math.pow(0.46576, 2));
  });

  it('returns the value of a decimal base raised to the power of a number dynamically', () => {
    assert.strictEqual(evaluate(`calc(${pow(`var(--base)`, 2)})`, {
      '--base': 0.46576,
    }), Math.pow(0.46576, 2));
  });

  it('returns the base to a fractional exponent power dynamically', () => {
    assert.strictEqual(
      toPrecision(evaluate(`calc(${pow(`var(--base)`, 2.4)})`, {
        '--base': 0.46576,
      })),
      toPrecision(Math.pow(0.46576, 2.4))
    );
  });

  it('returns the base as a term to an integer exponent power dynamically', () => {
    assert.strictEqual(
      toPrecision(
        evaluate(`calc(${pow(`5 + var(--base)`, 2)})`, {
          '--base': 0.46576,
        })
      ),
      toPrecision(Math.pow(0.46576 + 5, 2))
    );
  });

  it('returns the base as a term to a fractional exponent power dynamically', () => {
    assert.strictEqual(
      toPrecision(
        evaluate(`calc(${pow(`5 + var(--base)`, 2.4)})`, {
          '--base': 0.46576,
        })
      ),
      toPrecision(Math.pow(0.46576 + 5, 2.4))
    );
  });

  xit('returns the base to a fractional exponent power', () => {
    const base = 0.46576;
    const exponent = 2.4;
    const result = pow(base, exponent);

    assert.strictEqual(
      toPrecision(evaluate(result)),
      toPrecision(Math.pow(base, exponent))
    );
  });

  xit('returns the square root of a number', () => {
    const base = 49;
    const exponent = 0.5;
    const result = pow(base, exponent);

    assert.strictEqual(
      toPrecision(evaluate(result)),
      toPrecision(Math.pow(base, exponent))
    );
  });
});

