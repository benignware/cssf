import * as csstree from 'css-tree';

export const calcTransformer = (options = {}) => (ast) => {
  const unwrap = [ 'calc' ];
  let nestedCalc = false;

  csstree.walk(ast, {
    enter(node, item, list = []) {
      if (node.type === 'Function' && unwrap.includes(node.name)) {
        if (nestedCalc) {
          node.name = '';
          node.type = 'Value';
        }

        nestedCalc = true;
      }
    },
    leave(node, item, list = []) {
      if (nestedCalc && node.type === 'Function' && unwrap.includes(node.name)) {
        nestedCalc = false;
      }
    },
  });

  return ast;
};