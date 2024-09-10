export function parseUnit(value) {
  const match = value.match(/([0-9.]+)([a-z%]+)$/);
  return match ? {
    value: parseFloat(match[1]),
    unit: match[2]
  } : {
    value: parseFloat(value),
    unit: ''
  };
}