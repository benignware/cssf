const csstree = require('css-tree');
const chroma = require('chroma-js');

const { ifelse, round, eq, lt } = require('./math');

const parseFn = (input) => {
  const data = !input.match(/\{/) ? `.____root { prop: \n${input}\n}` : input;
  const ast = csstree.parse(data);
  const fn = csstree.find(ast, (node) => node.type === 'Function');

  if (fn) {
    const args = fn.children
      .toArray()
      .filter(({ type }) => type !== 'Operator')
      .map((node) => csstree.generate(node));

    return [fn.name, ...args];
  }

  return null;
};

const rgb2hsl = (r, g, b, a = 1) => {
  const rn = `(${r} / 255)`;
  const gn = `(${g} / 255)`;
  const bn = `(${b} / 255)`;

  const max = `max(${rn}, ${gn}, ${bn})`;
  const min = `min(${rn}, ${gn}, ${bn})`;

  const maxminusmin = `max(${max} - ${min}, 0.0000000000001)`;

  const l = `((${max} + ${min}) / 2)`;

  const s1 = `(${max} - ${min}) / (${max} + ${min})`;
  const s2 = `(${max} - ${min}) / (2.0 - ${max} - ${min})`;

  const s = ifelse(round(l), s2, s1);

  const hr = `${ifelse(lt(g, b), 6, 0)} + (${gn} - ${bn}) / (${maxminusmin})`;
  const hg = `(2 + (${bn} - ${rn}) / (${maxminusmin}))`;
  const hb = `(4 + (${rn} - ${gn}) / (${maxminusmin}))`;

  const h = `(${ifelse(eq(rn, max), hr, ifelse(eq(gn, max), hg, hb))} * 60)`;

  return [h, s, l, a];
};

const getColor = (color) => {
  if (color.match(/(hsl|rgb)a?\(/)) {
    const [name, ...args] = parseFn(color);

    if (name.startsWith('rgb')) {
      return rgb2hsl(...args);
    }

    return [...args];
  }

  try {
    return chroma(color).hsl();
  } catch (e) {
    return color;
  }
};

function hsla(h, s, l, a) {
  [h, s, l, a] = [...arguments].map((arg) => (arg ? String(arg) : ''));

  console.log('HSLA:', h, s, l, a);

  if (!l) {
    a = s;
    [h, s, l] = getColor(h);
  }

  a = a || 1;

  return `hsla(${h}, ${s}, ${l}, ${a})`;
}

function rgba(r, g, b, a = 1) {
  [r, g, b, a] = [...arguments].map((arg) => String(arg));

  const [h, s, l] = getColor(isNaN(parseInt(r)) ? r : `rgba(${r}, ${g}, ${b})`);

  return `rgba(calc(${h}), calc(${s} * 100%), calc(${l} * 100%), ${a})`;
}

function darken(color, weight = 0.3) {
  console.log('DARKEN: ', color, weight);
  const [h, s, l, a] = getColor(color);

  return `hsla(
    ${h}, 
    ${s},
    calc(${l} - ${l} * ${weight}),
    ${a || 1}
  )`;
}

function lighten(color, weight = 0.3) {
  console.log('LIGHTEN: ', color, weight);
  const [h, s, l, a] = getColor(color);

  return `hsla(
    ${h},
    ${s},
    calc(${l} + (100% - ${l}) * ${weight}),
    ${a || 1}
  )`;
}

function hue(color) {
  const [h] = getColor(color);

  return h;
}

function saturation(color) {
  const [, s] = getColor(color);

  return s;
}

module.exports = {
  rgba,
  hsla,
  hue,
  saturation,
  darken,
  lighten,
};
