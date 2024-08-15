// These are currently not used, but feel faster than change-case
export const camelize = str => str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
export const pascalize = str => str.charAt(0).toUpperCase() + camelize(str).slice(1);
export const decamelize = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();