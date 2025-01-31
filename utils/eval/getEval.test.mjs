import { expect } from 'chai';
import assert from 'assert';
import { getEval, ENV_2022, ENV_2023, ENV_2024, ENV_NEXT } from './getEval.mjs';
import { Env } from '../env/Env.mjs';

describe('Evaluation Tests', () => {
  it('should preserve arithmetic parentheses if expression cannot be resolved', function() {
    const e = getEval();
    const input = `calc( (var(--x) + 10) / 2 )`
    const expectedOutput = 7.5; // Adjust based on actual transformation logic
    const prepared = e(input);
    expect(prepared).to.be.cssEquivalent(input);
    expect(e(prepared, {
      '--x': 5,
    })).to.equal(expectedOutput);
  });
  
  // it('should resolve args', function() {
  //   const e = getEval();
  //   const input = 'rgba(calc(var(--p-r) + 20) 0 0 / 0)';
  //   const expectedOutput = 'rgba(120 0 0 / 0)'; // Adjust based on actual transformation logic
  //   const result = e(input, {
  //     '--p-r': 100,
  //   });
  //   expect(result).to.equal(expectedOutput);
  // });

  it('should compute operations with negative dimension values', function() {
    const e = getEval();
    // const input = `calc(((0 / 255) - (0 / 255)) / (max((0 / 255), (0 / 255), (0 / 255)) - min((0 / 255), (0 / 255), (0 / 255))))`;
    // const input = `calc(
    //   max(1, 2, 3) - min(1, 2, 3)
    // )`;
    // const input = `
    //   calc(
        // (
        //   (0 / 255) - (0 / 255)
        // ) / (
    //       max(
    //         (0 / 255),
    //         (0 / 255),
    //         (0 / 255)
    //       ) - min(
    //         (0 / 255),
    //         (0 / 255),
    //         (0 / 255)
    //       )
    //     )
    //   )
    // `
    // const input = `calc((0 / 255) - (0 / 255))`;
    const input = `calc(
     (
        (0 / 255) - (0 / 255)
      ) / (
        max(
          (0 / 255),
          (0 / 255),
          (0 / 255)
        ) - min(
          (0 / 255),
          (0 / 255),
          (0 / 255)
        )
      )
    )`;
    
    // const expectedOutput = Number.NaN; // Adjust based on actual transformation logic
    const result = e(input);
    expect(result).to.be.NaN;
  });

  xit('should resolve args', function() {
    const e = getEval();
    const input = 'rgba(from blue r g b / 0)';
    const expectedOutput = 'rgba(120 0 0 / 0)'; // Adjust based on actual transformation logic
    const result = e(input, {
      '--p-r': 100,
    });
    expect(result).to.equal(expectedOutput);
  });

  
  it('should compute operations with negative dimension values', function() {
    const e = getEval();
    const value = '-314px';
    const input = `calc(2px * -4px)`;
    
    const expectedOutput = '-8px'; // Adjust based on actual transformation logic
    const result = e(input);
    expect(result).to.equal(expectedOutput);
  });

  it('should compute complex expression', function() {
    const e = getEval();
    const input = `calc(max(-342px, -1 * (-342px)))`
    
    const expectedOutput = '342px'; // Adjust based on actual transformation logic
    const result = e(input);
    expect(result).to.equal(expectedOutput);
  });


  it('should evaluate addition inside calc', () => {
    const e = getEval();
    const result = e('calc(3 + 4)');
    expect(result).to.equal(7);
  });

  it('should evaluate subtraction inside calc', () => {
    const e = getEval();
    const result = e('calc(10 - 4)');
    expect(result).to.equal(6);
  });

  it('should evaluate multiplication inside calc', () => {
    const e = getEval();
    const result = e('calc(3 * 4)');
    expect(result).to.equal(12);
  });

  it('should evaluate division inside calc', () => {
    const e = getEval();
    const result = e('calc(12 / 4)');
    expect(result).to.equal(3);
  });

  it('evaluates unit expression', () => {
    const e = getEval();
    assert.strictEqual(e('10px'), '10px');
  });

  it('evaluates calc expression', () => {
    const e = getEval();
    assert.strictEqual(e('calc(10px * 2)'), '20px');
  });

  it("should not evaluate expressions that can't be resolved", () => {
    const e = getEval();
    const result = e('calc(l + 4)');
    expect(result).to.equal('calc(l + 4)');
  });

  it('should only wrap expression with calc', () => {
    const e = getEval();
    const input = 'abc(var(--h), var(--s), var(--l))';
    const result = e(input);
    expect(result).to.equal(input);
  });

  it('evaluates addition with units', () => {
    const e = getEval();
    assert.strictEqual(e('calc(10px + 20px)'), '30px');
  });

  it('evaluates arithmetic with floating points', () => {
    const e = getEval();
    assert.strictEqual(e('calc(0.5 / 10 * 4.9406564584124654e-323 / 4.9406564584124654e-323)'), 0.1);
  });

  it('evaluates expression containing min', () => {
    const e = getEval();
    assert.strictEqual(e('min(10 + 50 * 2, 20)'), 20);
  });

  it('evaluates expression containing max', () => {
    const e = getEval();
    assert.strictEqual(e('max(10 + 50 * 2, 20)'), 110);
  });

  it('evaluates dynamic expression', () => {
    const e = getEval();
    assert.strictEqual(e(
      'calc((var(--a) + var(--b)) * var(--c))',
      {
        '--a': 1,
        '--b': 2,
        '--c': 3,
      }
    ), 9);
  });

  it('evaluates dynamic expression with fallback', () => {
    const e = getEval();
    assert.strictEqual(e(
      'calc((var(--a, 1) + var(--b, 2)) * var(--c, 3))',
    ), 9);
  });

  it('evaluates constants', () => {
    const e = getEval();
    assert.strictEqual(e('pi'), Math.PI);
  });

  it('evaluates calc with constants', () => {
    const e = getEval();
    assert.strictEqual(e('calc(pi * 2)'), Math.PI * 2);
  });

  it('correctly resolves infinity constant', () => {
    const e = getEval();
    assert.strictEqual(e('infinity'), Infinity);
  });

  it('correctly resolves negative infinity constant', () => {
    const e = getEval();
    assert.strictEqual(e('-infinity'), -Infinity);
  });

  xit('resolves to negative zero when computing constants', () => {
    const e = getEval();
    assert.strictEqual(e('calc(1 / -infinity)'), -0);
  });

  it('doesn\'t evaluate undefined functions', () => {
    const e = getEval();
    assert.strictEqual(e('xyz(0, 0, 0)'), 'xyz(0, 0, 0)');
  });

  it('handles space-separated arguments', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(10 0 0)'), 'abc(10 0 0)');
  });

  it('executes calc inside ', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(calc(10px + 1px))'), 'abc(11px)');
  });

  it('splits consecutive arguments', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(calc(10px + 1px) 10px)'), 'abc(11px 10px)');
  });

  it('handles space-separated arguments with variables', () => {
    const abc = (...args) => `abc(${args.join(', ')})`;
    const e = getEval({ abc });

    assert.strictEqual(e('abc(calc(10 * 10) var(--b) 0)', {
      '--b': '50px',
    }), 'abc(100 50px 0)');
  });

  it('handles slash-separated arguments', () => {
    const abcd = (...args) => `abcd(${args.join(', ')})`;
    const e = getEval({ abcd });

    assert.strictEqual(e('abcd(calc(10 * 10) 0 0 / 1)'), 'abcd(100 0 0 / 1)');
  });

  it('splits and joins concatenated arguments', () => {
    const input = 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)';
    const e = getEval();
    const result = e(input);

    assert.strictEqual(result, 'xyz(in srgb, rgba(255, 0, 255, 1) 50%, #00f 50%)');
  });

  it('should correctly use and verify the custom environment function', () => {
    function custom(name, ...args) {
      const env = Env.getEnv();
      const self = Object.values(env).find(fn => fn === custom);

      return `${self.name}(${name}, ${args.join(', ')})`;
    }

    const e = getEval({ custom });

    const result = e('custom(var(--a), 10px, calc(5 + 5))', {
      '--a': 'value',
    });

    expect(result).to.equal('custom(value, 10px, 10)');
  });

  it('should evaluate stylesheet', () => {
    const e = getEval();
    const input = `
      .example {
        width: calc(123px + 456px);
      }
    `;
    const expectedOutput = `
      .example {
        width: 579px;
      }
    `;
    expect(e(input)).to.be.cssEquivalent(expectedOutput);
  });

  it('should not evaluate vars without input', () => {
    const e = getEval();
    const input = 'var(--a)';
    const result = e(input);
   
    expect(result).to.equal(input);
  });

  it('should not evaluate complex expression with vars without input', () => {
    const e = getEval();
    const input = `calc(
      (
        (var(--primary-r) * 299 +
        var(--primary-g) * 587) +
        var(--primary-b) * 114
      ) / 1000
    )`
    const result = e(input);
   
    expect(result).to.contain('calc(');
    expect(result).to.contain('var(--primary-r)');

    expect(result).to.be.cssEquivalent(input);

    // const computed = e(input, {
    //   '--primary-r': 255,
    //   '--primary-g': 25,
    //   '--primary-b': 235,
    // });

    // expect(computed).to.equal(63.5);
  });

  it('evaluates relative color', () => {
    const e = getEval();
    // const input = e(`
    //   rgb(
    //     from rgba(255, 126, 235, 1)
    //     calc(max(0, min((((r * 299 + g * 587) + b * 114) / 1000 - 128) * 1000 * -1, 255)))
    //     calc(max(0, min((((r * 299 + g * 587) + b * 114) / 1000 - 128) * 1000 * -1, 255)))
    //     calc(max(0, min((((r * 299 + g * 587) + b * 114) / 1000 - 128) * 1000 * -1, 255))))
    //   `);
    const input = e(`rgba(from rgb(255 126 235 / 0.5) r g b / a)`);
    expect(input).to.be.equal('rgb(255 126 235 / 0.5)');
  });

  describe('Environment Tests', () => {
    it('should use default base environment when no arguments are passed', () => {
      const e = getEval();
      const result = e('calc(5 + 3)');
      expect(result).to.equal(8);
    });
  
    it('should use custom functions only without base environment', () => {
      const customEnv = {
        add: (a, b) => a + b,
      };
      const e = getEval(customEnv);
      const result = e('add(2, 3)');
      expect(result).to.equal(5);
    });
  
    it('should use specified preset as base environment', () => {
      const e = getEval({}, ENV_2022);
      const result = e('(calc(max(5, 3)))');
      // Replace `someFunction` with an actual function from env22
      expect(result).to.equal(5);
    });
  
    it('should use custom functions with a specified preset', () => {
      const customEnv = {
        multiply: (a, b) => a * b,
      };
      const e = getEval(customEnv, ENV_2023);
      const result = e('multiply(4, 5)');
      expect(result).to.equal(20);
    });
  
    it('should correctly handle environment presets with empty custom env', () => {
      const e = getEval({}, ENV_NEXT);
      const result = e('abs(-123)');
      // Replace `abs` with an actual function from envNext
      expect(result).to.equal(123);
    });
  
    it('should correctly handle environment presets with no custom env', () => {
      const e = getEval(ENV_NEXT);
      const result = e('abs(-123)');
      // Replace `abs` with an actual function from envNext
      expect(result).to.equal(123);
    });

    it('should use both custom functions and base environment preset', () => {
      const e = getEval({
        customFunc: (x) => `calc((${x}) * 2)`
      }, ENV_2023);
    
      expect(e('customFunc(2)')).to.be.equal(4);
    });
  });
});
