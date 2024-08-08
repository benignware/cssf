import { expect } from 'chai';
import { getRender } from './getRender.mjs'; // Adjust the path to your module

// Define the sample function
const sampleFunction = (...args) => `calc(${args.map(s => s.trim()).join(' + ')})`;

// Define the environment with the sample function
const env = {
  sampleFunction,
};

// Get the render function with the environment
const render = getRender(env);

describe('getRender with sampleFunction', () => {
  it('should render sampleFunction correctly in a basic value case', () => {
    // Test simple usage of sampleFunction
    const input = 'sampleFunction(10px, 20px)';
    const expectedOutput = 'calc(10px + 20px)';
    expect(render(input)).cssEquivalent(expectedOutput);
  });

  it('should render sampleFunction correctly in a full CSS rule', () => {
    // Test usage of sampleFunction in a full CSS rule
    const input = `
      .example {
        width: sampleFunction(10px, 20px);
      }
    `;
    const expectedOutput = `
      .example {
        width: calc(10px + 20px);
      }
    `;
    expect(render(input)).cssEquivalent(expectedOutput);
  });

  it('should handle multiple properties in a selector', () => {
    // Test multiple properties in a CSS selector
    const input = `
      .example {
        width: sampleFunction(10px, 20px);
        height: sampleFunction(5px, 15px);
      }
    `;
    const expectedOutput = `
      .example {
        width: calc(10px + 20px);
        height: calc(5px + 15px);
      }
    `;
    expect(render(input)).cssEquivalent(expectedOutput);
  });

  it('should handle complex calculations within a CSS rule', () => {
    // Test complex usage of sampleFunction
    const input = `
      .example {
        padding: sampleFunction(sampleFunction(5px, 10px), 20px);
      }
    `;
    const expectedOutput = `
      .example {
        padding: calc(calc(5px + 10px) + 20px);
      }
    `;
    expect(render(input)).cssEquivalent(expectedOutput);
  });

  it('should handle CSS variables in a property', () => {
    // Test usage of sampleFunction with CSS variables
    const input = `
      :root {
        --padding: 10px;
      }
      .example {
        padding: sampleFunction(var(--padding), 20px);
      }
    `;
    const expectedOutput = `
      :root {
        --padding: 10px;
      }
      .example {
        padding: calc(var(--padding) + 20px);
      }
    `;
    expect(render(input)).cssEquivalent(expectedOutput);
  });
});
