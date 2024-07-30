import * as csstree from 'css-tree';
import { camelize } from '../../utils.mjs';

export const whitespaceTransformer = (options = {}) => (ast) => {
  const consecutiveTypes = ['Function', 'Number', 'String', 'Dimension', 'Parentheses'];


  csstree.walk(ast, {
    enter(node) {
      if (node.type === 'Function') {
        console.log('PROCESS FUNCTION: ', node.name);
        
        // Split consecutive arguments with commas

        // node.children = node.children.reduce((acc, data, item) => {
        //   console.log('*** CHILD: ', data.type, data.name || data.value);
        //   if (item.prev) {
        //     const isConsecutive = consecutiveTypes.includes(data.type) && consecutiveTypes.includes(item.prev.data.type);

        //     if (isConsecutive) {

        //       console.log('NEW ARG: ', data);
        //       acc.push({
        //         type: 'Operator',
        //         value: ',',
        //       });

        //       acc.push({
        //         type: 'WhiteSpace',
        //         value: ' ',
        //       });
        //     }
        //   }

        //   acc.push(data);

        //   return acc;
        // }, children);


        // Join white-space separated arguments

        let children = new csstree.List();
        const argLists = [];

        let currentArgList;

        children = new csstree.List();

        node.children.forEach((data, item) => {
          if (!currentArgList) {
            currentArgList = new csstree.List();
            argLists.push(currentArgList);
          }

          if (data.type === 'Operator' && data.value === ',') {
            argLists.push(currentArgList);
            currentArgList = new csstree.List();
          } else {
            currentArgList.appendData(data);
          }
        });

        argLists.forEach((argList, index, array) => {
          let node;

          console.log('ARG LIST: ', argList.toArray());

          if (argList.toArray().length > 1) {
            console.log('HAS ARG LIST: ', argList.toArray());
            const nodes = argList.reduce((acc, data, item) => {
              if (item.prev) {
                acc.push({
                  type: 'Operator',
                  value: ',',
                });
                
                acc.push({
                  type: 'WhiteSpace',
                  value: ' ',
                });
              }

              if (data.type === 'Operator') {
                data.type = 'String';
              }

              acc.push(data);

              return acc;
            }, []);


            console.log('nodes: ', nodes);
            node = csstree.fromPlainObject({
              type: 'Function',
              name: '_join',
              children: [
                {
                  type: 'String',
                  value: ' ',
                },
                {
                  type: 'Operator',
                  value: ',',
                },
                {
                  type: 'WhiteSpace',
                  value: ' ',
                },
                ...nodes
              ],
            });
          } else {
            node = argList.first();
          }

          console.log('ADD NODE: ', node);

          children.appendData(node);
        });

        node.children = children;

        // const newList = new csstree.List();
        // const tokens = node.children
        //   .filter((data) => !['WhiteSpace', 'Operator'].includes(data.type) && data.value !== '/');

        // tokens.forEach((data, item) => {
        //   // console.log('*** CHILD: ', data.type, data.name);
        //   if (item.prev) {
        //     const isConsecutive = consecutiveTypes.includes(data.type) && consecutiveTypes.includes(item.prev.data.type);
        //     // const isArg = item.prev.data.type === 'Operator' && item.prev.data.value === ',';
            
        //     // console.log('IS CONSECUTIVE: ', isArg, isConsecutive);

        //     // if (isConsecutive) {
        //     //   newList.appendData({
        //     //     type: 'Operator',
        //     //     value: ',',
        //     //   });
        //     // }

        //     newList.appendData({
        //       type: 'Operator',
        //       value: ',',
        //     });

        //     newList.appendData({
        //       type: 'WhiteSpace',
        //       value: ' ',
        //     });
        //   }

        //   newList.appendData({...data});
          
        // });

        // node.children = newList;

        // node.children.forEach((data, item) => {
        //   console.log('*** CHILD: ', data.type, data.name);
        //   if (item.prev && item.next) {
        //     // console.log('HAS PREV: ', data.type, data.name, data.value);
        //     if (data.type === 'WhiteSpace') {
        //       console.log('WHITESPACE: prev: ', item.prev.data.type, item.prev.data.name, consecutiveTypes.includes(item.next.data.type), consecutiveTypes.includes(item.prev.data.type));
        //       // if (consecutiveTypes.includes(item.prev.data.type) && consecutiveTypes.includes(data.type)) {
        //       //   console.log('NEW ARG: ', prevArg);
        //       // }
        //       let isArg = false;

        //       node.children.prevUntil(item, (data, item) => {
        //         console.log('node...: ', data.type, data.value);

                
        //         if (data.type === 'Operator' && data.value === ',') {
        //           isArg = true;

        //           return true;
        //         }

        //         if (data.type === 'WhiteSpace') {
        //           return false;
        //         }

        //         return true;
        //       });
        //       console.log('IS ARG: ', isArg);

        //       const isNewArg = !isArg && consecutiveTypes.includes(item.next.data.type) && consecutiveTypes.includes(item.prev.data.type);

        //       if (isNewArg) {
        //         console.log('NEW ARG: ', item.prev.data);
        //         const op = csstree.fromPlainObject({
        //           type: 'Operator',
        //           value: ',',
        //         });

        //         list.insertData(op, item);

        //         // item.prev.data = whitespace;
        //         // item.prev.prev = whitespace;
        //       }
              
              
        //     }
        //   }
        // });

        // const argNodes = node.children.copy().toArray();
        
        // node.children.clear();

        // for (let[i, argNode] of Object.entries(argNodes)) {
        //   const prevArg = i > 0 ? argNodes[i - 1] : null;
        //   // const nextArg = i < argNodes.length - 1 ? argNodes[i + 1] : null;
        //   const consecutiveTypes = ['Function', 'Number', 'Dimension', 'Parentheses', 'Operator'];

        //   // const isNewArgument = !(argNode.type === 'Operator' && argNode.value === ',')
        //   //   && prevArg
        //   //   && consecutiveTypes.includes(prevArg.type)
        //   //   && consecutiveTypes.includes(argNode.type);

        //   const isNewArgument = argNode.type === 'Operator' && 
          

        //   if (isNewArgument) {

        //     console.log('NEW ARG: ', prevArg);
        //     const whitespace = csstree.fromPlainObject({
        //       type: 'Operator',
        //       value: ',',
        //     });

        //     node.children.appendData(whitespace);
        //   }

        //   node.children.appendData(argNode);
          
        // }
      }
    }
  });

  return ast;
};