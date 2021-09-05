const evaluate = require('../eval');
const chroma = require('chroma-js');
const assert = require('assert');
const { ifelse, lt, gt, divide, add, hsla, rgba } = require('..');
const brightness = require('./brightness');
const { parseFn } = require('../utils');

function contrastColorA(background, light, dark) {
  const br = brightness(background);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys()).map((index) =>
    ifelse(lt(br, 0.5), lightArgs[index], darkArgs[index])
  );

  return colorFn(...args);
}

function contrastColorB(background, light, dark) {
  const ratio1 = contrastRatio(background, light);
  const ratio2 = contrastRatio(background, dark);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys()).map((index) =>
    ifelse(gt(ratio1, ratio2), lightArgs[index], darkArgs[index])
  );

  return colorFn(...args);
}

function contrastRatio(rgb1, rgb2) {
  const lum1 = brightness(rgb1);
  const lum2 = brightness(rgb2);
  const ratio = ifelse(
    gt(lum1, lum2),
    divide(add(lum1, 0.05), add(lum2, 0.05)),
    divide(add(lum2, 0.05), add(lum1, 0.05))
  );

  return ratio;
}

describe('brightness', () => {
  it('retrieves brightness for rgb color', () => {
    const rgb = `rgba(127.5, 127.5, 127.5)`;
    const br = brightness(rgb);

    assert.strictEqual(evaluate(br), 0.5);
  });

  it('can be derived a contrast color based on brightness', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';

    assert.strictEqual(evaluate(contrastColorA(rgb1, light, dark)), light);

    const rgb2 = 'rgb(245, 188, 178)';

    assert.strictEqual(evaluate(contrastColorA(rgb2, light, dark)), dark);
  });

  it('can be derived a contrast color from contrast ratio based on brightness', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';

    assert.strictEqual(evaluate(contrastColorB(rgb1, light, dark)), light);

    const rgb2 = 'rgb(245, 188, 178)';

    assert.strictEqual(evaluate(contrastColorB(rgb2, light, dark)), dark);
  });

  it('can be derived a contrast color from contrast ratio based on brightness dynamically', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';
    const [r1, g1, b1] = chroma(rgb1).rgb();

    assert.strictEqual(
      evaluate(
        contrastColorB(`rgb(var(--r), var(--g), var(--b))`, light, dark),
        {
          r: r1,
          g: g1,
          b: b1,
        }
      ),
      light
    );

    const rgb2 = 'rgb(245, 188, 178)';
    const [r2, g2, b2] = chroma(rgb2).rgb();

    assert.strictEqual(
      evaluate(
        contrastColorB(`rgb(var(--r), var(--g), var(--b))`, light, dark),
        {
          r: r2,
          g: g2,
          b: b2,
        }
      ),
      dark
    );
  });
});
