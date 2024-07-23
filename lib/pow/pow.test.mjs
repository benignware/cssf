import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import pow from './pow.mjs';
import { toPrecision } from '../utils.mjs';

describe('pow', () => {
  xit('returns the base to an integer exponent power', () => {
    const base = 0.46576;
    const exponent = 2;
    const result = pow(base, exponent);

    assert.strictEqual(evaluate(result), Math.pow(base, exponent));
  });

  it('returns the base to an integer exponent power dynamically', () => {
    const base = 0.46576;
    const exponent = 2;
    const result = pow(`var(--base)`, exponent);

    assert.strictEqual(evaluate(result, {
      '--base': base,
    }), Math.pow(base, exponent));
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

  it('returns the base to a fractional exponent power dynamically', () => {
    const base = 0.46576;
    const exponent = 2.4;
    const result = pow(`var(--base)`, exponent);

    assert.strictEqual(
      toPrecision(evaluate(result, {
        '--base': base,
      })),
      toPrecision(Math.pow(base, exponent))
    );
  });

  it('returns the base as a term to an integer exponent power dynamically', () => {
    const base = 0.46576;
    const exponent = 2;
    const result = pow(`5 + var(--base)`, exponent);

    assert.strictEqual(
      toPrecision(
        evaluate(result, {
          '--base': base,
        })
      ),
      toPrecision(Math.pow(base + 5, exponent))
    );
  });

  it('returns the base as a term to a fractional exponent power dynamically', () => {
    const base = 0.46576;
    const exponent = 2.4;
    const result = pow(`5 + var(--base)`, exponent);

    assert.strictEqual(
      toPrecision(
        evaluate(result, {
          '--base': base,
        })
      ),
      toPrecision(Math.pow(base + 5, exponent))
    );
  });
});

export {};
