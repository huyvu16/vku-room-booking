import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// gh-pages keeps the repository's .gitignore in its publish cache. That file
// ignores every directory named node_modules, including Expo's generated font
// assets under dist/assets/node_modules. Replacing it in the web artifact keeps
// those runtime assets available on GitHub Pages.
const distGitignore = resolve(process.cwd(), 'dist', '.gitignore');

await writeFile(
  distGitignore,
  '# Generated web artifact: keep Expo runtime assets, including icon fonts.\n',
  'utf8',
);
