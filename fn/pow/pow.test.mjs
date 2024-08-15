import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { pow } from './pow.mjs';

const e = getEval();

describe('pow', () => {
  it('returns the value of a base raised to the power of a number.', () => {
    expect(e(`calc(${pow(2, 2)})`)).to.equal(4);
  });

  it('returns the value of a base with unit raised to the power of a number.', () => {
    expect(e(`calc(${pow('2px', 2)})`)).to.equal('4px');
  });

  it('returns the value of a base raised to the power of a number dynamically', () => {
    const base = 2;
    const exponent = 2;
    const result = pow(`var(--base)`, 2);

    expect(e(`calc(${result})`, {
      '--base': base,
    })).to.equal(4);
  });

  it('returns the value of a decimal base raised to the power of a number.', () => {
    expect(e(`calc(${pow(0.46576, 2)})`)).to.equal(Math.pow(0.46576, 2));
  });

  it('returns the value of a decimal base raised to the power of a number dynamically', () => {
    const base = 0.46576;
    const exponent = 2;
    const result = pow(`var(--base)`, 2);

    expect(e(`calc(${result})`, {
      '--base': base,
    })).to.equal(Math.pow(base, exponent));
  });

  it('returns the base to a fractional exponent power', () => {
    const base = 0.46576;
    const exponent = 2.4;
    const result = pow(base, exponent);

    expect(e(result)).to.be.closeTo(Math.pow(base, exponent), 0.01);
  });

  it('returns the square root of a number', () => {
    const base = 49;
    const exponent = 0.5;
    const result = pow(base, exponent);

    expect(e(result)).to.be.closeTo(Math.pow(base, exponent), 0.01);
  });

  it('returns 1 when raising any number to the power of 0', () => {
    expect(e(`calc(${pow(5, 0)})`)).to.equal(1);
    expect(e(`calc(${pow(0, 0)})`)).to.equal(1); // Edge case: 0^0 is often considered 1 in many contexts
    expect(e(`calc(${pow(-5, 0)})`)).to.equal(1);
  });

  it('returns 0 when raising 0 to a positive power', () => {
    expect(e(`calc(${pow(0, 5)})`)).to.equal(0);
  });

  xit('handles negative exponents correctly', () => {
    expect(e(`calc(${pow(2, -2)})`)).to.be.closeTo(Math.pow(2, -2), 0.01);
    expect(e(`calc(${pow(10, -1)})`)).to.be.closeTo(Math.pow(10, -1), 0.01);
  });

  it('handles negative bases with integer exponents correctly', () => {
    expect(e(`calc(${pow(-2, 3)})`)).to.equal(-8); // -2^3 = -8
    expect(e(`calc(${pow(-3, 4)})`)).to.equal(81); // -3^4 = 81
  });

  xit('handles negative bases with fractional exponents correctly', () => {
    expect(e(`calc(${pow(-8, 1/3)})`)).to.be.closeTo(Math.pow(-8, 1/3), 0.01); // Cube root of -8
  });

  xit('returns NaN for invalid inputs', () => {
    expect(e(`calc(${pow('abc', 2)})`)).to.be.NaN;
    expect(e(`calc(${pow(2, 'abc')})`)).to.be.NaN;
    expect(e(`calc(${pow('abc', 'xyz')})`)).to.be.NaN;
  });

  it('handles large exponents correctly', () => {
    expect(e(`calc(${pow(2, 20)})`)).to.equal(Math.pow(2, 20));
    expect(e(`calc(${pow(10, 10)})`)).to.equal(Math.pow(10, 10));
  });

  it('handles very small exponents correctly', () => {
    expect(e(`calc(${pow(2, 0.01)})`)).to.be.closeTo(Math.pow(2, 0.01), 0.075);
    expect(e(`calc(${pow(10, 0.1)})`)).to.be.closeTo(Math.pow(10, 0.1), 0.075);
  });

  xit('handles bases of zero correctly with negative exponents', () => {
    expect(e(`calc(${pow(0, -1)})`)).to.be.Infinite; // 0^-1 is essentially infinite
    expect(e(`calc(${pow(0, -2)})`)).to.be.Infinite; // 0^-2 is also essentially infinite
  });

  xit('returns the base to a fractional exponent power dynamically', () => {
    const base = 0.46576;
    const exponent = 2.4;
    const result = pow(`var(--base)`, 2.4);

    expect(e(`calc(${result})`, {
      '--base': base,
    })).to.equal(Math.pow(base, exponent));
  });

  xit('returns the base as a term to an integer exponent power dynamically', () => {
    expect(e(`calc(${pow(`5 + var(--base)`, 2)})`, {
      '--base': 0.46576,
    })).to.equal(Math.pow(0.46576 + 5, 2));
  });

  xit('returns the base as a term to a fractional exponent power dynamically', () => {
    expect(e(`calc(${pow(`5 + var(--base)`, 2.4)})`, {
      '--base': 0.46576,
    })).to.equal(Math.pow(0.46576 + 5, 2.4));
  });
});

