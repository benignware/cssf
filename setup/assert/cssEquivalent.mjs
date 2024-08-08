import * as chai from 'chai';
import * as csstree from 'css-tree';

// Add the custom assertion directly to Chai
export const cssEquivalent = (chai, utils) => {
  chai.Assertion.addMethod('cssEquivalent', function (expected, options = {}) {
    const parseOptions = {
      parseCustomProperty: true,
      ...options,
    };

    const generateOptions = {
      mode: 'safe',
      ...options,
    };

    const actual = this._obj;

    // Parse the CSS strings into ASTs using css-tree
    const actualAst = csstree.parse(actual, parseOptions);
    const expectedAst = csstree.parse(expected, parseOptions);

    // Stringify the ASTs to ensure they are equivalent
    const actualStringified = csstree.generate(actualAst, generateOptions).trim();
    const expectedStringified = csstree.generate(expectedAst, generateOptions).trim();

    // Use Chai's assertion to check if the stringified ASTs are equal
    chai.expect(actualStringified).to.equal(expectedStringified);
  });
};
