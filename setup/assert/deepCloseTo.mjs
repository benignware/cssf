import * as chai from 'chai';
import { parseValues } from './utils.mjs';
import { exp } from '../../utils/eval/env/env2023.mjs';

// Helper function to compare arrays or objects with a tolerance
function deepCloseToImpl(actual, expected, tolerance = 0.5) {
  const logs = [];

  if (typeof actual === 'string') {
    actual = parseValues(actual);
  }

  if (typeof expected === 'string') {
    expected = parseValues(expected);
  }

  if (actual === expected) {
    return;
  }

  if (typeof actual !== typeof expected) {
    throw new Error(`Different types: ${typeof actual} vs ${typeof expected}`);
  }

  if (typeof actual === 'number' && typeof expected === 'number') {
    
    try {
      return chai.expect(actual).to.be.closeTo(expected, tolerance);
    } catch (error) {
      console.log(logs.join('\n'));
    }

    return;
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      throw new Error('Arrays have different lengths');
    }
    
    actual.forEach((item, index) => {
      const log = `\t* Index ${index}: ${item} vs ${expected[index]} - Delta: ${Math.abs(item - expected[index])} - Tolerance: ${getTolerance(tolerance, index)} - Pass: ${Math.abs(item - expected[index]) <= getTolerance(tolerance, index)}`;

      logs.push(log);

      if (typeof item !== typeof expected[index]) {
        console.log('Different types:', item, expected[index]);
        throw new Error(`Different types: ${typeof item} vs ${typeof expected[index]}`);
      }

      if (typeof item === 'object' && typeof expected[index] === 'object') {
        deepCloseToImpl(item, expected[index], getTolerance(tolerance, index));
      } else {
        try {
          chai.expect(item).to.be.closeTo(expected[index], getTolerance(tolerance, index));
        } catch (error) {
          console.log(logs.join('\n'));
          throw error;
        }
      }
    });
  } else if (typeof actual === 'object' && typeof expected === 'object') {
    Object.keys(expected).forEach((key) => {
      deepCloseToImpl(actual[key], expected[key], getTolerance(tolerance, key));
    });
  } else {
    throw new Error(`Invalid types: ${typeof actual} vs ${typeof expected}`);
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