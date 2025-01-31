import { isNumber, number, unit } from './number.mjs';

function canTrimParentheses(expr) {
  if (expr[0] !== '(' || expr[expr.length - 1] !== ')') return false;
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
      if (expr[i] === '(') depth++;
      if (expr[i] === ')') depth--;
      if (depth === 0 && i < expr.length - 1) return false;
  }
  return depth === 0;
}

export function unwrap(expression) {
  if (typeof expression !== 'string') {
    return expression;
  }

  if (expression.startsWith('calc(') && expression.endsWith(')')) {
      expression = expression.slice(5, -1);
  }
  
  while (canTrimParentheses(expression)) {
      expression = expression.slice(1, -1);
  }

  const n = number(expression);
  
  if (!isNaN(n)) {
    const u = unit(expression);

    if (u) {
      return `${n}${u}`;
    }
    
    return n;
  }
  
  return expression;
}

export function wrap(expression) {
  return `calc(${unwrap(expression)} )`;
}
