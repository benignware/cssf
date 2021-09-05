const { hsla } = require('./colors');
const { evaluate } = require('./utils');

xdescribe('colors', () => {
  describe('rgba', () => {
    it('creates colors from rgba', () => {
      const color = hsla(123, '43%', '60%', 0.9);

      console.log('color: ', evaluate(color));

      // console.log('COLOR: ', color);
    });
  });
});
