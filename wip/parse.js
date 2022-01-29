const csstree = require("css-tree");
const { ifelse, eq } = require('./lib/math');

// simple parsing with no options
let ast = csstree.parse("a { prop: ifelse(eq(1%, 2px), test(), 5vh); }");

const functions = {
  ifelse,
  eq,
  test: () => 'test(1)'
};

// traverse AST and modify it
csstree.walk(ast, {
  leave(node, item, list) {
    // console.log("LEAVE NODE: ", node);

    if (node.type === "Function") {
      // console.log("****** FN: ", node.name);
      const fn = functions[node.name];

      if (fn) {
        console.log("FN TEST...", node.children.toArray());
        const args = node.children
          .toArray()
          .filter(({ type }) => type !== "Operator")
          .map(({ value, unit = '' }) => `${value}${unit}`);

        const result = fn(...args);

        node.type = 'String';
        node.value = result;
      }
    }
  },
});

// generate CSS from AST
// ast = csstree.generate(ast);
// .hello{world:"!"}

// parse with options
// const ast = csstree.parse('.foo.bar', {
//     context: 'selector',
//     positions: true
// });

// console.log(JSON.stringify(ast, null, 2));
console.log("--->", csstree.generate(ast));
