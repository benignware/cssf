import * as csstree from 'css-tree';
import { CSS } from '../../ast/CSS.mjs';

export const argumentTransformer = (options = {}) => (ast) => {
  csstree.walk(ast, {
    leave(node) {
      if (!node) {
        return;
      }
      
      if (node.type === 'Function') {
        const children = node.children.copy();

        node.children.clear();

        const argNodes = [];
        let currentArg = null;

        for (const argToken of children) {
          if (argToken.type === 'WhiteSpace') {
            continue;
          }

          if (!currentArg || argToken.type === 'Operator' && argToken.value === ',') {
            currentArg = argToken.type === 'Operator' ? [] : [argToken];

            argNodes.push(currentArg);
          } else {
            currentArg.push(argToken);
          }
        }

        for (const arg of argNodes) {
          if (arg.length === 0) {
            continue;
          }

          let argNode;

          if (arg.length === 1) {
            argNode = arg[0];
          } else {
            argNode = {
              type: 'Function',
              name: '_join',
              children: new csstree.List(),
            };

            argNode.children.appendData({
              type: 'String',
              value: ' ',
            });

            argNode.children.appendData({
              type: 'Operator',
              value: ',',
            });

            argNode.children.appendData({
              type: 'WhiteSpace',
              value: '',
            });

            for (const argToken of arg) {
              // const rawArg = argToken.value !== undefined ? argToken.value : CSS.stringify(argToken);

              // console.log('rawArg: ', argToken.value, `"${rawArg}"`);

              // argNode.children.appendData({
              //   type: 'String',
              //   value: rawArg.trim(),
              // });

              argNode.children.appendData(argToken);


              if (argToken !== arg[arg.length - 1]) {
                const operator = {
                  type: 'Operator',
                  value: ',',
                };

                argNode.children.appendData(operator);

                const whitespace = {
                  type: 'WhiteSpace',
                  value: '',
                };

                argNode.children.appendData(whitespace);
              }
            }
          }

          // const raw = argNode.value !== undefined ? argNode.value : csstree.generate(argNode); 

          // node.children.appendData({
          //   type: 'String',
          //   value: raw.trim(),
          // });

          node.children.appendData(argNode);

          if (arg !== argNodes[argNodes.length - 1]) {
            const operator = {
              type: 'Operator',
              value: ',',
            };

            node.children.appendData(operator);

            const whitespace = {
              type: 'WhiteSpace',
              value: '',
            };

            node.children.appendData(whitespace);
          }
        }
      }
    }
  });

  return ast;
};