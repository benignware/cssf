import * as csstree from 'css-tree';

export const operatorTransformer = (options = {}) => (ast) => {
  const valueTypes = [
    'Number',
    'Dimension',
    'Function',
    'Parentheses',
    'String',
    'Percentage',
    'Raw',
    'Identifier',
  ];

  [
    ['*', '/'], ['+', '-']
  ].map((operators) => {
    csstree.walk(ast, {
      leave(node, item, list) {
        if (node.type === 'Operator' && operators.includes(node.value.trim())) {
          const operator = node.value.trim();
          const children = list.copy();

          children.clear();

          let prev = item.prev;

          while (prev.data.type === 'WhiteSpace') {
            const p = prev;

            prev = prev.prev;

            list.remove(p);
          }

          list.prevUntil(prev, (data, item) => {
            if (!valueTypes.includes(data.type)) {
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
            if (!valueTypes.includes(data.type)) {
              return true;
            }

            children.appendData(data);
            list.remove(item);
          });

          list.insertData(
            {
              type: 'Function',
              name: Object.assign(
                {
                  '+': 'add',
                  '-': 'subtract',
                  '*': 'multiply',
                  '/': 'divide',
                },
                options.operators
              )[operator],
              children,
            },
            item.next
          );

          list.remove(item);
        }
      },
    });
  });

  return ast;
};