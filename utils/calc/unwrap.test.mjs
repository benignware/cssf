import { expect } from 'chai';

import { unwrap, wrap } from './unwrap.mjs';

describe('unwrap', function() {
  it('should return a number if the input is a number', function() {
    expect(unwrap(1)).to.equal(1);
  });

  it('should return a number if the input is a number string', function() {
    expect(unwrap('1.234')).to.equal(1.234);
  });

  it('should return a string if the input is a number string with unit', function() {
    expect(unwrap('180deg')).to.equal('180deg');
  });

  it('should return a number if the input is a number string with parentheses and whitespace', function() {
    expect(unwrap('( 1 )')).to.equal(1);
  });

  it('should strip calc if the input resolves to a numeric value', function() {
    expect(unwrap('calc(10px)')).to.equal('10px');
  });

  it('should strip calc but leave parentheses if the input is an expression', function() {
    expect(unwrap('calc(10px * 0.5)')).to.equal('(10px * 0.5)');
  });
});


describe('unwrap', function() {
  it('should return a number if the input is a number', function() {
    expect(unwrap(1)).to.equal(1);
  });

  it('should return a number if the input is a number string', function() {
    expect(unwrap('1.234')).to.equal(1.234);
  });

  it('should return a string if the input is a number string with unit', function() {
    expect(unwrap('180deg')).to.equal('180deg');
  });

  it('should return a number if the input is a number string with parentheses and whitespace', function() {
    expect(unwrap('( 1 )')).to.equal(1);
  });

  it('should strip calc if the input resolves to a numeric value', function() {
    expect(unwrap('calc(10px)')).to.equal('10px');
  });

  it('should strip calc but leave parentheses if the input is an expression', function() {
    expect(unwrap('calc(10px * 0.5)')).to.equal('(10px * 0.5)');
  });
});
