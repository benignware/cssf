function getName(func) {
  return func.name || func.toString().match(/function\s+([^\s(]+)/)[1];
}

function getParams(func) {
  const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

  return args
    .split(',')
    .map(arg => arg.replace(/\/\*.*\*\//, '').trim())
    .filter(arg => arg)
    .map(param => {
      const [, name, value] = param.match(/([\w\d]+)(?:\s*=\s*(.*))?/) || [];
      const item = { name };

      if (typeof value !== 'undefined') {
        item.value = value;
      }

      // {
      //   name,
      //   value: typeof value === 'string'
      //     ? value.replace(/^['"]/, '').replace(/['"]$/, '')
      //     : value,
      // };
      
      return item;
    });
}

const signature = (fn) => {
  const params = getParams(fn);
  const name = getName(fn);

  return `${name}(${params.map(param => `${param.name}${param.value ? `: ${param.value}` : ''}`).join(', ')})`;
}

class FnMeta {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }

  toString() {
    return `${this.name}(${this.params.map(param => `${param.name}${param.value ? `: ${param.value}` : ''}`).join(', ')})`;
  }
}

export const describe = (fn, options = {}) => {
  const { ignore = /^___/ } = options;
  let params = getParams(fn);

  params = params.filter(param => !ignore || !ignore.test(param.name));

  const name = getName(fn);

  return new FnMeta(name, params);
}

// function myTestFunction(a, b = 'hello') {
//   return a + b;
// }

// const signature = (fn) => {
//   const params = getParams(fn);
//   const name = getName(fn);

//   return `${name}(${params.map(param => param.name).join(', ')})`;
// }

// console.log(signature(myTestFunction));