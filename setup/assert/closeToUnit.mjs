import { expect } from "chai";

export function closeToUnit (_chai, utils) {
  const Assertion = _chai.Assertion;

  Assertion.addMethod('closeToUnit', function (expectedValue, precision) {
    const obj = this._obj;

    // Parse the object if it's a numerical string with units
    const parseValue = (str) => {
      const match = str.match(/^([+-]?\d*\.?\d+)([a-zA-Z%]*)$/);
      if (match) {
        return { value: parseFloat(match[1]), unit: match[2] };
      } else {
        throw new Error('Value must be a numerical string with units or a number');
      }
    };

    let objValue, objUnit;

    if (typeof obj === 'string') {
      const parsed = parseValue(obj);
      objValue = parsed.value;
      objUnit = parsed.unit;
    } else if (typeof obj === 'number') {
      objValue = obj;
      objUnit = '';
    } else {
      throw new Error('Value must be a numerical string with units or a number');
    }

    const { value: expectedValueNum, unit: expectedUnit } = parseValue(expectedValue);

    // Check the unit
    new Assertion(objUnit, 'Expected unit to be ' + expectedUnit).to.equal(expectedUnit);

    // Check the numeric closeness
    const delta = Math.abs(objValue - expectedValueNum);
    const tolerance = Math.pow(10, -precision);
    new Assertion(delta <= tolerance, `Expected value to be within ${tolerance} of ${expectedValueNum}`).to.be.true;
  });
}