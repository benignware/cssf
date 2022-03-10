const sass = require('sass');
const cssf = require('cssf');

const decamelize = (string) =>
  string.replace(/^[a-z]|[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase());

function getParams(func) {
  const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

  return args
    .split(',')
    .map(function (arg) {
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter(function (arg) {
      return arg;
    })
    .map((param) => {
      const [, name, value] = param.match(/([\w\d]+)(?:\s*=\s*(.*))?/) || [];

      return {
        name,
        value:
          typeof value === 'string'
            ? value.replace(/^['"]/, '').replace(/['"]$/, '')
            : value,
      };
    });
}

const unit = (value) => {
  if (!isNaN(Number(value))) {
    return '';
  }

  return (String(value).match(/^s*[-\d.e]+([a-z%]{2,})/) || [])[1] || '';
};

const getArgs = (...args) => {
  return args.map((arg) => {
    if (arg instanceof sass.types.Color) {
      return `rgba(${arg.getR()}, ${arg.getG()}, ${arg.getB()}, ${arg.getA()})`;
    }

    if (arg instanceof sass.types.Number) {
      return arg.getUnit()
        ? `${arg.getValue()}${arg.getUnit()}`
        : arg.getValue();
    }

    if (arg instanceof sass.types.String) {
      return arg.getValue();
    }

    return String(arg) !== 'null' ? String(arg) : undefined;
  });
};

const fnProxy = (fn) => {
  return function (...args) {
    args = getArgs(...args);
    const result = fn(...args);

    if (typeof result === 'number' || !isNaN(parseFloat(result))) {
      const u = unit(result);

      return new sass.types.Number(parseFloat(result), u);
    }

    return new sass.types.String(result);
  };
};

const libProxy = (lib, options = {}) => {
  const { prefix = '' } = options;

  return Object.assign(
    {},
    ...Object.values(lib).map((fn) => {
      const key = `${prefix}${decamelize(fn.name)}(${getParams(fn)
        .map(
          ({ name, value }) =>
            `$${name}${
              typeof value !== 'undefined'
                ? `: ${value.replace(/^\s*{/, '(').replace(/}\s*$/, ')')}`
                : 'null'
            }`
        )
        .join(', ')})`;

      return {
        [key]: fnProxy(fn),
      };
    })
  );
};

module.exports = libProxy(cssf, {
  prefix: 'cssf-',
});
