"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var csstree = require('css-tree');

var chroma = require('chroma-js');

var parse = function parse(input) {
  return typeof input === 'number' ? String(input) : csstree.parse(!input.match(/\{/) ? ".____root { prop: \n".concat(input, "\n}") : input);
};

var stringify = function stringify(ast) {
  return csstree.generate(ast).replace(/^\.____root\s*\{\s*prop:\s*(.*)\}$/, '$1');
};

var parseFn = function parseFn(input) {
  var ast = parse(input);
  var fn = csstree.find(ast, function (node) {
    return node.type === 'Function';
  });

  if (fn) {
    var args = fn.children.toArray().filter(function (_ref) {
      var type = _ref.type;
      return type !== 'Operator';
    }).map(function (node) {
      return csstree.generate(node);
    });
    return [fn.name].concat(_toConsumableArray(args));
  }

  return null;
};

var Color = function Color(color) {
  try {
    var type = _toConsumableArray(color.match(/^\s(hsl|rgb)a?/)).slice(1)[0];

    if (type) {
      return [name, parseFn(color).slice(1)];
    }

    return ['rgb'].concat(_toConsumableArray(chroma(color).rgb()));
  } catch (e) {
    throw new Error('Unknown color format');
  }
};

var stripCalc = function stripCalc(expression) {
  expression = String(expression);
  var calcStripped = expression.replace(/^\s*calc\(\s*(.*)\s*\)\s*$/, '($1)');
  var nestedCalcStripped = calcStripped.replace(/calc\(/g, '($1');
  var parenStripped = nestedCalcStripped.replace(/^\s*[(]+\s*(.*)\s*[)]+\s*$/g, '$1');
  return nestedCalcStripped;

  if (isNumber(parenStripped)) {
    return parenStripped;
  }

  return nestedCalcStripped;
};

var toDecimal = function toDecimal(expression) {
  expression = stripCalc(expression);

  if (isNumber(expression)) {
    if (unit(expression) === '%') {
      expression = parseFloat(expression) / 100;
    } else {
      expression = parseFloat(expression);
    }

    return expression;
  }

  expression = String(expression).replace(/^\s*\(?\((.*)\)\s*[*]\s*100%\s*\)?\s*$/, '$1');
  return expression;
};

var toPercent = function toPercent(expression) {
  expression = stripCalc(expression);

  if (!isNaN(parseFloat(expression))) {
    if (unit(expression) === '%') {
      return expression;
    }

    if (!isNaN(Number(expression))) {
      return "".concat(Math.round(parseFloat(expression) * 100), "%");
    }
  }

  return "calc((".concat(expression.trim(), ") * 100%)");
};

var unit = function unit(value) {
  if (!isNumber(value)) {
    return null;
  }

  value = stripCalc(value); // console.log(
  //   'UNIT: ',
  //   value,
  //   isNumber(value),
  //   String(value).match(/^\s*-?\d+[\d.-e]*([a-z]{2,}|%)?\s*$/)
  // );

  return (String(value).match(/^\s*-?\d+[\d.-e]*([a-z]{2,}|%)?\s*$/) || [])[1] || '';
}; // const dec2hex = (...numbers) =>
//   numbers.map((number) => number.toString(16).padStart(2, '0')).join('');
// const hex2dec = (string) => parseInt(hexString, 16);
// const Color = (color) => {
//   const type = [...color
//     .match(/((?:hsl|rgb)a?|#)\(/)]
//     .slice(1)
//     .map((match) => match === '#' ? 'hex' : match) find();
//   return {
//     get type() {
//       return type;
//     },
//     toString() {
//       return color;
//     }
// };


var isVar = function isVar(value) {
  return !!String(value).match(/^\s*var\(.*\)\s*$/);
};

var hasVar = function hasVar(value) {
  return !!String(value).match(/var\(/);
}; // const isNumber = (value) => {
//   if (typeof value === 'number') {
//     return true;
//   }
//   const u = unit(value);
//   if (u) {
//     return true;
//   }
//   return !Number.isNaN(Number(value));
// };


var isTerm = function isTerm(value) {
  return !!String(value).match(/^\s*(calc\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/);
};

var isNumber = function isNumber(value) {
  return typeof value === 'number' || !!String(value).match(/^\s*(calc\(|\(*-?\d+[\d.-e]*([a-z]{2,}|%)?)\s*$/);
};

var compute = function compute(operator) {
  return function (a, b) {
    var as = stripCalc(a);
    var bs = stripCalc(b); // console.log('§§§§§§§§§§§§ COMPUTE: ', `|${as}|`, `|${operator}|`, `|${bs}|`);

    if (isVar(as) || isVar(bs)) {
      // console.log('HAS VAR: ', as, bs);
      return "calc(".concat(as, " ").concat(operator, " ").concat(bs, ")");
    } // if (['*', '/'].includes(operator) && (au === '%' || bu === '%')) {
    //   u = au || bu;
    //   if (!(au === '%' && bu === '%')) {
    //     if (au === '%') {
    //       a = a / 100;
    //       u = bu;
    //     } else if (bu === '%') {
    //       b = b / 100;
    //       u = au;
    //     }
    //   }
    // } else {
    //   u = au || bu;
    // }
    // console.log('isTerm(a): ', isTerm(a), isTerm(b));
    // console.log('isNumber(a): ', isNumber(a), isNumber(b), unit(b));


    if (operator === '+' && (!isTerm(a) && !isNumber(as) || !isTerm(b) && !isNumber(bs))) {
      // console.log('concatenate strings: ', a, b);
      // Concatenate strings
      return "".concat(a).concat(b);
    } // console.log('IS TERM?', isTerm(a), isTerm(b));
    // console.log('IS NUMBER?', isNumber(a), isNumber(b));


    if (isNumber(a) && isNumber(b)) {
      // console.log('COMPUTE', a, b);
      var av = parseFloat(as);
      var bv = parseFloat(bs);
      var au = unit(a);
      var bu = unit(b);

      if (au === bu || !au || !bu) {
        var result = new Function('a', 'b', "return (a) ".concat(operator, " (b);"))(av, bv);
        var u = au || bu; // console.log('U: ', au, bu, u);
        // console.log(
        //   'COMPUTED RESULT: ',
        //   `|${av}|`,
        //   `|${operator}|`,
        //   `|${bv}|`,
        //   ` = |${result}|`
        // );
        // console.log(`RESULT *${result}${u}*`);

        if (!u) {
          return result;
        }

        return "".concat(result).concat(u);
      }

      return "calc(".concat(as, " ").concat(operator, " ").concat(bs, ")");
    } // if (isTerm(a) || isTerm(b)) {
    //   console.log('IS TERM...', as, bs);
    //   return `calc(${as} ${operator} ${bs})`;
    // }
    // console.log('Undefined -->', as, bs);
    // throw new Error(`Undefined Operation: ${a} ${operator} ${b}`);


    return "calc(".concat(as, " ").concat(operator, " ").concat(bs, ")");
  };
};

module.exports = {
  parse: parse,
  stringify: stringify,
  parseFn: parseFn,
  unit: unit,
  compute: compute,
  toDecimal: toDecimal,
  toPercent: toPercent,
  stripCalc: stripCalc,
  Color: Color,
  isVar: isVar,
  hasVar: hasVar
};