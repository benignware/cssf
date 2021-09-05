const x = 0.00000000000001;

// const a = 2342543.02452;
// const b = 2342543.02451;

const a = 0;
const b = 0.000001;

const c = Math.max(0, Math.min(Math.abs(a - b), 1));
const d = c + 0.5 - x;
const e = Math.round(d);
const f = 1 - e;
console.log('EQ: ', f);
