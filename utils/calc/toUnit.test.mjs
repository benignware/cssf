import { expect } from "chai";
import { toUnit } from './toUnit.mjs';


describe('toUnit', () => {
  it('should convert decimal to percentage', () => {
    expect(toUnit(0.5, '%')).to.equal('50%');
  });

  it('should convert numeric to degrees', () => {
    expect(toUnit(30, 'deg')).to.equal('30deg');
  });

  it('should convert numeric to turns', () => {
    expect(toUnit(360, 'turn')).to.equal('1turn');
  });

  it('should return value with same unit if no conversion needed', () => {
    expect(toUnit('10deg', 'deg')).to.equal('10deg');
    expect(toUnit('20%', '%')).to.equal('20%');
  });

  xit('should return calc expression as is', () => {
    expect(toUnit('calc(50% + 10deg)', 'deg')).to.equal('calc(50% + 10deg)');
  });
});