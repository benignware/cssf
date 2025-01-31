import * as csstree from 'css-tree';
import { keyToRgb } from '../../colors/keyToRgb.mjs';
import { hexToRgb } from '../../colors/hexToRgb.mjs';
import { kebabCase } from 'change-case';

const COLOR_STYLES = [
  /color$/,
  'fill',
  'stroke'
];

const COLOR_FUNCTIONS = [
  /^rgba?/,
  /^hsla?/,
  /^color/
];

/** 
 * Recursively interate through tree and change append name to each var function's identifier, 
 * e.g. var(--color-primary) => var(--color-primary-r), var(--color-primary-g), var(--color-primary-b), var(--color-primary-a)
 * handle default values recursively, e.g. var(--color-primary, rgba(0, 0, 0, 1)) => rgba(var(--color-primary-r, 0), var(--color-primary-g, 0), var(--color-primary-b, 0), var(--color-primary-a, 1))
 * resolve hex and named colors, e.g. var(--color-primary, red) => rgba(var(--color-primary-r, 255), var(--color-primary-g, 0), var(--color-primary-b, 0), var(--color-primary-a, 1))
 */
const traverseColorChannel = (node, channel, identifier = '', options = {}) => {
  if (!node) return node;
  const { identifiers = [], nested = 'auto' } = options;

  const channelIndex = ['r', 'g', 'b', 'a'].indexOf(channel);

  // Handle named colors
  if (node.type === 'Identifier') {
    if (node.name.startsWith('--')) {
      const shouldTransform = identifier === node.name || nested === true || (nested === 'auto' && identifiers.includes(node.name));

      if (shouldTransform) {
        return {
          type: 'Identifier',
          name: `${node.name}-${channel}`
        };
      }
    }

    const rgb = keyToRgb(node.name);
    
    if (rgb) {
      const value = rgb[channelIndex] !== undefined ? rgb[channelIndex].toString() : '1';
      return { type: 'Number', value };
    }
  }

  // Handle hex colors
  if (node.type === 'Hash') {
    const hex = `#${node.value}`;
    const rgb = hexToRgb(hex);
    if (rgb) {
      const value = rgb[channelIndex] !== undefined ? rgb[channelIndex].toString() : '1';
      return { type: 'Number', value };
    }
  }

  // Handle rgba functions
  if (node.type === 'Function' && node.name.startsWith('rgb')) {
    const identifierNode = node.children.filter((child) => child.type === 'Identifier').first;
    const isRelativeColor = identifierNode && !identifierNode.name === 'from';
    
    if (!isRelativeColor) {
      const channelArgNodes = [];

      for (const child of node.children) {
        if (child.type !== 'Operator' && child.type !== 'WhiteSpace') {
          channelArgNodes.push(child);
        }
      }

      const channelArgNode = channelArgNodes[channelIndex];
    
      return channelArgNode;
    }
  }

  if (node.children) {
    const list = new csstree.List();

    node.children.forEach((child) => {
      const traversed = traverseColorChannel(child, channel, identifier, options);
      list.appendData(traversed);
    });

    return { ...node, children: list };
  }

  return node; // Return the node as-is if no conditions were met
};

const deepCopy = (node) => {
  if (!node) {
    return null;
  }

  let result = null;

  if (node.toArray) {
    const Clazz = node.constructor;
    const items = node.toArray();
    const str = JSON.stringify(items);
    const itemsCopy = JSON.parse(str);
    result = new Clazz();

    itemsCopy.forEach((item) => {
      result.appendData(item);
    });

    return result;
  }

  const str = JSON.stringify(node);
  
  result = JSON.parse(str);

  return result;
};

const applyLegacyVarTransform = (node, options) => {
  const { varName, defaultNode } = node.children.reduce((acc, child) => {
    if (!acc.varName && child.type === 'Identifier') {
      acc.varName = child.name;
    } else if (acc.varName && !acc.defaultNode && !['WhiteSpace', 'Operator'].includes(child.type)) {
      acc.defaultNode = child;
    }

    return acc;
  }, {defaultNode: null, varName: ''});
  
  const newArgs = ['r', 'g', 'b', 'a'].map((channel, i) => {
    const l = deepCopy(node.children);

    l.clear();

    l.appendData({
      type: 'Identifier',
      name: `${varName}-${channel}`
    });

    let traversed = null;

    if (defaultNode) {
      const defaultNodeCopy = deepCopy(defaultNode);
      traversed = traverseColorChannel(defaultNodeCopy, channel, varName, options);
    } else if (channel === 'a') {
      traversed = {
        type: 'Number',
        value: '1'
      };
    }

    if (traversed) {
      l.appendData({
        type: 'Operator',
        value: ','
      });

      l.appendData(traversed);
    }
   
    return {
      type: 'Function',
      name: 'var',
      children: l
    };
  });

  node.name = 'rgba';
  node.children.clear();

  newArgs.forEach((arg, index) => {
    node.children.appendData(arg);

    if (index < newArgs.length - 1) {
      node.children.appendData({
        type: 'Operator',
        value: ','
      });
    }
  });
}

const isMatch = (needle, haystack, normalize = (s) => s) => {
  if (Array.isArray(haystack)) {
    return haystack.some((h) => isMatch(needle, h));
  }

  return haystack instanceof RegExp
    ? !!haystack.test(needle)
    : normalize(needle) === normalize(haystack);
};

export const colorVarTransformer = (options = {}) => (ast) => {
  const {
    styles = COLOR_STYLES,
    functions = COLOR_FUNCTIONS,
    identifiers = [],
  } = options;

  let currentDeclaration = null;
  let currentFunctions = [];

  let insideTransform = false;

  const rootNode = ast.children.toArray().length === 1 ? ast.children.first : null;

  csstree.walk(ast, {
    enter(node, item, list) {
      if (node.type === 'Declaration') {
        currentDeclaration = node;
      }

      if (node.type === 'Function' && node.name !== 'var') {
        currentFunctions.push(node);
      }

      if (!insideTransform && node.type === 'Function' && node.name === 'var') {
        const identifierNode = node.name === 'var' && node.children.filter((child) => child.type === 'Identifier').first;
        const identifier = identifierNode && !identifierNode.name.match(/-(?:r|g|b|a)$/) && identifierNode.name;

        if (identifier) {
          const fnNames = currentFunctions.map((f) => f.name);
          const isVarMatch = isMatch(identifier, identifiers);
          const isStyleMatch = currentDeclaration ? isMatch(currentDeclaration.property, styles) : false;
          const isFunctionMatch = fnNames.some((name) => isMatch(name, functions, kebabCase));
          const isRoot = rootNode === node;
          const isColorMatch = isVarMatch || isStyleMatch || isFunctionMatch || isRoot;

          

          if (isColorMatch) {
            insideTransform = true;

            applyLegacyVarTransform(node, options);
          }
        }
      }
    },
    leave(node, item, list) {
      if (node.type === 'Declaration') {
        currentDeclaration = null;
      }

      if (node.type === 'Function' && node.name !== 'var') {
        currentFunctions.pop();
      }
    }
  });

  return ast;
};
