import { expect } from 'chai';
import { getEval, ENV_2024 } from '../getEval.mjs';

const e = getEval(ENV_2024);

describe('System Baseline 2024', () => {
  describe('mod', () => {
    it('should return the modulus of two numbers', () => {
      expect(e('mod(5, 2)')).to.equal(1);
    });

    it('should return the modulus of two numbers with units', () => {
      expect(e('mod(5px, 2px)')).to.equal('1px');
    });

    it('should handle modulus with zero as divisor gracefully', () => {
      expect(e('mod(5, 0)')).to.be.NaN; // Ensure it handles zero divisor gracefully
    });

    xit('should handle modulus with zero and units gracefully', () => {
      expect(e('mod(5px, 0px)')).to.be.NaN; // Ensure it handles zero divisor gracefully
    });
  });

  describe('rem', () => {
    it('should return the remainder of two numbers', () => {
      expect(e('rem(5, 2)')).to.equal(1);
    });

    it('should return the remainder of two numbers with units', () => {
      expect(e('rem(5px, 2px)')).to.equal('1px');
    });

    it('should handle dynamic input', () => {
      expect(e('rem(var(--x), 2px)', {
        '--x': '1px',
      })).to.equal('1px');
    });

    it('should handle zero as divisor gracefully', () => {
      expect(e('rem(5, 0)')).to.be.NaN;
    });

    xit('should handle zero as divisor with units gracefully', () => {
      expect(e('rem(5px, 0px)')).to.be.NaN;
    });
  });

  describe('round', () => {
    it('should return 1 when the input is 1.4', () => {
      expect(e('round(nearest, 1.4)')).to.equal(1);
    });
  
    it('should round value to nearest integer up', () => {
      expect(e('round(up, 0.7)')).to.equal(1);
    });
  
    it('should round to nearest integer down', () => {
      expect(e('round(down, 0.7)')).to.equal(0);
    });
  
    it('should round value to nearest integer with negative numbers', () => {
      expect(e('round(nearest, -1.4)')).to.equal(-1);
    });
  
    it('should round to nearest integer with a rounding interval', () => {
      expect(e('round(nearest, 1.4, 0.5)')).to.equal(1.5);
    });
  
    it('should handle default rounding interval gracefully', () => {
      expect(e('round(nearest, 1.4)')).to.equal(1);
    });
  
    xit('should handle invalid rounding interval gracefully', () => {
      expect(e('round(nearest, 1.4, "invalid")')).to.equal(1.4); // Assume invalid interval falls back to default
    });
  
    xit('should handle zero rounding interval gracefully', () => {
      expect(e('round(nearest, 1.4, 0)')).to.equal(1.4); // Uses small positive value for zero interval
    });
  });
});
