import path from 'path';
import { pathToFileURL } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import * as sass from 'sass';
import { scssf } from '../peer/sass.mjs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const entry = path.resolve(__dirname, 'index.scss');
const output = path.join(__dirname, 'dist', 'index.css');

const input = readFileSync(entry, 'utf-8');

const NODE_MODULES = path.resolve(__dirname, '../node_modules');

const result = sass.compileString(
  input,
  {
    functions: scssf.env,
    verbose: true,
    quietDeps: true,
    importers: [{
      // An importer that redirects relative URLs starting with "~" to
      // `node_modules`.
      findFileUrl(url) {
        if (!url.startsWith('~')) return null;
        
        const b = pathToFileURL(path.resolve(__dirname, '../node_modules'));
        const u = new URL(b + '/' + url.substring(1));

        return u;
      }
    }]
  }
);

// console.log(result.css.toString());

writeFileSync(output, result.css.toString());