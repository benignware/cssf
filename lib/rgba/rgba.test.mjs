import assert from 'assert';
import chroma from 'chroma-js';
import { rgb, hsl, color } from './rgba.mjs';
import getEval from '../eval/getEval.mjs';

xdescribe('rgba', () => {
  beforeEach(() => {
    global.evaluate = getEval({
      color,
      rgb,
      rgba: rgb,
      hsl,
      hsla: hsl,
    });
  });

  // it('creates absolute color', function() {
  //   assert.equal(
  //     evaluate(color('srgb 1 0.5 1 / 1')),
  //     'color(srgb 1 0.5 1 / 1)'
  //   );
  // });

  // it('creates absolute color in lab colorspace', function() {
  //   assert.equal(
  //     evaluate(color('lab 1 0.5 1 / 1')),
  //     'color(lab 1 0.5 1 / 1)'
  //   );
  // });


  // it('creates absolute color in srgb with dynamic values', () => {
  //   assert.strictEqual(
  //     evaluate(color('srgb var(--r) var(--g) var(--b) / var(--a)'), {
  //       '--r': 0.5,
  //       '--g': 1,
  //       '--b': 0.5,
  //       '--a': 1,
  //     }),
  //     'color(srgb 0.5 1 0.5 / 1)'
  //   );
  // });

  // it('creates color from hex in srgb', function() {
  //   assert.equal(
  //     evaluate(color('from #00ffff srgb r 0.5 1 / 1')),
  //     'color(srgb 0 0.5 1 / 1)'
  //   );
  // });

  // it('creates color from hex in srgb with dynamic values', function() {
  //   assert.equal(
  //     evaluate(color('from #00ffff srgb r 0.5 var(--b) / 1'), {
  //       '--b': 1,
  //     }),
  //     'color(srgb 0 0.5 1 / 1)'
  //   );
  // });

  // it('creates color from hex in srgb with computed dynamic values', function() {
  //   assert.equal(
  //     evaluate(color('from #00ffff srgb r 0.5 calc(var(--b) * 0.5) / 1'), {
  //       '--b': 1,
  //     }),
  //     'color(srgb 0 0.5 0.5 / 1)'
  //   );
  // });

  it('creates color from hex in lab', function() {
    assert.equal(
      evaluate(color('from #00ffff lab r 0.5 1 / 1')),
      'color(lab 0 0.5 1 / 1)'
    );
  });

  // it('creates rgba color', () => {
  //   assert.strictEqual(rgba('123 230 199 / 0.9'), 'rgba(123 230 199 / 0.9)');
  // });

  // it('creates rgba color with legacy notation', () => {
  //   assert.strictEqual(rgba('123, 230, 199, 0.9'), 'rgba(123 230 199 / 0.9)');
  // });

  // it('creates rgba color with dynamic values', () => {
  //   assert.strictEqual(
  //     evaluate(rgba('var(--r) var(--g) var(--b) / var(--a)'), {
  //       '--r': 123,
  //       '--g': 230,
  //       '--b': 199,
  //       '--a': 0.9,
  //     }),
  //     'rgba(123 230 199 / 0.9)'
  //   );
  // });

  // it('creates relative identity rgba color', () => {
  //   assert.strictEqual(rgba('from rgba(123 230 199 / 0.9) r g b / a'), 'rgba(123 230 199 / 0.9)');
  // });

  // it('creates relative rgba color from hex', () => {
  //   assert.strictEqual(evaluate(rgba('from #123ec7 r g b')), 'rgb(18 62 199)');
  // });
  
  // it('creates relative hsl color from hex', () => {
  //   assert.strictEqual(evaluate(hsl('from #123ec7 h s l')), 'hsl(220 85% 43%)');
  // });

  // it('creates relative rgba color from color name', () => {
  //   assert.strictEqual(evaluate(rgba('from red r g b')), 'rgb(255 0 0)');
  // });


  return;

  it('creates relative rgba color by dynamic values', () => {
    assert.strictEqual(
      evaluate(rgba('from rgba(123 230 199 / 0.9) var(--r) var(--g) var(--b) / var(--a)'), {
        '--r': 255,
        '--g': 255,
        '--b': 255,
        '--a': 0.5,
      }),
      'rgba(255 255 255 / 0.5)'
    );
  });

  it('creates relative rgba color from aand by dynamic values', () => {
    assert.strictEqual(
      evaluate(rgba('from rgba(50 var(--g) 25 / var(--a)) var(--r) g var(--b) / a'), {
        '--r': 123,
        '--g': 230,
        '--b': 199,
        '--a': 0.9,
      }),
      'rgba(123 230 199 / 0.9)'
    );
  });

  it('creates relative rgba from color', () => {
    assert.strictEqual(evaluate(rgba('from color(srgb 0.5 0.3 0.1 / 1) r g b / a')), 'rgba(127.5 76.5 25.5 / 1)');
  });

  it('creates relative rgba from hsl', () => {
    assert.strictEqual(evaluate(rgba('from hsl(120 100% 50%) r g b')), 'rgb(0 255 0)');
  });

  xit('creates relative rgba from hsl with legacy notation', () => {
    assert.strictEqual(evaluate(rgba('from hsl(120, 100%, 50%) r g b')), 'rgb(0 255 0)');
  });

  xit('creates relative rgba from hsla', () => {
    assert.strictEqual(evaluate(rgba('from hsl(120 100% 50%, 0.5) r g b / a')), 'rgba(0 255 0 / 0.5)');
  });

  xit('creates relative rgba from hsla awith legacy notation', () => {
    assert.strictEqual(evaluate(rgba('from hsl(120, 100%, 50%, 0.5) r g b / a')), 'rgba(0 255 0 / 0.5)');
  });
  
  it('creates relative rgba color by computed values', () => {
    assert.strictEqual(
      evaluate(rgba('from rgba(230 25 10 / 1) calc(r - 50) calc(g + 25) calc(b + 90) / calc(a - 0.5)')),
      'rgba(180 50 100 / 0.5)'
    );
  });

  it ('creates relative rgba color by computed values with legacy notation', () => {
    assert.strictEqual(
      evaluate(rgba('from rgba(230, 25, 10, 1) calc(r - 50) calc(g + 25) calc(b + 90) / calc(a - 0.5)')),
      'rgba(180 50 100 / 0.5)'
    );
  });

  it('returns from color when there is identiy values', () => {
    assert.strictEqual(evaluate(rgba('from rgba(230 25 10 / 1) r g b / a')), 'rgba(230 25 10 / 1)');
  });

  it (`doesn't resolve origin color with dynamic relative components`, () => {
    assert.strictEqual(
      rgba('from rgba(230 25 10 / 1) var(--r) var(--g) var(--b) / var(--a)'),
      'rgba(from rgba(230 25 10 / 1) var(--r) var(--g) var(--b) / var(--a))'
    );
  });

  it ('creates relative rgba color by dynamic, computed values', () => {
    assert.strictEqual(
      evaluate(rgba('from rgba(230 25 10 / 1) var(--r) var(--g) var(--b) / var(--a)'), {
        '--r': 'calc(r - 50)',
        '--g': 'calc(g + 25)',
        '--b': 'calc(b + 90)',
        '--a': 'calc(a - 0.5)',
      }),
      'rgba(180 50 100 / 0.5)'
    );
  });
});

