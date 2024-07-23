import * as csstree from 'css-tree';

export const calcTransformer = (options = {}) => (ast) => {
  const unwrap = [ 'calc' ];

  csstree.walk(ast, {
    leave(node, item, list = []) {
      if (node.type === 'Function' && unwrap.includes(node.name)) {
        node.name = '';
        // const firstArgument = node.children.first();
        // const wrappedArgument = csstree.createNode({
        //   type: 'Parentheses',
        //   children: [firstArgument],
        // });
        // csstree.replace(item, wrappedArgument);
      }
    },
  });

  return ast;
};