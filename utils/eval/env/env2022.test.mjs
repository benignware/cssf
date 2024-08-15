import { expect } from 'chai';
import { getEval } from '../getEval.mjs';

const e = getEval();


describe('System Baseline 2022', () => {
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
});