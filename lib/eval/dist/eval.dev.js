"use strict";

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var csstree = require('css-tree');

var _require = require('../utils'),
    parse = _require.parse,
    stringify = _require.stringify,
    unit = _require.unit,
    compute = _require.compute,
    stripCalc = _require.stripCalc;

var min = function min() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  var u = values.map(function (value) {
    return unit(value);
  }).filter(function (u) {
    return u && u !== '%';
  })[0];
  var f = String(Math.min.apply(Math, _toConsumableArray(values.map(function (value) {
    return parseFloat(value);
  }))));
  return f + (u || '');
};

var max = function max() {
  for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }

  var u = values.map(function (value) {
    return unit(value);
  }).filter(function (u) {
    return u && u !== '%';
  })[0] || '';
  var v = values.map(function (value) {
    return parseFloat(value);
  });
  var f = String(Math.max.apply(Math, _toConsumableArray(v)));
  return u ? f + u : f;
};

var clamp = function clamp(min, value, max) {
  return max(min, min(value, max));
};

var add = compute('+');
var subtract = compute('-');
var divide = compute('/');
var multiply = compute('*');

var round = function round(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var u = unit(value);
  var f = parseFloat(value);
  var r = Number(f.toFixed(digits));
  return u ? "".concat(r).concat(u) : r;
};

var _var = function _var(name, value) {
  return this.context.get(name.replace(/^--/, '')) || value;
};

var nameTransformer = function nameTransformer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (ast) {
    csstree.walk(ast, {
      leave: function leave(node, item, list) {
        if (['Function'].includes(node.type)) {
          node.name = (options.functions || {})[node.name] || node.name;
        }
      }
    });
    return ast;
  };
};

var literalTransformer = function literalTransformer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (ast) {
    csstree.walk(ast, {
      leave: function leave(node, item, list) {
        var value;

        if (['Identifier'].includes(node.type)) {
          value = node.name;
        }

        if (['Percentage'].includes(node.type)) {
          value = node.value + '%';
        }

        if (node.unit) {
          value = node.value + node.unit;
        }

        if (typeof value !== 'undefined') {
          node.type = 'String';
          node.value = "'".concat(value, "'");
        }
      }
    });
    return ast;
  };
};

var operatorTransformer = function operatorTransformer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (ast) {
    var valueTypes = ['Number', 'Dimension', 'Function', 'Parentheses', 'String', 'Percentage'];
    [['*', '/'], ['+', '-']].map(function (operators) {
      csstree.walk(ast, {
        enter: function enter(node, item, list) {
          if (node.type === 'Operator' && operators.includes(node.value)) {
            var operator = node.value;
            var children = list.copy();
            children.clear();
            var prev = item.prev;

            while (prev.data.type === 'WhiteSpace') {
              var p = prev;
              prev = prev.prev;
              list.remove(p);
            }

            list.prevUntil(prev, function (data, item) {
              if (!valueTypes.includes(data.type)) {
                return true;
              }

              children.prependData(data);
              list.remove(item);
            });
            children.appendData({
              type: 'Operator',
              value: ','
            });
            children.appendData({
              type: 'WhiteSpace',
              value: ' '
            });
            var next = item.next;

            while (next.data.type === 'WhiteSpace') {
              var n = next;
              next = next.next;
              list.remove(n);
            }

            list.nextUntil(next, function (data, item) {
              if (!valueTypes.includes(data.type)) {
                return true;
              }

              children.appendData(data);
              list.remove(item);
            });
            list.insertData({
              type: 'Function',
              name: _objectSpread({
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide'
              }, options.operators)[operator],
              children: children
            }, item.next);
            list.remove(item);
          }
        }
      });
    });
    return ast;
  };
};

var transformers = [literalTransformer(), operatorTransformer(), nameTransformer({
  functions: {
    "var": '_var'
  }
})];

var functions = _objectSpread({
  add: add,
  subtract: subtract,
  multiply: multiply,
  divide: divide,
  min: min,
  max: max,
  clamp: clamp,
  round: round,
  _var: _var
}, Object.fromEntries(['hsl', 'hsla', 'rgb', 'rgba'].map(function (name) {
  return [name, function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return "".concat(name, "(").concat(args.join(', '), ")");
  }];
})), {
  calc: function calc(expression) {
    return expression;
  }
});

function evaluate(input) {
  var _this = this;

  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // if (!isNaN(Number(input))) {
  //   return Number(input);
  // }
  // if (!isNaN(parseFloat(input))) {
  //   console.log('RETURN: ', input);
  //   return input;
  // }
  input = stripCalc(input);
  input = String(input);
  input = stringify((transformers || []).reduce(function (ast, transformer) {
    return transformer.call(_this, ast);
  }, parse(input)));
  console.log('input: ', input);

  var f = _construct(Function, ['__context__'].concat(_toConsumableArray(Object.keys(functions)), ["\n  this.context = new Map();\n\n  for (x in __context__) {\n    this.context.set(x, __context__[x]);\n  }\n\n  return ".concat(input, ";\n")]));

  var result = f.apply(void 0, [context].concat(_toConsumableArray(Object.values(functions)))); // if (!isNaN(Number(result))) {
  //   return Number(result);
  // }

  return result;
}

;
module.exports = evaluate;