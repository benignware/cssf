import { expect } from 'chai';
import * as csstree from 'css-tree';
import { CSS } from './CSS.mjs';

// Basic transformer example included directly in the test file
const capitalizePropertiesTransformer = (ast) => {
  csstree.walk(ast, {
    leave(node) {
      if (node.type === 'Declaration' && node.property) {
        node.property = node.property.toUpperCase(); // Capitalize the property name
      }
    },
  });

  return ast;
};

describe('CSS Class', () => {
  describe('parse', () => {
    it('should return null for invalid CSS', () => {
      expect(CSS.parse('}')).to.be.null;
    });

    it('should auto-detect context', () => {
      expect(() => CSS.parse('calc(123px * 0.5)')).not.to.throw(); // No error should be thrown
    });

    it('should handle non-string input gracefully', () => {
      const nonStringInput = { key: 'value' };
      expect(() => CSS.parse({ key: 'value' })).to.not.throw();
      expect(CSS.parse(nonStringInput)).to.equal(nonStringInput);
    });
  });

  describe('stringify', () => {
    it('should return empty string for invalid AST', () => {
      expect(CSS.stringify(null)).to.equal('');
    });

    it('should handle string input by parsing it first', () => {
      expect(CSS.stringify('body { color: red; }')).to.equal('body{color:red}'); // Minified output
    });

    it('should normalize css output (because css-tree strips whitespace for "*")', () => {
      expect(CSS.stringify('calc(10px * 5px)')).to.be.equal('calc(10px * 5px)');
    });

    it('should normalize css output (because css-tree strips whitespace for argument separator ",")', () => {
      expect(CSS.stringify('rgb(calc(255 + 0.5), 0, 255)')).to.be.equal('rgb(calc(255 + 0.5), 0, 255)');
    });

    it('should apply transformers if provided', () => {
      expect(CSS.stringify('body { color: red; }', {
        transformers: [capitalizePropertiesTransformer]
      })).to.equal('body{COLOR:red}');
    });
  });
});
