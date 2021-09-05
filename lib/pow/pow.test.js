const assert = require('assert');
const evaluate = require('../eval');
const pow = require('./pow');
const { toPrecision } = require('../utils');

describe('pow', () => {
  it('returns the base to an integer exponent power', () => {
    const base = 0.46576;
    const exponent = 2;
    const result = pow(base, exponent);

    assert.strictEqual(evaluate(result), Math.pow(base, exponent));
  });

  it('returns the base to an integer exponent power dynamically', () => {
    const base = 0.46576;
    const exponent = 2;
    const result = pow(`var(--base)`, exponent);

    assert.strictEqual(evaluate(result, { base }), Math.pow(base, exponent));
  });

  it('returns the base to a fractional exponent power', () => {
    const base = 0.46576;
    const exponent = 2.4;
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
      toPrecision(evaluate(result, { base })),
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
          base,
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
          base,
        })
      ),
      toPrecision(Math.pow(base + 5, exponent))
    );
  });
});
