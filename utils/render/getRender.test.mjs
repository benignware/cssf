import { expect } from 'chai';
import { getEval } from '../eval/getEval.mjs';
import { getRender, ENV_2022 } from './getRender.mjs'; // Adjust the path to your module
import { Env } from '../env/Env.mjs';

const e = getEval();

// Define the sample function
const sampleFunction = (...args) => `calc(${args.map(s => s.trim()).join(' + ')})`;

const env = {
  sampleFunction,
};

const render = getRender(env);

describe('getRender', () => {
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

  it('should provide the default environment', () => {
    // Test usage of sampleFunction with CSS variables
    const input = `
      .example {
        color: hsv(0, 100%, 100%);
      }
    `;
    const expectedOutput = `
      .example {
        color: hsl(0deg 100% 50%);
      }
    `;
    expect(e(render(input))).cssEquivalent(expectedOutput);

    // It should not contain functions that are natively supported by knowledge of the environment
    expect(e(render(input))).not.to.contain('colorMix');
  });

  it('should provide a preset environment', () => {
    const env2022 = ENV_2022;
    const customEnv = {
      getEnv: () => {
        return `"${Object.keys(Env.getEnv()).join(', ')}"`
      }
    };

    const fn = Object.keys({ ...env2022, ...customEnv });

    const r = getRender(customEnv, ENV_2022);
    // Test usage of sampleFunction with CSS variables
    const input = `
      .example {
        --env: getEnv();
      }
    `;
    const expectedOutput = `
      .example {
        --env: ${fn.join(',')};
      }
    `;
    expect(e(r(input))).cssEquivalent(expectedOutput);

    // It should not contain functions that are natively supported by knowledge of the environment
    expect(e(render(input))).not.to.contain('colorMix');
  });
});
