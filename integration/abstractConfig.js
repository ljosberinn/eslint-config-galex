// do not trigger linting through the vscode eslint extension, as paths turn
// out to be fairly different
if (!process.argv.some(arg => arg.includes('vscode-eslint'))) {
  const { writeFileSync } = require('fs');
  const { resolve } = require('path');
  const { format } = require('prettier');

  const { createConfig, getDependencies } = require('../src/createConfig');

  const cwd = '.';
  const prettierOptions = {
    parser: 'json-stringify',
  };

  const config = createConfig({
    root: true,
    cwd,
    cacheOptions: {
      enabled: false,
    },
  });

  const depsPath = resolve('deps.json');
  console.log('writing deps to', depsPath);
  writeFileSync(
    depsPath,
    format(JSON.stringify(getDependencies()), prettierOptions)
  );

  const configCachePath = resolve('eslint-config.json');
  console.log('writing config cache to', configCachePath);
  writeFileSync(
    configCachePath,
    format(JSON.stringify(config), prettierOptions)
  );

  module.exports = config;
}
