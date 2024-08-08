export const isVar = value =>
  /^\s*var\(.*\)\s*$/.test(String(value));

export const hasVar = (value, name = null) => {
  const strValue = String(value);
  if (isVar(strValue)) return true;
  const pattern = name ? `\\bvar\\(${name}\\)` : '\\bvar\\(';
  return new RegExp(pattern).test(strValue);
}

export const hasVars = (value, names = []) =>
  names.length ? names.some(name => hasVar(value, name)) : hasVar(value);
