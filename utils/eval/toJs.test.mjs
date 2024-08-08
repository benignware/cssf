import { expect } from 'chai';
import toJS from './toJs.mjs'; // Update with the correct path

describe('toJS Function', function() {

  it('should transform basic CSS functions correctly', function() {
    const input = 'calc(100px + 20px)';
    const expectedOutput = '_add("100px", "20px")'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should transform arithmetic operators according to the options', function() {
    const input = 'calc(100px * 2)';
    const options = {
      operators: {
        '*': 'product'
      }
    };
    const expectedOutput = 'product("100px", 2)'; // Adjust based on actual transformation logic
    const result = toJS(input, options);
    expect(result).to.equal(expectedOutput);
  });

  it('should wrap undefined functions with _undef', function() {
    const input = 'custom-function(10px, 20px)';
    const expectedOutput = '_undef("custom-function", "10px", "20px")'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should strip calc function and keep arithmetic operation', function() {
    const input = 'calc(100px + 20px)';
    const expectedOutput = '_add("100px", "20px")'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should handle multiple spaces and join arguments correctly', function() {
    const input = 'custom-function(arg1    arg2  arg3)';
    const expectedOutput = '_undef("custom-function", _join(" ", "arg1", "arg2", "arg3"))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });
});
