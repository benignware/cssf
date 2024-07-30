import * as chai from 'chai';

// Helper function to compare arrays with a tolerance
// chai.use(function (_chai, utils) {
//   utils.addMethod(chai.Assertion.prototype, 'deepCloseTo', function (expected, tolerance) {
//       const actual = this._obj;
//       new chai.Assertion(actual).to.be.an('array').that.has.lengthOf(expected.length);
//       for (let i = 0; i < expected.length; i++) {
//           new chai.Assertion(actual[i]).to.be.closeTo(expected[i], tolerance);
//       }
//   });
// });

// Improved function to handle floating-point precision issues for deep comparison
function deepCloseTo(actual, expected, tolerance = 0.05) {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      throw new Error('Arrays are of different lengths');
    }
    for (let i = 0; i < actual.length; i++) {
      chai.expect(actual[i]).to.be.closeTo(expected[i], getTolerance(tolerance, i));
    }
  } else if (typeof actual === 'object' && typeof expected === 'object') {
    for (const key in expected) {
      if (expected.hasOwnProperty(key)) {
        chai.expect(actual[key]).to.be.closeTo(expected[key], getTolerance(tolerance, key));
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

// Extend Chai with the custom assertion
chai.use(function (chai, utils) {
  chai.Assertion.addMethod('deepCloseTo', function (expected, tolerance) {
    const actual = this._obj;
    deepCloseTo(actual, expected, tolerance);
  });
});

// Export Chai's expect for global use in tests
global.expect = chai.expect;

// You can add more setup or helper functions here as needed
