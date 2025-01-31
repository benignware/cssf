import * as csstree from 'css-tree';
import { camelCase } from 'change-case';

const RESERVED = ['var', 'in', 'for'];


export const literalTransformer = (options = {}) => (ast) => {
  const reservedKeywords = options.reserved || RESERVED;
  const validIdentifiers = options.validIdentifiers || [];
  const undef = options.undef || null;

  csstree.walk(ast, {
    enter(node) {
      if (undef && node.type === 'Function' && node.name) {
        if (reservedKeywords.includes(node.name) && validIdentifiers.includes('_' + node.name)) {
          node.name = '_' + node.name;

          return;
        }

        if (node.type === 'Function' && node.name && !validIdentifiers.includes(node.name)) {
          const camel = camelCase(node.name);

          if (validIdentifiers.includes(camel)) {
            node.name = camel;

            return;
          }
        }

        if (node.name && !validIdentifiers.includes(node.name)) {
          const nameArg = {
            type: 'String',
            value: node.name,
          };

          const operator = {
            type: 'Operator',
            value: ',',
          };

          // const argsList = node.children.copy();

          // node.children.forEach((arg) => {
          //   console.log('ARG: ', arg);
          // });

          node.children.prependData(operator);
          node.children.prependData(nameArg);

          node.name = undef;

          return;
        }
      }

      if (node.type === 'Identifier') {
        const [sign = '', name] = (node.name.match(/^(-)?([^-].*)$/) || ['']).slice(1);
        
        if (node.name && !validIdentifiers.includes(name)) {
          node.type = 'String';
          node.value = node.name;
  
          return;
        }

        if (sign === '-') {
          node.type = 'Raw';
          node.value = `-${name}`;

          return;
        }
      }

      if (node.type === 'Hash') {
        node.type = 'String';
        node.value = '#' + node.value;

        return;
      }

      if (node.type === 'Percentage') {
        node.type = 'String';
        node.value = node.value + '%';

        return;
      }

      if (node.value !== undefined && node.unit) {
        node.type = 'String';
        node.value = node.value + node.unit;
      }
    },
  });

  return ast;
};