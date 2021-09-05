const csstree = require('css-tree');

const parse = (input) =>
  csstree.parse(!input.match(/\{/) ? `.____root { prop: \n${input}\n}` : input);

const stringify = (ast) =>
  csstree.generate(ast).replace(/^\.____root\s*\{\s*prop:\s*(.*)\}$/, '$1');

// const fn = {
//   var(name, value) {
//     console.log('VAAR: ', name, value);
//     name = name.replace(/^--/, '');
//     return `typeof ${name} === 'undefined' ? ${value} : ${name}`;
//   },
//   min(...args) {
//     return `Math.min(${args.join(', ')})`;
//   },
//   max(...args) {
//     return `Math.max(${args.join(', ')})`;
//   },
// };

// const js = (input) => {
//   const ast = parse(input);

//   // traverse AST and modify it
//   csstree.walk(ast, {
//     leave(node) {
//       if (node.type === 'Function') {
//         const name = node.name;
//         console.log('********* FN: ', name);
//         const args = node.children
//           .toArray()
//           .filter(({ type }) => type !== 'Operator')
//           .map((node) => {
//             let value = node.value;

//             if (['Identifier'].includes(node.type)) {
//               console.log('ARG: VALUE', node);
//               return node.name;
//             }

//             if (['Percentage', 'Number'].includes(node.type)) {
//               const unit = node.type === 'Percentage' ? '%' : node.unit;

//               // console.log(
//               //   'arg: ',
//               //   node.type,
//               //   value,
//               //   parseFloat(value) / 10,
//               //   unit
//               // );
//               switch (unit) {
//                 case '%':
//                   return parseFloat(value) / 100;
//                 default:
//                   return parseFloat(value);
//               }
//             }

//             console.log('RETURN ARG', node.value);

//             // return `' + ${value} + '`;
//             return node.value;
//           });

//         console.log('DO FN:', node.name, args);

//         const result = fn[node.name]
//           ? fn[name](...args)
//           : `(() => '${name}(${args
//               .map((arg) => `' + ${arg} + '`)
//               .join(', ')})')()`;

//         node.type = 'String';
//         node.value = result;

//         console.log('NODE: ', result, args);
//       }
//     },
//   });

//   return stringify(ast);
// };

// const string = `
//   hsla(min(123, var(--test, 54)), 50%, 30%)
// `;

// const fn = {};

// fn.var = () => {
//   console.log('TEST');
// }

// const output = js(string);

// // console.log('output: ', output);

// const evaluate = new Function(
//   'expression',
//   `
//   var test = 8;
// console.log('eval', expression, test);
// return ${output};
// `
// );

// console.log('RESULT: ', evaluate(output));

const js = (input) => {
  const ast = parse(input);

  // Process operators
  ['*', '/', '+', '-'].map((operator) => {
    csstree.walk(ast, {
      reverse: true,
      leave(node, item, list) {
        if (node.type === 'Operator' && node.value == operator) {
          const children = list.copy();

          children.clear();

          let prev = item.prev;

          while (prev.data.type === 'WhiteSpace') {
            const p = prev;

            prev = prev.prev;

            list.remove(p);
          }

          list.prevUntil(prev, (data, item) => {
            if (
              !['Number', 'Dimension', 'Function', 'Parentheses'].includes(
                data.type
              )
            ) {
              return true;
            }

            children.prependData(data);
            list.remove(item);
          });

          children.appendData({
            type: 'Operator',
            value: ',',
          });

          children.appendData({
            type: 'WhiteSpace',
            value: ' ',
          });

          let next = item.next;

          while (next.data.type === 'WhiteSpace') {
            const n = next;

            next = next.next;

            list.remove(n);
          }

          list.nextUntil(next, (data, item) => {
            if (
              !['Number', 'Dimension', 'Function', 'Parentheses'].includes(
                data.type
              )
            ) {
              return true;
            }

            children.appendData(data);
            list.remove(item);
          });

          list.insertData(
            {
              type: 'Function',
              name: {
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide',
              }[operator],
              children,
            },
            item
          );

          list.remove(item);
        }
      },
    });
  });

  return stringify(ast);
};

const unit = (value) =>
  (String(value).match(/^s*[\d.-]+([a-z%]+)/) || [])[1] || '';

const compute = (operator) => (a, b) => {
  const au = unit(a);
  const bu = unit(b);

  a = parseFloat(a);
  b = parseFloat(b);

  let u;

  if (['*', '/'].includes(operator) && (au === '%' || bu === '%')) {
    u = au === '%' ? bu : au;
    a = au === '%' ? a / 100 : a;
    b = bu === '%' ? b / 100 : b;
  } else {
    u = au || bu;
  }

  const result = new Function('a', 'b', `return a ${operator} b;`)(a, b);

  return `${result}${u}`;
};

const min = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0];
  const f = String(Math.min(...values.map((value) => parseFloat(value))));

  return f + u;
};

const max = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0];
  const f = String(Math.max(...values.map((value) => parseFloat(value))));

  return f + u;
};

const clamp = (min, value, max) => max(min, min(value, max));

const add = compute('+');
const subtract = compute('-');
const divide = compute('-');
const multiply = compute('-');

console.log('MIN: ', max('-234px', '34px'));

// console.log('compute: ', compute('*')('100px', '3%'));

// console.log('U: ', subtract('322px', 'var(--2342332)'));

// const str = js('(1 + 2) / min(2 * 3, 4 - 5) * (min(243, 345) + 7)');

// console.log('STR: ', str);
