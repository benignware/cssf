import { expect } from "chai";
import { toNumeric } from './toNumeric.mjs';

describe('Unit Conversion Tests', () => {
  describe('toNumeric', () => {
    it('should convert percentage to decimal', () => {
      expect(toNumeric('50%')).to.equal(0.5);
    });

    it('should convert degrees to numeric', () => {
      expect(toNumeric('30deg')).to.equal(30);
    });

    it('should convert turns to degrees', () => {
      expect(toNumeric('1turn')).to.equal(360);
    });

    it('should return numeric value if no unit present', () => {
      expect(toNumeric(10)).to.equal(10);
      expect(toNumeric('10')).to.equal(10);
    });

    it('should return calc expression as is', () => {
      expect(toNumeric('calc(50% + 10deg)')).to.equal('calc(50% + 10deg)');
    });
  });
});
