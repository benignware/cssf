// const compiler = (fn) => {

//   return new Function(
//     'fn',
//     `
//     return ${code};
//   `
//   );
// };

// const res = compile(`test('hello')`)({
//   test: () => 'hallo',
// });

// console.log('res: ', res);

class Compiler {
  constructor() {
    this._fn = {};
    this.transform = new Set();
  }

  define(key, value) {
    this.fn = {
      ...(typeof key === 'object' ? key : { [key]: value })
    }
  }

  use(middleware) {
    this.plugins.push(middleware);
  }

  // transform(expression) {
  //   let ast = parse(string);
  
  //   ast = (this.transformers || []).reduce((ast, transformer) =>
  //     transformer.call(this, ast)
  //   );

  //   return stringify(ast);
  // }

  compile(expression) {
    expression = this.transform(expression);

    return new Function(...Object.keys(fn), `return ${expression}`);
  }

  evaluate(expression) {

  }
}

const compiler = new Compiler();

compiler.transform.add((ast => {
  return ast;
}))

compiler.define({
  test: () => 'TEST'
});

compiler.use(() => {
  console.log('transform...', compiler);
  this.transform.add(transformer);

  return compiler;
});
