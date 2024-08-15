import * as chai from 'chai';
import { closeToUnit } from './closeToUnit.mjs';

chai.use(closeToUnit);
const { expect } = chai;

describe('closeToUnit Assertion', function() {
  // it('should pass when values are close within precision in percent', function() {
  //   expect('44.567%').to.be.closeToUnit('45%');
  //   expect('45.123%').to.be.closeToUnit('45%'); // Should pass with default precision
  // });

  // it('should pass when values are close within precision in degrees', function() {
  //   expect('44.567deg').to.be.closeToUnit('45deg');
  //   expect('45.123deg').to.be.closeToUnit('45deg'); // Should pass with default precision
  // });

  // it('should infer the unit from the expected value if given as perentage', function() {
  //   expect(0.5).to.be.closeToUnit('50%'); // Should pass
  //   expect(0.499).to.be.closeToUnit('50%'); // Should pass
  // });

  // it('should infer the unit from the expected value if given as degrees', function() {
  //   expect(1).to.be.closeToUnit('57.2958deg'); // 1 radian ≈ 57.2958 degrees
  //   expect(1).to.be.closeToUnit('57deg'); // Should pass
  // });

  // it('should infer the unit from the actual value if given as percentage', function() {
  //   expect('50%').to.be.closeToUnit(0.5); // Should pass
  //   expect('49.999%').to.be.closeToUnit(0.5); // Should pass
  // });

  // it('should infer the unit from the actual value if given as degrees', function() {
  //   expect('57.2958deg').to.be.closeToUnit(1); // 1 radian ≈ 57.2958 degrees
  //   // expect('57deg').to.be.closeToUnit(1); // Should pass
  // });

  // it('should infer the unit from the actual value when expected value does not have a unit (percent to fraction)', function() {
  //   expect('50%').to.be.closeToUnit(0.5); // 50% is 0.5 as a fraction
  // });

  // it('should infer the unit from the actual value when expected value does not have a unit (degrees to radians)', function() {
  //   expect('57.2958deg').to.be.closeToUnit(1); // 1 radian ≈ 57.2958 degrees
  // });

  // it('should infer the unit from the actual value when expected value does not have a unit (radians to degrees)', function() {
  //   expect('57deg').to.be.closeToUnit(1); // 1 radian ≈ 57 degrees
  // });

  // it('should infer the unit from the actual value when expected value is a number with no unit (percentage to percentage)', function() {
  //   expect('50%').to.be.closeToUnit(50); // 50% should be close to 50% as it is
  // });

  // it('should handle cases where both actual and expected values are numbers but with different units', function() {
  //   expect('90deg').to.be.closeToUnit(1.5708); // 90 degrees ≈ 1.5708 radians
  //   expect('1rad').to.be.closeToUnit(57.2958); // 1 radian ≈ 57.2958 degrees
  // });

  // it('should handle multiple values with inferred units correctly', function() {
  //   expect('45deg 50% 99.999%').to.be.closeToUnit('45deg 50% 100%'); // Multiple values, same units for comparison
  // });

  // it('should correctly parse numeric values from a complex string', function() {
  //   expect('color(xyz-d65 0.950506 0.999965 1.0889)').to.be.closeToUnit('color(xyz-d65 0.9 0.9 1.1)');
  // });

  it('should correctly parse unit values from a complex string', function() {
    expect('color(xyz-d65 59.9876deg 79.987% 50.123%)').to.be.closeToUnit('color(xyz-d65 60deg 80% 50%)');
  });

  return;

  it('should pass when value is close within custon precision larger than 1 in percent', function() {
    expect('49.567%').to.be.closeToUnit('45%', 5);
  });

  it('should pass when multiple values are provided with custom precision', function() {
    expect('45.1deg 55% 99.999%').to.be.closeToUnit('45deg 50% 100%', [0.1, 10, 0.1]);
  });

  xit('should throw an error if unit inference cannot be determined', function() {
    expect(() => expect('45deg').to.be.closeToUnit('45')).to.throw(Error, /Unsupported or mismatched unit/);
    expect(() => expect('45%').to.be.closeToUnit(45)).to.throw(Error, /Unsupported or mismatched unit/);
  });

  xit('should throw an error if units or precision arrays do not match values', function() {
    expect(() => expect('45deg 0.5rad').to.be.closeToUnit('45deg', ['deg'], [0.1, 0.1])).to.throw(Error, /The number of units must match the number of values/);
    expect(() => expect('45deg 0.5rad').to.be.closeToUnit('45deg 0.5rad', null, [0.1])).to.throw(Error, /The number of precision values must match the number of values/);
  });

  xit('should throw an error for unsupported units', function() {
    expect(() => expect('45deg').to.be.closeToUnit('45xyz')).to.throw(Error, /Unsupported unit for conversion to degrees/);
  });

  xit('should throw an error for invalid precision', function() {
    expect(() => expect('45deg').to.be.closeToUnit('45deg', null, -1)).to.throw(Error, /Precision must be a non-negative number/);
    expect(() => expect('45deg').to.be.closeToUnit('45deg', null, 'invalid')).to.throw(Error, /Precision must be a number or an array of numbers/);
  });
});
