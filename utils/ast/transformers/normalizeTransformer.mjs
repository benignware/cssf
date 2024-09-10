import * as csstree from 'css-tree';

export const normalizeTransformer = () => (ast) => {
  let insideFunction = false;
  const operators = ['*', '/'];

  csstree.walk(ast, {
    enter(node) {
      if (node.type === 'Function') {
        insideFunction = true;

        node.children.forEach((child) => {
          if (child.type === 'Operator' && child.value === ',') {
            child.value = ', ';
          }
        });
      }

      if (node.type === 'Operator' && operators.includes(node.value)) {
        node.value = ` ${node.value} `;
      }
      
    },
    leave(node) {
      if (node.type === 'Function') {
        insideFunction = false;
      }
    }
  });

  return ast;
};
