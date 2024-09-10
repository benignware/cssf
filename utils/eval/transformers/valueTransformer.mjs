import * as csstree from 'css-tree';

export const valueTransformer = (callback = (input) => input) => (ast) => {
  csstree.walk(ast, {
    leave(node) {
      const isValue = node.type === 'Value';
      
      if (isValue) {
        const value = callback(node);

        node.children.clear();
        node.children.appendData({
          type: 'Raw',
          value: String(value)
        })
      }
    },
  });

  return ast;
};