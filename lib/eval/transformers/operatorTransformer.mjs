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

  const { operatorMap = {} } = {
    ...options,
    operatorMap: {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      '/': 'divide',
      ...options.operatorMap,
    },
  };

  const calcNames = [
    'abs',
    'asin',
    'acos',
    'atan',
    'atan2',
    'calc',
    'calc-size',
    'clamp',
    'cos',
    'log',
    'min',
    'max',
    'mod',
    'pow',
    'round',
    'sin',
    'tan',
    // ...Object.values(options.operatorMap),
  ];

  const calcOnly = true;
  const noFuncArgs = false;

  let calcLevel = calcOnly === false ? 1 : 0;

  calcLevel = 0;

  let functionNode = null;

  [
    ['*', '/'], ['+', '-']
  ].map((operators) => {
    csstree.walk(ast, {
      enter(node, item, list) {
        if (node.type === 'Function' && calcNames.includes(node.name)) {
          calcLevel++;
        }

        if (node.type === 'Function') {
          functionNode = node;
        }
      },
      leave(node, item, list) {
        let isFunctionArg = false;

        if (noFuncArgs && functionNode) {
          if (functionNode.children.toArray().includes(node)) {
            isFunctionArg = true;
          }
        }

        const isCalc = calcLevel > 0 && !isFunctionArg;

        if (node.type === 'Function') {
          functionNode = null;
        }

        if (node.type === 'Operator' && operators.includes(node.value.trim())) {
          const operator = node.value.trim();

          const children = list.copy();

          let prev = item.prev;

          children.clear();

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

          const fn = isCalc
            ? operatorMap[operator]
            : '_join';

          if (fn) {
            if (!isCalc) {
              children.prependData({
                type: 'WhiteSpace',
                value: ' ',
              });

              children.prependData({
                type: 'Operator',
                value: ',',
              });

              children.prependData({
                type: 'String',
                value: ` ${operator} `,
              });
            }

            list.insertData(
              {
                type: 'Function',
                name: fn,
                children
              },
              item.next
            );

            list.remove(item);
          }
        }

        if (node.type === 'Function' && calcNames.includes(node.name)) {
          calcLevel--;
        }
      },
    });
  });

  return ast;
};