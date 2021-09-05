console.log('RUN');

// class Quantity {
//   static parse(string) {
//     const [, value, unit] = input.match(/([\d.]+)([\w%/]+)?/) || [];
//     console.log('VAL: ', this, value, unit);
//   }
// }

const Num = new Proxy(Number, {
  apply(target, thisArg, argumentsList) {
    const input = String(argumentsList[0]);
    // console.log(`Calculate sum: ${argumentsList}`);
    const [, value, unit] = input.match(/([\d.]+)([\w%/]+)?/) || [];
    console.log('VAL: ', this, value, unit);

    value.toString = () => {
      console.log('value...', value);
      return 'kuck';
    };

    return target(value);
  },
  // get(target, prop) {
  //   if (prop === 'unit') {
  //   }
  //   return Reflect.get(...arguments);
  // }
});

console.log('num', String(Num('53%')));

process.exit();