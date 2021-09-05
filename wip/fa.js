const csstree = require('css-tree');

const parse = (input) =>
  csstree.parse(!input.match(/\{/) ? `.____root { prop: \n${input}\n}` : input);

const stringify = (ast) =>
  csstree.generate(ast).replace(/^\.____root\s*\{\s*prop:\s*(.*)\}$/, '$1');

const Compiler = (fn) => {
  const transformers = [];

  function transform(string) {
    let ast = parse(string);

    ast = (transformers || []).reduce((ast, transformer) =>
      transformer.call(this, ast)
    );

    return stringify(ast);
  }

  function compile(expression) {
    return function evaluate(data = {}) {
      const f = new Function(
        '____data____',
        ...Object.keys(fn),
        `
      for (x in arguments[0]) {
        this[x] = arguments[0][x];
      }

      return ${transform(expression)};
  `
      );

      return f(data, ...Object.values(fn));
    };
  }

  compile.use = (transformer) => {
    transformers.push(transformer);

    return this;
  };

  return compile;
};

const unit = (value) =>
  (String(value).match(/^s*[\d.-]+([a-z%]+)/) || [])[1] || '';

const unitTransformer =
  (options = {}) =>
  (ast) => {
    csstree.walk(ast, {
      leave(node) {
        if (['Percentage', 'Number', 'Dimension'].includes(node.type)) {
          console.log('PROCESS UNIT: ', node, options);
          if (unit(node.value)) {
            node.type = 'String';
            node.value = `'${node.value}'`;
          }
        }
      },
    });

    return ast;
  };

const compile = Compiler({
  min(...args) {
    return Math.min(...args);
  },
  var(name, value) {
    return this[name] || value;
  },
}).use(unitTransformer());

console.log('compile: ', compile('test'));

// const code = `var_('fd', var_('test'))`;

// console.log('---', code);
// const fn = compile(code);

// console.log('---', fn);

// const result = fn({
//   test: 'sdjfklsa',
// });

// console.log('RESULT: ', result);
