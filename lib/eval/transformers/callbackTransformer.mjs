export const callbackTransformer =
  (callback = () => {}) =>
  (ast) => {
    csstree.walk(ast, {
      leave(node) {
        callback(node);
      },
    });

    return ast;
  };