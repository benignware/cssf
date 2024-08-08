import * as chai from 'chai';

// Helper function to compare arrays or objects with a tolerance
function deepCloseToImpl(actual, expected, tolerance) {
  // console.log('* TEST: ', actual, 'expected:', expected, 'tolerance: ', tolerance);
  const logs = [];

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      throw new Error('Arrays have different lengths');
    }
    actual.forEach((item, index) => {
      const log = `\t* Index ${index}: ${item} vs ${expected[index]} - Delta: ${Math.abs(item - expected[index])} - Tolerance: ${getTolerance(tolerance, index)} - Pass: ${Math.abs(item - expected[index]) <= getTolerance(tolerance, index)}`;

      logs.push(log);
      try {
        chai.expect(item).to.be.closeTo(expected[index], getTolerance(tolerance, index));
      } catch (error) {
        console.log(logs.join('\n'));
        throw error;
      }
      
    });
  } else if (typeof actual === 'object' && typeof expected === 'object') {
    Object.keys(expected).forEach((key) => {
      chai.expect(actual[key]).to.be.closeTo(expected[key], getTolerance(tolerance, key));
    });
  } else {
    throw new Error('Unsupported types for comparison');
  }
}

function getTolerance(tolerance, keyOrIndex) {
  if (Array.isArray(tolerance)) {
    return tolerance[keyOrIndex] ?? 0.01; // Default tolerance for arrays
  } else if (typeof tolerance === 'object') {
    return tolerance[keyOrIndex] ?? 0.01; // Default tolerance for objects
  } else {
    return tolerance; // Single tolerance for all comparisons
  }
}

export const deepCloseTo= function (chai, utils) {
  chai.Assertion.addMethod('deepCloseTo', function (expected, tolerance) {
    deepCloseToImpl(this._obj, expected, tolerance);
  });
}