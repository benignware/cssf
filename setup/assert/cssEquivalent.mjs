import * as csstree from 'css-tree';
import { CSS } from '../../utils/ast/CSS.mjs';
const findFirstDiff = (str1, str2) => {
  if (str1.length === 0 || str2.length === 0) return "";
  return [...str1].findIndex((el, index) => el !== str2[index]);
}

const trim = (str) => str.replace(/\s+/g, ' ').trim();

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
    const actualAst = CSS.parse(actual, parseOptions);
    const expectedAst = CSS.parse(expected, parseOptions);

    // Stringify the ASTs to ensure they are equivalent
    const actualStringified = CSS.stringify(actualAst, generateOptions).trim();
    const expectedStringified = CSS.stringify(expectedAst, generateOptions).trim();

    // console.log('actual:', actualStringified);
    // console.log('expect:', expectedStringified);

    // Use Chai's assertion to check if the stringified ASTs are equal
    chai.expect(actualStringified).to.be.equal(expectedStringified);
  });
};
