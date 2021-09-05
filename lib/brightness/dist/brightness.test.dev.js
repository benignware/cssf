"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var evaluate = require('../eval');

var assert = require('assert');

var _require = require('..'),
    ifelse = _require.ifelse,
    lt = _require.lt,
    gt = _require.gt,
    divide = _require.divide,
    add = _require.add,
    hsla = _require.hsla,
    rgba = _require.rgba;

var brightness = require('./brightness');

var _require2 = require('../utils'),
    toPrecision = _require2.toPrecision,
    parseFn = _require2.parseFn; // const textColour = (brightness > 125) ? 'black' : 'white';


function contrastRatio(rgb1, rgb2) {
  var br1 = brightness(rgb1);
  var br2 = brightness(rgb2);
  console.log('br1: ', evaluate(br1));
  console.log('br2: ', evaluate(br2));
  var ratio = ifelse(lt(br1, br2), divide(add(br1, 0.05), add(br1, 0.05)), divide(add(br2, 0.05), add(br2, 0.05)));
  return ratio;
}

function contrastColor(background, light, dark) {
  var ratio1 = contrastRatio(background, light);
  var ratio2 = contrastRatio(background, dark);
  console.log('ratio1: ', evaluate(ratio1));
  console.log('ratio2: ', evaluate(ratio2));
  var colorFn = light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;
  light = colorFn(light);
  dark = colorFn(dark);

  var _parseFn = parseFn(light),
      _parseFn2 = _toArray(_parseFn),
      lightArgs = _parseFn2.slice(1);

  var _parseFn3 = parseFn(dark),
      _parseFn4 = _toArray(_parseFn3),
      darkArgs = _parseFn4.slice(1);

  var args = Array.from(Array(3).keys()).map(function (index) {
    return ifelse(gt(ratio1, ratio2), lightArgs[index], darkArgs[index]);
  });
  return colorFn.apply(void 0, _toConsumableArray(args));
} // function contrastColor(background, light, dark) {
//   // const ratio1 = contrastRatio(background, light);
//   // const ratio2 = contrastRatio(background, dark);
//   const br = brightness(background);
//   console.log('br: ', evaluate(br), 0.5);
//   const colorFn =
//     light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;
//   light = colorFn(light);
//   dark = colorFn(dark);
//   const [, ...lightArgs] = parseFn(light);
//   const [, ...darkArgs] = parseFn(dark);
//   const args = Array.from(Array(3).keys()).map((index) =>
//     ifelse(lt(br, 0.5), lightArgs[index], darkArgs[index])
//   );
//   return colorFn(...args);
// }


describe('brightness', function () {
  xit('retrieves brightness for rgb color', function () {
    var rgb = "rgba(127.5, 127.5, 127.5)";
    console.log('RGB: ', rgb);
    var br = brightness(rgb);
    assert.strictEqual(evaluate(br), 0.5);
  });
  it('can be derived a contrast color from contrast ratio based on luminance', function () {
    var light = 'rgba(255, 255, 255, 1)';
    var dark = 'rgba(0, 0, 0, 1)';
    var rgb1 = 'rgb(25, 12, 32)';
    assert.strictEqual(evaluate(contrastColor(rgb1, light, dark)), light); // const rgb2 = 'rgb(245, 188, 178)';
    // assert.strictEqual(evaluate(contrastColor(rgb2, light, dark)), dark);
  });
});