import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import * as sass from 'sass';
import { scssf } from './peer/sass.mjs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const entry = path.resolve(__dirname, 'index.scss');
const output = 'bootstrap.css';

const input = readFileSync(entry, 'utf-8');

const result = sass.compileString(
  input,
  {
    functions: scssf.env,
    includePaths: [path.resolve(__dirname, 'node_modules')],
    outputStyle: 'compressed',
  }
);

console.log(result.css.toString());

writeFileSync(output, result.css.toString());