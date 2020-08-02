const { sync } = require('read-pkg-up');

const customRules = require('./rulesets/custom-rules');
const noReact = require('./rulesets/no-react');
const react = require('./rulesets/react');
const typescript = require('./rulesets/typescript');

const mergeObjects = (...objects) =>
  objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});

const { hasJest, hasReact } = (() => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  try {
    const {
      packageJson: {
        peerDependencies = {},
        devDependencies = {},
        dependencies = {},
      },
    } = sync({ normalize: true });

    const deps = Object.keys(dependencies);

    const allDeps = new Set([
      ...Object.keys({
        ...peerDependencies,
        ...devDependencies,
      }),
      ...deps,
    ]);

    return {
      hasJest: allDeps.has('jest'),
      hasReact: ['react', 'preact', 'next'].some(pkg => allDeps.has(pkg)),
    };
  } catch {
    // eslint-disable-next-line no-console
    console.error('error parsing package.json!');
    return {
      hasJest: false,
      hasReact: false,
    };
  }
})();

const corePlugins = ['sort-keys-fix', 'unicorn', 'promise'];

const defaultConfig = {
  extends: [
    'react-app',
    'prettier',
    ...(hasJest ? ['kentcdodds/jest', 'plugin:jest-formatting/strict'] : []),
  ].filter(Boolean),
  overrides: typescript,
  plugins: corePlugins,
  rules: mergeObjects(customRules, react),
};

const noReactConfig = {
  ...noReact,
  overrides: typescript,
  plugins: [...corePlugins, ...noReact.plugins],
  rules: mergeObjects(noReact.rules, customRules),
};

module.exports = hasReact ? defaultConfig : noReactConfig;
