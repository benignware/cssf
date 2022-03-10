// Calc
const abs = require('./abs');
const add = require('./add');
const and = require('./and');
const calc = require('./calc');
const divide = require('./divide');
const eq = require('./eq');
const floor = require('./floor');
const gt = require('./gt');
const gte = require('./gte');
const ifelse = require('./ifelse');
const lt = require('./lt');
const lte = require('./lte');
const mod = require('./mod');
const multiply = require('./multiply');
const not = require('./not');
const pow = require('./pow');
const round = require('./round');
const subtract = require('./subtract');

// Color
const alpha = require('./alpha');
const brightness = require('./brightness');
const contrastColor = require('./contrastColor');
const contrastRatio = require('./contrastRatio');
const hsla = require('./hsla');
const rgba = require('./rgba');
const hue = require('./hue');
const saturation = require('./saturation');
const lightness = require('./lightness');
const red = require('./red');
const green = require('./green');
const blue = require('./blue');
const luminance = require('./luminance');
const darken = require('./darken');
const lighten = require('./lighten');
const mix = require('./mix');

// Utils
const evaluate = require('./eval');
// const render = require('./render');

module.exports = {
  abs,
  add,
  alpha,
  and,
  brightness,
  contrastColor,
  contrastRatio,
  calc,
  darken,
  divide,
  eq,
  eval: evaluate,
  floor,
  gt,
  gte,
  hsla,
  ifelse,
  lighten,
  lt,
  lte,
  luminance,
  mix,
  mod,
  multiply,
  not,
  // render,
  round,
  pow,
  rgba,
  hue,
  saturation,
  subtract,
  lightness,
  red,
  green,
  blue,
};
