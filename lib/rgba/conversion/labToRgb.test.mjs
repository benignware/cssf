// lchToLab.test.mjs

import { strict as assert } from 'assert';
import { lchToLab } from './lchToLab.mjs';
import { toPrecision } from '../../utils.mjs'; // Utility for precision handling

describe('lchToLab', () => {
  describe('Conversion of LCH to LAB', () => {
    it('should convert LCH (0.5, 0.5, 0.3333) to LAB (0.5, 0.2410, 0.3171)', () => {
      const result = lchToLab(0.5, 0.5, 0.3333);
      assert.deepStrictEqual(toPrecision(result, 4), toPrecision({ l: 0.5, a: 0.2410, b: 0.3171 }, 4));
    });

    it('should convert LCH (0.7, 0.2, 0.6667) to LAB (0.7, 0.0464, 0.0524)', () => {
      const result = lchToLab(0.7, 0.2, 0.6667);
      assert.deepStrictEqual(toPrecision(result, 4), toPrecision({ l: 0.7, a: 0.0464, b: 0.0524 }, 4));
    });

    it('should convert LCH (0.4, 0.1, 0.1250) to LAB (0.4, 0.0273, 0.0133)', () => {
      const result = lchToLab(0.4, 0.1, 0.1250);
      assert.deepStrictEqual(toPrecision(result, 4), toPrecision({ l: 0.4, a: 0.0273, b: 0.0133 }, 4));
    });

    it('should convert LCH (0.9, 1, 0.2500) to LAB (0.9, 0.0000, 0.9245)', () => {
      const result = lchToLab(0.9, 1, 0.2500);
      assert.deepStrictEqual(toPrecision(result, 4), toPrecision({ l: 0.9, a: 0.0000, b: 0.9245 }, 4));
    });
  });
});
