// do not trigger linting through the vscode eslint extension, as paths turn
// out to be fairly different
if (!process.argv.some(arg => arg.includes('vscode-eslint'))) {
  const { writeFileSync } = require('fs');
  const { resolve } = require('path');
  const { format } = require('prettier');

  const { createConfig } = require('../dist/createConfig');
  const { getDependencies } = require('../dist/getDependencies');

  const eslintPackageJson = require(resolve(
    'node_modules/eslint/package.json'
  ));

  console.log(`ESLint v${eslintPackageJson.version}`);

  const cwd = '.';
  const prettierOptions = {
    parser: 'json-stringify',
  };

  let extraArgs = {};

  if (process.env.createConfigArgs) {
    extraArgs = JSON.parse(process.env.createConfigArgs);

    console.log(
      `running createConfig with extra arguments: ${process.env.createConfigArgs}`
    );
  }

  const config = createConfig({
    root: true,
    cwd,
    ...extraArgs,
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
