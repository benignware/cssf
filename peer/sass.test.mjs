import { expect } from "chai";
import { getSassTag } from "./sass.mjs";
import { getEval } from "../utils/eval/getEval.mjs";

describe('getSassTag', function() {
  it('should return a Sass proxy wrapper', function() {
    const scssf = getSassTag();

    scssf.use({
      echo: function (str) {
        return `"${str}"`;
      }
    });

    const scss = scssf`
      :root {
        --test: #{echo("Hello World!")};
      }
    `;

    expect(scss).to.be.cssEquivalent(`
      :root {
        --test: "Hello World!";
      }
    `
    );
  });

  it('should render scss with default env', function() {
    const scssf = getSassTag();
    const input = scssf`
      .example {
        color: hsv(0, 100%, 100%);
      }
    `;

    const expectedOutput = `
      .example {
        color: hsl(0deg 100% 50%);
      }
    `;
    const e = getEval();

    expect(e(input)).to.be.cssEquivalent(expectedOutput);
  });

  it('applies plugin', function() {
    const scssf = getSassTag();

    scssf.use(new class {
      _call(str) {
        return 'TEST';
      }
    });

    const input = scssf`
      .example {
        color: hsv(0, 100%, 100%);
      }
    `;

    const expectedOutput = `
      .example {
        color: TEST;
      }
    `;
    const e = getEval();

    expect(e(input)).to.be.cssEquivalent(expectedOutput);
  });
});