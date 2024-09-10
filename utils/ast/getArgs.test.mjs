import { expect } from 'chai';
import { getArgs } from './getArgs.mjs';

describe('getArgs', () => {
  // it('should return an empty array for an empty string', () => {
  //   expect(getArgs('')).to.deep.equal([]);
  // });

  // it('should return an array with a single argument', () => {
  //   expect(getArgs('1')).to.deep.equal(['1']);
  // });

  // it('should return an array with multiple arguments', () => {
  //   expect(getArgs('255, 0, 0, 0.5')).to.deep.equal(['255', '0', '0', '0.5']);
  // });

  // it('should extract arguments with function expressions', () => {
  //   expect(getArgs('calc(1 + 2), calc(2 * sin(pi * 0.5)), calc(var(--x) * 0.5)')).to.deep.equal([
  //     'calc(1 + 2)',
  //     'calc(2 * sin(pi * 0.5))',
  //     'calc(var(--x) * 0.5)'
  //   ]);
  // });

  // it('should handle subTokens option', () => {
  //   expect(getArgs('rgb(0, 255, 255), rgb(255, 0, 255) 50%, rgb(0, 255, 0) 50%', { subTokens: true })).to.deep.equal([
  //     ['rgb(0, 255, 255)'],
  //     ['rgb(255, 0, 255)', '50%'],
  //     ['rgb(0, 255, 0)', '50%']
  //   ]);
  // });

  // it('should return an array with multiple arguments as tokens', () => {
  //   expect(getArgs('255, 0, 0, 0.5', { tokens: true })).to.deep.equal(['255', '0', '0', '0.5']);
  // });

  // it('should parse whitespace separated arguments as tokens', () => {
  //   expect(getArgs('1 calc(2 + 3) 3', { tokens: true })).to.deep.equal(['1', 'calc(2 + 3)', '3']);
  // });

  // it('should parse whitespace separated arguments as tokens and skip custom delimiters', () => {
  //   expect(getArgs('1 calc(2 + 3) 3 / 0.5', { tokens: ['/'] })).to.deep.equal(['1', 'calc(2 + 3)', '3', '0.5']);
  // });

  it('should parse complex args', () => {
    expect(
      getArgs('from rgba(calc(var(--r) * 0.5) calc(0.5 * var(--g)) calc(var(--b) * 0.5) / 0.5), x, y, z, a' )
    ).to.deep.equal(
      [
        'from rgba(calc(var(--r) * 0.5) calc(0.5 * var(--g)) calc(var(--b) * 0.5) / 0.5)',
        'x',
        'y',
        'z',
        'a'
      ]
    );
  } );

  it('should parse complex args as tokens', () => {
    expect(
      getArgs('from rgba(calc(var(--r) * 0.5) calc(0.5 * var(--g)) calc(var(--b) * 0.5)) calc(x * 0.5) y z / a', { tokens: ['/'] })
    ).to.deep.equal(
      [
        'from',
        'rgba(calc(var(--r) * 0.5) calc(0.5 * var(--g)) calc(var(--b) * 0.5))',
        'calc(x * 0.5)',
        'y',
        'z',
        'a'
      ]
    );
  } );
});
