import { expect } from 'chai';
import { getEval } from './getEval.mjs';

const e = getEval();

describe('env', () => {
  describe('mod', () => {
    it('should return the modulus of two numbers', () => {
      expect(e('mod(5, 2)')).to.equal(1);
    });

    it('should return the modulus of two numbers with units', () => {
      expect(e('mod(5px, 2px)')).to.equal('1px');
    });

    it('should handle modulus with zero as divisor gracefully', () => {
      expect(e('mod(5, 0)')).to.equal('NaN'); // Ensure it handles zero divisor gracefully
    });

    xit('should handle modulus with zero and units gracefully', () => {
      expect(e('mod(5px, 0px)')).to.equal('NaN'); // Ensure it handles zero divisor gracefully
    });
  });

  describe('exp', () => {
    it('should return the exponent of a number', () => {
      expect(e('exp(1)')).to.be.closeTo(Math.exp(1), 0.10);
    });

    it('should return the exponent of a number with units', () => {
      expect(e('exp(1px)')).to.be.closeTo(Math.exp(1), 0.1);
    });

    it('should handle zero as input', () => {
      expect(e('exp(0)')).to.equal(1);
    });

    it('should handle negative input', () => {
      expect(e('exp(-1)')).to.be.closeTo(Math.exp(-1), 0.10);
    });
  });

  describe('log', () => {
    it('should return 0 when the input is 1', () => {
      expect(e('log(1)')).to.equal(0);
    });

    it('should return 1 when the input is e', () => {
      expect(e('log(e)')).to.equal(1);
    });

    it('should return 2 when the input is 7.389', () => {
      expect(e('log(7.389)')).to.be.closeTo(2, 0.1);
    });

    it('should handle dynamic input', () => {
      expect(e('log(var(--x))', {
        '--x': 7.389
      })).to.be.closeTo(2, 0.1);
    });

    it('should return "200px" when the input is 7.389 and the result is multiplied by "100px"', () => {
      expect(e('calc(100px * log(7.389))')).to.be.closeToUnit('200px', 0.1);
    });

    it('should return 1 when the input is 10 and the base is 10', () => {
      expect(e('calc(log(10, 10))')).to.equal(1);
    });

    it('should return 4 when the input is 16 and the base is 2', () => {
      expect(e('calc(log(16, 2))')).to.be.closeTo(4, 0.1);
    });

    it('should return ~2.3026 when the input is 10', () => {
      expect(e('calc(log(10))')).to.be.closeTo(2.3026, 0.1);
    });

    it('should return NaN for base 1', () => {
      expect(e('log(10, 1)')).to.equal('NaN');
    });

    it('should return NaN for negative numbers', () => {
      expect(e('log(-10)')).to.equal('NaN');
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
      expect(e('rem(5, 0)')).to.equal('NaN');
    });

    xit('should handle zero as divisor with units gracefully', () => {
      expect(e('rem(5px, 0px)')).to.equal('NaN');
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

  describe('sqrt', () => {
    it('should return 2 for input 4', () => {
      expect(e('sqrt(4)')).to.equal(2);
    });

    it('should return NaN for negative input', () => {
      expect(e('sqrt(-4)')).to.be.NaN;
    });

    it('should return 0 for input 0', () => {
      expect(e('sqrt(0)')).to.equal(0);
    });

    it('should handle dynamic input', () => {
      expect(e('sqrt(var(--x))', {
        '--x': 16
      })).to.equal(4);
    });
  });

  describe('clamp', () => {
    it('should return 5 when clamped between 1 and 10', () => {
      expect(e('clamp(1, 5, 10)')).to.equal(5);
    });

    it('should return 1 when clamped between 1 and 10 but input is lower', () => {
      expect(e('clamp(1, 0, 10)')).to.equal(1);
    });

    it('should return 10 when clamped between 1 and 10 but input is higher', () => {
      expect(e('clamp(1, 15, 10)')).to.equal(10);
    });

    it('should handle dynamic input', () => {
      expect(e('clamp(var(--min), var(--value), var(--max))', {
        '--min': 1,
        '--value': 5,
        '--max': 10
      })).to.equal(5);
    });

    it('should handle units', () => {
      expect(e('clamp(1px, 5px, 10px)')).to.equal('5px');
    });

    it('should handle units with dynamic input', () => {
      expect(e('clamp(var(--min), var(--value), var(--max))', {
        '--min': '1px',
        '--value': '5px',
        '--max': '10px'
      })).to.equal('5px');
    });
  });

  describe('constants', () => {
    it('should return the value of pi', () => {
      expect(e('pi')).to.be.closeTo(Math.PI, 0.00001);
    });

    it('should return NaN', () => {
      expect(e('NaN')).to.be.NaN;
    });

    it('should return Infinity', () => {
      expect(e('infinity')).to.equal(Infinity);
    });

    it('should return the value of e', () => {
      expect(e('e')).to.be.closeTo(Math.E, 0.00001);
    });
  });
});
