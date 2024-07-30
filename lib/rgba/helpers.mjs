import { expect } from 'chai';

// Improved function to handle floating-point precision issues
export function approximateEqual(actual, expected, tolerance = 1) {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      throw new Error('Arrays are of different lengths');
    }
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).to.be.closeTo(expected[i], getTolerance(tolerance, i));
    }
  } else if (typeof actual === 'object' && typeof expected === 'object') {
    for (const key in expected) {
      if (expected.hasOwnProperty(key)) {
        expect(actual[key]).to.be.closeTo(expected[key], getTolerance(tolerance, key));
      }
    }
  } else {
    throw new Error('Unsupported types for comparison');
  }
}

function getTolerance(tolerance, indexOrKey) {
  if (Array.isArray(tolerance)) {
    return tolerance[indexOrKey] || 0.01;
  } else if (typeof tolerance === 'object') {
    return tolerance[indexOrKey] || 0.01;
  } else {
    return tolerance;
  }
}
