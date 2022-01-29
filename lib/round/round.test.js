const assert = require('assert');
const round = require('./round');

describe('round', () => {
  it('rounds value up', () => {
    const x = 0.53137254901960786;

    assert.strictEqual(eval(round(x)), Math.round(x));
  });

  it('rounds value down ', () => {
    const x = 0.43137254901960786;

    assert.strictEqual(eval(round(x)), Math.round(x));
  });

  xit('rounds value up at two digits', () => {
    const x = 0.43537254901960786;

    assert.strictEqual(eval(round(x, 2)), Number(x.toFixed(2)));
  });

  xit('rounds value down at two digits', () => {
    const x = 0.43137254901960786;

    assert.strictEqual(eval(round(x, 2)), Number(x.toFixed(2)));
  });
});
