import * as csstree from 'css-tree';
import { camelize } from '../../utils.mjs';

const RESERVED = ['var', 'in', 'for'];

// const isValidIdentifier = (name) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

export const literalTransformer = (options = {}) => (ast) => {
  const reservedKeywords = options.reserved || RESERVED;
  const validIdentifiers = options.validIdentifiers || [];
  const undef = options.undef || '_undef';

  // console.log('LITERAL TRANSFORMER: ', validIdentifiers);

  csstree.walk(ast, {
    enter(node, item, list) {
      if (node.type === 'Function' && node.name) {
        node.name = camelize(node.name);

        if (reservedKeywords.includes(node.name) && validIdentifiers.includes('_' + node.name)) {
          node.name = '_' + node.name;

          return;
        }

        if (!validIdentifiers.includes(node.name)) {
          const nameArg = {
            type: 'String',
            value: node.name,
          };

          const operator = {
            type: 'Operator',
            value: ',',
          };

          node.children.prependData(operator);
          node.children.prependData(nameArg);

          node.name = undef;

          return;
        }
      }

      if (node.type === 'Identifier') {
        const [sign = '', name] = (node.name.match(/^(-)?([^-].*)$/) || ['']).slice(1)
        
        if (!validIdentifiers.includes(name)) {
          node.type = 'String';
          node.value = node.name;
  
          return;
        }

        if (sign === '-') {
          node.type = 'Raw';
          // node.value = `(${node.name} * -1)`;
          node.value = `-${name}`;

          return;
        }
      }

      // if (node.name && !validIdentifiers.includes(node.name)) {
      //   node.type = 'String';
      //   node.value = node.name;

      //   return;
      // }

      // if (node.type === 'Identifier') {
      //   if (reservedKeywords.includes(node.name)) {
      //     node.type = 'String';
      //     node.value = node.name;

      //     return;
      //   }
      // }
  
      // if (node.type === 'Function' || node.type === 'Identifier') {
      //   const isValidIdentifier = validIdentifiers.includes(node.name);
      //   // || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(node.name);

      //   if (!isValidIdentifier) {
      //     node.type = 'String';
      //     node.value = node.name;
      //   }
      // }
      

      // if (node.name && !isValidIdentifier(node.name)) {
      //   node.type = 'String';
      //   node.value = node.name;

      //   return;
      // }

      // if (node.type === 'Identifier') {
      //   const [_sign = '', name] = node.name.match(/^(-)?[^-](.*)$/).slice(1) || [];
      //   // console.log('IDENTIFIER: ', node.name, _sign, name);

      //   if (_sign === '-') {
      //     node.type = 'Raw';
      //     // node.value = `(${node.name} * -1)`;
      //     node.value = `-${name}`;

      //     return;
      //   }

      //   // const def = options.functions[name] || options.functions[camelize(name)];

      //   // // if (typeof def !== 'undefined' && typeof def !== 'function') {
      //   // //   node.type = 'Raw';
      //   // //   node.value = node.name;
      //   // // } else {
      //   //   node.type = 'Raw';
      //   //   node.value = node.name;
      //   // // }
      // }


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

      if (node.unit) {
        node.type = 'String';
        node.value = node.value + node.unit;
      }
    },
  });

  return ast;
};