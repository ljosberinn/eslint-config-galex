const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const file = resolve('./dist/index.js');

writeFileSync(
  file,
  readFileSync(file, 'utf-8').replace('exports.default =', 'module.exports =')
);
