import { writeFileSync } from 'fs';
import { renderSync } from 'sass';
import * as sass from 'sass';

const FILE = 'main.scss';

const DEST = 'main.css';

const { css } = renderSync({
  file: FILE,
  functions: {
    'hello-world': (a) => {
      // return new sass.types.String(`test(${a.getValue()}, ${b.getValue()})`);
      return new sass.types.String('Hello World');
    },
  }
});

writeFileSync(DEST, css);