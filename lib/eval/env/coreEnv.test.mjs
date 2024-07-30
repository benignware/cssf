import assert from 'assert';
import evaluate from '../eval.mjs';
import { toPrecision } from '../../utils.mjs';

describe('env', () => {
  describe('mod', () => {
    it('should return the modulus of two numbers', () => {
      assert.equal(evaluate('mod(5, 2)'), 1);
    });

    it('should return the modulus of two numbers with units', () => {
      assert.equal(evaluate('mod(5px, 2px)'), '1px');
    });

    it('should return the modulus of two numbers with units', () => {
      assert.equal(evaluate('mod(5px, 2px)'), '1px');
    });

    it('should return the modulus of two numbers with units', () => {
      assert.equal(evaluate('mod(5px, 2px)'), '1px');
    });

    it('should return the modulus of two numbers with units', () => {
      assert.equal(evaluate('mod(5px, 2px)'), '1px');
    });
  });

  // describe('exp', () => {
  //   it('should return the exponent of a number', () => {
  //     assert.equal(evaluate('exp(1)'), Math.exp(1));
  //   });

  //   it('should return the exponent of a number with units', () => {
  //     assert.equal(evaluate('exp(1px)'), Math.exp(1));
  //   });
  // });

  // describe('log', () => {
  //   it('should return 0 when the input is 1', () => {
  //     assert.strictEqual(evaluate(`log(1)`), 0);
  //   });
  
  //   it('should return 1 when the input is e', () => {
  //     assert.strictEqual(evaluate(`log(e)`), 1);
  //   });
  
  //   it('should return 2 when the input is 7.389', () => {
  //     assert.strictEqual(toPrecision(evaluate(`log(7.389)`)), 2);
  //   });
  
  //   it('should handle dynamic input', () => {
  //     assert.strictEqual(toPrecision(evaluate(`log(var(--x)`, {
  //       '--x': 7.389
  //     })), 2);
  //   });
  
  //   it(`should return '200px' when the input is 7.389 and the result is multiplied by '100px'`, () => {
  //     assert.strictEqual(toPrecision(evaluate(`calc(100px * log(7.389))`)), '200px');
  //   });
  
  //   it('should return 1 when the input is 10 and the base is 10', () => {
  //     assert.strictEqual(evaluate(`calc(log(10, 10))`), 1);
  //   });
  
  //   it('should return 4 when the input is 16 and the base is 2', () => {
  //     assert.strictEqual(toPrecision(evaluate(`calc(log(16, 2))`)), 4);
  //   });
  
  //   it('should return ~2.3026 when the input is 10', () => {
  //     assert.strictEqual(toPrecision(evaluate(`calc(log(10))`)), toPrecision(2.3026));
  //   });
  // });

  // describe('rem', () => {
  //   it('should return the remainder of two numbers', () => {
  //     assert.equal(evaluate('rem(5, 2)'), 1);
  //   });

  //   it('should return the remainder of two numbers with units', () => {
  //     assert.equal(evaluate('rem(5px, 2px)'), '1px');
  //   });
    
  //   it(`should not return remainder if expression can't be resolved`, () => {
  //     assert.equal(evaluate('rem(var(--x), 2px)'), 'rem(var(--x), 2px)', {
  //       x: '1px',
  //     });
  //   });

  //   it('should not evaluate if variables cannot be resolved', () => {
  //     assert.equal(evaluate('rem(var(--x), 2px)'), 'rem(var(--x), 2px)');
  //   });

  //   // TODO: margin: rem(1000px, 29rem); /* 72px - if root font-size is 16px */
  // });

  // describe('round', () => {
  //   it('should return 1 when the input is 1', () => {
  //     assert.strictEqual(evaluate(`round(1.4)`), 1);
  //   });

  //   it('rounds value to nearest integer up', () => {
  //     assert.strictEqual(evaluate(`round(0.7)`), 1);
  //   });

  //   it('rounds to nearest integer down', () => {
  //     assert.strictEqual(evaluate(`round(1.2)`), 1);
  //   });

  //   it('should round up to nearest integer', () => {
  //     assert.strictEqual(evaluate(`round(up, 1.2)`), 2);
  //   });

  //   it('should round down to nearest integer', () => {
  //     assert.strictEqual(evaluate(`round(down, 1.2)`), 1);
  //   });
  // });

  // describe('sin', () => {
  //   it('should return 0 when the input is 0', () => {
  //     assert.strictEqual(evaluate(`sin(0)`), 0);
  //   });

  //   it('should return 1 when the input is π/2', () => {
  //     assert.strictEqual(evaluate(`sin(pi / 2)`), 1);
  //   });

  //   it('should return 0 when the input is π', () => {
  //     assert.strictEqual(evaluate(`sin(pi / 2)`), Math.sin(Math.PI / 2));
  //   });

  //   it('should return -1 when the input is 3π/2', () => {
  //     assert.strictEqual(evaluate(`sin(3 * pi / 2)`), -1);
  //   });

  //   it('should return sine for dynamic input', () => {
  //     assert.strictEqual(evaluate(`sin(var(--x)`, {
  //       '--x': Math.PI / 2
  //     }), 1);
  //   });

  //   it('should return sine for angle', () => {
  //     assert.strictEqual(evaluate(`sin(90deg)`), 1);
  //   });

  //   it('should return sine for dynamic input with angle', () => {
  //     assert.strictEqual(evaluate(`sin(var(--x)`, {
  //       '--x': '90deg'
  //     }), 1);
  //   });
  // });

  // describe('sign', () => {
  //   it('returns 1 if value is positive', () => {
  //     assert.strictEqual(evaluate(`sign(2.99999)`), 1);
  //   });
  
  //   it('returns -1 if value is negative', () => {
  //     assert.strictEqual(evaluate(`sign(-2.99999)`), -1);
  //   });
  
  //   it('returns 0 if value is positive zero', () => {
  //     assert.strictEqual(evaluate(`sign(0)`), 0);
  //   });
  
  //   it('returns -0 if value is negative zero', () => {
  //     assert.strictEqual(evaluate(`sign(-0)`), -0);
  //   });

  //   it('returns correct sign for number with unit', () => {
  //     assert.strictEqual(evaluate(`sign(var(--x))`, {
  //       '--x': '2.99999px'
  //     }), 1);
  //   });

  //   it('returns correct sign for dynamic input', () => {
  //     assert.strictEqual(evaluate(`sign(var(--x))`, {
  //       '--x': 2.99999
  //     }), 1);
  //   });

  //   it('returns correct sign for dynamic input if negative zero', () => {
  //     assert.strictEqual(evaluate(`sign(var(--x))`, {
  //       '--x': -0
  //     }), -0);
  //   });
  // });

  // describe('sqrt', () => {
  //   it('should return the square root of a number', () => {
  //     assert.equal(evaluate('sqrt(4)'), 2);
  //   });

  //   it('should return the square root of a number with units', () => {
  //     assert.equal(evaluate('sqrt(4px)'), 2);
  //   });

  //   it('should return the square root of a dynamic number', () => {
  //     assert.equal(evaluate('sqrt(var(--x))', {
  //       '--x': 4
  //     }), 2);
  //   });
  // });
});

