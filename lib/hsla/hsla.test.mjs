import assert from 'assert';
import chroma from 'chroma-js';
import hsla from './hsla.mjs';
import getEval from '../eval/getEval.mjs';

describe('hsla', () => {
  beforeEach(() => {
    global.evaluate = getEval({
      hsla,
      hsl: hsla
    });
  });

  // it('creates absolute hsla color', () => {
  //   assert.strictEqual(hsla('123 43% 60% / 0.9'), 'hsla(123 43% 60% / 0.9)');
  // });

  // it('creates hsla color with legacy notation', () => {
  //   assert.strictEqual(hsla('123, 43%, 60%, 0.9'), 'hsla(123 43% 60% / 0.9)');
  // });
  
  // it('creates hsla color with dynamic values', () => {
  //   assert.strictEqual(
  //     evaluate(hsla('var(--h) var(--s) var(--l) / var(--a)'), {
  //       '--h': 123,
  //       '--s': '43%',
  //       '--l': '60%',
  //       '--a': 0.9,
  //     }),
  //     'hsla(123 43% 60% / 0.9)'
  //   );
  // });

  // it('creates relative identity hsla color', () => {
  //   assert.strictEqual(hsla('from hsla(123 43% 60% / 0.9) h s l / a'), 'hsla(123 43% 60% / 0.9)');
  // });

  // it('creates relative hsla color by dynamic values', () => {
  //   assert.strictEqual(
  //     evaluate(hsla('from hsla(123 43% 60% / 0.9) var(--h) var(--s) var(--l) / var(--a)'), {
  //       '--h': 255,
  //       '--s': '100%',
  //       '--l': '50%',
  //       '--a': 0.5,
  //     }),
  //     'hsla(255 100% 50% / 0.5)'
  //   );
  // });

  // it('creates relative hsla color from and by dynamic values', () => {
  //   assert.strictEqual(
  //     evaluate(hsla('from hsla(50 var(--s) 25 / var(--a)) h s var(--l) / a'), {
  //       '--h': 123,
  //       '--s': '43%',
  //       '--l': '60%',
  //       '--a': 0.9,
  //     }),
  //     'hsla(50 43% 60% / 0.9)'
  //   );
  // });

  // it('creates relative hsla color from hex', () => {
  //   assert.strictEqual(evaluate(hsla('from #f0f0f0 h s l / a')), 'hsla(0 0% 94% / 1)');
  // });

  // it('creates relative hsl color from color name', () => {
  //   assert.strictEqual(evaluate(hsla('from red h s l')), 'hsl(0 100% 50%)');
  // });

  it('creates relative hsl from rgba', () => {
    assert.strictEqual(evaluate(hsla('from rgba(0 255 0 / 1) h s l / a')), 'hsla(120 100% 50% / 1)');
  });

  return;

  xit('creates relative hsla from color', () => {
    assert.strictEqual(evaluate(hsla('from color(srgb 0 1 0 / 0.5) h s l / a')), 'hsla(120 100% 50% / 0.5)');
  });

  xit('creates relative hsl from rgb with legacy notation', () => {
    assert.strictEqual(evaluate(hsla('from rgb(0, 255, 0) h s l')), 'hsl(120 100% 50%)');
  });

  xit('creates relative hsla from rgba', () => {
    assert.strictEqual(evaluate(hsla('from rgba(0 255 0 / 1) h s l / a')), 'hsla(120 100% 50% / 1)');
  });

  xit('creates relative hsla from rgba awith legacy notation', () => {
    assert.strictEqual(evaluate(hsla('from rgba(0 255 0 / 1) h s l / a')), 'hsla(120 100% 50% / 1)');
  });

  return;
  
  it('creates relative hsla color by computed values', () => {
    assert.strictEqual(
      evaluate(hsla('from hsla(123 43% 60% / 0.9) calc(h + 50) calc(s - 25) calc(l + 90) / calc(a - 0.5)')),
      'hsla(173 18% 150% / 0.4)'
    );
  });



  it ('creates relative hsla color by computed values with legacy notation', () => {
    assert.strictEqual(
      evaluate(hsla('from hsla(123, 43%, 60%, 0.9) calc(h + 50) calc(s - 25) calc(l + 90) / calc(a - 0.5)')),
      'hsla(173 18% 150% / 0.4)'
    );
  });

  it('returns origin color when there is identiy values', () => {
    assert.strictEqual(hsla('from hsla(123 43% 60% / 0.9) h s l / a'), 'hsla(123 43% 60% / 0.9)');
  });

  it (`doesn't resolve origin color with dynamic relative components`, () => {
    assert.strictEqual(
      hsla('from hsla(123 43% 60% / 0.9) var(--h) var(--s) var(--l) / var(--a)'),
      'hsla(from hsla(123 43% 60% / 0.9) var(--h) var(--s) var(--l) / var(--a))'
    );
  });

  it ('creates relative hsla color by dynamic, computed values', () => {
    assert.strictEqual(
      evaluate(hsla('from hsla(123 43% 60% / 0.9) calc(var(--h) + 50) calc(var(--s) - 25) calc(var(--l) + 90) / calc(var(--a) + 0.5)'), {
        '--h': 50,
        '--s': '100%',
        '--l': '50%',
        '--a': 0.5,
      }),
      'hsla(100 75% 140% / 1)'
    );
  });
});
