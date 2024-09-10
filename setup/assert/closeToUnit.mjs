import { expect } from "chai";

const PRECISION = 0.1;

// Conversion constants
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;
const TURN_TO_DEG = 360;
const DEG_TO_TURN = 1 / 360;

// Convert value to degrees from any angle unit
const convertToDegrees = (value, unit) => {
  switch (unit) {
    case 'rad':
      return value * RAD_TO_DEG;
    case 'turn':
      return value * TURN_TO_DEG;
    case 'deg':
      return value;
    case '%':
      return value * 360; // Assuming % is used for degrees directly
    default:
      throw new Error(`Unsupported unit for conversion to degrees: ${unit}`);
  }
};

// Convert value to radians from any angle unit
const convertToRadians = (value, unit) => {
  switch (unit) {
    case 'deg':
      return value * DEG_TO_RAD;
    case 'turn':
      return value * 2 * Math.PI;
    case 'rad':
      return value;
    default:
      throw new Error(`Unsupported unit for conversion to radians: ${unit}`);
  }
};

// Convert value to a fraction from a percentage
const convertToFraction = (value) => value / 100;

// Convert value to a percentage from a fraction
const convertToPercent = (value) => value * 100;

// Normalize angles to a range [0, 360) for degrees
const normalizeDegrees = (value) => ((value % 360) + 360) % 360;

// Normalize angles to a range [0, 2π) for radians
const normalizeRadians = (value) => ((value % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

// Function to parse values and units from a complex string
// Function to parse values and units from a complex string
// Function to parse numeric values and units from a string
const parseValues = (str) => {
  const results = [];
  
  // Regex to match numeric values with optional units
  const regex = /(?:^|\s|\b)([\d.]+(?:e[-+]?\d+)?)([a-zA-Z%]*)/g;
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    // Ensure valid capture of numeric values and optional units
    const value = parseFloat(match[1]);
    const unit = match[2] || '';
    
    // Add only if we have a numeric value (ignore empty matches)
    if (!isNaN(value)) {
      results.push({ value, unit });
    }
  }
  
  return results;
};




export function closeToUnit(_chai, utils) {
  const Assertion = _chai.Assertion;

  Assertion.addMethod('closeToUnit', function (expectedStr, precision = PRECISION) {
    const obj = this._obj;

    // Parse the actual and expected values
    const objValues = parseValues(obj);
    const expectedValues = parseValues(expectedStr);

    // console.log('objValues: ', obj, objValues);
    // console.log('expectedValues: ', expectedStr, expectedValues);

    // Ensure the number of values matches
    if (objValues.length !== expectedValues.length) {
      throw new Error(`Number of values in the actual and expected strings must match`);
    }

    // Handle precision: single value or array
    const precisionArray = Array.isArray(precision) ? precision : Array(objValues.length).fill(precision);

    if (precisionArray.length !== objValues.length) {
      throw new Error('The number of precision values must match the number of values');
    }

    // Helper function to check unit and value closeness
    const checkValue = (actual, expected, precision) => {
      // console.log('CHECK VALUE: ', actual, expected, precision);
      let actualValue = actual.value;
      let actualUnit = actual.unit || 'rad'; // Default to radians if no unit is given

      let expectedValue = expected.value;
      let expectedUnit = expected.unit || actualUnit; // Use actual unit if expected unit is not provided

      // Convert actual value to the expected unit for comparison
      if (expectedUnit === 'deg') {
        actualValue = convertToDegrees(actualValue, actualUnit);
        actualUnit = 'deg';
      } else if (expectedUnit === 'rad') {
        actualValue = convertToRadians(actualValue, actualUnit);
        actualUnit = 'rad';
      } else if (expectedUnit === 'turn') {
        actualValue = convertToDegrees(actualValue, actualUnit);
        actualUnit = 'deg';
      } else if (expectedUnit === '%') {
        actualValue = convertToFraction(actualValue);
        actualUnit = '%';
      } else if (actualUnit !== expectedUnit) {
        throw new Error(`Unsupported or mismatched unit. Expected unit: ${expectedUnit}, Actual unit: ${actualUnit}`);
      }

      // Convert expected value to the actual unit for comparison
      if (expectedUnit === '%') {
        expectedValue = convertToFraction(expectedValue);
      } else if (expectedUnit === 'deg') {
        expectedValue = convertToDegrees(expectedValue, 'deg');
      } else if (expectedUnit === 'rad') {
        expectedValue = convertToRadians(expectedValue, 'rad');
      } else if (expectedUnit === 'turn') {
        expectedValue = expectedValue * TURN_TO_DEG;
      }

      // Normalize values for comparison
      if (actualUnit === 'deg') {
        actualValue = normalizeDegrees(actualValue);
        expectedValue = normalizeDegrees(expectedValue);
      } else if (actualUnit === 'rad') {
        actualValue = normalizeRadians(actualValue);
        expectedValue = normalizeRadians(expectedValue);
      }

      // console.log('actual: ', actualValue, actualUnit, 'expected: ', expectedValue, expectedUnit);

      // Check the numeric closeness
      if (typeof precision !== 'number' || precision <= 0) {
        throw new Error('Precision must be a positive number');
      }

      const tolerance = precision > 1 ? precision : Math.pow(10, -precision); // Precision determines the tolerance
      const delta = Math.abs(actualValue - expectedValue);

      // Adjust for periodicity if necessary
      const adjustedDelta = Math.min(delta, Math.abs((2 * Math.PI) - delta));

      // Check if the actual value is within the tolerance range of the expected value
      // console.log('actualValue: ', actualValue, 'expectedValue: ', expectedValue, 'tolerance: ', tolerance);
      new Assertion(adjustedDelta <= tolerance, `Expected value to be within ${tolerance} of ${expectedValue}, but got ${actualValue}`).to.be.true;
    };

    // Iterate over values and check each one
    for (let i = 0; i < objValues.length; i++) {
      checkValue(objValues[i], expectedValues[i], precisionArray[i]);
    }
  });
}
