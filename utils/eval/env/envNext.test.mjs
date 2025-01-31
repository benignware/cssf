import { expect } from 'chai';
import { getEval, ENV_NEXT } from '../getEval.mjs';

const e = getEval({}, ENV_NEXT);

describe('System Next', () => {
  describe('abs', () => {
    it('should return the absolute value of a positive number', () => {
      expect(e('abs(5)')).to.equal(5);
    });

    return;

    it('should return the absolute value of a negative number', () => {
      expect(e('abs(-5)')).to.equal(5);
    });

    it('should return zero for an input of zero', () => {
      expect(e('abs(0)')).to.equal(0);
    });

    it('should handle the absolute value of a number with units', () => {
      expect(e('abs(-5px)')).to.equal('5px');
    });

    it('should handle the absolute value of zero with units', () => {
      expect(e('abs(0px)')).to.equal('0px');
    });

    xit('should handle non-numeric values gracefully', () => {
      expect(e('abs("string")')).to.be.NaN; // Adjust based on your implementation of handling non-numeric values
    });
  });

  return;

  describe('sign', () => {
    it('should return 1 for a positive number', () => {
      expect(e('sign(5)')).to.equal(1);
    });

    it('should return -1 for a negative number', () => {
      expect(e('sign(-5)')).to.equal(-1);
    });

    it('should return 0 for an input of zero', () => {
      expect(e('sign(0)')).to.equal(0);
    });

    it('should handle sign of a number with units', () => {
      expect(e('sign(-5px)')).to.equal(-1);
    });

    it('should handle sign of zero with units', () => {
      expect(e('sign(0px)')).to.equal(0);
    });

    xit('should handle non-numeric values gracefully', () => {
      expect(e('sign("string")')).to.be.NaN; // Adjust based on your implementation of handling non-numeric values
    });
  });
});
