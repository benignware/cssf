import { expect } from 'chai';
import toJS from './toJs.mjs'; // Update with the correct path

describe('toJS Function', function() {
  it('should resolve args', function() {
    const input = 'rgba(calc(100 + 20) 0 0 / 0)';
    const expectedOutput = '_undef("rgba", _join(" / ", _join(" ", calc(_add(100, 20)), 0, 0), 0))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });
  
  it('should resolve args', function() {
    const input = 'rgba(0 0 0 / 0)';
    const expectedOutput = '_undef("rgba", _join(" / ", _join(" ", 0, 0, 0), 0))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should resolve nested calc', function() {
    const input = 'calc(calc(100px * -1px) + 10px)';
    const expectedOutput = 'calc(_add(_multiply("100px", "-1px"), "10px"))'; 
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should transform basic dimension addition correctly', function() {
    const input = 'calc(100px + 20px)';
    const expectedOutput = 'calc(_add("100px", "20px"))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should transform basic dimension multiplication correctly', function() {
    const input = 'calc(100px * -1)';
    const expectedOutput = 'calc(_multiply("100px", -1))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should handle negative dimensions correctly', function() {
    const input = 'calc(100px * -1px)';
    const expectedOutput = 'calc(_multiply("100px", "-1px"))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should transform basic arithmetic expression', function() {
    const input = 'calc(100px - 20px)';
    const expectedOutput = 'calc(_subtract("100px", "20px"))'; // Adjust based on actual transformation logic
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
    const expectedOutput = 'calc(product("100px", 2))'; // Adjust based on actual transformation logic
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
    const expectedOutput = 'calc(_add("100px", "20px"))'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should preserve arithmetic operations within regular arguments', function() {
    const input = 'custom-function(calc(10px * 5),  arg2,  arg3)';
    const expectedOutput = '_undef("custom-function", calc(_multiply("10px", 5)), "arg2", "arg3")'; // Adjust based on actual transformation logic
    const result = toJS(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should preserve arithmetic operations within joined arguments', function() {
    const input = 'custom-function(calc(10px * 5)    arg2  arg3)';
    const expectedOutput = '_undef("custom-function", _join(" ", calc(_multiply("10px", 5)), "arg2", "arg3"))'; // Adjust based on actual transformation logic
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
