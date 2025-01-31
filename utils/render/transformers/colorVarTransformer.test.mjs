import { expect } from 'chai';
import { CSS } from '../../ast/CSS.mjs';
import { colorVarTransformer } from './colorVarTransformer.mjs';
import { getEval } from '../../../utils/eval/getEval.mjs';

describe('colorVarTransformer', () => {
  it('transforms root var', () => {
    const input = `var(--primary)`;
    const expectedOutput = `rgba(
      var(--primary-r),
      var(--primary-g),
      var(--primary-b),
      var(--primary-a, 1)
    )`;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms without default ', () => {
    const input = `
      .example {
        color: var(--primary);
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(
          var(--primary-r),
          var(--primary-g),
          var(--primary-b),
          var(--primary-a, 1)
        );
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it(`doesn't transform twice`, () => {
    const input = `
      .example {
        color: var(--primary);
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(var(--primary-r), var(--primary-g), var(--primary-b), var(--primary-a, 1));
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    const result2 = CSS.stringify(result, options);
    expect(result2).cssEquivalent(expectedOutput);
  });

  it('transforms with default color keyword', () => {
    const input = `
      .example {
        color: var(--primary, red);
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(
          var(--primary-r, 255),
          var(--primary-g, 0),
          var(--primary-b, 0),
          var(--primary-a, 1)
        );
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms with default hex color', () => {
    const input = `
      .example {
        color: var(--primary, #ff0000);
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(
          var(--primary-r, 255),
          var(--primary-g, 0),
          var(--primary-b, 0),
          var(--primary-a, 1)
        );
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms with default rgba function', () => {
    const input = `
      .example {
        color: var(--primary, rgba(255, 0, 0, 1));
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(
          var(--primary-r, 255),
          var(--primary-g, 0),
          var(--primary-b, 0),
          var(--primary-a, 1)
        );
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms with nested default vars', () => {
    const input = `
      .example {
        color: var(--primary, var(--secondary, var(--tertiary, rgba(255, 0, 0, 1))));
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(
          var(--primary-r, var(--secondary-r, var(--tertiary-r, 255))),
          var(--primary-g, var(--secondary-g, var(--tertiary-g, 0))),
          var(--primary-b, var(--secondary-b, var(--tertiary-b, 0))),
          var(--primary-a, var(--secondary-a, var(--tertiary-a, 1)))
        );
      }
    `;
    const options = {
      transformers: [colorVarTransformer({
        nested: true,
      })],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms inside custom color function', () => {
    const input = `
      .btn-primary {
        color: color-contrast(var(--primary));
      }
    `;
    const expectedOutput = `
      .btn-primary {
        color: color-contrast(rgba(var(--primary-r),var(--primary-g),var(--primary-b),var(--primary-a,1)));
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options); 
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms inside relative function', () => {
    const input = `
      .example {
        color: rgba(from var(--primary, red) r g b / var(--bg-opacity, 1));
      }
    `;
    const expectedOutput = `
      .example {
        color: rgba(from rgba(
          var(--primary-r, 255),
          var(--primary-g, 0),
          var(--primary-b, 0),
          var(--primary-a, 1)
        ) r g b / var(--bg-opacity, 1));
      }
    `;
    const options = {
      transformers: [colorVarTransformer()],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  it('transforms with specified identifiers and nested default vars', () => {
    const input = `
      var(--primary, var(--secondary, var(--tertiary, rgba(255, 0, 0, 1) ) ) )
    `;
    const expectedOutput = `
      rgba(
        var(--primary-r, var(--secondary-r, var(--tertiary-r, 255))),
        var(--primary-g, var(--secondary-g, var(--tertiary-g, 0))),
        var(--primary-b, var(--secondary-b, var(--tertiary-b, 0))),
        var(--primary-a, var(--secondary-a, var(--tertiary-a, 1)))
      )
    `;
    const options = {
      transformers: [colorVarTransformer({
        identifiers: [
          '--primary',
          '--secondary',
          '--tertiary',
        ],
        styles: [],
        functions: [],
      })],
    };
    
    const result = CSS.stringify(input, options);
    expect(result).cssEquivalent(expectedOutput);
  });

  xit('transforms complex expressions', () => {
    const input = `
      .btn-primary {
        --btn-color: color-contrast(var(--primary, #007bff));
        --btn-hover-bg: color-mix(in srgb, var(--btn-color) 0.5, var(--primary, #007bff));
      }`;
    const expectedOutput = `
      .btn-primary{
        --btn-color: color-contrast(
          rgba(var(--primary-r, 0), var(--primary-g, 123), var(--primary-b, 255), var(--primary-a, 1))
        );
        --btn-hover-bg: color-mix(
          in srgb,
          var(--btn-color) 0.5,
          rgba(var(--primary-r, 0), var(--primary-g, 123), var(--primary-b, 255), var(--primary-a, 1))
        );
    `;
    const options = {
      transformers: [colorVarTransformer({
        nested: 'auto',
        identifiers: [
          '--primary',
        ],
      })],
    };
    
    const result = CSS.stringify(input, options);
    
    expect(result).cssEquivalent(expectedOutput);
  });
});
